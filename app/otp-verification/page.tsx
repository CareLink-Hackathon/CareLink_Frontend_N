"use client"

import type React from "react"

import { useState, useEff          <div className="text-center space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Verify Your Phone</h1>
            <p className="text-sm sm:text-base text-gray-600">
              We've sent a 6-digit verification code to
              <br />
              <span className="font-medium text-gray-900">+237 656 776 987</span>
            </p>
          </div> } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Smartphone, Shield, Clock } from "lucide-react"

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(60)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    setIsLoading(true)
    // Simulate verification
    setTimeout(() => {
      router.push("/signing-in")
    }, 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - OTP Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <Button
            variant="ghost"
            className="p-0 h-auto text-gray-600 hover:text-gray-800"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Smartphone className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Verify Your Phone</h1>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to
              <br />
              <span className="font-semibold">+237 6XX XXX XXX</span>
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 focus:border-blue-500 rounded-lg"
                />
              ))}
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Resend code in {formatTime(timeLeft)}</span>
            </div>

            <Button
              onClick={handleVerify}
              disabled={otp.some((digit) => !digit) || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>

            <div className="text-center">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700" disabled={timeLeft > 0}>
                Resend Code
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Security Tip</p>
                <p>
                  Never share your verification code with anyone. CareLink will never ask for your code via phone or
                  email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div
        className="flex-1 bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col justify-between p-8 text-white relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8)), url('/images/hospital-bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">CareLink</h2>
            <p className="text-blue-100">Connected Care, Closer to You.</p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Secure Verification</h3>
            <p className="text-blue-100">
              Your security is our priority. We use advanced encryption to protect your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
