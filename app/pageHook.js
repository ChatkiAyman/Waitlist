"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useForm, Controller } from "react-hook-form"
import { AnimatePresence, motion, useTransform, useMotionValue, useSpring } from "framer-motion"
import Snowfall from "react-snowfall"
import { PiWarningThin } from "react-icons/pi"
import { TbArrowsJoin2 } from "react-icons/tb"

// Tooltip content data
const tooltipContent = {
  id: 1,
  name: "JOIN NOW",
  designation: "Join the waitlist for early access to MerchSpy! 🔥",
  image: "/img/email.png",
  href: "#",
}

export default function PageHook() {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenModel, setIsOpenModel] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Motion values for tooltip animation
  const springConfig = { stiffness: 100, damping: 5 }
  const x = useMotionValue(0)
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig)
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 20]), springConfig)

  const handleMouseMove = (event) => {
    const halfWidth = event.currentTarget.offsetWidth / 2
    x.set(event.nativeEvent.offsetX - halfWidth)
  }

  // Form handling
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
  } = useForm()

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    return emailRegex.test(email)
  }

  const handleOpenModel = () => {
    setIsOpenModel(true)
    setTimeout(() => {
      setIsOpenModel(false)
    }, 4000)
  }

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (res.ok) {
        reset();
        handleOpenModel();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit email");
      }
    } catch (error) {
      console.error("Error submitting email:", error)
      // You could set an error state here to display to the user
    }
  }

  return (
    <div className="min-h-screen w-full p-3 flex items-center justify-center relative z-50">
      {/* Background snowfall effect */}
      <Snowfall
        snowflakeCount={200}
        color="grey"
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: -9,
        }}
        speed={"140"}
        radius={"12"}
      />

      <section className="mt-5 max-w-6xl mx-auto w-full">
        <div className="space-y-8">
          {/* Header section */}
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <Image width={128} height={128} alt="Animated shake head" src="/img/shake.gif" className="w-32" />
            </div>

            <div className="flex items-center justify-center">
              <span aria-hidden="true">🔥</span>
              <div className="p-[1px] bg-transparent relative">
                <div className="p-2">
                  <span className="absolute inset-0 px-3 rounded-3xl overflow-hidden">
                    <motion.span
                      className="w-[500%] aspect-square absolute bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] opacity-20"
                      initial={{ rotate: -90 }}
                      animate={{ rotate: 90 }}
                      transition={{
                        duration: 3.8,
                        ease: "linear",
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                      style={{
                        translateX: "-50%",
                        translateY: "-10%",
                        zIndex: -1,
                      }}
                    />
                  </span>
                  <span className="bg-clip-text text-transparent dark:bg-gradient-to-r bg-gradient-to-tr dark:from-white from-black to-neutral-600 dark:to-neutral-700 text-xl font-bold">
                    MerchSpy
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent dark:bg-gradient-to-r bg-gradient-to-tr dark:from-white from-black to-neutral-600 dark:to-neutral-800 capitalize md:max-w-2xl lg:max-w-3xl mx-auto">
              HERE'S THE THING YOU SAID YOU WANTED
            </h1>

            <p className="max-w-[600px] leading-7 text-center text-[16px] bg-clip-text text-transparent dark:bg-gradient-to-br bg-gradient-to-tr dark:from-white from-black to-neutral-600 dark:to-neutral-700 mx-auto">
              Uncover trending designs, top-selling keywords, and competitor insights, so you can create merch that
              actually sells.
            </p>

            {/* Form error message */}
            {errors.email && (
              <div
                className="border dark:border-white/25 border-[#704705] flex gap-x-3 items-center p-2 pl-5 max-w-md bg-gradient-to-r from-10% dark:from-[#704705] text-[#3a2503] from-[#f5a524] via-30% dark:via-black dark:to-black to-100% to-[#704705] mx-auto rounded-md dark:text-white"
                role="alert"
              >
                <PiWarningThin className="text-[#704705] dark:text-white text-lg" aria-hidden="true" />
                <span>{errors.email.message}</span>
              </div>
            )}
          </div>

          {/* Email signup form */}
          <div className="w-full space-y-2">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row mx-auto lg:space-x-2 max-w-lg">
              <div className="flex-1">
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      placeholder="Your Email Address"
                      aria-label="Email address"
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={`w-full py-2.5 outline-none focus:border-2 focus:border-neutral-100 dark:border bg-opacity-20 shadow-md border 
                      border-neutral-400 dark:text-white dark:border-white/20 placeholder:text-neutral-500 pl-5 rounded-lg focus-within:border-none ${
                        isDirty && !isValid
                          ? "bg-[#f5a524] dark:bg-[#704705]/50"
                          : isDirty && isValid
                            ? "bg-green-500/20 dark:bg-green-500/30"
                            : ""
                      }`}
                    />
                  )}
                  rules={{
                    required: "Email is required!",
                    validate: (value) => validateEmail(value) || "Invalid email format",
                  }}
                />
                {errors.email && (
                  <span id="email-error" className="sr-only">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <button
                disabled={isSubmitting}
                className="flex items-center justify-center gap-x-3 bg-gradient-to-tr from-black from-50% via-black/40 to-gray-600/40 via-45% border-t-gray-700 disabled:opacity-70 disabled:cursor-not-allowed lg:w-36 shadow-md border border-b-0 border-r-0 border-l-0 bg-black mt-4 lg:mt-0 rounded-md px-2 py-2.5 w-full font-medium text-sm text-gray-200 dark:text-gray-300 transition-all hover:bg-black/80"
                type="submit"
              >
                <TbArrowsJoin2 className="text-[#383127] dark:text-gray-400" aria-hidden="true" />
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading
                  </span>
                ) : (
                  <span className="shrink-0">Join Waitlist</span>
                )}
              </button>

              {/* Tooltip */}
              <div
                className="relative group hidden lg:block"
                onMouseEnter={() => setHoveredIndex(tooltipContent.id)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence mode="wait">
                  {hoveredIndex === tooltipContent.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.6 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 260,
                          damping: 10,
                        },
                      }}
                      exit={{ opacity: 0, y: 20, scale: 0.6 }}
                      style={{
                        translateX: translateX,
                        rotate: rotate,
                        whiteSpace: "nowrap",
                      }}
                      className="absolute -top-16 -left-1/2 translate-x-1/2 text-xs flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2"
                    >
                      <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px" />
                      <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px" />
                      <div className="font-bold text-white relative z-30 text-base">{tooltipContent.name}</div>
                      <div className="text-white text-xs">{tooltipContent.designation}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>

          {/* Footer section */}
          <div className="p-3 rounded-lg border dark:border-white/10 border-neutral-400 dark:border-opacity-10 relative top-14 sm:top-14 lg:top-24 max-w-xl mx-auto flex flex-col lg:flex-row justify-between items-center text-sm">
            <p className="text-zinc-500 dark:text-zinc-100">You deserve to have the best on your side 🗿</p>
            <Link
              onClick={() => setIsOpen(true)}
              className="bg-zinc-700/30 lg:py-1 py-2 px-2 w-full lg:w-fit mt-3 md:mt-3 lg:mt-0 text-center rounded-md text-white hover:bg-zinc-700/50 transition-colors"
              href="#"
              aria-label="Learn more about MerchSpy"
            >
              <span>Join to know why.</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Modals */}
      <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <ReceivedModal isOpenModel={isOpenModel} setIsOpenModel={setIsOpenModel} />
    </div>
  )
}

// Giveaway modal component
const SpringModal = ({ isOpen, setIsOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-black/80 p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            exit={{ scale: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/20 backdrop-blur-lg border border-white/10 border-opacity-10 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative"
          >
            <Image
              width={100}
              height={100}
              className="w-16 absolute right-0 -top-16"
              src="/img/whisper.png"
              alt="Whisper emoji"
            />

            <div className="relative z-10">
              <h2 id="modal-title" className="text-xl font-bold mb-3">
                Special Giveaway
              </h2>
              <p className="lg:text-justify leading-6 mb-6">
                I'm doing a little Giveaway on the Launch of this Template Website by December. So If you sign up today,
                which will only take a few seconds and 1 click, you'll automatically be participated in our giveaway and
                10 lucky people will get free access to one of Our Premium Templates, free of cost!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex gap-x-3 items-center justify-center lg:justify-start bg-white text-black hover:bg-neutral-300 transition-colors duration-200 font-semibold lg:w-fit w-full py-2 lg:py-1.5 rounded px-8"
                >
                  Got that
                  <Image width={20} height={20} className="w-5 h-5" src="/img/alarm.png" alt="" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Confirmation modal component
const ReceivedModal = ({ isOpenModel, setIsOpenModel }) => {
  return (
    <AnimatePresence>
      {isOpenModel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-black/80 p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            exit={{ scale: 0 }}
            className="bg-white/20 backdrop-blur-lg border border-white/10 border-opacity-10 text-white p-6 rounded-lg w-full max-w-md shadow-xl cursor-default relative"
          >
            <Image
              width={100}
              height={100}
              className="w-16 absolute right-0 -top-16"
              src="/img/party.png"
              alt="Party emoji"
            />
            <h1 id="success-title" className="text-3xl font-bold text-center">
              You're on the waitlist
            </h1>

            <div className="relative z-10">
              <p className="text-center text-lg mt-4 mb-6">
                We'll send a notification as soon as MerchSpy is ready for you to experience
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpenModel(false)}
                  className="flex justify-center gap-x-3 items-center bg-white text-black hover:bg-neutral-300 transition-colors duration-200 font-semibold w-60 mx-auto py-2 rounded px-8"
                >
                  <span>Happy Selling</span>
                  <Image width={28} height={28} className="w-7 h-7" src="/img/got.png" alt="" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

