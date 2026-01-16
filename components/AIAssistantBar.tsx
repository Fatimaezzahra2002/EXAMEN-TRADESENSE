import React, { useState, useEffect, useRef } from 'react';
import { getAISignals } from '../services/geminiService';
import { useUser } from '../context/UserContext';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIAssistantBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { activeChallenge } = useUser();
  const { t } = useTranslation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get AI response based on the user's question and current trading context
      let aiResponse = '';
      
      // Simple responses based on common trading queries
      if (inputMessage.toLowerCase().includes('hello') || inputMessage.toLowerCase().includes('hi')) {
        aiResponse = "Bonjour! Je suis votre assistant IA TradeSense. Comment puis-je vous aider avec votre trading aujourd'hui?";
      } else if (inputMessage.toLowerCase().includes('risk') || inputMessage.toLowerCase().includes('risque')) {
        if (activeChallenge) {
          const remainingRisk = activeChallenge.maxTotalLoss - (activeChallenge.initialBalance - activeChallenge.currentBalance);
          aiResponse = `Votre risque restant est de $${remainingRisk.toFixed(2)}. Vous avez atteint ${(100 - (remainingRisk / activeChallenge.maxTotalLoss) * 100).toFixed(1)}% de votre limite de perte totale.`;
        } else {
          aiResponse = "Pour accéder aux informations de risque, veuillez d'abord souscrire à un challenge.";
        }
      } else if (inputMessage.toLowerCase().includes('balance') || inputMessage.toLowerCase().includes('solde')) {
        if (activeChallenge) {
          aiResponse = `Votre solde actuel est de $${activeChallenge.currentBalance.toFixed(2)}. Votre solde initial était de $${activeChallenge.initialBalance.toFixed(2)}.`;
        } else {
          aiResponse = "Pour accéder à votre solde, veuillez d'abord souscrire à un challenge.";
        }
      } else if (inputMessage.toLowerCase().includes('profit') || inputMessage.toLowerCase().includes('gain')) {
        if (activeChallenge) {
          const profit = activeChallenge.currentBalance - activeChallenge.initialBalance;
          aiResponse = `Votre profit actuel est de $${profit.toFixed(2)} (${((profit / activeChallenge.initialBalance) * 100).toFixed(2)}%).`;
        } else {
          aiResponse = "Pour accéder aux informations de profit, veuillez d'abord souscrire à un challenge.";
        }
      } else {
        // Default response that could connect to the Gemini service
        aiResponse = "Je traite votre demande. En tant qu'assistant IA TradeSense, je peux vous aider avec des analyses de marché, des conseils de gestion de risque et des informations sur votre compte.";
      }

      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolé, je rencontre un problème technique. Veuillez réessayer plus tard.",
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-80 h-96 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <h3 className="font-bold text-white">{t('aiAssistantTitle')}</h3>
            </div>
            <button 
              onClick={toggleAssistant}
              className="text-white hover:text-slate-200"
            >
              ✕
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 bg-slate-900">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-slate-400 text-center p-4">
                <div className="mb-4 text-emerald-400 text-3xl">🤖</div>
                <h4 className="font-bold text-white mb-2">{t('welcomeMessage')}</h4>
                <p className="text-sm">{t('aiWelcomeText')}</p>
                <p className="text-xs mt-2">{t('aiExamples')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                        message.sender === 'user' 
                          ? 'bg-emerald-600 text-white rounded-br-none' 
                          : 'bg-slate-700 text-slate-100 rounded-bl-none'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 text-slate-100 rounded-2xl rounded-bl-none p-3 max-w-[80%]">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Input */}
          <div className="border-t border-slate-700 p-3 bg-slate-800">
            <div className="flex gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('askQuestion')}
                className="flex-grow bg-slate-700 text-white text-sm rounded-lg p-2 resize-none"
                rows={2}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className={`self-end px-4 py-2 rounded-lg font-medium ${
                  isLoading || !inputMessage.trim()
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {t('sendMessage')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleAssistant}
          className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <span>🤖</span>
          <span className="font-bold hidden sm:inline">{t('aiAssistant')}</span>
        </button>
      )}
    </div>
  );
};

export default AIAssistantBar;