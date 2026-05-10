import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Loader2, User, Bot } from 'lucide-react';
import { getAI } from '../lib/ai';
import { Button } from './ui/button';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: "Hi! I'm the PSL Driving Academy assistant. How can I help you today? You can ask about our courses, pricing, or booking a lesson." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const ai = getAI();
    if (!ai) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm currently unable to assist with AI. Please call us at 07429 494 921." }]);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `You are a helpful assistant for PSL Driving Academy, a driving school in Sheffield and Rotherham. 
            Lead instructor is Kaz. 
            Services: Manual Lessons (£35/hr), Automatic Lessons (£36/hr), Intensive Courses, Advanced Training.
            Contact: 07429 494 921.
            
            User message: ${userMessage}` }]
          }
        ],
        config: {
          systemInstruction: "You are a friendly and professional assistant for PSL Driving Academy. Answer questions about driving lessons, pricing, and the booking process. Keep responses concise and helpful. Use Google Search to provide accurate information about local driving test centers or current UK driving laws if asked.",
          tools: [{ googleSearch: {} }]
        }
      });

      const botResponse = response.text || "I'm sorry, I couldn't process that. Please try again or contact Kaz directly.";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now. Please call us at 07429 494 921." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white border border-border rounded-sm shadow-2xl w-[350px] sm:w-[400px] h-[500px] flex flex-col mb-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-charcoal p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber flex items-center justify-center">
                  <Bot className="w-5 h-5 text-charcoal" />
                </div>
                <div>
                  <h3 className="text-white font-display font-bold text-sm leading-none">PSL Assistant</h3>
                  <span className="text-amber text-[10px] uppercase font-bold tracking-widest">Online</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-sm text-sm ${
                    msg.role === 'user' 
                      ? 'bg-amber text-charcoal font-medium' 
                      : 'bg-white border border-border text-charcoal shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-border p-3 rounded-sm shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-amber" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-50 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber"
                />
                <Button 
                  size="sm" 
                  className="bg-amber hover:bg-amber-dark text-charcoal"
                  onClick={handleSend}
                  disabled={isLoading}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-amber rounded-full shadow-lg flex items-center justify-center text-charcoal hover:bg-amber-dark transition-colors relative"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
        )}
      </motion.button>
    </div>
  );
}
