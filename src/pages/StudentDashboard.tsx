import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { QrCode, ClipboardList, User, ChevronRight, CheckCircle2, ArrowLeft, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useAttendance } from '@/hooks/useSession';
import QRScanner from '@/components/QRScanner';
import SelfieCapture from '@/components/SelfieCapture';
import AttendanceHistory from '@/components/AttendanceHistory';

type ViewState = 'dashboard' | 'scanning' | 'selfie' | 'success' | 'error' | 'history';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { student, setRole, setStudent } = useApp();
  const { validateAndMarkAttendance, isLoading } = useAttendance();
  const [view, setView] = useState<ViewState>('dashboard');
  const [scannedToken, setScannedToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLogout = () => {
    setRole(null);
    setStudent(null);
    navigate('/');
  };

  const handleQRSuccess = (qrToken: string) => {
    setScannedToken(qrToken);
    setView('selfie');
  };

  const handleSelfieSuccess = async () => {
    if (!scannedToken || !student) {
      setErrorMessage('Missing scan data. Please try again.');
      setView('error');
      return;
    }

    const result = await validateAndMarkAttendance(
      scannedToken,
      student.name,
      student.rollNumber
    );

    if (result.success) {
      setView('success');
      setTimeout(() => {
        setView('dashboard');
        setScannedToken(null);
      }, 3000);
    } else {
      setErrorMessage(result.message);
      setView('error');
    }
  };

  if (view === 'scanning') {
    return <QRScanner onSuccess={handleQRSuccess} onBack={() => setView('dashboard')} />;
  }

  if (view === 'selfie') {
    return <SelfieCapture onSuccess={handleSelfieSuccess} onBack={() => setView('scanning')} />;
  }

  if (view === 'success') {
    return (
      <div className="min-h-screen gradient-bg-hero flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center"
          >
            <CheckCircle2 className="w-14 h-14 text-success" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Attendance Submitted!
          </h1>
          <p className="text-muted-foreground">
            You're all set for today's class
          </p>
        </motion.div>
      </div>
    );
  }

  if (view === 'error') {
    return (
      <div className="min-h-screen gradient-bg-hero flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="text-center max-w-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center"
          >
            <XCircle className="w-14 h-14 text-destructive" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Attendance Failed
          </h1>
          <p className="text-muted-foreground mb-6">
            {errorMessage}
          </p>
          <Button onClick={() => setView('dashboard')} variant="outline">
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  if (view === 'history') {
    return <AttendanceHistory onBack={() => setView('dashboard')} />;
  }

  return (
    <div className="min-h-screen gradient-bg-hero p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Logout
        </Button>
        <div className="w-10 h-10 rounded-full gradient-bg-primary flex items-center justify-center">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
      </motion.div>

      <div className="max-w-lg mx-auto space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-bg-secondary flex items-center justify-center">
              <User className="w-8 h-8 text-foreground" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                {student?.name || 'Student'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {student?.rollNumber} • {student?.department}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scan Attendance Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="hero"
            size="xl"
            className="w-full h-auto py-8 flex-col gap-3"
            onClick={() => setView('scanning')}
          >
            <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <QrCode className="w-8 h-8" />
            </div>
            <span className="font-display text-xl">Scan Attendance</span>
            <span className="text-primary-foreground/70 text-sm font-normal">
              Scan QR code to mark your presence
            </span>
          </Button>
        </motion.div>

        {/* My Attendance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setView('history')}
            className="w-full card-elevated p-6 flex items-center justify-between group hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">My Attendance</h3>
                <p className="text-sm text-muted-foreground">View your attendance history</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="card-elevated p-5 text-center">
            <div className="text-3xl font-display font-bold gradient-text mb-1">92%</div>
            <div className="text-sm text-muted-foreground">This Month</div>
          </div>
          <div className="card-elevated p-5 text-center">
            <div className="text-3xl font-display font-bold text-foreground mb-1">24</div>
            <div className="text-sm text-muted-foreground">Classes Attended</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
