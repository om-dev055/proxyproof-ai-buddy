import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Square, RefreshCw, Users, ArrowLeft, TrendingUp, AlertTriangle, Eye, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import AttendanceCard from '@/components/AttendanceCard';
import StudentDetailModal from '@/components/StudentDetailModal';
import InsightCards from '@/components/InsightCards';
import AIChat from '@/components/AIChat';
import { AttendanceRecord } from '@/types';

const mockAttendance: AttendanceRecord[] = [
  { id: '1', studentId: 's1', studentName: 'Priya Sharma', rollNumber: 'CS2024001', department: 'Computer Science', timestamp: new Date(Date.now() - 120000), status: 'confirmed' },
  { id: '2', studentId: 's2', studentName: 'Rahul Verma', rollNumber: 'CS2024015', department: 'Computer Science', timestamp: new Date(Date.now() - 90000), status: 'confirmed' },
  { id: '3', studentId: 's3', studentName: 'Ananya Patel', rollNumber: 'CS2024008', department: 'Computer Science', timestamp: new Date(Date.now() - 60000), status: 'needs-review' },
  { id: '4', studentId: 's4', studentName: 'Vikram Singh', rollNumber: 'CS2024022', department: 'Computer Science', timestamp: new Date(Date.now() - 30000), status: 'confirmed' },
];

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { setRole } = useApp();
  const [isClassActive, setIsClassActive] = useState(false);
  const [qrRefreshTimer, setQrRefreshTimer] = useState(45);
  const [selectedStudent, setSelectedStudent] = useState<AttendanceRecord | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  const handleStartClass = () => {
    setIsClassActive(true);
    setAttendanceList([]);
  };

  const handleEndClass = () => {
    setIsClassActive(false);
    setQrRefreshTimer(45);
  };

  // QR refresh timer
  useEffect(() => {
    if (!isClassActive) return;

    const interval = setInterval(() => {
      setQrRefreshTimer(prev => {
        if (prev <= 1) return 45;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isClassActive]);

  // Simulate incoming attendance
  useEffect(() => {
    if (!isClassActive) return;

    const timeout = setTimeout(() => {
      setAttendanceList(mockAttendance);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isClassActive]);

  return (
    <div className="min-h-screen gradient-bg-hero">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Logout
          </Button>
          <h1 className="font-display text-xl font-bold text-foreground">Teacher Dashboard</h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Class Control & QR */}
          <div className="lg:col-span-1 space-y-6">
            {/* Class Control */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-elevated p-6"
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Class Control
              </h2>

              {!isClassActive ? (
                <Button
                  variant="hero"
                  size="xl"
                  className="w-full"
                  onClick={handleStartClass}
                >
                  <Play className="w-6 h-6" />
                  Start Class
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full"
                  onClick={handleEndClass}
                >
                  <Square className="w-5 h-5" />
                  End Class
                </Button>
              )}
            </motion.div>

            {/* QR Code */}
            <AnimatePresence>
              {isClassActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <QRCodeDisplay timer={qrRefreshTimer} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="card-elevated p-4 text-center">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-display font-bold text-foreground">
                  {attendanceList.length}
                </div>
                <div className="text-xs text-muted-foreground">Present</div>
              </div>
              <div className="card-elevated p-4 text-center">
                <AlertTriangle className="w-6 h-6 text-warning mx-auto mb-2" />
                <div className="text-2xl font-display font-bold text-foreground">
                  {attendanceList.filter(a => a.status === 'needs-review').length}
                </div>
                <div className="text-xs text-muted-foreground">Review</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Insights & Attendance */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Insights */}
            <InsightCards isActive={isClassActive} attendanceCount={attendanceList.length} />

            {/* Attendance Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-elevated p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Live Attendance
                </h2>
                {isClassActive && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Live
                  </div>
                )}
              </div>

              {attendanceList.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {isClassActive 
                    ? 'Waiting for students to scan...' 
                    : 'Start class to see attendance'}
                </div>
              ) : (
                <div className="space-y-3">
                  {attendanceList.map((record, index) => (
                    <AttendanceCard
                      key={record.id}
                      record={record}
                      index={index}
                      onClick={() => setSelectedStudent(record)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentDetailModal
            record={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        )}
      </AnimatePresence>

      {/* AI Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-bg-primary glow-primary flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
      >
        <MessageSquare className="w-6 h-6 text-primary-foreground" />
      </motion.button>

      {/* AI Chat Panel */}
      <AnimatePresence>
        {isChatOpen && <AIChat onClose={() => setIsChatOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDashboard;
