import { motion } from 'framer-motion';
import { User, Clock, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { AttendanceRecord } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface AttendanceCardProps {
  record: AttendanceRecord;
  index: number;
  onClick: () => void;
}

const AttendanceCard = ({ record, index, onClick }: AttendanceCardProps) => {
  const isConfirmed = record.status === 'confirmed';

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="w-full p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all flex items-center gap-4 group text-left"
    >
      {/* Avatar */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        isConfirmed ? 'bg-success/20' : 'bg-warning/20'
      }`}>
        <User className={`w-6 h-6 ${isConfirmed ? 'text-success' : 'text-warning'}`} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-foreground truncate">{record.studentName}</h4>
          {isConfirmed ? (
            <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-warning flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{record.rollNumber}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(record.timestamp, { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        isConfirmed 
          ? 'bg-success/20 text-success' 
          : 'bg-warning/20 text-warning'
      }`}>
        {isConfirmed ? 'Confirmed' : 'Review'}
      </div>

      {/* Arrow */}
      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
    </motion.button>
  );
};

export default AttendanceCard;
