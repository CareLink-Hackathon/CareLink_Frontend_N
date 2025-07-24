"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CreatingAccount() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Loading */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="text-center space-y-8">
          <h1 className="text-3xl font-bold text-blue-600">Creating your Account</h1>

          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>

          <p className="text-gray-500">Signing in...</p>
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
          <p className="text-sm">Follow CareLink</p>
          <div className="flex justify-center space-x-4">
            <div className="w-6 h-6 bg-white rounded-sm opacity-80"></div>
            <div className="w-6 h-6 bg-white rounded-sm opacity-80"></div>
            <div className="w-6 h-6 bg-white rounded-sm opacity-80"></div>
            <div className="w-6 h-6 bg-white rounded-sm opacity-80"></div>
            <div className="w-6 h-6 bg-white rounded-sm opacity-80"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
