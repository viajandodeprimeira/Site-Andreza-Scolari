import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  Home as HomeIcon, 
  TrendingUp, 
  Building2, 
  Wallet, 
  Bot, 
  Instagram, 
  MessageCircle,
  CheckCircle2,
  MapPin,
  Plus,
  Minus,
  Search,
  ChevronDown,
  Lock,
  X,
  Bed,
  Bath,
  Move,
  DollarSign,
  Calendar,
  Heart,
  MessageSquare,
  Scale
} from '../ui/Icons';
import { AppMode } from '../../types';
import { useProperties, Property } from '../../contexts/PropertyContext';

interface HomeProps {
  setMode: (mode: AppMode) => void;
}

const differentials = [
  { icon: <TrendingUp size={24} />, title: 'Multiplicação Patrimonial', desc: 'Foco exclusivo em ativos com alto potencial de valorização acima da inflação.' },
  { icon: <Wallet size={24} />, title: 'Renda Passiva', desc: 'Estratégias de Short Stay e Long Stay para maximizar o retorno mensal sobre o capital.' },
  { icon: <Building2 size={24} />, title: 'Pré-Lançamentos', desc: 'Acesso à "tabela zero" de construtoras renomadas antes da abertura ao público geral.' },
];

export const Home: React.FC<HomeProps> = ({ setMode }) => {
  const { properties, brokerProfile, socialLinks, faqs, features, socialPosts } = useProperties();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Property Modal State
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Search/Filter State
  const [locationFilter, setLocationFilter] = useState('Todas');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [activeSearch, setActiveSearch] = useState(false);

  // Derived lists
  const availableLocations = useMemo(() => ['Todas', ...Array.from(new Set(properties.map(p => p.location)))], [properties]);
  const availableTypes = useMemo(() => ['Todos', ...Array.from(new Set(properties.map(p => p.type)))], [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchLocation = locationFilter === 'Todas' || p.location === locationFilter;
      const matchType = typeFilter === 'Todos' || p.type === typeFilter;
      return matchLocation && matchType;
    });
  }, [properties, locationFilter, typeFilter]);

  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);

  const handleSearch = () => {
    setActiveSearch(true);
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearFilters = () => {
    setLocationFilter('Todas');
    setTypeFilter('Todos');
    setActiveSearch(false);
  };

  const handleFeatureClick = (featureTitle: string) => {
    setTypeFilter(featureTitle);
    setActiveSearch(true);
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openPropertyDetails = (property: Property) => {
    setSelectedProperty(property);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  const closePropertyDetails = () => {
    setSelectedProperty(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="w-full bg-[#09090b] text-zinc-100 font-sans selection:bg-[#d4af37] selection:text-black">
      
      {/* Floating WhatsApp */}
      <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp" className="fixed bottom-6 right-6 z-50 bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-500 transition-all hover:scale-110">
        <MessageCircle size={28} />
      </a>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
           {brokerProfile.logo ? (
             <img src={brokerProfile.logo} alt={brokerProfile.name} className="h-10 w-auto object-contain" />
           ) : (
             <>
               <div className="text-[#d4af37]"><Building2 size={24} /></div>
               <div className="flex flex-col">
                 <span className="font-serif font-bold text-xl tracking-wide text-white leading-none uppercase">{brokerProfile.name}</span>
                 <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#d4af37]">{brokerProfile.title}</span>
               </div>
             </>
           )}
        </div>
        
        <div className="flex items-center gap-4">
          <a href={socialLinks.instagram} target="_blank" aria-label="Instagram" className="hidden md:block p-2 text-zinc-400 hover:text-white transition-colors">
            <Instagram size={20} />
          </a>
          <button onClick={() => setMode(AppMode.CHAT)} className="bg-zinc-100 text-black px-5 py-2.5 rounded-none text-xs uppercase tracking-wider font-bold hover:bg-[#d4af37] hover:text-white transition-colors flex items-center gap-2">
            <span>AI Advisor</span> <Bot size={16} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] w-full flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img src={brokerProfile.heroImage || "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop"} className="w-full h-full object-cover opacity-50" alt="Apartamento de Luxo Frente Mar" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/70 to-transparent" />
        </div>

        <div className="relative z-10 px-6 md:px-16 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
           <div className="space-y-8 lg:w-1/2">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
                <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">Especialista em Lançamentos</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="font-serif text-5xl md:text-7xl text-white leading-[1.1]">
                Construa Riqueza <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-amber-200 italic pr-2">Sólida</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-zinc-400 text-lg max-w-lg font-light leading-relaxed">
                Assessoria exclusiva para investidores que buscam multiplicação patrimonial e renda passiva através do mercado imobiliário de alto padrão.
              </motion.p>
           </div>
           
           {/* Search Widget - Hero Placement */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.6 }}
             className="w-full max-w-[340px] bg-[#1c1c1e] border border-white/10 shadow-2xl p-0 overflow-hidden self-start lg:self-center"
           >
                {/* Tabs Header */}
                <div className="flex items-center border-b border-white/10 px-6 pt-4">
                    <div className="pb-3 border-b-2 border-[#d4af37] text-[#d4af37] text-[10px] font-bold uppercase tracking-widest cursor-default">
                        INVESTIR
                    </div>
                </div>

                <div className="p-6 space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Localização</label>
                    <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <select 
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="w-full bg-[#2c2c2e] border border-transparent rounded-sm py-3 pl-9 pr-8 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37] appearance-none cursor-pointer"
                        >
                            {availableLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Tipo de Imóvel</label>
                    <div className="relative">
                        <HomeIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full bg-[#2c2c2e] border border-transparent rounded-sm py-3 pl-9 pr-8 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37] appearance-none cursor-pointer"
                        >
                            {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                </div>

                <button 
                    onClick={handleSearch} 
                    className="w-full bg-[#d4af37] text-black font-bold uppercase text-xs py-3.5 tracking-widest hover:bg-[#c4a030] transition-colors flex items-center justify-center gap-2"
                >
                    <Search size={14} /> Buscar Imóveis
                </button>
                </div>
           </motion.div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-24 bg-[#09090b] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
             {differentials.map((item, idx) => (
               <div key={idx} className="group p-8 border border-white/5 hover:border-[#d4af37]/30 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500">
                  <div className="mb-6 text-[#d4af37] group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                  <h3 className="font-serif text-2xl text-white mb-4">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm font-light">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* ABOUT THE BROKER & INSTAGRAM SECTION */}
      <section className="py-24 bg-[#0c0c0e]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
             
             {/* Broker Image */}
             <div className="lg:w-1/2 relative">
                <div className="relative aspect-[3/4] max-w-md mx-auto">
                    <div className="absolute inset-0 border border-[#d4af37]/30 translate-x-4 translate-y-4 rounded-sm" />
                    <img 
                      src={brokerProfile.image} 
                      alt={`Foto de ${brokerProfile.name} - ${brokerProfile.title}`}
                      loading="lazy"
                      className="w-full h-full object-cover relative z-10 rounded-sm grayscale hover:grayscale-0 transition-all duration-700" 
                    />
                </div>
             </div>

             {/* Broker Content */}
             <div className="lg:w-1/2 space-y-8">
                <div>
                   <h2 className="font-serif text-4xl md:text-5xl text-white mb-2">{brokerProfile.name}</h2>
                   <p className="text-[#d4af37] text-sm font-bold uppercase tracking-[0.2em]">{brokerProfile.title}</p>
                </div>
                
                <p className="text-zinc-400 leading-relaxed font-light text-lg whitespace-pre-wrap">
                   {brokerProfile.description}
                </p>

                <div className="pt-4">
                    <a 
                      href={socialLinks.whatsapp}
                      target="_blank" 
                      className="inline-flex items-center gap-3 border border-white/20 px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                    >
                        Falar com Andreza <ArrowUpRight size={16} />
                    </a>
                </div>

                {/* Instagram "Plugin" / Integration */}
                <div className="mt-12 pt-12 border-t border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Instagram size={20} className="text-[#d4af37]" />
                            <span className="text-sm font-bold text-white">Últimas do Instagram</span>
                        </div>
                        <a href={socialLinks.instagram} target="_blank" className="text-xs text-zinc-500 hover:text-white transition-colors">Ver perfil completo</a>
                    </div>
                    
                    {/* Simulated Instagram Grid - Powered by Context */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {socialPosts.map((post) => (
                            <a 
                                key={post.id} 
                                href={post.link} 
                                target="_blank" 
                                className="group relative aspect-square overflow-hidden bg-zinc-900 cursor-pointer"
                            >
                                <img src={post.image} loading="lazy" alt="Instagram Post Imóvel" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                    <div className="flex items-center gap-1 text-white text-xs font-bold">
                                        <Heart size={12} fill="white" /> {post.likes}
                                    </div>
                                    <div className="flex items-center gap-1 text-white text-xs font-bold">
                                        <MessageSquare size={12} fill="white" /> {post.comments}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Dynamic Features Grid */}
      <section className="py-24 bg-[#09090b] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-12 text-center">
             Qual característica você busca <br/> em um imóvel?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {features.map((feat) => (
               <div 
                 key={feat.id}
                 onClick={() => handleFeatureClick(feat.title)}
                 className="relative h-[250px] group overflow-hidden cursor-pointer rounded-sm border border-white/5"
               >
                  <img src={feat.image} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={`Imóveis com característica ${feat.title}`} />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white font-serif text-2xl md:text-3xl drop-shadow-lg text-center px-4">{feat.title}</h3>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-32 bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
               <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.2em] mb-2 block">Portfólio Selecionado</span>
               <h2 className="font-serif text-4xl md:text-5xl text-white">Oportunidades Exclusivas</h2>
            </div>
            
            <div className="flex items-center gap-4">
               {activeSearch && (
                  <button onClick={clearFilters} className="text-xs text-red-400 flex items-center gap-1 hover:underline">
                    <X size={12} /> Limpar Filtro: {locationFilter !== 'Todas' ? locationFilter : ''} {typeFilter !== 'Todos' ? typeFilter : ''}
                  </button>
               )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {filteredProperties.length > 0 ? (
               filteredProperties.map((prop) => (
                 <motion.div 
                    key={prop.id} 
                    whileHover={{ y: -10 }} 
                    className="group cursor-pointer" 
                    layout
                    onClick={() => openPropertyDetails(prop)}
                 >
                   <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 mb-6 border border-white/5">
                      <img src={prop.image} loading="lazy" alt={`${prop.title} - ${prop.type} em ${prop.location}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                      <div className="absolute top-0 left-0 bg-[#d4af37] text-black text-xs font-bold px-4 py-2 uppercase tracking-widest">{prop.tag}</div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                         <p className="text-white font-serif text-2xl mb-1">{prop.price}</p>
                         <p className="text-zinc-400 text-sm">{prop.specs}</p>
                      </div>
                   </div>
                   <div className="space-y-1 px-2">
                     <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-widest"><MapPin size={12} /> {prop.location}</div>
                     <h3 className="text-xl text-white font-serif group-hover:text-[#d4af37] transition-colors">{prop.title}</h3>
                     
                     {/* Delivery Date Display */}
                     {prop.deliveryDate && (
                         <div className="flex items-center gap-2 text-[#d4af37] text-xs mt-1">
                             <Calendar size={12} />
                             <span>Entrega: {prop.deliveryDate}</span>
                         </div>
                     )}
                     
                     {/* Financial Info (Subtle) */}
                     {(prop.downPayment || prop.installments) && (
                        <div className="text-xs text-zinc-400 pt-1 flex flex-col gap-0.5 mt-2 border-t border-white/5 pt-2">
                            {prop.downPayment && <span className="text-zinc-300">Entrada {prop.downPayment}</span>}
                            {prop.installments && <span>+ {prop.installments}</span>}
                        </div>
                     )}
                   </div>
                 </motion.div>
               ))
             ) : (
                <div className="col-span-full py-12 text-center text-zinc-500 border border-dashed border-white/10 rounded-lg">
                   <p className="text-lg">Nenhum imóvel encontrado.</p>
                   <button onClick={clearFilters} className="mt-4 text-[#d4af37] hover:underline">Limpar busca</button>
                </div>
             )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-[#0c0c0e] border-t border-white/5">
         <div className="max-w-3xl mx-auto px-6">
            <h2 className="font-serif text-3xl md:text-4xl text-center text-white mb-16">Perguntas Frequentes</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-white/10 pb-4">
                  <button onClick={() => toggleFaq(idx)} className="w-full flex items-center justify-between text-left py-4 focus:outline-none group">
                     <span className="text-lg text-zinc-200 font-light group-hover:text-[#d4af37] transition-colors">{faq.q}</span>
                     <div className={`transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-[#d4af37]' : 'text-zinc-500'}`}>
                        <Minus size={20} className={openFaq === idx ? 'block' : 'hidden'} />
                        <Plus size={20} className={openFaq !== idx ? 'block' : 'hidden'} />
                     </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                         <p className="text-zinc-400 pb-6 leading-relaxed font-light text-sm md:text-base">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
           <div className="space-y-6 md:w-1/3">
             <div className="flex items-center gap-3">
               {brokerProfile.logo ? (
                 <img src={brokerProfile.logo} alt={brokerProfile.name} className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
               ) : (
                 <div className="flex items-center gap-3">
                   <div className="text-[#d4af37]"><Building2 size={24} /></div>
                   <span className="font-serif font-bold text-xl tracking-wide uppercase">{brokerProfile.name}</span>
                 </div>
               )}
             </div>
             <p className="text-zinc-500 text-sm font-light leading-relaxed">Consultoria imobiliária especializada em ativos de alta performance.</p>
           </div>
           
           <div className="flex flex-wrap gap-16 md:justify-end md:w-2/3">
              <div className="space-y-4">
                 <h4 className="text-sm font-bold uppercase tracking-widest text-[#d4af37]">Links Úteis</h4>
                 <ul className="space-y-2 text-zinc-400 text-sm">
                    <li><button onClick={() => setMode(AppMode.PRIVACY)} className="flex items-center gap-1 hover:text-[#d4af37] transition-colors"><Scale size={12}/> Política de Privacidade</button></li>
                    <li><button onClick={() => setMode(AppMode.ADMIN)} className="flex items-center gap-1 hover:text-[#d4af37] transition-colors"><Lock size={12}/> Área do Corretor</button></li>
                 </ul>
              </div>
           </div>
        </div>
      </footer>

      {/* PROPERTY DETAIL MODAL OVERLAY */}
      <AnimatePresence>
        {selectedProperty && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex justify-end"
                onClick={closePropertyDetails}
            >
                <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="w-full md:w-[600px] h-full bg-[#18181b] overflow-y-auto border-l border-white/10"
                    onClick={(e) => e.stopPropagation()} // Prevent close on content click
                >
                    <div className="relative h-[40vh]">
                        <img src={selectedProperty.image} className="w-full h-full object-cover" alt={selectedProperty.title} />
                        <button 
                            onClick={closePropertyDetails}
                            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors backdrop-blur-md"
                        >
                            <X size={24} />
                        </button>
                        <div className="absolute bottom-4 left-4">
                            <span className="bg-[#d4af37] text-black text-xs font-bold px-3 py-1 uppercase tracking-widest">{selectedProperty.tag}</span>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        <div>
                            <div className="flex items-center gap-2 text-zinc-500 text-sm uppercase tracking-widest mb-2">
                                <MapPin size={14} /> {selectedProperty.location}
                            </div>
                            <h2 className="font-serif text-3xl md:text-4xl text-white mb-2">{selectedProperty.title}</h2>
                            <p className="text-zinc-400 text-sm">{selectedProperty.type}</p>
                            
                            {/* Delivery Date Modal Display */}
                            {selectedProperty.deliveryDate && (
                                <div className="mt-4 inline-flex items-center gap-2 bg-[#d4af37]/10 text-[#d4af37] px-3 py-1.5 rounded-full border border-[#d4af37]/20">
                                    <Calendar size={14} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Entrega: {selectedProperty.deliveryDate}</span>
                                </div>
                            )}
                        </div>

                        <div className="bg-white/5 p-6 border border-white/5 rounded-sm">
                             <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1">Valor do Investimento</p>
                             <p className="font-serif text-3xl text-[#d4af37]">{selectedProperty.price}</p>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/30 p-4 border border-white/5 rounded-sm">
                                <Bed size={20} className="text-zinc-500 mb-2" />
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Configuração</p>
                                <p className="text-white font-bold">{selectedProperty.specs}</p>
                            </div>
                             <div className="bg-black/30 p-4 border border-white/5 rounded-sm">
                                <DollarSign size={20} className="text-zinc-500 mb-2" />
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Pagamento</p>
                                <p className="text-white font-bold">Facilitado</p>
                            </div>
                        </div>

                        {/* Financial Plan Details */}
                        {(selectedProperty.downPayment || selectedProperty.installments || selectedProperty.balloonPayments) && (
                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                                    <Wallet size={16} className="text-[#d4af37]" /> Condições de Pagamento
                                </h3>
                                <div className="space-y-3 bg-white/[0.02] p-4 rounded-sm">
                                    {selectedProperty.downPayment && (
                                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                            <span className="text-zinc-400 text-sm">Entrada</span>
                                            <span className="text-white font-bold">{selectedProperty.downPayment}</span>
                                        </div>
                                    )}
                                    {selectedProperty.installments && (
                                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                            <span className="text-zinc-400 text-sm">Parcelamento</span>
                                            <span className="text-white font-bold text-right">{selectedProperty.installments}</span>
                                        </div>
                                    )}
                                    {selectedProperty.balloonPayments && selectedProperty.balloonPayments !== '-' && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-zinc-400 text-sm">Reforços / Balões</span>
                                            <span className="text-white font-bold text-right">{selectedProperty.balloonPayments}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="pt-8">
                            <a 
                                href={`${socialLinks.whatsapp}?text=Olá, gostaria de saber mais sobre o imóvel *${selectedProperty.title}* em ${selectedProperty.location}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#d4af37] hover:bg-[#c4a030] text-black font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 transition-colors rounded-sm"
                            >
                                <MessageCircle size={20} /> Solicitar Apresentação
                            </a>
                            <p className="text-center text-xs text-zinc-500 mt-4">
                                Valores e disponibilidade sujeitos a alteração sem aviso prévio.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};