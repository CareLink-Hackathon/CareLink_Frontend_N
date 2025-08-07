"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { doctorService, MedicalRecord } from '@/lib/services/doctor-service'
import {
  Search,
  Calendar,
  Users,
  Activity,
  FileText,
  Eye,
  Download,
  RefreshCw,
  AlertTriangle,
  Settings,
  HelpCircle,
  Bell,
  Heart,
  Stethoscope,
  Brain,
  Clipboard,
  FileImage,
  TestTube,
} from "lucide-react"

export default function DoctorRecords() {
  const router = useRouter()
  const { user } = useAuth()
  
  // State management
  const [loading, setLoading] = useState(true)
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Get doctor ID from user
  const getDoctorId = () => {
    return user?.user_id || user?._id || (user as any)?.id
  }

  const sidebarItems = [
    { icon: Activity, label: "Dashboard", href: "/doctor/dashboard" },
    { icon: Calendar, label: "My Appointments", href: "/doctor/appointments" },
    { icon: Users, label: "My Patients", href: "/doctor/patients" },
    { icon: FileText, label: "Medical Records", href: "/doctor/records", active: true },
    { icon: Bell, label: "Notifications", href: "/doctor/notifications" },
    { icon: Settings, label: "Settings", href: "/doctor/settings" },
    { icon: HelpCircle, label: "Help Center", href: "/doctor/help" },
  ]

  const userInfo = {
    name: user ? `DR. ${(user.first_name || '').toUpperCase()} ${(user.last_name || '').toUpperCase()}` : 'Doctor',
    id: user ? `Doctor ID: ${(user.user_id || user._id || '').slice(-6)}` : 'Loading...',
    avatar: '/placeholder.svg?height=64&width=64',
    fallback: user ? `${(user.first_name || 'D')[0]}${(user.last_name || 'R')[0]}` : 'DR',
    role: (user as any)?.specialty || 'Doctor',
  }

  // Load medical records
  const loadMedicalRecords = async () => {
    const doctorId = getDoctorId()
    if (!doctorId) {
      console.warn('No doctor ID found')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log('Loading medical records for doctor:', doctorId)
      const records = await doctorService.getMedicalRecords(doctorId)
      setMedicalRecords(records)

    } catch (error) {
      console.error('Error loading medical records:', error)
      setError('Failed to load medical records')
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    if (user?.role === 'doctor') {
      loadMedicalRecords()
    } else {
      setLoading(false)
    }
  }, [user])

  // Filter records based on search and type
  const filteredRecords = medicalRecords.filter((record) => {
    const matchesSearch = 
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.chief_complaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || record.record_type === filterType
    
    return matchesSearch && matchesType
  })

  // Get record type icon
  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return <Stethoscope className="w-4 h-4" />
      case 'diagnosis':
        return <Brain className="w-4 h-4" />
      case 'prescription':
        return <Clipboard className="w-4 h-4" />
      case 'laboratory':
        return <TestTube className="w-4 h-4" />
      case 'imaging':
        return <FileImage className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  // Get record type color
  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'bg-blue-100 text-blue-800'
      case 'diagnosis':
        return 'bg-purple-100 text-purple-800'
      case 'prescription':
        return 'bg-green-100 text-green-800'
      case 'laboratory':
        return 'bg-orange-100 text-orange-800'
      case 'imaging':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  // Handle PDF download
  const handleDownloadPDF = async (recordId: string) => {
    try {
      setError(null)
      await doctorService.downloadMedicalRecordPDF(recordId)
      
      // Show success feedback
      const tempSuccessDiv = document.createElement('div')
      tempSuccessDiv.className = 'fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300'
      tempSuccessDiv.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span class="font-medium">PDF downloaded successfully!</span>
        </div>
      `
      document.body.appendChild(tempSuccessDiv)
      
      setTimeout(() => {
        if (document.body.contains(tempSuccessDiv)) {
          tempSuccessDiv.style.opacity = '0'
          setTimeout(() => {
            if (document.body.contains(tempSuccessDiv)) {
              document.body.removeChild(tempSuccessDiv)
            }
          }, 300)
        }
      }, 3000)
      
    } catch (error) {
      setError(`Failed to download PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Loading state
  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['doctor']}>
        <ResponsiveDashboardLayout
          sidebarItems={sidebarItems}
          userInfo={userInfo}
          pageTitle="Medical Records"
        >
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin mr-2" />
            <span>Loading medical records...</span>
          </div>
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <ResponsiveDashboardLayout
        sidebarItems={sidebarItems}
        userInfo={userInfo}
        pageTitle="Medical Records"
      >
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Medical Records
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage and download medical records you've created
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={loadMedicalRecords}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by title, diagnosis, complaint, or patient ID..."
              className="pl-10 border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="consultation">Consultation</SelectItem>
              <SelectItem value="diagnosis">Diagnosis</SelectItem>
              <SelectItem value="prescription">Prescription</SelectItem>
              <SelectItem value="laboratory">Laboratory</SelectItem>
              <SelectItem value="imaging">Imaging</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold">{medicalRecords.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Consultations</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {medicalRecords.filter(r => r.record_type === 'consultation').length}
                  </p>
                </div>
                <Stethoscope className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lab Results</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {medicalRecords.filter(r => r.record_type === 'laboratory').length}
                  </p>
                </div>
                <TestTube className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-green-600">
                    {medicalRecords.filter(r => {
                      if (!r.created_at) return false
                      const recordDate = new Date(r.created_at)
                      const currentDate = new Date()
                      return recordDate.getMonth() === currentDate.getMonth() && 
                             recordDate.getFullYear() === currentDate.getFullYear()
                    }).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medical Records Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterType !== 'all' 
                  ? 'No records match your search criteria.' 
                  : 'You have not created any medical records yet.'}
              </p>
              {(searchTerm || filterType !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setFilterType('all')
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            filteredRecords.map((record) => (
              <Card key={record._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {getRecordTypeIcon(record.record_type)}
                        <h3 className="font-semibold text-lg truncate">
                          {record.title}
                        </h3>
                        <Badge className={getRecordTypeColor(record.record_type)}>
                          {record.record_type}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">Patient ID:</span> {record.patient_id}</p>
                        <p><span className="font-medium">Chief Complaint:</span> {record.chief_complaint}</p>
                        <p><span className="font-medium">Diagnosis:</span> {record.diagnosis}</p>
                        <p><span className="font-medium">Created:</span> {formatDate(record.created_at || '')}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRecord(record)
                          setIsDetailOpen(true)
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleDownloadPDF(record._id!)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Record Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {selectedRecord && getRecordTypeIcon(selectedRecord.record_type)}
                <span>{selectedRecord?.title}</span>
              </DialogTitle>
            </DialogHeader>

            {selectedRecord && (
              <div className="space-y-6">
                {/* Record Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Record Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Type:</span> {selectedRecord.record_type}</p>
                      <p><span className="font-medium">Patient ID:</span> {selectedRecord.patient_id}</p>
                      <p><span className="font-medium">Doctor ID:</span> {selectedRecord.doctor_id}</p>
                      <p><span className="font-medium">Created:</span> {formatDate(selectedRecord.created_at || '')}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleDownloadPDF(selectedRecord._id!)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>

                {/* Chief Complaint */}
                <div>
                  <h4 className="font-semibold mb-2">Chief Complaint</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedRecord.chief_complaint}</p>
                </div>

                {/* History of Present Illness */}
                {selectedRecord.history_of_present_illness && (
                  <div>
                    <h4 className="font-semibold mb-2">History of Present Illness</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedRecord.history_of_present_illness}</p>
                  </div>
                )}

                {/* Physical Examination */}
                {selectedRecord.physical_examination && (
                  <div>
                    <h4 className="font-semibold mb-2">Physical Examination</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedRecord.physical_examination}</p>
                  </div>
                )}

                {/* Vital Signs */}
                {selectedRecord.vital_signs && Object.keys(selectedRecord.vital_signs).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Vital Signs</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(selectedRecord.vital_signs).map(([key, value]) => 
                        value ? (
                          <div key={key} className="bg-gray-50 p-3 rounded text-center">
                            <p className="text-xs text-gray-600 capitalize">{key.replace('_', ' ')}</p>
                            <p className="font-semibold">{value}</p>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                )}

                {/* Diagnosis */}
                <div>
                  <h4 className="font-semibold mb-2">Diagnosis</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedRecord.diagnosis}</p>
                </div>

                {/* Treatment Plan */}
                <div>
                  <h4 className="font-semibold mb-2">Treatment Plan</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedRecord.treatment_plan}</p>
                </div>

                {/* Medications */}
                {selectedRecord.medications && selectedRecord.medications.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Medications</h4>
                    <div className="space-y-2">
                      {selectedRecord.medications.map((med, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div><span className="font-medium">Name:</span> {med.name}</div>
                            <div><span className="font-medium">Dosage:</span> {med.dosage}</div>
                            <div><span className="font-medium">Frequency:</span> {med.frequency}</div>
                            <div><span className="font-medium">Duration:</span> {med.duration}</div>
                          </div>
                          {med.instructions && (
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">Instructions:</span> {med.instructions}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lab Results */}
                {selectedRecord.lab_results && selectedRecord.lab_results.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Laboratory Results</h4>
                    <div className="space-y-2">
                      {selectedRecord.lab_results.map((lab, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div><span className="font-medium">Test:</span> {lab.test_name}</div>
                            <div><span className="font-medium">Result:</span> {lab.result}</div>
                            <div><span className="font-medium">Reference:</span> {lab.reference_range}</div>
                            <div>
                              <Badge className={lab.status === 'normal' ? 'bg-green-100 text-green-800' : 
                                               lab.status === 'critical' ? 'bg-red-100 text-red-800' : 
                                               'bg-yellow-100 text-yellow-800'}>
                                {lab.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up Instructions */}
                {selectedRecord.follow_up_instructions && (
                  <div>
                    <h4 className="font-semibold mb-2">Follow-up Instructions</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedRecord.follow_up_instructions}</p>
                  </div>
                )}

                {/* Additional Notes */}
                {selectedRecord.notes && (
                  <div>
                    <h4 className="font-semibold mb-2">Additional Notes</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </ResponsiveDashboardLayout>
    </ProtectedRoute>
  )
}
