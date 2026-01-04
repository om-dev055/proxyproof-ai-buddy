export type UserRole = 'student' | 'teacher' | null;

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  timestamp: Date;
  status: 'confirmed' | 'needs-review';
  selfieUrl?: string;
}

export interface ClassSession {
  id: string;
  isActive: boolean;
  startTime: Date;
  qrCode: string;
  attendanceRecords: AttendanceRecord[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface InsightCard {
  id: string;
  title: string;
  description: string;
  type: 'pattern' | 'irregular' | 'observation';
  icon: string;
}
