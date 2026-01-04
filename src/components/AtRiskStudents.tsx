import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AtRiskStudent {
  id: string;
  name: string;
  rollNumber: string;
  attendancePercentage: number;
}

// Mock data for students below 75%
const atRiskStudents: AtRiskStudent[] = [
  { id: '1', name: 'Rohan Kapoor', rollNumber: 'CS2024012', attendancePercentage: 68 },
  { id: '2', name: 'Sneha Gupta', rollNumber: 'CS2024019', attendancePercentage: 72 },
  { id: '3', name: 'Arjun Mehta', rollNumber: 'CS2024025', attendancePercentage: 65 },
];

const AtRiskStudents = () => {
  if (atRiskStudents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            Students Below 75% Attendance
          </h2>
        </div>
        
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mb-3">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
          <p className="text-foreground font-medium">Great news!</p>
          <p className="text-sm text-muted-foreground mt-1">
            All students are meeting the 75% attendance requirement.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card-elevated p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            Students Below 75% Attendance
          </h2>
        </div>
        <Badge variant="outline" className="border-warning/50 text-warning bg-warning/10">
          {atRiskStudents.length} at risk
        </Badge>
      </div>

      <div className="space-y-3">
        {atRiskStudents.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-warning/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                <User className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium text-foreground">{student.name}</p>
                <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-lg font-display font-bold text-warning">
                  {student.attendancePercentage}%
                </p>
                <p className="text-xs text-muted-foreground">attendance</p>
              </div>
              <Badge className="bg-warning/20 text-warning border-warning/30 hover:bg-warning/30">
                At Risk
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export { atRiskStudents };
export default AtRiskStudents;
