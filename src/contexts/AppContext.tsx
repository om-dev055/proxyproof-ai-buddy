import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, Student, ClassSession, AttendanceRecord, ChatMessage } from '@/types';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  student: Student | null;
  setStudent: (student: Student | null) => void;
  classSession: ClassSession | null;
  setClassSession: (session: ClassSession | null) => void;
  attendanceRecords: AttendanceRecord[];
  addAttendanceRecord: (record: AttendanceRecord) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [classSession, setClassSession] = useState<ClassSession | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const addAttendanceRecord = (record: AttendanceRecord) => {
    setAttendanceRecords(prev => [record, ...prev]);
  };

  const addChatMessage = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        student,
        setStudent,
        classSession,
        setClassSession,
        attendanceRecords,
        addAttendanceRecord,
        chatMessages,
        addChatMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
