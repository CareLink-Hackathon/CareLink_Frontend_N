"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Menu,
  MoreVertical,
  Settings,
  HelpCircle,
  Plus,
  Paperclip,
  Mic,
  MessageSquare,
  Send,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  X,
  Activity,
  Calendar,
  Star,
  FileText,
  Bell,
  LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function PatientChatbot() {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const router = useRouter()

  const sidebarItems = [
    { icon: Activity, label: "Dashboard", href: "/patient/dashboard" },
    { icon: Calendar, label: "Appointments", href: "/patient/appointments" },
    { icon: FileText, label: "Medical Records", href: "/patient/records" },
    { icon: Star, label: "Reviews & Feedback", href: "/patient/feedback" },
    { icon: Bell, label: "Notifications", href: "/patient/notifications", badge: "3" },
    { icon: Settings, label: "Settings", href: "/patient/settings" },
    { icon: HelpCircle, label: "Help Center", href: "/patient/help" },
  ]

  const chatHistory = [
    {
      title: "Appointment Booking",
      preview: "I need help booking an appointment with a cardiologist for next week...",
      time: "Yesterday",
    },
    {
      title: "Medication Query",
      preview: "Can you tell me about the side effects of my prescribed medication?",
      time: "Yesterday",
    },
    {
      title: "Symptoms Check",
      preview: "I've been experiencing chest pain and shortness of breath...",
      time: "Today",
    },
    {
      title: "Lab Results",
      preview: "Can you help me understand my recent blood test results?",
      time: "Today",
    },
  ]

  const messages = [
    {
      type: "bot",
      content: "Hello! I'm your CareLink AI assistant. How can I help you with your healthcare needs today?",
      timestamp: "10:30 AM",
    },
    {
      type: "user",
      content:
        "I've been experiencing some chest pain and I'm worried. Can you help me understand what might be causing it?",
      timestamp: "10:32 AM",
    },
    {
      type: "bot",
      content:
        "I understand your concern about chest pain. While I can provide general information, it's important to note that chest pain can have various causes and should be evaluated by a healthcare professional. Some common causes include muscle strain, acid reflux, anxiety, or more serious conditions affecting the heart. Given the nature of your symptoms, I'd recommend scheduling an appointment with your doctor or visiting an emergency room if the pain is severe or accompanied by other symptoms like shortness of breath, nausea, or dizziness. Would you like me to help you book an appointment?",
      timestamp: "10:33 AM",
    },
  ]

  return (
    <div className="flex h-screen bg-gray-900 relative">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setShowSidebar(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative md:translate-x-0 w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white z-50 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12 border-2 border-white">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold">JOHN DOE</h3>
                <p className="text-blue-100 text-sm">Patient</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-500 md:hidden"
              onClick={() => setShowSidebar(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-white hover:bg-blue-500"
                onClick={() => setShowSidebar(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && <Badge className="bg-red-500 text-white text-xs">{item.badge}</Badge>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
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

      {/* Chat Sidebar */}
      <div className="w-80 bg-blue-600 text-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-blue-500">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-500 md:hidden"
              onClick={() => setShowSidebar(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">CareLink AI Assistant</h1>
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button className="w-full bg-blue-500 hover:bg-blue-400 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {chatHistory.map((chat, index) => (
              <div key={index} className="p-3 rounded-lg hover:bg-blue-500 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{chat.title}</h3>
                  <span className="text-xs text-blue-200">{chat.time}</span>
                </div>
                <p className="text-sm text-blue-100 line-clamp-3">{chat.preview}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowSidebar(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <span className="font-medium">CareLink AI Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <HelpCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-2xl ${msg.type === "user" ? "order-2" : "order-1"}`}>
                <div
                  className={`p-4 rounded-lg ${
                    msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.type === "bot" && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <ThumbsUp className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <ThumbsDown className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Regenerate Button */}
        <div className="px-4 py-2">
          <Button variant="outline" className="mx-auto flex items-center space-x-2 bg-transparent">
            <RotateCcw className="w-4 h-4" />
            <span>Regenerate Response</span>
          </Button>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about your health, symptoms, or medical questions..."
                className="min-h-[60px] pr-20 resize-none"
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-8 h-8 ${isRecording ? "bg-red-100 text-red-600" : ""}`}
                  onClick={() => setIsRecording(!isRecording)}
                >
                  <Mic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button size="icon" className="w-8 h-8 bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
