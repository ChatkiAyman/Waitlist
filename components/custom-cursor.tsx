"use client"

import { useEffect, useState } from "react"

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [hidden, setHidden] = useState(true)
  const [clicked, setClicked] = useState(false)
  const [linkHovered, setLinkHovered] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setHidden(false)
    }

    const handleMouseDown = () => setClicked(true)
    const handleMouseUp = () => setClicked(false)

    const handleMouseEnterLink = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement).tagName === "BUTTON" ||
        (e.target as HTMLElement).tagName === "A" ||
        (e.target as HTMLElement).closest("button") ||
        (e.target as HTMLElement).closest("a")
      ) {
        setLinkHovered(true)
      } else {
        setLinkHovered(false)
      }
    }

    const handleMouseLeave = () => {
      setHidden(true)
    }

    document.addEventListener("mousemove", updatePosition)
    document.addEventListener("mouseenter", updatePosition)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseover", handleMouseEnterLink)

    return () => {
      document.removeEventListener("mousemove", updatePosition)
      document.removeEventListener("mouseenter", updatePosition)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseover", handleMouseEnterLink)
    }
  }, [])

  if (typeof window === "undefined") return null

  return (
    <>
      <div
        className={`fixed pointer-events-none z-50 rounded-full mix-blend-difference ${
          hidden ? "opacity-0" : "opacity-100"
        } ${clicked ? "scale-75" : "scale-100"} ${
          linkHovered ? "w-8 h-8" : "w-5 h-5"
        } bg-white transition-all duration-200 ease-out`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        className={`fixed pointer-events-none z-50 rounded-full border border-white/30 ${
          hidden ? "opacity-0" : "opacity-100"
        } ${linkHovered ? "w-16 h-16" : "w-10 h-10"} transition-all duration-300 ease-out`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  )
}

