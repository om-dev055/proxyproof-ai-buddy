import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { CalendarDays, TrendingDown } from 'lucide-react';

// Mock monthly attendance data
const monthlyData = [
  { week: 'Week 1', attendance: 92 },
  { week: 'Week 2', attendance: 88 },
  { week: 'Week 3', attendance: 78 },
  { week: 'Week 4', attendance: 71 },
];

const MonthlyAttendanceChart = () => {
  const avgAttendance = Math.round(
    monthlyData.reduce((sum, d) => sum + d.attendance, 0) / monthlyData.length
  );

  const trend = monthlyData[monthlyData.length - 1].attendance < monthlyData[0].attendance 
    ? 'declining' 
    : 'stable';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            Monthly Attendance Overview
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
          <span>Avg: {avgAttendance}%</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} barCategoryGap="20%">
            <XAxis 
              dataKey="week" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222 47% 11%)',
                border: '1px solid hsl(222 30% 18%)',
                borderRadius: '12px',
                color: 'hsl(210 40% 98%)',
              }}
              formatter={(value: number) => [`${value}%`, 'Attendance']}
            />
            <Bar 
              dataKey="attendance" 
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(187 100% 50%)" />
                <stop offset="100%" stopColor="hsl(270 100% 65%)" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 p-4 rounded-xl bg-muted/50 border border-border/50"
      >
        <div className="flex items-start gap-3">
          {trend === 'declining' && (
            <TrendingDown className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {trend === 'declining' 
              ? "Attendance dropped in the second half of the month, with several students falling below the required threshold. Consider addressing potential causes such as exam schedules or student engagement."
              : "Attendance has remained stable throughout the month. Keep up the consistent engagement strategies."}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MonthlyAttendanceChart;
