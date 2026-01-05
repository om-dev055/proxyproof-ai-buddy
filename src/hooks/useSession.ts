import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AttendanceRecord } from '@/types';

interface Session {
  id: string;
  qr_token: string;
  is_active: boolean;
  teacher_name: string;
  created_at: string;
}

// Generate a short unique token
const generateToken = () => {
  return `PP-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();
};

export const useSession = () => {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch active session on mount
  useEffect(() => {
    const fetchActiveSession = async () => {
      const { data, error } = await supabase
        .from('session')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching active session:', error);
        return;
      }

      if (data) {
        setActiveSession(data);
        fetchAttendance(data.id);
      }
    };

    fetchActiveSession();
  }, []);

  // Subscribe to attendance changes for active session
  useEffect(() => {
    if (!activeSession) return;

    const channel = supabase
      .channel('attendance-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'attendance',
          filter: `session_id=eq.${activeSession.id}`,
        },
        (payload) => {
          const newRecord = payload.new as {
            id: string;
            session_id: string;
            student_name: string;
            roll_number: string;
            status: string;
            created_at: string;
            selfie_url: string | null;
          };
          
          const record: AttendanceRecord = {
            id: newRecord.id,
            studentId: newRecord.id,
            studentName: newRecord.student_name || 'Unknown',
            rollNumber: newRecord.roll_number || '',
            department: 'Computer Science',
            timestamp: new Date(newRecord.created_at || Date.now()),
            status: newRecord.status === 'present' ? 'confirmed' : 'needs-review',
            selfieUrl: newRecord.selfie_url || undefined,
          };

          setAttendanceList((prev) => [record, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeSession?.id]);

  const fetchAttendance = async (sessionId: string) => {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching attendance:', error);
      return;
    }

    const records: AttendanceRecord[] = (data || []).map((item) => ({
      id: item.id,
      studentId: item.id,
      studentName: item.student_name || 'Unknown',
      rollNumber: item.roll_number || '',
      department: 'Computer Science',
      timestamp: new Date(item.created_at || Date.now()),
      status: item.status === 'present' ? 'confirmed' : 'needs-review',
      selfieUrl: item.selfie_url || undefined,
    }));

    setAttendanceList(records);
  };

  const startClass = async (teacherName: string = 'Teacher') => {
    setIsLoading(true);
    setError(null);

    try {
      // End any existing active sessions first
      await supabase
        .from('session')
        .update({ is_active: false })
        .eq('is_active', true);

      const qrToken = generateToken();

      const { data, error } = await supabase
        .from('session')
        .insert({
          teacher_name: teacherName,
          is_active: true,
          qr_token: qrToken,
        })
        .select()
        .single();

      if (error) throw error;

      setActiveSession(data);
      setAttendanceList([]);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start class';
      setError(message);
      console.error('Error starting class:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const endClass = async () => {
    if (!activeSession) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('session')
        .update({ is_active: false })
        .eq('id', activeSession.id);

      if (error) throw error;

      setActiveSession(null);
      setAttendanceList([]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to end class';
      setError(message);
      console.error('Error ending class:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshQRToken = useCallback(async () => {
    if (!activeSession) return null;

    const newToken = generateToken();

    try {
      const { data, error } = await supabase
        .from('session')
        .update({ qr_token: newToken })
        .eq('id', activeSession.id)
        .select()
        .single();

      if (error) throw error;

      setActiveSession(data);
      return newToken;
    } catch (err) {
      console.error('Error refreshing QR token:', err);
      return null;
    }
  }, [activeSession?.id]);

  return {
    activeSession,
    attendanceList,
    isLoading,
    error,
    startClass,
    endClass,
    refreshQRToken,
  };
};

// Hook for student to validate QR and mark attendance
export const useAttendance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndMarkAttendance = async (
    qrToken: string,
    studentName: string,
    rollNumber: string,
    selfieUrl?: string
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate QR token against active session
      const { data: session, error: sessionError } = await supabase
        .from('session')
        .select('*')
        .eq('qr_token', qrToken)
        .eq('is_active', true)
        .maybeSingle();

      if (sessionError) throw sessionError;

      if (!session) {
        return { success: false, message: 'Invalid or expired QR code. Please scan again.' };
      }

      // Check if student already marked attendance for this session
      const { data: existingAttendance } = await supabase
        .from('attendance')
        .select('id')
        .eq('session_id', session.id)
        .eq('roll_number', rollNumber)
        .maybeSingle();

      if (existingAttendance) {
        return { success: false, message: 'You have already marked attendance for this class.' };
      }

      // Insert attendance record
      const { error: insertError } = await supabase.from('attendance').insert({
        session_id: session.id,
        student_name: studentName,
        roll_number: rollNumber,
        status: 'present',
        selfie_url: selfieUrl || null,
        created_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      return { success: true, message: 'Attendance marked successfully!' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark attendance';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const getActiveSession = async (): Promise<string | null> => {
    const { data } = await supabase
      .from('session')
      .select('qr_token')
      .eq('is_active', true)
      .maybeSingle();

    return data?.qr_token || null;
  };

  return {
    isLoading,
    error,
    validateAndMarkAttendance,
    getActiveSession,
  };
};
