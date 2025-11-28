import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, PlusCircle, Save, Database, Upload, CheckCircle2, Users, MessageSquare, LayoutGrid, AlertTriangle, RotateCcw, Zap, Eye, ImageIcon, Sparkles, Building2, Calendar, Code2, Lock, LogIn, Instagram, Heart, Send, Loader2 } from '../ui/Icons';
import { useProperties } from '../../contexts/PropertyContext';
import { AppMode } from '../../types';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';

interface AdminViewProps {
  goBack: () => void;
  navigate?: (mode: AppMode) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ goBack, navigate }) => {
  const { 
    properties, addProperty, removeProperty, importMockProperties,
    brokerProfile, updateBrokerProfile,
    socialLinks, updateSocialLinks,
    faqs, addFaq, removeFaq,
    features, addFeature, removeFeature,
    socialPosts, addSocialPost, removeSocialPost,
    resetAllData, restoreBackup, usingFirebase
  } = useProperties();

  // --- Auth State ---
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'properties' | 'content'>('properties');
  const fileInputRef = useRef<HTMLInputElement>(null); // For Properties
  const featureInputRef = useRef<HTMLInputElement>(null); // For Features
  const socialPostInputRef = useRef<HTMLInputElement>(null); // For Social Posts
  const logoInputRef = useRef<HTMLInputElement>(null); // For Logo
  const profileImageInputRef = useRef<HTMLInputElement>(null); // For Profile Pic
  const heroImageInputRef = useRef<HTMLInputElement>(null); // For Hero Pic
  const backupInputRef = useRef<HTMLInputElement>(null); // For Backup

  // Property Form
  const [propForm, setPropForm] = useState({
    title: '', location: '', price: '', type: '', specs: '', tag: '', image: '',
    downPayment: '', installments: '', balloonPayments: '', deliveryDate: ''
  });

  // Profile Form
  const [profileForm, setProfileForm] = useState(brokerProfile);
  const [socialForm, setSocialForm] = useState(socialLinks);
  
  // FAQ Form
  const [faqForm, setFaqForm] = useState({ q: '', a: '' });

  // Feature Form
  const [featureForm, setFeatureForm] = useState({ title: '', image: '' });

  // Social Post Form
  const [socialPostForm, setSocialPostForm] = useState({ image: '', link: '', likes: '1.2k', comments: '50' });

  // --- Auth Effect ---
  useEffect(() => {
    if (usingFirebase && auth) {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    } else {
        // Fallback for local mode (dev only) without auth
        setAuthLoading(false);
    }
  }, [usingFirebase]);

  // --- Helpers ---
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    const floatValue = parseFloat(numericValue) / 100;
    return floatValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // --- Handlers ---

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError('');
      setIsLoggingIn(true);

      if (usingFirebase && auth) {
          try {
              await signInWithEmailAndPassword(auth, loginEmail, loginPass);
              // Auth state listener will handle the rest
          } catch (error: any) {
              console.error("Firebase Login Error", error);
              let msg = 'Erro ao realizar login.';
              if (error.code === 'auth/invalid-credential') msg = 'E-mail ou senha incorretos.';
              if (error.code === 'auth/too-many-requests') msg = 'Muitas tentativas. Tente mais tarde.';
              setLoginError(msg);
          } finally {
              setIsLoggingIn(false);
          }
      } else {
          // Dev Mode / Local Storage Mode
          // Allow any login in dev mode if firebase is not connected, but warn user
          if (loginEmail && loginPass) {
             setUser({ email: 'dev@local.com' } as User);
             alert('Modo Local (Sem Firebase): Login simulado.');
          }
          setIsLoggingIn(false);
      }
  };

  const handleLogout = async () => {
      if (usingFirebase && auth) {
          await signOut(auth);
      }
      setUser(null);
  };

  const handlePropChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'price' || name === 'downPayment') {
        if (value === '') { setPropForm({ ...propForm, [name]: '' }); return; }
        const formatted = formatCurrency(value);
        setPropForm({ ...propForm, [name]: formatted });
    } else {
        setPropForm({ ...propForm, [name]: value });
    }
  };

  // Generic Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: Function, currentForm: any, fieldName: string = 'image') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter({ ...currentForm, [fieldName]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propForm.title || !propForm.price) return;
    const imageToUse = propForm.image || 'https://images.unsplash.com/photo-1600596542815-2495db98dada?q=80&w=2976';
    addProperty({ ...propForm, image: imageToUse });
    setPropForm({ 
        title: '', location: '', price: '', type: '', specs: '', tag: '', image: '',
        downPayment: '', installments: '', balloonPayments: '', deliveryDate: ''
    });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrokerProfile(profileForm);
    updateSocialLinks(socialForm);
    alert('Configurações salvas!');
  };

  const handleFaqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!faqForm.q || !faqForm.a) return;
    addFaq(faqForm);
    setFaqForm({ q: '', a: '' });
  };

  const handleFeatureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!featureForm.title) return;
    const img = featureForm.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000';
    addFeature({ ...featureForm, image: img });
    setFeatureForm({ title: '', image: '' });
  };

  const handleSocialPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!socialPostForm.image) return;
    // Default link to profile if empty
    const link = socialPostForm.link || socialLinks.instagram;
    addSocialPost({ ...socialPostForm, link });
    setSocialPostForm({ image: '', link: '', likes: '1.2k', comments: '50' });
  };

  // --- Backup Handlers ---
  const handleExportBackup = () => {
      const data = {
          properties,
          brokerProfile,
          socialLinks,
          faqs,
          features,
          socialPosts,
          timestamp: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-site-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
              try {
                  const data = JSON.parse(event.target?.result as string);
                  restoreBackup(data);
              } catch (err) {
                  alert('Arquivo inválido!');
              }
          };
          reader.readAsText(file);
      }
  };

  // --- RENDER LOADING ---
  if (authLoading) {
      return (
          <div className="h-screen w-full bg-[#09090b] flex items-center justify-center">
              <Loader2 className="text-[#d4af37] animate-spin" size={32} />
          </div>
      );
  }

  // --- RENDER LOGIN SCREEN IF NOT AUTHENTICATED ---
  if (!user) {
      return (
        <div className="h-screen w-full bg-[#09090b] text-white font-sans flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-[#18181b] border border-white/10 p-8 rounded-lg shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-[#d4af37]/10 p-4 rounded-full mb-4">
                        <Lock size={32} className="text-[#d4af37]" />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-white">Área Restrita</h1>
                    <p className="text-zinc-500 text-sm">Acesso exclusivo para corretores.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase font-bold text-zinc-500 mb-2">E-mail</label>
                        <input 
                            type="email" 
                            required 
                            value={loginEmail} 
                            onChange={(e) => setLoginEmail(e.target.value)} 
                            className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm"
                            placeholder="seu@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase font-bold text-zinc-500 mb-2">Senha</label>
                        <input 
                            type="password" 
                            required 
                            value={loginPass} 
                            onChange={(e) => setLoginPass(e.target.value)} 
                            className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    {loginError && (
                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-sm border border-red-500/20">
                            <AlertTriangle size={16} /> {loginError}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoggingIn}
                        className="w-full bg-[#d4af37] hover:bg-[#c4a030] disabled:opacity-50 text-black font-bold uppercase tracking-widest py-3 flex items-center justify-center gap-2 transition-colors"
                    >
                        {isLoggingIn ? <Loader2 size={18} className="animate-spin"/> : <LogIn size={18} />} 
                        {isLoggingIn ? 'Entrando...' : 'Entrar'}
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={goBack} 
                        className="w-full text-zinc-500 text-xs hover:text-white transition-colors text-center mt-4"
                    >
                        Voltar ao Site
                    </button>
                </form>
            </div>
        </div>
      );
  }

  // --- RENDER ADMIN DASHBOARD ---
  return (
    <div className="h-screen w-full bg-[#09090b] text-white font-sans overflow-y-auto pb-20 scrollbar-thin scrollbar-thumb-zinc-700">
      <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold font-serif text-white">Painel do Corretor</h1>
            <div className="flex items-center gap-2">
                 {usingFirebase ? (
                     <span className="flex items-center gap-1 text-[10px] text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full border border-green-500/20"><Zap size={10} /> Online ({user.email})</span>
                 ) : (
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded-full border border-white/5"><Database size={10} /> Local (Sem Sync)</span>
                 )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
             <div className="flex bg-zinc-900 border border-white/5 rounded-sm p-1">
               <button onClick={() => setActiveTab('properties')} className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${activeTab === 'properties' ? 'bg-[#d4af37] text-black' : 'text-zinc-400 hover:text-white'}`}>Imóveis</button>
               <button onClick={() => setActiveTab('content')} className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${activeTab === 'content' ? 'bg-[#d4af37] text-black' : 'text-zinc-400 hover:text-white'}`}>Site & Conteúdo</button>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-sm text-red-400 hover:text-red-300 transition-colors" title="Sair">
                <LogIn size={18} className="rotate-180" />
            </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        
        {!usingFirebase && (
            <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-sm flex items-start gap-3">
                <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                <div className="text-sm text-yellow-200">
                    <p className="font-bold mb-1">Atenção: Modo Local Ativado</p>
                    <p className="opacity-80 leading-relaxed">
                        Você não configurou as chaves do Firebase, então os dados estão sendo salvos apenas no navegador (LocalStorage). 
                        Se você limpar o cache ou abrir em outro computador, os dados sumirão.
                    </p>
                    <div className="mt-3 flex gap-3">
                         <button onClick={handleExportBackup} className="bg-yellow-500/20 hover:bg-yellow-500/30 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wide flex items-center gap-2"><Save size={14}/> Baixar Backup (Segurança)</button>
                         <button onClick={() => backupInputRef.current?.click()} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wide flex items-center gap-2"><Upload size={14}/> Restaurar Backup</button>
                         <input type="file" ref={backupInputRef} onChange={handleImportBackup} accept=".json" className="hidden" />
                    </div>
                </div>
            </div>
        )}

        {/* === PROPERTIES TAB === */}
        {activeTab === 'properties' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-[#18181b] border border-white/5 p-6 rounded-sm shadow-xl sticky top-24">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-6"><PlusCircle size={18} className="text-[#d4af37]" /> Novo Imóvel</h2>
                
                <form onSubmit={handlePropSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Título do Empreendimento</label>
                    <input required name="title" value={propForm.title} onChange={handlePropChange} placeholder="Ex: Ocean Palace" className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Valor Total</label>
                        <input required name="price" value={propForm.price} onChange={handlePropChange} placeholder="R$ 0,00" className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                     </div>
                     <div>
                        <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Localização</label>
                        <input name="location" value={propForm.location} onChange={handlePropChange} placeholder="Cidade, UF" className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                     </div>
                  </div>

                   <div className="p-3 bg-white/5 rounded-sm border border-white/5 space-y-3">
                      <p className="text-[10px] text-[#d4af37] uppercase font-bold tracking-wider">Condições de Pagamento</p>
                      <div>
                          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Entrada</label>
                          <input name="downPayment" value={propForm.downPayment} onChange={handlePropChange} placeholder="Ex: R$ 200.000,00" className="w-full bg-black/50 border border-white/10 p-2 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                          <div>
                              <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Parcelas</label>
                              <input name="installments" value={propForm.installments} onChange={handlePropChange} placeholder="Ex: 60x" className="w-full bg-black/50 border border-white/10 p-2 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                          </div>
                          <div>
                              <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Balões</label>
                              <input name="balloonPayments" value={propForm.balloonPayments} onChange={handlePropChange} placeholder="Ex: 5x" className="w-full bg-black/50 border border-white/10 p-2 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                          </div>
                      </div>
                  </div>

                  <div>
                     <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Data de Entrega</label>
                     <input name="deliveryDate" value={propForm.deliveryDate} onChange={handlePropChange} placeholder="Ex: Dezembro/2026" className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                  </div>

                  <div>
                     <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Características (Specs)</label>
                     <input name="specs" value={propForm.specs} onChange={handlePropChange} placeholder="Ex: 4 Suítes | 250m²" className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Tipo / Característica</label>
                       <select name="type" value={propForm.type} onChange={handlePropChange} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm">
                          <option value="">Selecione...</option>
                          <option value="Frente Mar">Frente Mar</option>
                          <option value="Quadra Mar">Quadra Mar</option>
                          <option value="Vista Mar">Vista Mar</option>
                          <option value="Renda Passiva">Renda Passiva</option>
                          <option value="Diferenciado">Diferenciado</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Tag / Situação</label>
                       <select name="tag" value={propForm.tag} onChange={handlePropChange} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm">
                          <option value="">Selecione...</option>
                          <option value="Lançamento">Lançamento</option>
                          <option value="Pré-Lançamento">Pré-Lançamento</option>
                          <option value="Exclusividade">Exclusividade</option>
                          <option value="Oportunidade">Oportunidade</option>
                       </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Imagem Principal</label>
                    <div className="flex flex-col gap-2">
                        <input name="image" value={propForm.image} onChange={handlePropChange} placeholder="URL ou Upload" className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs py-2 px-3 rounded-sm flex items-center justify-center gap-2 border border-white/10"><Upload size={14} /> Upload</button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setPropForm, propForm, 'image')} />
                        </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-[#d4af37] hover:bg-[#c4a030] text-black font-bold uppercase tracking-widest py-3 mt-4 flex items-center justify-center gap-2"><Save size={18} /> Adicionar Imóvel</button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Imóveis Ativos ({properties.length})</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties.map(prop => (
                     <div key={prop.id} className="flex bg-[#18181b] border border-white/5 rounded-sm overflow-hidden group min-h-[140px]">
                        <div className="w-1/3 relative">
                           <img src={prop.image} className="absolute inset-0 w-full h-full object-cover" alt={prop.title} />
                           <div className="absolute top-2 left-2 bg-[#d4af37] text-black text-[10px] font-bold px-2 py-0.5 uppercase">{prop.tag}</div>
                        </div>
                        <div className="w-2/3 p-4 flex flex-col justify-between">
                           <div>
                              <h3 className="font-bold text-white leading-tight">{prop.title}</h3>
                              <p className="text-zinc-500 text-xs mt-1">{prop.location}</p>
                              <p className="text-[#d4af37] font-serif mt-2 text-lg">{prop.price}</p>
                           </div>
                           <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                              <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{prop.type}</span>
                              <button onClick={() => removeProperty(prop.id)} className="text-red-900 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* === CONTENT TAB === */}
        {activeTab === 'content' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-24">
              
              {/* Profile & Logo & Pixel */}
              <div className="space-y-8">
                 <div className="bg-[#18181b] border border-white/5 p-6 rounded-sm shadow-xl">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Users size={18} className="text-[#d4af37]" /> Configurações Gerais</h2>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                       <div>
                          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Logo do Header</label>
                          <div className="flex flex-col gap-2">
                              <input placeholder="URL ou Upload" value={profileForm.logo || ''} onChange={(e) => setProfileForm({...profileForm, logo: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={() => logoInputRef.current?.click()} className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs py-2 px-3 rounded-sm flex items-center justify-center gap-2 border border-white/10"><Upload size={14} /> Upload Logo</button>
                                <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setProfileForm, profileForm, 'logo')} />
                              </div>
                          </div>
                       </div>
                       
                       {/* Hero Image Field - ADDED */}
                       <div>
                          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Imagem de Fundo (Hero)</label>
                          <div className="flex flex-col gap-2">
                              <input placeholder="URL ou Upload" value={profileForm.heroImage || ''} onChange={(e) => setProfileForm({...profileForm, heroImage: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={() => heroImageInputRef.current?.click()} className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs py-2 px-3 rounded-sm flex items-center justify-center gap-2 border border-white/10"><Upload size={14} /> Upload Capa</button>
                                <input type="file" ref={heroImageInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setProfileForm, profileForm, 'heroImage')} />
                              </div>
                          </div>
                       </div>
                       
                       <div>
                          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Nome de Exibição</label>
                          <input required value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                       </div>
                       <div>
                          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Subtítulo / Cargo</label>
                          <input required value={profileForm.title} onChange={(e) => setProfileForm({...profileForm, title: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                       </div>
                       
                       <div>
                          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Foto de Perfil</label>
                          <div className="flex flex-col gap-2">
                              <input required value={profileForm.image} onChange={(e) => setProfileForm({...profileForm, image: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={() => profileImageInputRef.current?.click()} className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs py-2 px-3 rounded-sm flex items-center justify-center gap-2 border border-white/10"><Upload size={14} /> Upload Foto</button>
                                <input type="file" ref={profileImageInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setProfileForm, profileForm, 'image')} />
                              </div>
                          </div>
                       </div>

                       {/* Social Media Fields - NEW */}
                       <div className="pt-4 border-t border-white/10 mt-4">
                           <label className="block text-xs uppercase font-bold text-zinc-500 mb-3">Redes Sociais & Contato</label>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                   <label className="block text-[10px] uppercase font-bold text-zinc-600 mb-1">WhatsApp (Link Completo)</label>
                                   <input 
                                       placeholder="https://wa.me/55..." 
                                       value={socialForm.whatsapp} 
                                       onChange={(e) => setSocialForm({...socialForm, whatsapp: e.target.value})} 
                                       className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" 
                                   />
                               </div>
                               <div>
                                   <label className="block text-[10px] uppercase font-bold text-zinc-600 mb-1">Instagram (Link Perfil)</label>
                                   <input 
                                       placeholder="https://instagram.com/..." 
                                       value={socialForm.instagram} 
                                       onChange={(e) => setSocialForm({...socialForm, instagram: e.target.value})} 
                                       className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" 
                                   />
                               </div>
                           </div>
                       </div>

                       <div className="pt-6 border-t border-white/10">
                           <div className="flex items-center gap-2 mb-2">
                               <Code2 size={16} className="text-[#d4af37]"/>
                               <label className="block text-xs uppercase font-bold text-white">Scripts / Tracking (Head)</label>
                           </div>
                           
                           <div className="mb-4">
                                <label className="block text-[10px] uppercase font-bold text-zinc-600 mb-1">Google Analytics 4 ID (G-XXXXX)</label>
                                <input 
                                    placeholder="G-XXXXXXXXXX" 
                                    value={profileForm.googleAnalyticsId || ''} 
                                    onChange={(e) => setProfileForm({...profileForm, googleAnalyticsId: e.target.value})} 
                                    className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" 
                                />
                                <p className="text-[10px] text-zinc-500 mt-1">Cole apenas o ID (ex: G-123456789). Nós geramos o script automaticamente.</p>
                           </div>

                           <div className="border-t border-white/5 pt-4">
                                <label className="block text-[10px] uppercase font-bold text-zinc-600 mb-1">Outros Scripts / Facebook Pixel</label>
                                <p className="text-[10px] text-zinc-500 mb-2">Cole o código completo (&lt;script&gt;...&lt;/script&gt;).</p>
                                <textarea 
                                    rows={6}
                                    placeholder="<script>...</script>"
                                    value={profileForm.pixelCode || ''} 
                                    onChange={(e) => setProfileForm({...profileForm, pixelCode: e.target.value})} 
                                    className="w-full bg-black/50 border border-white/10 p-3 text-xs font-mono text-zinc-300 focus:border-[#d4af37] focus:outline-none rounded-sm resize-y" 
                                />
                           </div>
                       </div>

                       <button type="submit" className="w-full bg-[#d4af37] hover:bg-[#c4a030] text-black font-bold uppercase tracking-widest py-3 mt-4 flex items-center justify-center gap-2"><Save size={18} /> Salvar Configurações</button>
                    </form>
                 </div>

                 {/* Social Posts (Instagram Grid) Manager */}
                 <div className="bg-[#18181b] border border-white/5 p-6 rounded-sm shadow-xl">
                     <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Instagram size={18} className="text-[#d4af37]" /> Grade do Instagram</h2>
                     
                     <form onSubmit={handleSocialPostSubmit} className="space-y-4 mb-8">
                        <div>
                          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Imagem do Post</label>
                           <div className="flex flex-col gap-2">
                                <input value={socialPostForm.image} onChange={(e) => setSocialPostForm({...socialPostForm, image: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => socialPostInputRef.current?.click()} className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs py-2 px-3 rounded-sm flex items-center justify-center gap-2 border border-white/10"><Upload size={14} /> Upload</button>
                                    <input type="file" ref={socialPostInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setSocialPostForm, socialPostForm, 'image')} />
                                </div>
                            </div>
                       </div>
                       
                       <div>
                          <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Link do Post (Opcional)</label>
                          <input placeholder="https://instagram.com/p/..." value={socialPostForm.link} onChange={(e) => setSocialPostForm({...socialPostForm, link: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Likes</label>
                            <input placeholder="1.2k" value={socialPostForm.likes} onChange={(e) => setSocialPostForm({...socialPostForm, likes: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                          </div>
                          <div>
                            <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Comentários</label>
                            <input placeholder="50" value={socialPostForm.comments} onChange={(e) => setSocialPostForm({...socialPostForm, comments: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#d4af37] focus:outline-none text-white rounded-sm" />
                          </div>
                       </div>

                       <button type="submit" className="w-full border border-white/20 hover:bg-white/5 text-white font-bold uppercase tracking-widest py-2 flex items-center justify-center gap-2 text-xs"><PlusCircle size={14} /> Adicionar Post</button>
                     </form>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                         {socialPosts.map(post => (
                             <div key={post.id} className="relative aspect-square group overflow-hidden border border-white/10">
                                 <img src={post.image} className="w-full h-full object-cover" alt="Post" />
                                 <button onClick={() => removeSocialPost(post.id)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                                 <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 flex justify-center gap-2 text-[10px] text-white">
                                    <span className="flex items-center gap-0.5"><Heart size={8} /> {post.likes}</span>
                                 </div>
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