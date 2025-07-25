"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Calendar,
  Users,
  Activity,
  FileText,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminAppointments() {
  const router = useRouter()
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isAssigning, setIsAssigning] = useState(false)

  const sidebarItems = [
    { icon: Activity, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Calendar, label: "Appointments", href: "/admin/appointments", active: true },
    { icon: Users, label: "Doctors", href: "/admin/doctors" },
    { icon: Users, label: "Patients", href: "/admin/patients" },
    { icon: FileText, label: "Feedback Analytics", href: "/admin/feedback" },
    { icon: Bell, label: "Notifications", href: "/admin/notifications", badge: "5" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
    { icon: HelpCircle, label: "Help Center", href: "/admin/help" },
  ]

  const appointments = [
    {
      id: 1,
      patient: "John Doe",
      patientId: "P001",
      doctor: "Dr. Sarah Johnson",
      doctorId: "D001",
      date: "2025-01-28",
      time: "10:00 AM",
      type: "Check-up",
      status: "pending",
      specialty: "Cardiology",
      reason: "Chest pain and irregular heartbeat",
    },
    {
      id: 2,
      patient: "Jane Smith",
      patientId: "P002",
      doctor: "Unassigned",
      doctorId: null,
      date: "2025-01-28",
      time: "11:30 AM",
      type: "Consultation",
      status: "pending",
      specialty: "Dermatology",
      reason: "Skin rash and irritation",
    },
    {
      id: 3,
      patient: "Bob Wilson",
      patientId: "P003",
      doctor: "Dr. Emily Davis",
      doctorId: "D003",
      date: "2025-01-28",
      time: "2:00 PM",
      type: "Follow-up",
      status: "confirmed",
      specialty: "Gynecology",
      reason: "Post-surgery follow-up",
    },
    {
      id: 4,
      patient: "Alice Brown",
      patientId: "P004",
      doctor: "Dr. Michael Chen",
      doctorId: "D002",
      date: "2025-01-27",
      time: "3:30 PM",
      type: "Check-up",
      status: "completed",
      specialty: "Dermatology",
      reason: "Routine skin examination",
    },
  ]

  const availableDoctors = [
    { id: "D001", name: "Dr. Sarah Johnson", specialty: "Cardiology" },
    { id: "D002", name: "Dr. Michael Chen", specialty: "Dermatology" },
    { id: "D003", name: "Dr. Emily Davis", specialty: "Gynecology" },
    { id: "D004", name: "Dr. Robert Kim", specialty: "Pediatrics" },
  ]

  const handleStatusChange = (appointmentId: number, newStatus: string) => {
    // Simulate status update
    console.log(`Updating appointment ${appointmentId} to ${newStatus}`)
  }

  const handleAssignDoctor = (appointmentId: number, doctorId: string) => {
    setIsAssigning(true)
    // Simulate doctor assignment
    setTimeout(() => {
      setIsAssigning(false)
      console.log(`Assigned doctor ${doctorId} to appointment ${appointmentId}`)
    }, 1000)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <Avatar className="w-16 h-16 border-2 border-white">
              <AvatarImage src="/placeholder.svg?height=64&width=64" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-lg">ADMIN USER</h3>
              <p className="text-blue-100 text-sm">Hospital Administrator</p>
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
              <Button variant="outline" size="sm">
                Export Report
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
              <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
              <p className="text-gray-600">Manage and assign appointments to doctors</p>
            </div>
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="today">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
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
                          {appointment.patient
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{appointment.patient}</h3>
                        <p className="text-gray-600">ID: {appointment.patientId}</p>
                        <p className="text-sm text-gray-500">{appointment.specialty}</p>
                      </div>
                    </div>
                    <div className="text-center">
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
                              : appointment.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-medium mb-1">
                        {appointment.doctor === "Unassigned" ? (
                          <span className="text-red-600">Unassigned</span>
                        ) : (
                          appointment.doctor
                        )}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">{appointment.type}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Reason:</p>
                        <p className="text-sm">{appointment.reason}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {appointment.doctor === "Unassigned" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <UserPlus className="w-4 h-4 mr-1" />
                                Assign Doctor
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Assign Doctor</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Select Doctor</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose a doctor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableDoctors
                                        .filter((doc) => doc.specialty === appointment.specialty)
                                        .map((doctor) => (
                                          <SelectItem key={doctor.id} value={doctor.id}>
                                            {doctor.name} - {doctor.specialty}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button
                                  className="w-full"
                                  onClick={() => handleAssignDoctor(appointment.id, "D001")}
                                  disabled={isAssigning}
                                >
                                  {isAssigning ? "Assigning..." : "Assign Doctor"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        {appointment.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusChange(appointment.id, "confirmed")}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusChange(appointment.id, "cancelled")}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
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
