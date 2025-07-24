"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function Chatbot() {
  const [message, setMessage] = useState("")
  const router = useRouter()

  const chatHistory = [
    {
      title: "Healthcare",
      preview:
        "Artificial Intelligence (AI) has permeated virtually every aspect of our lives, and healthcare is no exception. The integration of AI in healthcare is ushering in a new era of medical practice, where machines complement the capabilities of healthcare",
      time: "Yesterday",
    },
    {
      title: "Healthcare",
      preview:
        "Artificial Intelligence (AI) has permeated virtually every aspect of our lives, and healthcare is no exception. The integration of AI in healthcare is ushering in a new era of medical practice, where machines complement the capabilities of healthcare",
      time: "Yesterday",
    },
    {
      title: "Healthcare",
      preview:
        "Artificial Intelligence (AI) has permeated virtually every aspect of our lives, and healthcare is no exception. The integration of AI in healthcare is ushering in a new era of medical practice, where machines complement the capabilities of healthcare",
      time: "Today",
    },
    {
      title: "Healthcare",
      preview:
        "Artificial Intelligence (AI) has permeated virtually every aspect of our lives, and healthcare is no exception. The integration of AI in healthcare is ushering in a new era of medical practice, where machines complement the capabilities of healthcare",
      time: "Today",
    },
  ]

  const messages = [
    {
      type: "bot",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "10:30 AM",
    },
    {
      type: "user",
      content:
        "Artificial Intelligence (AI) has permeated virtually every aspect of our lives, and healthcare is no exception. The integration of AI in healthcare is ushering in a new era of medical practice, where machines complement the capabilities of healthcare professionals, ultimately improving patient outcomes and the efficiency of the healthcare system. In this blog post, we will delve into the diverse applications of AI in healthcare, from diagnostic imaging to personalised treatment plans, and address the ethical considerations surrounding this revolutionary technology.",
      timestamp: "10:32 AM",
    },
    {
      type: "bot",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "10:33 AM",
    },
    {
      type: "user",
      content:
        "Artificial Intelligence (AI) has permeated virtually every aspect of our lives, and healthcare is no exception. The integration of AI in healthcare is ushering in a new era of medical practice, where machines complement the capabilities of healthcare professionals, ultimately improving patient outcomes and the efficiency of the healthcare system. In this blog post, we will delve into the diverse applications of AI in healthcare, from diagnostic imaging to personalised treatment plans, and address the ethical considerations surrounding this revolutionary technology.",
      timestamp: "10:35 AM",
    },
  ]

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-blue-600 text-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-blue-500">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500">
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">CareLink Chatbot</h1>
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

        {/* Trash Icon */}
        <div className="p-4 border-t border-blue-500">
          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>NE</AvatarFallback>
              </Avatar>
              <span className="font-medium">Naomie Ekon</span>
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
                placeholder="Ask or Search Anything"
                className="min-h-[60px] pr-20 resize-none"
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
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

      {/* Right Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="space-y-6">
          {/* Chat History Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Chat History</CardTitle>
              <Button variant="ghost" size="icon">
                <MessageSquare className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {chatHistory.slice(0, 4).map((chat, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm">{chat.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{chat.preview}</p>
                  <span className="text-xs text-gray-500 mt-2 block">{chat.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Premium Plan Card */}
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardContent className="p-6 text-center">
              <Badge className="bg-white text-blue-600 mb-4">Popular</Badge>
              <div className="mb-4">
                <div className="text-2xl font-bold">10,000FCFA</div>
                <div className="text-blue-100 text-sm">/month</div>
              </div>
              <p className="text-blue-100 mb-4">Get other interesting Features</p>
              <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">Get Premium Plan</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
