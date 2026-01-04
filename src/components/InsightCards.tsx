import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Eye, Sparkles } from 'lucide-react';

interface InsightCardsProps {
  isActive: boolean;
  attendanceCount: number;
}

const InsightCards = ({ isActive, attendanceCount }: InsightCardsProps) => {
  const insights = [
    {
      id: '1',
      title: 'Strong Start Today',
      description: `${attendanceCount} students checked in within the first 5 minutes. Above average engagement.`,
      type: 'pattern',
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      id: '2',
      title: '1 Flagged for Review',
      description: 'One attendance requires verification due to scan timing anomalies.',
      type: 'irregular',
      icon: AlertTriangle,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      id: '3',
      title: 'Session Observation',
      description: 'All scans originated from expected classroom location. No off-site attempts detected.',
      type: 'observation',
      icon: Eye,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  if (!isActive || attendanceCount === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-semibold text-foreground">AI Insights</h2>
        </div>
        <p className="text-muted-foreground text-center py-8">
          {isActive ? 'Analyzing attendance patterns...' : 'Start class to see AI insights'}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="font-display text-lg font-semibold text-foreground">AI Insights</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className={`p-4 rounded-xl ${insight.bg} border border-border/50`}
          >
            <div className="flex items-center gap-2 mb-2">
              <insight.icon className={`w-4 h-4 ${insight.color}`} />
              <span className={`text-sm font-semibold ${insight.color}`}>
                {insight.title}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {insight.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default InsightCards;
