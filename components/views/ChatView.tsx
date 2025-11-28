import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Loader2, Bot, X } from '../ui/Icons';
import { ChatMessage } from '../../types';
import { generateText } from '../../services/gemini';
import ReactMarkdown from 'react-markdown';

interface ChatViewProps {
  goBack: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ goBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const realEstatePrompt = `
        Você é o assistente virtual da corretora Andreza Scolari, especialista em investimentos imobiliários de alto padrão em SC.
        Seu objetivo é qualificar investidores interessados em multiplicação patrimonial e renda passiva.
        
        INFORMAÇÕES CRUCIAIS PARA SUAS RESPOSTAS:
        1. Beto Carrero World: Destaque a proximidade com o parque (em Penha/Piçarras) como um grande vetor de rentabilidade para locação Short Stay (Airbnb).
        2. Imóveis na Planta: Explique o conceito de "alavancagem" e "tabela zero", onde o investidor paga apenas 10-20% de entrada e ganha a valorização sobre o valor total do imóvel durante a obra.
        3. Renda Passiva: Mencione a gestão profissional de locação para quem não quer ter dor de cabeça com inquilinos.
        4. Regiões: Balneário Camboriú (luxo/segurança), Itapema (valorização recorde), Piçarras/Penha (turismo/Beto Carrero).

        Responda as perguntas do usuário em PORTUGUÊS (PT-BR) de forma elegante, profissional e objetiva, usando termos como "liquidez", "yield", "TIR".
        Se perguntarem sobre contato, sugira o Instagram: https://www.instagram.com/andrezascolari/?hl=pt.
        
        Pergunta do usuário: ${input}
      `;
      const response = await generateText(realEstatePrompt);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "Desculpe, a conexão com o servidor de investimentos foi interrompida momentaneamente.",
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl h-[80vh] bg-[#0c0c0e] border border-white/10 rounded-none shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0c0c0e]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#d4af37] text-black">
               <Bot size={20} />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white">Private Advisor</h2>
              <p className="text-xs text-[#d4af37] uppercase tracking-wider">Andreza Scolari AI</p>
            </div>
          </div>
          <button 
            onClick={goBack}
            className="p-2 hover:bg-white/5 transition-colors text-zinc-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#09090b]">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-center px-8">
              <Sparkles size={32} className="mb-4 text-[#d4af37]" />
              <p className="text-sm font-light leading-relaxed">
                Bem-vindo ao canal exclusivo. <br/>
                Pergunte sobre rentabilidade no Beto Carrero, alavancagem com imóveis na planta ou agende uma consultoria.
              </p>
            </div>
          )}
          
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[85%] p-4 text-sm leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-zinc-800 text-white border border-white/5' 
                      : 'bg-[#d4af37]/10 border border-[#d4af37]/20 text-white [&_*]:text-zinc-100 [&_strong]:text-white [&_strong]:font-bold'
                    }
                  `}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-[#d4af37]/5 border border-[#d4af37]/20 p-4 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-[#d4af37]" />
                <span className="text-xs text-[#d4af37] uppercase tracking-wider">Analisando mercado...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0c0c0e] border-t border-white/10">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ex: Como investir perto do Beto Carrero?"
              className="w-full bg-[#18181b] border border-white/10 text-white rounded-none pl-5 pr-12 py-4 focus:outline-none focus:border-[#d4af37] transition-all placeholder:text-zinc-600 font-light"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="absolute right-2 top-2 bottom-2 p-2 bg-[#d4af37] text-black hover:bg-[#bfa030] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center aspect-square"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};