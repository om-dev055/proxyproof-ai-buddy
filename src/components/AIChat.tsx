import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Sparkles, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  onClose: () => void;
}

const predefinedResponses: Record<string, string> = {
  'suspicious': "Based on today's session, one student (Ananya Patel - CS2024008) shows scan timing that differs from typical patterns. The scan occurred slightly outside the expected window and the verification image quality was lower than usual. I recommend a brief check-in to confirm attendance.",
  'summarize': "Today's attendance summary:\n\n• Total students present: 4\n• Confirmed without issues: 3 (75%)\n• Flagged for review: 1 (25%)\n• Average check-in time: 2 minutes after class start\n• No off-site scan attempts detected\n\nOverall, attendance quality is strong for this session.",
  'unusual': "One notable observation: The flagged student's scan timing and image quality are inconsistent with their previous attendance patterns. However, this could be due to network issues or device problems rather than intentional proxy attempts. The system prioritizes explainability over accusation.",
  'below75': "Currently, 3 students are below the 75% attendance threshold this month:\n\n• Rohan Kapoor (CS2024012) — 68%\n• Sneha Gupta (CS2024019) — 72%\n• Arjun Mehta (CS2024025) — 65%\n\nI recommend reaching out to these students to understand any barriers they may be facing.",
  'monthly': "This month's attendance overview:\n\n• Week 1: 92% (strong start)\n• Week 2: 88% (slight dip)\n• Week 3: 78% (noticeable decline)\n• Week 4: 71% (below threshold)\n\nThe trend shows a gradual decline, especially in the second half. Consider addressing potential causes such as upcoming exams or student fatigue.",
  'default': "I can help you understand attendance patterns, review flagged students, or provide session summaries. Try asking:\n\n• \"Who looks suspicious today?\"\n• \"Summarize today's attendance\"\n• \"Who is below 75% this month?\"\n• \"Summarize this month's attendance\"",
};

const AIChat = ({ onClose }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your attendance assistant. I can help you understand patterns, review flagged students, or answer questions about today's session. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('suspicious') || lowerQuery.includes('flag')) {
      return predefinedResponses['suspicious'];
    }
    if (lowerQuery.includes('below 75') || lowerQuery.includes('at risk') || lowerQuery.includes('low attendance')) {
      return predefinedResponses['below75'];
    }
    if (lowerQuery.includes('month') && (lowerQuery.includes('summarize') || lowerQuery.includes('summary') || lowerQuery.includes('overview'))) {
      return predefinedResponses['monthly'];
    }
    if (lowerQuery.includes('summarize') || lowerQuery.includes('summary')) {
      return predefinedResponses['summarize'];
    }
    if (lowerQuery.includes('unusual') || lowerQuery.includes('behavior') || lowerQuery.includes('pattern')) {
      return predefinedResponses['unusual'];
    }
    return predefinedResponses['default'];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = getResponse(userMessage.content);
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col bg-card border-l border-border shadow-2xl"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Attendance insights</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              message.role === 'assistant' 
                ? 'bg-primary/20' 
                : 'bg-secondary/20'
            }`}>
              {message.role === 'assistant' ? (
                <Bot className="w-4 h-4 text-primary" />
              ) : (
                <User className="w-4 h-4 text-secondary" />
              )}
            </div>
            <div className={`max-w-[80%] p-3 rounded-xl ${
              message.role === 'assistant'
                ? 'bg-muted text-foreground'
                : 'gradient-bg-primary text-primary-foreground'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted p-3 rounded-xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about attendance..."
            className="flex-1 bg-muted border-border"
          />
          <Button type="submit" variant="gradient" size="icon" disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default AIChat;
