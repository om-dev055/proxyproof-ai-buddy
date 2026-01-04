import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AttendanceHistoryProps {
  onBack: () => void;
}

const mockHistory = [
  { id: '1', date: 'Jan 4, 2026', time: '9:15 AM', subject: 'Data Structures', status: 'present' },
  { id: '2', date: 'Jan 3, 2026', time: '10:30 AM', subject: 'Algorithms', status: 'present' },
  { id: '3', date: 'Jan 3, 2026', time: '2:00 PM', subject: 'Database Systems', status: 'present' },
  { id: '4', date: 'Jan 2, 2026', time: '9:15 AM', subject: 'Data Structures', status: 'absent' },
  { id: '5', date: 'Jan 2, 2026', time: '11:00 AM', subject: 'Computer Networks', status: 'present' },
];

const AttendanceHistory = ({ onBack }: AttendanceHistoryProps) => {
  return (
    <div className="min-h-screen gradient-bg-hero p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <h1 className="font-display text-xl font-bold text-foreground">
          Attendance History
        </h1>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        {mockHistory.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card-elevated p-4 flex items-center gap-4 ${
              record.status === 'absent' ? 'border-destructive/30' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              record.status === 'present' 
                ? 'bg-success/20' 
                : 'bg-destructive/20'
            }`}>
              {record.status === 'present' ? (
                <CheckCircle2 className="w-6 h-6 text-success" />
              ) : (
                <Calendar className="w-6 h-6 text-destructive" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{record.subject}</h3>
              <p className="text-sm text-muted-foreground">
                {record.date} • {record.time}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              record.status === 'present'
                ? 'bg-success/20 text-success'
                : 'bg-destructive/20 text-destructive'
            }`}>
              {record.status === 'present' ? 'Present' : 'Absent'}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceHistory;
