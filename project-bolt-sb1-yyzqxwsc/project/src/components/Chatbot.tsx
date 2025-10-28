import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your Grievance Assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello ${profile?.full_name || 'there'}! I'm here to help with your grievances. You can ask me about grievance status, how to submit a grievance, or common issues.`;
    }

    if (lowerMessage.includes('status') || lowerMessage.includes('track')) {
      const { data: grievances } = await supabase
        .from('grievances')
        .select('grievance_id, status, title')
        .eq('submitted_by', profile?.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (grievances && grievances.length > 0) {
        let response = 'Here are your recent grievances:\n\n';
        grievances.forEach((g) => {
          response += `• ${g.grievance_id || 'Pending ID'}: ${g.title} - Status: ${g.status}\n`;
        });
        return response;
      }
      return "You don't have any grievances yet. Would you like to submit one?";
    }

    if (lowerMessage.includes('how') && (lowerMessage.includes('submit') || lowerMessage.includes('create'))) {
      return "To submit a grievance:\n\n1. Click 'Submit Grievance' button\n2. Choose appropriate category (Academic, Facility, Examination, Placement, or Other)\n3. Fill in the details\n4. Provide a clear description\n5. Submit and track your grievance ID";
    }

    if (lowerMessage.includes('category') || lowerMessage.includes('categories')) {
      return "We have 5 main categories:\n\n• Academic - Teaching quality, syllabus, lab issues\n• Facility - Infrastructure, WiFi, hostel, canteen\n• Examination - Marks, scheduling, results\n• Placement - Eligibility, opportunities, interviews\n• Other - General issues";
    }

    if (lowerMessage.includes('resolved') || lowerMessage.includes('resolve')) {
      return "Grievances typically take 5-7 working days to resolve depending on complexity. Admins review and assign grievances to appropriate departments. You'll receive updates as your grievance progresses.";
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('help')) {
      return "For urgent matters, you can:\n\n• Contact the Grievance Cell: grievance@college.edu\n• Visit the Student Affairs Office\n• Call: +91-XXXX-XXXXXX\n\nFor regular grievances, please use the online system for faster processing.";
    }

    if (lowerMessage.includes('thank')) {
      return "You're welcome! Feel free to ask if you need anything else.";
    }

    return "I can help you with:\n\n• Checking grievance status\n• How to submit a grievance\n• Information about categories\n• Resolution timeline\n• Contact information\n\nWhat would you like to know?";
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(async () => {
      const botResponse = await getBotResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200">
          <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">Grievance Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 rounded-full p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-900 rounded-2xl rounded-bl-none px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
