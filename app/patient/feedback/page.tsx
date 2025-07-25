"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Calendar,
  Star,
  FileText,
  Activity,
  Mic,
  Globe,
  Send,
  Bot,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PatientFeedback() {
  const router = useRouter()
  const [rating, setRating] = useState(4)
  const [feedback, setFeedback] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sidebarItems = [
    { icon: Activity, label: "Dashboard", href: "/patient/dashboard" },
    { icon: Calendar, label: "Appointments", href: "/patient/appointments" },
    { icon: FileText, label: "Medical Records", href: "/patient/records" },
    { icon: Star, label: "Reviews & Feedback", href: "/patient/feedback", active: true },
    { icon: Bell, label: "Notifications", href: "/patient/notifications", badge: "3" },
    { icon: Settings, label: "Settings", href: "/patient/settings" },
    { icon: HelpCircle, label: "Help Center", href: "/patient/help" },
  ]

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate feedback submission
    setTimeout(() => {
      setIsSubmitting(false)
      setFeedback("")
      setRating(0)
      // Show success message
    }, 2000)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <Avatar className="w-16 h-16 border-2 border-white">
              <AvatarImage src="/placeholder.svg?height=64&width=64" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-lg">JOHN DOE</h3>
              <p className="text-blue-100 text-sm">Patient ID: P001</p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active ? "bg-white text-blue-600" : "text-white hover:bg-blue-500"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && <Badge className="bg-red-500 text-white text-xs">{item.badge}</Badge>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6">
          <Button
            variant="ghost"
            className="text-white hover:bg-blue-500 w-full justify-start"
            onClick={() => router.push("/login")}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign-out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search..." className="pl-10 w-96 border-gray-300" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push("/patient/chatbot")}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
              >
                <Bot className="w-4 h-4" />
                <span>AI Assistant</span>
              </Button>
              <Button variant="outline" size="sm">
                Help
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Button>
            </div>
          </div>
        </header>

        {/* Feedback Content */}
        <div className="flex-1 bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-600 rounded-sm"></div>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-blue-600">CareLink</h1>
            </div>

            {/* Feedback Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back! Please Share your <span className="text-blue-600">Feedbacks</span> Us
              </h2>

              {/* Star Rating */}
              <div className="flex justify-center items-center space-x-1 my-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? star <= 2
                            ? "text-red-500 fill-red-500"
                            : star <= 4
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-green-500 fill-green-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-4 text-gray-500">: 4.5 / 5</span>
              </div>

              {/* Feedback Form */}
              <form onSubmit={handleSubmitFeedback}>
                {/* Feedback Textarea */}
                <div className="mb-6">
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts and experiences..."
                    className="min-h-[120px] border-gray-300 rounded-lg resize-none"
                  />
                </div>

                {/* Bottom Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                      <Globe className="w-4 h-4" />
                      <span>EN</span>
                    </Button>
                    <Button variant="outline" size="icon">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 flex items-center space-x-2"
                    disabled={isSubmitting}
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "SENDING..." : "SEND"}</span>
                  </Button>
                </div>
              </form>

              {/* Voice Recording */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={`rounded-full ${isRecording ? "bg-red-100 text-red-600" : ""}`}
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      <Mic className="w-5 h-5" />
                    </Button>
                    <span className="text-sm text-gray-600">Voice chat</span>
                  </div>

                  {/* Audio Waveform */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 bg-gray-400 rounded-full ${isRecording ? "animate-pulse" : ""}`}
                        style={{
                          height: `${Math.random() * 20 + 10}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      ></div>
                    ))}
                  </div>

                  <span className="text-sm text-gray-600">1:30</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
