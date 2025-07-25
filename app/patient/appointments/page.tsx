"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Calendar,
  Star,
  Clock,
  FileText,
  Activity,
  Plus,
  Filter,
  Bot,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PatientAppointments() {
  const router = useRouter()
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const sidebarItems = [
    { icon: Activity, label: "Dashboard", href: "/patient/dashboard" },
    { icon: Calendar, label: "Appointments", href: "/patient/appointments", active: true },
    { icon: FileText, label: "Medical Records", href: "/patient/records" },
    { icon: Star, label: "Reviews & Feedback", href: "/patient/feedback" },
    { icon: Bell, label: "Notifications", href: "/patient/notifications", badge: "3" },
    { icon: Settings, label: "Settings", href: "/patient/settings" },
    { icon: HelpCircle, label: "Help Center", href: "/patient/help" },
  ]

  const appointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2025-01-28",
      time: "2:30 PM",
      type: "Check-up",
      status: "confirmed",
      hospital: "City General Hospital",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "2025-01-29",
      time: "10:00 AM",
      type: "Consultation",
      status: "pending",
      hospital: "Skin Care Clinic",
    },
    {
      id: 3,
      doctor: "Dr. Emily Davis",
      specialty: "Gynecologist",
      date: "2025-01-25",
      time: "3:00 PM",
      type: "Follow-up",
      status: "completed",
      hospital: "Women's Health Center",
    },
  ]

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate booking
    setTimeout(() => {
      setIsLoading(false)
      setIsBookingOpen(false)
      // Show success message or refresh appointments
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
                <Input placeholder="Search appointments..." className="pl-10 w-96 border-gray-300" />
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

        {/* Appointments Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
              <p className="text-gray-600">Manage your healthcare appointments</p>
            </div>
            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Book New Appointment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleBookAppointment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Medical Specialty</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="dermatology">Dermatology</SelectItem>
                        <SelectItem value="gynecology">Gynecology</SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Preferred Doctor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dr-johnson">Dr. Sarah Johnson</SelectItem>
                        <SelectItem value="dr-chen">Dr. Michael Chen</SelectItem>
                        <SelectItem value="dr-davis">Dr. Emily Davis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input type="date" id="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <Textarea id="reason" placeholder="Describe your symptoms or reason for visit..." />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Booking..." : "Book Appointment"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter and Sort */}
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Appointments</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" />
                        <AvatarFallback>
                          {appointment.doctor
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{appointment.doctor}</h3>
                        <p className="text-gray-600">{appointment.specialty}</p>
                        <p className="text-sm text-gray-500">{appointment.hospital}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{appointment.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{appointment.time}</span>
                      </div>
                      <Badge
                        className={
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="text-sm font-medium">{appointment.type}</span>
                    </div>
                    <div className="flex space-x-2">
                      {appointment.status === "pending" && (
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      )}
                      {appointment.status === "confirmed" && (
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                      )}
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
