import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, PlusCircle, Save, Database, Upload, CheckCircle2, Users, MessageSquare, LayoutGrid } from '../ui/Icons';
import { useProperties } from '../../contexts/PropertyContext';

interface AdminViewProps {
  goBack: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ goBack }) => {
  const { 
    properties, addProperty, removeProperty, importMockProperties,
    brokerProfile, updateBrokerProfile,
    socialLinks, updateSocialLinks,
    faqs, addFaq, removeFaq
  } = useProperties();

  const [activeTab, setActiveTab] = useState<'properties' | 'content'>('properties');
  const [isImporting, setIsImporting] = useState(false);

  // Property Form State
  const [propForm, setPropForm] = useState({
    title: '', location: '', price: '', type: '', specs: '', tag: '', image: ''
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState(brokerProfile);
  const [socialForm, setSocialForm] = useState(socialLinks);
  
  // FAQ Form State
  const [faqForm, setFaqForm] = useState({ q: '', a: '' });

  // --- Handlers ---

  const handlePropChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPropForm({ ...propForm, [e.target.name]: e.target.value });
  };

  const handlePropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propForm.title || !propForm.price) return;
    const imageToUse = propForm.image || 'https://images.unsplash.com/photo-1600596542815-2495db98dada?q=80&w=2976';
    addProperty({ ...propForm, image: imageToUse });
    setPropForm({ title: '', location: '', price: '', type: '', specs: '', tag: '', image: '' });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrokerProfile(profileForm);
    updateSocialLinks(socialForm);
    alert('Perfil atualizado!');
  };

  const handleFaqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!faqForm.q || !faqForm.a) return;
    addFaq(faqForm);
    setFaqForm({ q: '', a: '' });
  };

  const handleSimulateImport = () => {
    setIsImporting(true);
    setTimeout(() => {
        importMockProperties();
        setIsImporting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans overflow-y-auto">
      <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold font-serif text-white">Painel do Corretor</h1>
            <p className="text-xs text-[#d4af37] uppercase tracking-wider">Gerenciamento</p>
          </div>
        </div>
        
        <div className="flex bg-zinc-900 border border-white/5 rounded-sm p-1">
           <button 
             onClick={() => setActiveTab('properties')}
             className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${activeTab === 'properties' ? 'bg-[#d4af37] text-black' : 'text-zinc-400 hover:text-white'}`}
           >
             Imóveis
           </button>
           <button 
             onClick={() => setActiveTab('content')}
             className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${activeTab === 'content' ? 'bg-[#d4af37] text-black' : 'text-zinc-400 hover:text-white'}`}
           >
             Site & Conteúdo
           </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        
        {/* === PROPERTIES TAB === */}
        {activeTab === 'properties' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-[#18181b] border border-white/5 p-6 rounded-sm shadow-xl sticky top-24">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <PlusCircle size={18} className="text-[#d4af37]" /> Novo Imóvel
                    </h2>
                    <button 
                        onClick={handleSimulateImport}
                        disabled={isImporting}
                        title="Simular importação de CRM"
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        {isImporting ? <CheckCircle2 size={16} className="animate-spin" /> : <Database size={16} />}
                    </button>
                </div>
                
                <form onSubmit={handlePropSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Título do Empreendimento</label>
                    <input required name="title" value={propForm.title} onChange={handlePropChange} placeholder="Ex: Ocean Palace" className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Preço</label>
                        <input required name="price" value={propForm.price} onChange={handlePropChange} placeholder="R$ 0,00" className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                     </div>
                     <div>
                        <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Localização</label>
                        <input name="location" value={propForm.location} onChange={handlePropChange} placeholder="Cidade, UF" className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Características (Specs)</label>
                     <input name="specs" value={propForm.specs} onChange={handlePropChange} placeholder="Ex: 4 Suítes | 250m²" className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Tipo</label>
                       <select name="type" value={propForm.type} onChange={handlePropChange} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm">
                          <option value="">Selecione...</option>
                          <option value="Frente Mar">Frente Mar</option>
                          <option value="Quadra Mar">Quadra Mar</option>
                          <option value="Vista Mar">Vista Mar</option>
                          <option value="Diferenciado">Diferenciado</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Tag</label>
                       <select name="tag" value={propForm.tag} onChange={handlePropChange} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm">
                          <option value="">Selecione...</option>
                          <option value="Lançamento">Lançamento</option>
                          <option value="Pré-Lançamento">Pré-Lançamento</option>
                          <option value="Renda Passiva">Renda Passiva</option>
                          <option value="Oportunidade">Oportunidade</option>
                       </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">URL da Imagem</label>
                    <input name="image" value={propForm.image} onChange={handlePropChange} placeholder="https://..." className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                    <p className="text-[10px] text-zinc-600 mt-1">*Deixe em branco para imagem padrão</p>
                  </div>

                  <button type="submit" className="w-full bg-[#d4af37] hover:bg-[#c4a030] text-black font-bold uppercase tracking-widest py-3 mt-4 flex items-center justify-center gap-2 transition-colors">
                    <Save size={18} /> Adicionar Imóvel
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Imóveis Ativos ({properties.length})</h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties.map(prop => (
                     <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={prop.id} 
                        className="flex bg-[#18181b] border border-white/5 rounded-sm overflow-hidden group"
                     >
                        <div className="w-1/3 relative">
                           <img src={prop.image} className="absolute inset-0 w-full h-full object-cover" alt={prop.title} />
                           <div className="absolute top-2 left-2 bg-[#d4af37] text-black text-[10px] font-bold px-2 py-0.5 uppercase">
                              {prop.tag}
                           </div>
                        </div>
                        <div className="w-2/3 p-4 flex flex-col justify-between">
                           <div>
                              <h3 className="font-bold text-white leading-tight">{prop.title}</h3>
                              <p className="text-zinc-500 text-xs mt-1">{prop.location}</p>
                              <p className="text-[#d4af37] font-serif mt-2">{prop.price}</p>
                           </div>
                           <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                              <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{prop.type}</span>
                              <button 
                                onClick={() => removeProperty(prop.id)}
                                className="text-red-900 hover:text-red-500 transition-colors p-1"
                              >
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* === CONTENT TAB === */}
        {activeTab === 'content' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Profile & Socials */}
              <div className="space-y-8">
                 <div className="bg-[#18181b] border border-white/5 p-6 rounded-sm shadow-xl">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Users size={18} className="text-[#d4af37]" /> Perfil do Corretor
                    </h2>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                       <div>
                          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Nome de Exibição</label>
                          <input required value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                       </div>
                       <div>
                          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Subtítulo / Cargo</label>
                          <input required value={profileForm.title} onChange={(e) => setProfileForm({...profileForm, title: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                       </div>
                       <div>
                          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Foto de Perfil (URL)</label>
                          <input required value={profileForm.image} onChange={(e) => setProfileForm({...profileForm, image: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                       </div>
                       <div>
                          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Biografia (Seção "Sobre")</label>
                          <textarea required rows={6} value={profileForm.description} onChange={(e) => setProfileForm({...profileForm, description: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm resize-none" />
                       </div>
                       
                       <div className="pt-4 border-t border-white/10 mt-4">
                          <label className="block text-xs uppercase font-bold text-[#d4af37] mb-3">Redes Sociais</label>
                          <div className="grid grid-cols-1 gap-3">
                             <div>
                                <label className="block text-[10px] text-zinc-500 mb-1">Link Instagram</label>
                                <input value={socialForm.instagram} onChange={(e) => setSocialForm({...socialForm, instagram: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                             </div>
                             <div>
                                <label className="block text-[10px] text-zinc-500 mb-1">Link WhatsApp (https://wa.me/...)</label>
                                <input value={socialForm.whatsapp} onChange={(e) => setSocialForm({...socialForm, whatsapp: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                             </div>
                          </div>
                       </div>

                       <button type="submit" className="w-full bg-[#d4af37] hover:bg-[#c4a030] text-black font-bold uppercase tracking-widest py-3 mt-4 flex items-center justify-center gap-2 transition-colors">
                          <Save size={18} /> Atualizar Perfil
                       </button>
                    </form>
                 </div>
              </div>

              {/* FAQ Management */}
              <div className="space-y-8">
                 <div className="bg-[#18181b] border border-white/5 p-6 rounded-sm shadow-xl">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <MessageSquare size={18} className="text-[#d4af37]" /> Gerenciar FAQ
                    </h2>
                    
                    <form onSubmit={handleFaqSubmit} className="space-y-4 mb-8">
                       <div>
                          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Pergunta</label>
                          <input required value={faqForm.q} onChange={(e) => setFaqForm({...faqForm, q: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                       </div>
                       <div>
                          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Resposta</label>
                          <textarea required rows={3} value={faqForm.a} onChange={(e) => setFaqForm({...faqForm, a: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm resize-none" />
                       </div>
                       <button type="submit" className="w-full border border-white/20 hover:bg-white/5 text-white font-bold uppercase tracking-widest py-2 flex items-center justify-center gap-2 transition-colors text-xs">
                          <PlusCircle size={14} /> Adicionar FAQ
                       </button>
                    </form>

                    <div className="space-y-3">
                       {faqs.map(faq => (
                          <div key={faq.id} className="bg-black/30 border border-white/5 p-4 rounded-sm flex justify-between gap-4 group">
                             <div>
                                <p className="text-sm font-bold text-white mb-1">{faq.q}</p>
                                <p className="text-xs text-zinc-500 line-clamp-2">{faq.a}</p>
                             </div>
                             <button onClick={() => removeFaq(faq.id)} className="text-zinc-600 hover:text-red-500 transition-colors self-start">
                                <Trash2 size={16} />
                             </button>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

           </div>
        )}

      </div>
    </div>
  );
};