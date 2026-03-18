import React, { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { MessageCircle, Send } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface ChatbotProps {
  groqApiKey: string;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const SYSTEM_PROMPT = `You are a helpful AI assistant for a menstrual cycle tracking app called Cycle AI. 
You provide:
- Personalized cycle guidance and predictions
- Health and wellness advice related to menstrual health
- General support and answers about reproductive health
- Cycle management tips and recommendations
Keep responses concise, empathetic, and informative.`;

export const Chatbot: React.FC<ChatbotProps> = ({ groqApiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Cycle AI Assistant. Ask me anything about your cycle, wellness, or health-related questions. I\'m here to help! 💜',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      if (!groqApiKey) {
        throw new Error('Groq API key is not configured. Please add NEXT_PUBLIC_GROQ_API_KEY to your environment variables.');
      }

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: input },
          ],
          max_tokens: 512,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || 'Failed to get response from AI');
      }

      const data = await response.json();
      const assistantReply = data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantReply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your message.';
      setError(errorMessage);
      const errorReply: ChatMessage = {
        role: 'assistant',
        content: `⚠️ Error: ${errorMessage}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorReply]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="w-full p-6 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200/50 flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Cycle AI Assistant</h3>
          <p className="text-xs text-muted-foreground">Always here to help</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-none'
                  : 'bg-white dark:bg-slate-800 text-foreground border border-border rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 text-foreground border border-border px-4 py-3 rounded-lg rounded-bl-none">
              <Spinner />
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-3 p-3 bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about your cycle, wellness, or health..."
          className="flex-1 bg-white dark:bg-slate-800"
        />
        <Button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
