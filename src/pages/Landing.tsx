import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

const Landing = () => {
  const navigate = useNavigate();
  const { setRole } = useApp();

  const handleRoleSelect = (role: 'student' | 'teacher') => {
    setRole(role);
    navigate(role === 'student' ? '/student/onboarding' : '/teacher');
  };

  return (
    <div className="min-h-screen gradient-bg-hero relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1.5s' }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-bg-primary flex items-center justify-center glow-primary">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="font-display text-3xl font-bold text-foreground">ProxyProof</span>
          </div>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-3xl"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Attendance without</span>
            <br />
            <span className="gradient-text">proxy.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            Powered by intelligence.
          </p>

          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-12">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm">AI-assisted • Real-time • Fair</span>
            <Sparkles className="w-5 h-5 text-secondary" />
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
        >
          <Button
            variant="hero"
            size="xl"
            className="flex-1 group"
            onClick={() => handleRoleSelect('student')}
          >
            <GraduationCap className="w-6 h-6 transition-transform group-hover:scale-110" />
            Enter as Student
          </Button>
          
          <Button
            variant="heroOutline"
            size="xl"
            className="flex-1 group"
            onClick={() => handleRoleSelect('teacher')}
          >
            <BookOpen className="w-6 h-6 transition-transform group-hover:scale-110" />
            Enter as Teacher
          </Button>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mt-16"
        >
          {[
            { icon: Zap, label: 'Live QR Codes' },
            { icon: Shield, label: 'Anti-Proxy' },
            { icon: Sparkles, label: 'AI Insights' },
          ].map((feature, index) => (
            <div
              key={feature.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect text-sm text-muted-foreground"
            >
              <feature.icon className="w-4 h-4 text-primary" />
              {feature.label}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
};

export default Landing;
