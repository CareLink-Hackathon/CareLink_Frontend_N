"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
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
  UserCheck,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const router = useRouter()

  const sidebarItems = [
    { icon: Activity, label: "Dashboard", href: "/admin/dashboard", active: true },
    { icon: Calendar, label: "Appointments", href: "/admin/appointments" },
    { icon: Users, label: "Doctors", href: "/admin/doctors" },
    { icon: Users, label: "Patients", href: "/admin/patients" },
    { icon: FileText, label: "Feedback Analytics", href: "/admin/feedback" },
    { icon: Bell, label: "Notifications", href: "/admin/notifications", badge: "5" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
    { icon: HelpCircle, label: "Help Center", href: "/admin/help" },
  ]

  const stats = [
    { label: "Total Patients", value: "1,234", change: "+12%", icon: Users, color: "text-blue-600" },
    { label: "Active Doctors", value: "45", change: "+3%", icon: UserCheck, color: "text-green-600" },
    { label: "Appointments Today", value: "89", change: "+8%", icon: Calendar, color: "text-purple-600" },
    { label: "Pending Reviews", value: "23", change: "-5%", icon: Clock, color: "text-orange-600" },
  ]

  const recentAppointments = [
    {
      id: 1,
      patient: "John Doe",
      doctor: "Dr. Sarah Johnson",
      time: "10:00 AM",
      status: "confirmed",
      type: "Check-up",
    },
    {
      id: 2,
      patient: "Jane Smith",
      doctor: "Dr. Michael Chen",
      time: "11:30 AM",
      status: "pending",
      type: "Consultation",
    },
    {
      id: 3,
      patient: "Bob Wilson",
      doctor: "Dr. Emily Davis",
      time: "2:00 PM",
      status: "completed",
      type: "Follow-up",
    },
  ]

  const feedbackCategories = [
    { category: "Wait Time", count: 45, percentage: 35, color: "bg-red-500" },
    { category: "Staff Behavior", count: 32, percentage: 25, color: "bg-orange-500" },
    { category: "Facility Cleanliness", count: 28, percentage: 22, color: "bg-yellow-500" },
    { category: "Appointment Scheduling", count: 23, percentage: 18, color: "bg-blue-500" },
  ]

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
                <Input placeholder="Search anything..." className="pl-10 w-96 border-gray-300" />
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

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Hospital Dashboard</h1>
            <p className="text-gray-600">Monitor hospital operations and performance</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className={`text-sm ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Appointments */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Recent Appointments</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => router.push("/admin/appointments")}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>
                              {appointment.patient
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{appointment.patient}</h4>
                            <p className="text-sm text-gray-600">{appointment.doctor}</p>
                            <p className="text-xs text-gray-500">{appointment.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{appointment.time}</p>
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feedback Analytics */}
            <div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Top Feedback Categories</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => router.push("/admin/feedback")}>
                    View Details
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feedbackCategories.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.category}</span>
                          <span className="text-sm text-gray-600">{item.count} complaints</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Add New Doctor
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Manage Schedules
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
