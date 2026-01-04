import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Hash, Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';

const StudentOnboarding = () => {
  const navigate = useNavigate();
  const { setStudent } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    department: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.rollNumber && formData.department) {
      setStudent({
        id: crypto.randomUUID(),
        name: formData.name,
        rollNumber: formData.rollNumber,
        department: formData.department,
      });
      navigate('/student');
    }
  };

  return (
    <div className="min-h-screen gradient-bg-hero relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-secondary/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="card-elevated p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-bg-primary flex items-center justify-center glow-primary"
            >
              <User className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Welcome, Student
            </h1>
            <p className="text-muted-foreground">
              Enter your details to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 bg-muted border-border focus:border-primary focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollNumber" className="text-foreground flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                Roll Number
              </Label>
              <Input
                id="rollNumber"
                type="text"
                placeholder="e.g., CS2024001"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="h-12 bg-muted border-border focus:border-primary focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Department
              </Label>
              <Input
                id="department"
                type="text"
                placeholder="e.g., Computer Science"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="h-12 bg-muted border-border focus:border-primary focus:ring-primary/20"
                required
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full mt-6 group"
            >
              Continue to Dashboard
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentOnboarding;
