export interface Client {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address: string;
  keyboxCode: string;
  contactInfo: {
    phone: string;
    email: string;
    emergencyContact: string;
  };
  nextOfKin: {
    name: string;
    relationship: string;
    phone: string;
  };
  serviceLevel: '1' | '2' | '3' | '4';
  careNeeds: string[];
  medications: Medication[];
  gpDetails: {
    name: string;
    practice: string;
    phone: string;
  };
  schedule: {
    type: 'am' | 'pm' | 'full-day';
    days: string[];
    startDate: string;
    endDate: string;
  };
  patch: string;
  status: 'active' | 'pending' | 'ending-soon' | 'completed';
  admissionDate: string;
  preferredCarer?: string;
  restrictions?: string[];
  lastContactNote?: string;
  otherResidents?: string;
  allergies?: string[];
  additionalTasks?: string[];
  preferredLanguage?: string;
  preferredGender?: 'male' | 'female' | 'no-preference';
}

export interface Staff {
  id: string;
  name: string;
  staffRefNumber?: string;
  gender: 'male' | 'female' | 'other';
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  transport: 'car' | 'public' | 'bicycle' | 'walking';
  patches: string[];
  languages: string[];
  skills: string[];
  idNumber: string;
  status: 'active' | 'leave' | 'training' | 'sick' | 'inactive';
  role?: 'carer' | 'planner-admin' | 'assessor';
  photo?: string;
  availability: {
    am: boolean;
    pm: boolean;
    fullDay: boolean;
  };
  metrics: {
    totalHours: number;
    mileage: number;
    shiftsCompleted: number;
  };
  workSchedule?: {
    [key: string]: {
      am: boolean;
      pm: boolean;
      amStart: string;
      amEnd: string;
      pmStart: string;
      pmEnd: string;
    };
  };
  carReg?: string;
  postcode?: string;
  joinDate?: string;
  leftDate?: string;
  preferredDistrict?: string;
  leaveStart?: string;
  leaveEnd?: string;
  leaveType?: string;
  leaveNotes?: string;
  restrictions?: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  instructions: string;
  lowStock: boolean;
  route?: string;
}

export interface EMAREntry {
  id: string;
  clientId: string;
  medicationId: string;
  scheduledTime: string;
  status: 'pending' | 'administered' | 'skipped' | 'refused';
  reason?: string;
  administeredBy?: string;
  administeredTime?: string;
  notes?: string;
}

export interface Visit {
  id: string;
  clientId: string;
  staffId: string;
  date: string;
  timeSlot: 'am' | 'pm';
  duration: number;
  tasks: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'missed';
  location: string;
  mileage?: number;
  notes?: string;
  lastContactNote?: string;
}

export interface Patch {
  id: string;
  name: string;
  planner: string;
  clientCount: number;
  staffCount: number;
  availableStaff: number;
  district: string;
  pendingClients?: number;
}

export interface DashboardMetrics {
  activeClients: number;
  staffOnDuty: number;
  pendingClients: number;
  activeAlerts: number;
  incidentReports: number;
  pendingAssessments: number;
  clientsEndingSoon: number;
  staffOnLeave: number;
}

export interface ActivityLogEntry {
  id: string;
  type: 'missed-medication' | 'no-access' | 'refused-care' | 'incident' | 'alert' | 'contact-note';
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  clientId?: string;
  staffId?: string;
  resolved: boolean;
  notes?: string;
  lastContactNote?: string;
}

export interface TimesheetEntry {
  id: string;
  staffId: string;
  weekEnding: string;
  totalHours: number;
  totalMileage: number;
  shiftsCompleted: number;
  overtimeHours: number;
  hourlyRate: number;
  dailyHours: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    weekend: number;
  };
  dailyMileage: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    weekend: number;
  };
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  clientName: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  reportedBy: string;
  dateReported: string;
  actions?: {
    description: string;
    takenBy: string;
    date: string;
  }[];
}