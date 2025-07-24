"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Mic, Globe } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Feedback() {
  const [rating, setRating] = useState(4)
  const [feedback, setFeedback] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const router = useRouter()

  const handleSubmit = () => {
    // Simulate feedback submission
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center p-8">
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

            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              SEND
            </Button>
          </div>

          {/* Voice Recording */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
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
  )
}
