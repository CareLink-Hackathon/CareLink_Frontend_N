"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Heart,
  Thermometer,
  Weight,
  Plus,
  User,
  AlertTriangle,
} from "lucide-react"

export default function DoctorPatients() {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    bloodType: "",
    allergies: "",
    conditions: "",
    notes: "",
    emergencyContact: "",
    emergencyPhone: "",
  })

  const sidebarItems = [
    { icon: Activity, label: "Dashboard", href: "/doctor/dashboard" },
    { icon: Calendar, label: "My Appointments", href: "/doctor/appointments" },
    { icon: Users, label: "My Patients", href: "/doctor/patients", active: true },
    { icon: FileText, label: "Medical Records", href: "/doctor/records" },
    { icon: Bell, label: "Notifications", href: "/doctor/notifications", badge: "3" },
    { icon: Settings, label: "Settings", href: "/doctor/settings" },
    { icon: HelpCircle, label: "Help Center", href: "/doctor/help" },
  ]

  const patients = [
    {
      id: 1,
      name: "John Doe",
      age: 45,
      gender: "Male",
      phone: "+1 (555) 123-4567",
      email: "john.doe@email.com",
      address: "123 Main St, City, State 12345",
      bloodType: "O+",
      allergies: ["Penicillin", "Shellfish"],
      conditions: ["Hypertension", "Diabetes Type 2"],
      lastVisit: "2025-01-27",
      nextAppointment: "2025-01-30",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      vitals: {
        heartRate: "72 bpm",
        bloodPressure: "130/85 mmHg",
        temperature: "98.6°F",
        weight: "185 lbs",
        height: "5'10\"",
      },
      medications: [
        { name: "Lisinopril", dosage: "10mg daily", frequency: "Once daily" },
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      ],
      notes: "Patient has been compliant with medication. Blood pressure improving."
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      phone: "+1 (555) 987-6543",
      email: "jane.smith@email.com",
      address: "456 Oak Ave, City, State 54321",
      bloodType: "A-",
      allergies: ["Latex"],
      conditions: ["Asthma"],
      lastVisit: "2025-01-25",
      nextAppointment: "2025-02-05",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      vitals: {
        heartRate: "68 bpm",
        bloodPressure: "115/75 mmHg",
        temperature: "98.4°F",
        weight: "140 lbs",
        height: "5'6\"",
      },
      medications: [
        { name: "Albuterol Inhaler", dosage: "90mcg", frequency: "As needed" },
      ],
      notes: "Asthma well controlled. Continue current treatment plan."
    },
    {
      id: 3,
      name: "Bob Wilson",
      age: 58,
      gender: "Male",
      phone: "+1 (555) 555-0123",
      email: "bob.wilson@email.com",
      address: "789 Pine St, City, State 67890",
      bloodType: "B+",
      allergies: ["None known"],
      conditions: ["Coronary Artery Disease", "High Cholesterol"],
      lastVisit: "2025-01-20",
      nextAppointment: "2025-01-28",
      status: "critical",
      avatar: "/placeholder.svg?height=40&width=40",
      vitals: {
        heartRate: "85 bpm",
        bloodPressure: "145/95 mmHg",
        temperature: "99.1°F",
        weight: "210 lbs",
        height: "6'0\"",
      },
      medications: [
        { name: "Atorvastatin", dosage: "40mg", frequency: "Once daily" },
        { name: "Aspirin", dosage: "81mg", frequency: "Once daily" },
        { name: "Metoprolol", dosage: "50mg", frequency: "Twice daily" },
      ],
      notes: "Recent cardiac event. Monitoring closely. Patient education on lifestyle changes."
    },
    {
      id: 4,
      name: "Alice Brown",
      age: 28,
      gender: "Female",
      phone: "+1 (555) 444-7890",
      email: "alice.brown@email.com",
      address: "321 Elm St, City, State 13579",
      bloodType: "AB+",
      allergies: ["Sulfa drugs"],
      conditions: ["Migraine"],
      lastVisit: "2025-01-15",
      nextAppointment: "2025-02-15",
      status: "stable",
      avatar: "/placeholder.svg?height=40&width=40",
      vitals: {
        heartRate: "65 bpm",
        bloodPressure: "110/70 mmHg",
        temperature: "98.2°F",
        weight: "125 lbs",
        height: "5'4\"",
      },
      medications: [
        { name: "Sumatriptan", dosage: "50mg", frequency: "As needed for migraine" },
      ],
      notes: "Migraine frequency reduced with current treatment. Continue monitoring."
    },
  ]

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || patient.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "stable": return "bg-blue-100 text-blue-800"
      case "critical": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsCreateOpen(false)
      setNewPatient({
        name: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        bloodType: "",
        allergies: "",
        conditions: "",
        notes: "",
        emergencyContact: "",
        emergencyPhone: "",
      })
      // Show success message
    }, 1000)
  }

  const handleEditPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsEditOpen(false)
      setEditingPatient(null)
      // Show success message
    }, 1000)
  }

  const openEditDialog = (patient: any) => {
    setEditingPatient({
      ...patient,
      allergies: patient.allergies.join(", "),
      conditions: patient.conditions.join(", "),
    })
    setIsEditOpen(true)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <Avatar className="w-16 h-16 border-2 border-white">
              <AvatarImage src="/placeholder.svg?height=64&width=64" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-lg">DR. SARAH JOHNSON</h3>
              <p className="text-blue-100 text-sm">Cardiologist</p>
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
              <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
              <Badge className="bg-blue-100 text-blue-800">
                {filteredPatients.length} Patients
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Patient
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Add New Patient</span>
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreatePatient} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newPatient.name}
                          onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={newPatient.age}
                          onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={newPatient.gender} onValueChange={(value) => setNewPatient({...newPatient, gender: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bloodType">Blood Type</Label>
                        <Select value={newPatient.bloodType} onValueChange={(value) => setNewPatient({...newPatient, bloodType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={newPatient.phone}
                          onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newPatient.email}
                          onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={newPatient.address}
                        onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                        rows={2}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        <Input
                          id="emergencyContact"
                          value={newPatient.emergencyContact}
                          onChange={(e) => setNewPatient({...newPatient, emergencyContact: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                        <Input
                          id="emergencyPhone"
                          value={newPatient.emergencyPhone}
                          onChange={(e) => setNewPatient({...newPatient, emergencyPhone: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                      <Input
                        id="allergies"
                        value={newPatient.allergies}
                        onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})}
                        placeholder="e.g., Penicillin, Shellfish, None"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="conditions">Medical Conditions (comma-separated)</Label>
                      <Input
                        id="conditions"
                        value={newPatient.conditions}
                        onChange={(e) => setNewPatient({...newPatient, conditions: e.target.value})}
                        placeholder="e.g., Hypertension, Diabetes"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Initial Notes</Label>
                      <Textarea
                        id="notes"
                        value={newPatient.notes}
                        onChange={(e) => setNewPatient({...newPatient, notes: e.target.value})}
                        rows={3}
                        placeholder="Add any initial notes about the patient..."
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Patient"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="stable">Stable</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patients List */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={patient.avatar} />
                        <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{patient.name}</CardTitle>
                        <p className="text-sm text-gray-500">{patient.age} years, {patient.gender}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Blood Type</p>
                      <p className="font-medium">{patient.bloodType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Visit</p>
                      <p className="font-medium">{patient.lastVisit}</p>
                    </div>
                  </div>
                  
                  {patient.conditions.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-sm mb-2">Conditions</p>
                      <div className="flex flex-wrap gap-1">
                        {patient.conditions.slice(0, 2).map((condition) => (
                          <Badge key={condition} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                        {patient.conditions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{patient.conditions.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <Mail className="w-4 h-4 text-gray-400" />
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openEditDialog(patient)}
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            onClick={() => setSelectedPatient(patient)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={patient.avatar} />
                              <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-bold">{patient.name}</h3>
                              <p className="text-gray-500">{patient.age} years, {patient.gender}</p>
                            </div>
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Contact Information */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{patient.phone}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span>{patient.email}</span>
                              </div>
                              <div className="flex items-start space-x-3">
                                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                <span className="text-sm">{patient.address}</span>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Vital Signs */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Latest Vital Signs</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Heart className="w-4 h-4 text-red-500" />
                                  <span className="text-sm">Heart Rate</span>
                                </div>
                                <span className="font-medium">{patient.vitals.heartRate}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Activity className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm">Blood Pressure</span>
                                </div>
                                <span className="font-medium">{patient.vitals.bloodPressure}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Thermometer className="w-4 h-4 text-orange-500" />
                                  <span className="text-sm">Temperature</span>
                                </div>
                                <span className="font-medium">{patient.vitals.temperature}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Weight className="w-4 h-4 text-green-500" />
                                  <span className="text-sm">Weight</span>
                                </div>
                                <span className="font-medium">{patient.vitals.weight}</span>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Medical Information */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Medical Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-500 mb-2">Blood Type</p>
                                <Badge className="bg-red-100 text-red-800">{patient.bloodType}</Badge>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-2">Allergies</p>
                                <div className="flex flex-wrap gap-1">
                                  {patient.allergies.map((allergy) => (
                                    <Badge key={allergy} variant="outline" className="text-xs bg-yellow-50 text-yellow-800">
                                      {allergy}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-2">Conditions</p>
                                <div className="flex flex-wrap gap-1">
                                  {patient.conditions.map((condition) => (
                                    <Badge key={condition} variant="outline" className="text-xs">
                                      {condition}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Current Medications */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Current Medications</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {patient.medications.map((med, index) => (
                                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                                    <p className="font-medium">{med.name}</p>
                                    <p className="text-sm text-gray-500">{med.dosage} - {med.frequency}</p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Doctor's Notes */}
                        <Card className="mt-6">
                          <CardHeader>
                            <CardTitle className="text-lg">Doctor's Notes</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Textarea
                              value={patient.notes}
                              placeholder="Add your notes about this patient..."
                              className="min-h-[100px]"
                              readOnly
                            />
                          </CardContent>
                        </Card>
                      </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Edit Patient Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Edit className="w-5 h-5" />
                <span>Edit Patient</span>
              </DialogTitle>
            </DialogHeader>
            {editingPatient && (
              <form onSubmit={handleEditPatient} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={editingPatient.name}
                      onChange={(e) => setEditingPatient({...editingPatient, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-age">Age</Label>
                    <Input
                      id="edit-age"
                      type="number"
                      value={editingPatient.age}
                      onChange={(e) => setEditingPatient({...editingPatient, age: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-gender">Gender</Label>
                    <Select value={editingPatient.gender} onValueChange={(value) => setEditingPatient({...editingPatient, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-bloodType">Blood Type</Label>
                    <Select value={editingPatient.bloodType} onValueChange={(value) => setEditingPatient({...editingPatient, bloodType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone Number</Label>
                    <Input
                      id="edit-phone"
                      value={editingPatient.phone}
                      onChange={(e) => setEditingPatient({...editingPatient, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingPatient.email}
                      onChange={(e) => setEditingPatient({...editingPatient, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Textarea
                    id="edit-address"
                    value={editingPatient.address}
                    onChange={(e) => setEditingPatient({...editingPatient, address: e.target.value})}
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-allergies">Allergies (comma-separated)</Label>
                  <Input
                    id="edit-allergies"
                    value={editingPatient.allergies}
                    onChange={(e) => setEditingPatient({...editingPatient, allergies: e.target.value})}
                    placeholder="e.g., Penicillin, Shellfish, None"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-conditions">Medical Conditions (comma-separated)</Label>
                  <Input
                    id="edit-conditions"
                    value={editingPatient.conditions}
                    onChange={(e) => setEditingPatient({...editingPatient, conditions: e.target.value})}
                    placeholder="e.g., Hypertension, Diabetes"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Doctor's Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={editingPatient.notes}
                    onChange={(e) => setEditingPatient({...editingPatient, notes: e.target.value})}
                    rows={3}
                    placeholder="Update notes about the patient..."
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Patient"}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
