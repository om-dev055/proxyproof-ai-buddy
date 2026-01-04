import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Clock, Camera, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AttendanceRecord } from '@/types';
import { format } from 'date-fns';

interface StudentDetailModalProps {
  record: AttendanceRecord;
  onClose: () => void;
}

const StudentDetailModal = ({ record, onClose }: StudentDetailModalProps) => {
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isConfirmed = record.status === 'confirmed';

  const handleExplainWithAI = async () => {
    setIsLoading(true);
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (isConfirmed) {
      setAiExplanation(
        "This attendance appears legitimate. The student scanned within a reasonable timeframe, and the captured selfie matches typical attendance patterns. No anomalies detected in scan timing or location data."
      );
    } else {
      setAiExplanation(
        "Multiple scans occurred in a short time window from this device. The captured image quality is lower than typical submissions, and the scan timestamp shows unusual patterns compared to other students. Recommend manual verification with the student."
      );
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md card-elevated p-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-foreground">Student Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Student Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            isConfirmed ? 'bg-success/20' : 'bg-warning/20'
          }`}>
            <User className={`w-8 h-8 ${isConfirmed ? 'text-success' : 'text-warning'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">{record.studentName}</h3>
            <p className="text-muted-foreground">{record.rollNumber}</p>
            <p className="text-sm text-muted-foreground">{record.department}</p>
          </div>
        </div>

        {/* Status */}
        <div className={`p-4 rounded-xl mb-4 ${
          isConfirmed ? 'bg-success/10 border border-success/20' : 'bg-warning/10 border border-warning/20'
        }`}>
          <div className="flex items-center gap-2">
            {isConfirmed ? (
              <CheckCircle2 className="w-5 h-5 text-success" />
            ) : (
              <AlertCircle className="w-5 h-5 text-warning" />
            )}
            <span className={`font-semibold ${isConfirmed ? 'text-success' : 'text-warning'}`}>
              {isConfirmed ? 'Confirmed Attendance' : 'Needs Review'}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Scan Time</p>
              <p className="font-medium text-foreground">
                {format(record.timestamp, 'PPpp')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Camera className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Captured Selfie</p>
              <div className="mt-2 w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                <User className="w-10 h-10 text-muted-foreground/50" />
              </div>
            </div>
          </div>
        </div>

        {/* AI Explanation */}
        <div className="space-y-3">
          <Button
            variant="gradient"
            className="w-full"
            onClick={handleExplainWithAI}
            disabled={isLoading}
          >
            <Sparkles className="w-5 h-5" />
            {isLoading ? 'Analyzing...' : 'Explain with AI'}
          </Button>

          {aiExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-primary/10 border border-primary/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">AI Analysis</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {aiExplanation}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentDetailModal;
