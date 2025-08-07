"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { doctorService } from '@/lib/services/doctor-service';
import {
  Search,
  Bell,
  Settings,
  HelpCircle,
  Calendar,
  Users,
  Activity,
  FileText,
  Filter,
  Eye,
  Phone,
  Mail,
  MapPin,
  Heart,
  Thermometer,
  Weight,
  Plus,
  User,
  AlertTriangle,
  RefreshCw,
  Download,
  FilePlus,
  X,
} from "lucide-react"

// Interfaces
interface Patient {
  user_id: string;
  patient_name: string;
  patient_email: string;
  patient_phone?: string;
  patient_age?: number;
  patient_gender?: string;
  last_appointment_date: string;
  appointment_type: string;
  appointment_status: string;
  medical_records_count?: number;
}

interface MedicalRecord {
  _id?: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  record_type: 'consultation' | 'diagnosis' | 'prescription' | 'laboratory' | 'imaging';
  title: string;
  chief_complaint: string;
  history_of_present_illness: string;
  physical_examination: string;
  diagnosis: string;
  treatment_plan: string;
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  follow_up_instructions: string;
  notes?: string;
  vital_signs?: {
    blood_pressure?: string;
    heart_rate?: string;
    temperature?: string;
    weight?: string;
    height?: string;
    respiratory_rate?: string;
    oxygen_saturation?: string;
  };
  lab_results?: Array<{
    test_name: string;
    result: string;
    reference_range?: string;
    status: 'normal' | 'abnormal' | 'critical';
  }>;
  created_at?: string;
  updated_at?: string;
}

export default function DoctorPatients() {
  const router = useRouter()
  const { user } = useAuth();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateRecordOpen, setIsCreateRecordOpen] = useState(false);
  const [isCreatingRecord, setIsCreatingRecord] = useState(false);
  
  // Medical record form state
  const [newMedicalRecord, setNewMedicalRecord] = useState<Partial<MedicalRecord>>({
    record_type: 'consultation',
    title: '',
    chief_complaint: '',
    history_of_present_illness: '',
    physical_examination: '',
    diagnosis: '',
    treatment_plan: '',
    medications: [],
    follow_up_instructions: '',
    notes: '',
    vital_signs: {},
    lab_results: []
  });

  // Get doctor ID from user
  const getDoctorId = () => {
    return user?.user_id || user?._id || (user as any)?.id;
  };

  // Load patients with approved appointments
  const loadPatients = async () => {
    const doctorId = getDoctorId();
    if (!doctorId) {
      console.warn('⚠️ No doctor ID found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🚀 Loading patients for doctor:', doctorId);

      // Get all appointments for this doctor
      const appointments = await doctorService.getAppointments(doctorId);
      
      // Filter for approved appointments and extract unique patients
      const approvedAppointments = appointments.filter(apt => apt.status === 'approved');
      
      // Group by patient and get the latest appointment for each
      const patientMap = new Map();
      approvedAppointments.forEach(apt => {
        const existingPatient = patientMap.get(apt.user_id);
        if (!existingPatient || new Date(apt.date) > new Date(existingPatient.last_appointment_date)) {
          patientMap.set(apt.user_id, {
            user_id: apt.user_id,
            patient_name: apt.patient_name || 'Unknown Patient',
            patient_email: apt.user_email,
            patient_phone: apt.patient_phone,
            patient_age: apt.patient_age,
            patient_gender: apt.patient_gender,
            last_appointment_date: apt.date,
            appointment_type: apt.type,
            appointment_status: apt.status,
            medical_records_count: 0 // This would be populated from backend
          });
        }
      });

      const uniquePatients = Array.from(patientMap.values());
      console.log('👥 Patients with approved appointments:', uniquePatients);
      
      setPatients(uniquePatients);

    } catch (error) {
      console.error('❌ Error loading patients:', error);
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (user?.role === 'doctor') {
      console.log('🚀 DoctorPatients - Loading data for doctor:', user);
      loadPatients();
    } else {
      console.log('❌ DoctorPatients - User is not a doctor:', user);
      setLoading(false);
    }
  }, [user]);

  const sidebarItems = [
    { icon: Activity, label: "Dashboard", href: "/doctor/dashboard" },
    { icon: Calendar, label: "My Appointments", href: "/doctor/appointments" },
    { icon: Users, label: "My Patients", href: "/doctor/patients", active: true },
    { icon: FileText, label: "Medical Records", href: "/doctor/records" },
    { icon: Bell, label: "Notifications", href: "/doctor/notifications" },
    { icon: Settings, label: "Settings", href: "/doctor/settings" },
    { icon: HelpCircle, label: "Help Center", href: "/doctor/help" },
  ];

  const userInfo = {
    name: user ? `DR. ${(user.first_name || '').toUpperCase()} ${(user.last_name || '').toUpperCase()}` : 'Doctor',
    id: user ? `Doctor ID: ${(user.user_id || user._id || '').slice(-6)}` : 'Loading...',
    avatar: '/placeholder.svg?height=64&width=64',
    fallback: user ? `${(user.first_name || 'D')[0]}${(user.last_name || 'R')[0]}` : 'DR',
    role: (user as any)?.specialty || 'Doctor',
  };

  // Filter patients based on search
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.appointment_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Handle medical record creation
  const handleCreateMedicalRecord = async () => {
    if (!selectedPatient) return;
    
    const doctorId = getDoctorId();
    if (!doctorId) return;

    try {
      setIsCreatingRecord(true);
      
      const recordData = {
        ...newMedicalRecord,
        patient_id: selectedPatient.user_id,
        doctor_id: doctorId
      };

      await doctorService.createMedicalRecord(recordData as any, doctorId);
      
      // Reset form and close dialog
      setNewMedicalRecord({
        record_type: 'consultation',
        title: '',
        chief_complaint: '',
        history_of_present_illness: '',
        physical_examination: '',
        diagnosis: '',
        treatment_plan: '',
        medications: [],
        follow_up_instructions: '',
        notes: '',
        vital_signs: {},
        lab_results: []
      });
      setIsCreateRecordOpen(false);
      setSelectedPatient(null);
      
      // Reload patients to update counts
      await loadPatients();
      
      console.log('✅ Medical record created successfully');
    } catch (error) {
      console.error('❌ Error creating medical record:', error);
      setError('Failed to create medical record');
    } finally {
      setIsCreatingRecord(false);
    }
  };

  // Add medication to the list
  const addMedication = () => {
    const currentMedications = newMedicalRecord.medications || [];
    setNewMedicalRecord({
      ...newMedicalRecord,
      medications: [
        ...currentMedications,
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
      ]
    });
  };

  // Remove medication from the list
  const removeMedication = (index: number) => {
    const currentMedications = newMedicalRecord.medications || [];
    setNewMedicalRecord({
      ...newMedicalRecord,
      medications: currentMedications.filter((_, i) => i !== index)
    });
  };

  // Update medication
  const updateMedication = (index: number, field: string, value: string) => {
    const currentMedications = newMedicalRecord.medications || [];
    const updatedMedications = currentMedications.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    );
    setNewMedicalRecord({
      ...newMedicalRecord,
      medications: updatedMedications
    });
  };

  // Format date for display
  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return date;
    }
  };

  // Loading state
  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['doctor']}>
        <ResponsiveDashboardLayout
          sidebarItems={sidebarItems}
          userInfo={userInfo}
          pageTitle="My Patients"
        >
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin mr-2" />
            <span>Loading patients...</span>
          </div>
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    );
  }

  // Error state
  if (error) {
    return (
      <ProtectedRoute allowedRoles={['doctor']}>
        <ResponsiveDashboardLayout
          sidebarItems={sidebarItems}
          userInfo={userInfo}
          pageTitle="My Patients"
        >
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Patients</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadPatients} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <ResponsiveDashboardLayout
        sidebarItems={sidebarItems}
        userInfo={userInfo}
        pageTitle="My Patients"
      >
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                My Patients
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage patients with approved appointments and create medical records
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={loadPatients}
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

        {/* Search Section */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search patients..."
              className="pl-10 border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Patients Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold">{patients.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">With Approved Appointments</p>
                  <p className="text-2xl font-bold text-green-600">{patients.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Medical Records</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {patients.reduce((sum, p) => sum + (p.medical_records_count || 0), 0)}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patients List */}
        <div className="space-y-4">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Patients Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'No patients match your search criteria.' 
                  : 'You have no patients with approved appointments yet.'}
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <Card
                key={patient.user_id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" />
                        <AvatarFallback>
                          {patient.patient_name
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">
                          {patient.patient_name}
                        </h3>
                        <p className="text-gray-600">
                          {patient.patient_email}
                        </p>
                        {patient.patient_phone && (
                          <p className="text-sm text-gray-500">
                            📞 {patient.patient_phone}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          {patient.patient_age && (
                            <span className="text-sm text-gray-500">
                              Age: {patient.patient_age}
                            </span>
                          )}
                          {patient.patient_gender && (
                            <span className="text-sm text-gray-500">
                              {patient.patient_gender}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="text-center lg:text-right">
                        <div className="mb-2">
                          <p className="text-sm text-gray-500">Last Appointment</p>
                          <p className="font-medium">{formatDate(patient.last_appointment_date)}</p>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm text-gray-500">Type</p>
                          <Badge variant="outline">{patient.appointment_type}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <Badge className="bg-green-100 text-green-800">
                            {patient.appointment_status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            setSelectedPatient(patient);
                            setIsCreateRecordOpen(true);
                          }}
                        >
                          <FilePlus className="w-4 h-4 mr-2" />
                          Create Medical Record
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/doctor/records?patient=${patient.user_id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Records ({patient.medical_records_count || 0})
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Create Medical Record Dialog */}
        <Dialog open={isCreateRecordOpen} onOpenChange={setIsCreateRecordOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FilePlus className="w-5 h-5" />
                <span>Create Medical Record for {selectedPatient?.patient_name}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Record Type and Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recordType">Record Type</Label>
                  <Select 
                    value={newMedicalRecord.record_type} 
                    onValueChange={(value) => setNewMedicalRecord({...newMedicalRecord, record_type: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select record type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="diagnosis">Diagnosis</SelectItem>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="laboratory">Laboratory</SelectItem>
                      <SelectItem value="imaging">Imaging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newMedicalRecord.title}
                    onChange={(e) => setNewMedicalRecord({...newMedicalRecord, title: e.target.value})}
                    placeholder="e.g., Routine Checkup, Follow-up Visit"
                    required
                  />
                </div>
              </div>

              {/* Chief Complaint */}
              <div className="space-y-2">
                <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                <Textarea
                  id="chiefComplaint"
                  value={newMedicalRecord.chief_complaint}
                  onChange={(e) => setNewMedicalRecord({...newMedicalRecord, chief_complaint: e.target.value})}
                  placeholder="Main reason for patient's visit..."
                  rows={2}
                  required
                />
              </div>

              {/* History of Present Illness */}
              <div className="space-y-2">
                <Label htmlFor="hpi">History of Present Illness</Label>
                <Textarea
                  id="hpi"
                  value={newMedicalRecord.history_of_present_illness}
                  onChange={(e) => setNewMedicalRecord({...newMedicalRecord, history_of_present_illness: e.target.value})}
                  placeholder="Detailed history of the current condition..."
                  rows={3}
                />
              </div>

              {/* Physical Examination */}
              <div className="space-y-2">
                <Label htmlFor="physicalExam">Physical Examination</Label>
                <Textarea
                  id="physicalExam"
                  value={newMedicalRecord.physical_examination}
                  onChange={(e) => setNewMedicalRecord({...newMedicalRecord, physical_examination: e.target.value})}
                  placeholder="Physical examination findings..."
                  rows={3}
                />
              </div>

              {/* Vital Signs */}
              <div className="space-y-2">
                <Label>Vital Signs</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="bp" className="text-sm">Blood Pressure</Label>
                    <Input
                      id="bp"
                      value={newMedicalRecord.vital_signs?.blood_pressure || ''}
                      onChange={(e) => setNewMedicalRecord({
                        ...newMedicalRecord, 
                        vital_signs: {...newMedicalRecord.vital_signs, blood_pressure: e.target.value}
                      })}
                      placeholder="120/80"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="hr" className="text-sm">Heart Rate</Label>
                    <Input
                      id="hr"
                      value={newMedicalRecord.vital_signs?.heart_rate || ''}
                      onChange={(e) => setNewMedicalRecord({
                        ...newMedicalRecord, 
                        vital_signs: {...newMedicalRecord.vital_signs, heart_rate: e.target.value}
                      })}
                      placeholder="72 bpm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="temp" className="text-sm">Temperature</Label>
                    <Input
                      id="temp"
                      value={newMedicalRecord.vital_signs?.temperature || ''}
                      onChange={(e) => setNewMedicalRecord({
                        ...newMedicalRecord, 
                        vital_signs: {...newMedicalRecord.vital_signs, temperature: e.target.value}
                      })}
                      placeholder="98.6°F"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="weight" className="text-sm">Weight</Label>
                    <Input
                      id="weight"
                      value={newMedicalRecord.vital_signs?.weight || ''}
                      onChange={(e) => setNewMedicalRecord({
                        ...newMedicalRecord, 
                        vital_signs: {...newMedicalRecord.vital_signs, weight: e.target.value}
                      })}
                      placeholder="70 kg"
                    />
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Textarea
                  id="diagnosis"
                  value={newMedicalRecord.diagnosis}
                  onChange={(e) => setNewMedicalRecord({...newMedicalRecord, diagnosis: e.target.value})}
                  placeholder="Primary and secondary diagnoses..."
                  rows={2}
                  required
                />
              </div>

              {/* Treatment Plan */}
              <div className="space-y-2">
                <Label htmlFor="treatmentPlan">Treatment Plan</Label>
                <Textarea
                  id="treatmentPlan"
                  value={newMedicalRecord.treatment_plan}
                  onChange={(e) => setNewMedicalRecord({...newMedicalRecord, treatment_plan: e.target.value})}
                  placeholder="Recommended treatment approach..."
                  rows={3}
                  required
                />
              </div>

              {/* Medications */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Medications</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Medication
                  </Button>
                </div>
                {newMedicalRecord.medications?.map((medication, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 border rounded-lg">
                    <Input
                      placeholder="Medication name"
                      value={medication.name}
                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Dosage"
                      value={medication.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                    />
                    <Input
                      placeholder="Frequency"
                      value={medication.frequency}
                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                    />
                    <Input
                      placeholder="Duration"
                      value={medication.duration}
                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeMedication(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Follow-up Instructions */}
              <div className="space-y-2">
                <Label htmlFor="followUp">Follow-up Instructions</Label>
                <Textarea
                  id="followUp"
                  value={newMedicalRecord.follow_up_instructions}
                  onChange={(e) => setNewMedicalRecord({...newMedicalRecord, follow_up_instructions: e.target.value})}
                  placeholder="Follow-up care instructions..."
                  rows={2}
                />
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={newMedicalRecord.notes}
                  onChange={(e) => setNewMedicalRecord({...newMedicalRecord, notes: e.target.value})}
                  placeholder="Any additional notes..."
                  rows={2}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateRecordOpen(false);
                    setSelectedPatient(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateMedicalRecord}
                  disabled={isCreatingRecord}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isCreatingRecord ? 'Creating...' : 'Create Medical Record'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </ResponsiveDashboardLayout>
    </ProtectedRoute>
  );
}
