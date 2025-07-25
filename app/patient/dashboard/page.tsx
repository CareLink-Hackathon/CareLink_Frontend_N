"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ResponsiveDashboardLayout } from "@/components/layout/responsive-dashboard-layout"
import {
  Calendar,
  MessageSquare,
  Star,
  Clock,
  FileText,
  Heart,
  Activity,
  Thermometer,
  Weight,
  Bot,
  Bell,
  Settings,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PatientDashboard() {
  const router = useRouter()

  const sidebarItems = [
    { icon: Activity, label: "Dashboard", href: "/patient/dashboard", active: true },
    { icon: Calendar, label: "Appointments", href: "/patient/appointments" },
    { icon: FileText, label: "Medical Records", href: "/patient/records" },
    { icon: Star, label: "Reviews & Feedback", href: "/patient/feedback" },
    { icon: Bell, label: "Notifications", href: "/patient/notifications", badge: "3" },
    { icon: Settings, label: "Settings", href: "/patient/settings" },
    { icon: HelpCircle, label: "Help Center", href: "/patient/help" },
  ]

  const userInfo = {
    name: "JOHN DOE",
    id: "Patient ID: P001",
    avatar: "/placeholder.svg?height=64&width=64",
    fallback: "JD",
    role: "Patient"
  }

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "Today",
      time: "2:30 PM",
      type: "Check-up",
      status: "confirmed",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "Tomorrow",
      time: "10:00 AM",
      type: "Consultation",
      status: "pending",
    },
  ]

  const healthMetrics = [
    { label: "Heart Rate", value: "72 bpm", icon: Heart, color: "text-red-500" },
    { label: "Blood Pressure", value: "120/80", icon: Activity, color: "text-blue-500" },
    { label: "Temperature", value: "98.6°F", icon: Thermometer, color: "text-orange-500" },
    { label: "Weight", value: "165 lbs", icon: Weight, color: "text-green-500" },
  ]

  return (
    <ResponsiveDashboardLayout
      sidebarItems={sidebarItems}
      userInfo={userInfo}
      pageTitle="Patient Dashboard"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Appointment</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">Today</p>
                <p className="text-xs sm:text-sm text-gray-500">2:30 PM</p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">5</p>
                <p className="text-xs sm:text-sm text-gray-500">Unread</p>
              </div>
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Health Score</p>
                <p className="text-lg sm:text-2xl font-bold text-orange-600">85%</p>
                <p className="text-xs sm:text-sm text-gray-500">Good</p>
              </div>
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reports</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-600">12</p>
                <p className="text-xs sm:text-sm text-gray-500">Available</p>
              </div>
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg sm:text-xl">Upcoming Appointments</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push("/patient/appointments")}
                className="text-xs sm:text-sm"
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" />
                        <AvatarFallback>
                          {appointment.doctor
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-sm sm:text-base">{appointment.doctor}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{appointment.specialty}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end space-y-2">
                      <Badge
                        className={
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {appointment.status}
                      </Badge>
                      <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Metrics */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Health Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gray-100 ${metric.color}`}>
                      <metric.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{metric.label}</p>
                      <p className="text-lg sm:text-xl font-bold text-gray-700">{metric.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base" 
                onClick={() => router.push("/patient/appointments")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push("/patient/chatbot")}
              >
                <Bot className="w-4 h-4 mr-2" />
                Chat with AI Assistant
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push("/patient/records")}
              >
                <FileText className="w-4 h-4 mr-2" />
                View Medical Records
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Appointment scheduled with Dr. Sarah Johnson</span>
              <span className="text-gray-500 ml-auto text-xs">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Blood test results received</span>
              <span className="text-gray-500 ml-auto text-xs">1 day ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Prescription refilled</span>
              <span className="text-gray-500 ml-auto text-xs">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </ResponsiveDashboardLayout>
  )
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
                <Input placeholder="Search anything..." className="pl-10 w-96 border-gray-300" />
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

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
            <p className="text-gray-600">Here's your health overview for today</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Book Appointment</h3>
                <p className="text-sm text-gray-600">Schedule a new visit</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">Medical Records</h3>
                <p className="text-sm text-gray-600">View your history</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-sm text-gray-600">Get instant help</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <h3 className="font-semibold">Leave Review</h3>
                <p className="text-sm text-gray-600">Share your experience</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Appointments */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => router.push("/patient/appointments")}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="/placeholder.svg?height=48&width=48" />
                          <AvatarFallback>
                            {appointment.doctor
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold">{appointment.doctor}</h4>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{appointment.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Health Metrics */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Health Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {healthMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gray-100 ${metric.color}`}>
                          <metric.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{metric.label}</p>
                          <p className="text-sm text-gray-600">{metric.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Appointment booked with Dr. Johnson</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Lab results uploaded</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Prescription refilled</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
