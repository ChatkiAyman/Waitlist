"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, CheckCircle, TrendingUp, Database, Search, ArrowRight, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import AnimatedBackground from "@/components/animated-background"
import CustomCursor from "@/components/custom-cursor"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

export default function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [waitlistCount, setWaitlistCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Fetch initial count
    fetch("/api/waitlist")
      .then((res) => res.json())
      .then((data) => {
        if (data.count) {
          setWaitlistCount(data.count)
        } else {
          // Fallback to a default number if API fails
          setWaitlistCount(487)
        }
      })
      .catch(() => {
        // Fallback to a default number if API fails
        setWaitlistCount(487)
      })
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      if (data.count) {
        setWaitlistCount(data.count)
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {mounted && <CustomCursor />}
      <AnimatedBackground />

      <div className="relative w-full max-w-4xl mx-auto space-y-10 p-4 z-10">
        <div className="space-y-4 text-center">
          <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary animate-fade-in">
            Coming Soon
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 animate-fade-in-up">
            MerchSpy
          </h1>
          <p className="text-xl md:text-2xl font-medium text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
            The intelligent Amazon Merch research tool for data-driven sellers
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          <Card className="bg-background/80 backdrop-blur-sm border-primary/10 overflow-hidden group hover:shadow-md hover:border-primary/30 transition-all duration-300 animate-fade-in-up animation-delay-200">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="flex flex-col items-center p-6 text-center space-y-3">
              <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Trend Analysis</h3>
              <p className="text-muted-foreground">Identify trending designs and niches with our advanced analytics</p>
            </CardContent>
          </Card>
          <Card className="bg-background/80 backdrop-blur-sm border-primary/10 overflow-hidden group hover:shadow-md hover:border-primary/30 transition-all duration-300 animate-fade-in-up animation-delay-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="flex flex-col items-center p-6 text-center space-y-3">
              <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Data Insights</h3>
              <p className="text-muted-foreground">Access comprehensive data on top-performing products and keywords</p>
            </CardContent>
          </Card>
          <Card className="bg-background/80 backdrop-blur-sm border-primary/10 overflow-hidden group hover:shadow-md hover:border-primary/30 transition-all duration-300 animate-fade-in-up animation-delay-400">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="flex flex-col items-center p-6 text-center space-y-3">
              <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Competitor Research</h3>
              <p className="text-muted-foreground">Track and analyze successful sellers and their product strategies</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-background/90 backdrop-blur-md shadow-lg animate-fade-in-up animation-delay-500">
          <CardContent className="p-8">
            {!isSubmitted ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-semibold">Get Early Access</h2>
                    <p className="text-muted-foreground">
                      Join <span className="font-medium text-primary">{waitlistCount}+</span> merch sellers already on
                      our waitlist
                    </p>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="animate-fade-in">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Enter your email"
                              {...field}
                              className="h-12 text-base bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/50 transition-all duration-300"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="h-12 px-6 text-base font-medium transition-all duration-300 hover:translate-x-1 group"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        <>
                          Join Waitlist
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="py-10 text-center space-y-4 animate-fade-in">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">You're on the list!</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Thank you for joining our waitlist. We'll notify you when MerchSpy launches.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground animate-fade-in-up animation-delay-600">
          MerchSpy uses Playwright, MongoDB, and NLP to help you discover profitable Amazon Merch opportunities.
        </p>
      </div>
    </div>
  )
}

