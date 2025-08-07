"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  LogOut,
  Download,
  Calendar,
  BarChart3,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Appointments() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 24)) // July 24, 2025

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Appointments", href: "/appointments", active: true },
  ]

  const appointments = [
    {
      date: "24th July 2025",
      time: "11:00am",
      doctor: "Dr Elame Jordan",
      specialty: "Gynecologists",
      hospital: "Buea District Hospital",
      visitType: "Check-up",
      status: "Ongoing",
    },
    {
      date: "17th July 2025",
      time: "10:00am",
      doctor: "Dr Elame Jordan",
      specialty: "Gynecologists",
      hospital: "Buea District Hospital",
      visitType: "Consultation",
      status: "Ended",
    },
    {
      date: "10th July 2025",
      time: "11:00am",
      doctor: "Dr Elame Jordan",
      specialty: "Gynecologists",
      hospital: "Buea District Hospital",
      visitType: "Follow-up Treatment",
      status: "Ended",
    },
    {
      date: "3rd July 2025",
      time: "11:00am",
      doctor: "Dr Elame Jordan",
      specialty: "Gynecologists",
      hospital: "Buea District Hospital",
      visitType: "Check-up",
      status: "Ended",
    },
    {
      date: "23rd June 2025",
      time: "11:00am",
      doctor: "Dr Elame Jordan",
      specialty: "Gynecologists",
      hospital: "Buea District Hospital",
      visitType: "Consultation",
      status: "Ended",
    },
  ]

  const medications = [
    { name: "Amoxicillin", time: "Today - Morning Dose", schedule: "6:00am - 11:00am", checked: true },
    { name: "Paracetamol", time: "Today - Morning Dose", schedule: "6:00am - 11:00am", checked: true },
    { name: "Amoxicillin", time: "Today - Afternoon Dose", schedule: "12:00noon - 1:00pm", checked: false },
    { name: "Paracetamol", time: "Today - Afternoon Dose", schedule: "12:00noon - 1:00pm", checked: false },
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

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
            </div>
          </div>
        </header>

        <div className="flex-1 flex">
          {/* Appointments Content */}
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Appointment Reminders</h1>

              {/* Appointments Table */}
              <Card className="mb-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Appointments</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Building2 className="w-4 h-4 mr-1" />
                      Most Recent
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Date & Time</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Doctor</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Hospital</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Visit Type</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appointment, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium">{appointment.date}</div>
                                <div className="text-sm text-gray-600">{appointment.time}</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium">{appointment.doctor}</div>
                                <div className="text-sm text-gray-600">{appointment.specialty}</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-medium">{appointment.hospital}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-medium">{appointment.visitType}</div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                className={
                                  appointment.status === "Ongoing"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {appointment.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6">
            {/* Medication Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Medication Schedule</CardTitle>
                <div className="text-sm text-gray-600">Morning Dose</div>
              </CardHeader>
              <CardContent className="space-y-4">
                {medications.map((med, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Checkbox checked={med.checked} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{med.name}</div>
                      <div className="text-xs text-gray-600">{med.time}</div>
                      <div className="text-xs text-gray-600">{med.schedule}</div>
                    </div>
                  </div>
                ))}
                <Button variant="link" className="text-blue-600 p-0 h-auto">
                  View all
                </Button>
              </CardContent>
            </Card>

            {/* Reminder Calendar */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Reminder</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    Date
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                  <Button size="sm" className="bg-blue-600 text-white">
                    <Plus className="w-4 h-4 mr-1" />
                    New Reminder
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-600 text-white p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-blue-500"
                      onClick={() => navigateMonth("prev")}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <h3 className="font-bold">{formatMonth(currentDate)}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-blue-500"
                      onClick={() => navigateMonth("next")}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <div key={day} className="py-2 font-medium">
                        {day}
                      </div>
                    ))}

                    {getDaysInMonth(currentDate).map((day, index) => (
                      <div
                        key={index}
                        className={`py-2 ${
                          day === 24
                            ? "bg-white text-blue-600 rounded-full font-bold"
                            : day
                              ? "hover:bg-blue-500 rounded cursor-pointer"
                              : ""
                        }`}
                      >
                        {day || ""}
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-blue-600 text-white">Modify Next Appointment</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
