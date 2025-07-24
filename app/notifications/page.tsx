"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Bell, Settings, HelpCircle, LogOut, Calendar, BarChart3, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Notifications() {
  const router = useRouter()

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Appointments", href: "/appointments" },
    { icon: Bell, label: "Notifications", href: "/notifications", active: true },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help Center", href: "/help" },
  ]

  const notifications = [
    {
      category: "New",
      items: [
        {
          title: "Hello Naomie",
          message: "Your next Check-up is in 1 hour time",
          time: "2d ago",
          icon: "🏥",
          unread: true,
        },
        {
          title: "Hello Naomie",
          message: "Your next Check-up is in 1 hour time",
          time: "2d ago",
          icon: "🏥",
          unread: true,
        },
      ],
    },
    {
      category: "Earlier",
      items: [
        {
          title: "Hello Naomie",
          message: "Your next Check-up is in 1 hour time",
          time: "2d ago",
          icon: "🏥",
          unread: true,
        },
      ],
    },
    {
      category: "This Week",
      items: [
        {
          title: "Hello Naomie",
          message: "Your next Check-up is in 1 hour time",
          time: "2d ago",
          icon: "🏥",
          unread: true,
        },
        {
          title: "Hello Naomie",
          message: "Your next Check-up is in 1 hour time",
          time: "2d ago",
          icon: "🏥",
          unread: true,
        },
        {
          title: "Hello Naomie",
          message: "Your next Check-up is in 1 hour time",
          time: "2d ago",
          icon: "🏥",
          unread: true,
        },
        {
          title: "Hello Naomie",
          message: "Your next Check-up is in 1 hour time",
          time: "2d ago",
          icon: "🏥",
          unread: true,
        },
      ],
    },
    {
      category: "Yesterday",
      items: [
        {
          title: "Hello Naomie",
          message: "Your next Check-up is in 1 hour time",
          time: "2d ago",
          icon: "🏥",
          unread: true,
        },
        {
          title: "Hello Naomie",
          message: "Your next Check-up is in 1 hour time",
          time: "2d ago",
          icon: "🏥",
          unread: true,
        },
        {
          title: "Hello Naomie",
          message: "Your next Check-up is in 1 hour time",
          time: "2d ago",
          icon: "🏥",
          unread: true,
        },
      ],
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <Avatar className="w-16 h-16 border-2 border-white">
              <AvatarImage src="/placeholder.svg?height=64&width=64" />
              <AvatarFallback>NE</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-lg">NAOMIE EKON</h3>
              <p className="text-blue-100 text-sm">ekonnaomie6@gmail.com</p>
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
                <Input placeholder="Search anything..." className="pl-10 w-96 border-gray-300" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                <option>EN</option>
                <option>FR</option>
              </select>
              <Button variant="outline" size="sm">
                User Guide
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

        {/* Notifications Content */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>

          <div className="max-w-4xl">
            {notifications.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{section.category}</h2>
                  {section.category !== "New" && (
                    <Button variant="ghost" size="sm">
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {section.items.map((notification, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <div className="text-blue-600 text-lg">{notification.icon}</div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>

                      {notification.unread && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
