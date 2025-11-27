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
  X
} from '../ui/Icons';
import { AppMode } from '../../types';
import { useProperties } from '../../contexts/PropertyContext';

interface HomeProps {
  setMode: (mode: AppMode) => void;
}

const differentials = [
  { icon: <TrendingUp size={24} />, title: 'Multiplicação Patrimonial', desc: 'Foco exclusivo em ativos com alto potencial de valorização acima da inflação.' },
  { icon: <Wallet size={24} />, title: 'Renda Passiva', desc: 'Estratégias de Short Stay e Long Stay para maximizar o retorno mensal sobre o capital.' },
  { icon: <Building2 size={24} />, title: 'Pré-Lançamentos', desc: 'Acesso à "tabela zero" de construtoras renomadas antes da abertura ao público geral.' },
];

const features = [
  { title: "Lançamentos", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop", size: "large" },
  { title: "Mobiliados", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop", size: "small" },
  { title: "Frente Mar", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop", size: "small" },
  { title: "Quadra Mar", image: "https://images.unsplash.com/photo-1600596542815-2495db98dada?q=80&w=1000&auto=format&fit=crop", size: "small" },
  { title: "Vista Mar", image: "https://images.unsplash.com/photo-1570129477492-45f003f2ddfa?q=80&w=1000&auto=format&fit=crop", size: "small" }
];

export const Home: React.FC<HomeProps> = ({ setMode }) => {
  const { properties, brokerProfile, socialLinks, faqs } = useProperties();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Search State
  const [searchTab, setSearchTab] = useState<'buy' | 'invest'>('invest');
  const [locationFilter, setLocationFilter] = useState('Todas');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [activeSearch, setActiveSearch] = useState(false);

  // Derived locations and types for dropdowns
  const availableLocations = useMemo(() => {
    const locs = new Set(properties.map(p => p.location));
    return ['Todas', ...Array.from(locs)];
  }, [properties]);

  const availableTypes = useMemo(() => {
    const types = new Set(properties.map(p => p.type));
    return ['Todos', ...Array.from(types)];
  }, [properties]);

  // Filter Logic
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchLocation = locationFilter === 'Todas' || p.location === locationFilter;
      const matchType = typeFilter === 'Todos' || p.type === typeFilter;
      // You could add logic here to filter based on 'buy' vs 'invest' tags if you had that data
      return matchLocation && matchType;
    });
  }, [properties, locationFilter, typeFilter]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSearch = () => {
    setActiveSearch(true);
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearFilters = () => {
    setLocationFilter('Todas');
    setTypeFilter('Todos');
    setActiveSearch(false);
  };

  return (
    <div className="w-full bg-[#09090b] text-zinc-100 font-sans selection:bg-[#d4af37] selection:text-black">
      
      {/* Floating WhatsApp Button */}
      <a 
        href={socialLinks.whatsapp}
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-500 transition-all hover:scale-110"
      >
        <MessageCircle size={28} />
      </a>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="text-[#d4af37]">
             <Building2 size={24} />
           </div>
           <div className="flex flex-col">
             <span className="font-serif font-bold text-xl tracking-wide text-white leading-none uppercase">{brokerProfile.name}</span>
             <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#d4af37]">{brokerProfile.title}</span>
           </div>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-zinc-400">
           <a href="#" className="hover:text-white transition-colors">Início</a>
           <a href="#about" className="hover:text-white transition-colors">Sobre</a>
           <a href="#portfolio" className="hover:text-white transition-colors">Oportunidades</a>
           <a href="#faq" className="hover:text-white transition-colors">Dúvidas</a>
        </div>

        <div className="flex items-center gap-4">
          <a href={socialLinks.instagram} target="_blank" className="hidden md:block p-2 text-zinc-400 hover:text-white transition-colors">
            <Instagram size={20} />
          </a>
          <button 
            onClick={() => setMode(AppMode.CHAT)}
            className="bg-zinc-100 text-black px-5 py-2.5 rounded-none text-xs uppercase tracking-wider font-bold hover:bg-[#d4af37] hover:text-white transition-colors flex items-center gap-2"
          >
            <span>AI Advisor</span>
            <Bot size={16} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] w-full flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-50"
            alt="Luxury Interior"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 px-6 md:px-16 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24">
           {/* Text Content */}
           <div className="space-y-8 md:w-1/2">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-1.5 rounded-full"
              >
                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
                <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">Especialista em Lançamentos</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-serif text-5xl md:text-7xl text-white leading-[1.1]"
              >
                Construa Riqueza <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-amber-200 italic pr-2">Sólida</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-zinc-400 text-lg max-w-lg font-light leading-relaxed"
              >
                Assessoria exclusiva para investidores que buscam multiplicação patrimonial e renda passiva através do mercado imobiliário de alto padrão.
              </motion.p>
           </div>

           {/* Search Widget */}
           <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-full md:w-[450px] bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-sm shadow-2xl"
           >
              <div className="flex gap-6 border-b border-white/10 pb-4 mb-6">
                <button 
                  onClick={() => setSearchTab('invest')}
                  className={`text-sm uppercase tracking-widest font-bold pb-4 -mb-4 border-b-2 transition-colors ${searchTab === 'invest' ? 'text-[#d4af37] border-[#d4af37]' : 'text-zinc-500 border-transparent hover:text-white'}`}
                >
                  Investir
                </button>
                <button 
                  onClick={() => setSearchTab('buy')}
                  className={`text-sm uppercase tracking-widest font-bold pb-4 -mb-4 border-b-2 transition-colors ${searchTab === 'buy' ? 'text-[#d4af37] border-[#d4af37]' : 'text-zinc-500 border-transparent hover:text-white'}`}
                >
                  Comprar
                </button>
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Localização</label>
                    <div className="relative">
                       <MapPin className="absolute left-3 top-3 text-zinc-500" size={18} />
                       <select 
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 appearance-none focus:outline-none focus:border-[#d4af37] text-sm"
                       >
                          {availableLocations.map(loc => (
                             <option key={loc} value={loc} className="bg-[#09090b]">{loc}</option>
                          ))}
                       </select>
                       <ChevronDown className="absolute right-3 top-3 text-zinc-500 pointer-events-none" size={16} />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Tipo de Imóvel</label>
                    <div className="relative">
                       <HomeIcon className="absolute left-3 top-3 text-zinc-500" size={18} />
                       <select 
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 appearance-none focus:outline-none focus:border-[#d4af37] text-sm"
                        >
                           {availableTypes.map(type => (
                             <option key={type} value={type} className="bg-[#09090b]">{type}</option>
                          ))}
                       </select>
                       <ChevronDown className="absolute right-3 top-3 text-zinc-500 pointer-events-none" size={16} />
                    </div>
                 </div>

                 <button 
                    onClick={handleSearch}
                    className="w-full bg-[#d4af37] text-black font-bold uppercase tracking-widest py-4 mt-4 hover:bg-[#c4a030] transition-colors flex items-center justify-center gap-2"
                 >
                    <Search size={18} />
                    Buscar Imóveis
                 </button>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Methodology / Differentials */}
      <section className="py-24 bg-[#09090b] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
             {differentials.map((item, idx) => (
               <div key={idx} className="group p-8 border border-white/5 hover:border-[#d4af37]/30 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500">
                  <div className="mb-6 text-[#d4af37] group-hover:scale-110 transition-transform duration-500">
                    {item.icon}
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-4">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm font-light">
                    {item.desc}
                  </p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Feature Filtering Section */}
      <section className="py-24 bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-12 text-center">
             Qual característica você busca <br/> em um imóvel?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 h-auto lg:h-[500px]">
            {/* Custom Grid Layout */}
            <div className="lg:col-span-3 lg:row-span-2 relative group overflow-hidden cursor-pointer h-[300px] lg:h-full rounded-sm">
                <img src={features[0].image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={features[0].title} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <h3 className="text-white font-serif text-3xl md:text-4xl drop-shadow-lg tracking-wide">{features[0].title}</h3>
                </div>
            </div>

            <div className="lg:col-span-3 lg:row-span-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group overflow-hidden cursor-pointer h-[200px] lg:h-full rounded-sm">
                    <img src={features[1].image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={features[1].title} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white font-serif text-xl md:text-2xl drop-shadow-lg">{features[1].title}</h3>
                    </div>
                </div>
                <div className="relative group overflow-hidden cursor-pointer h-[200px] lg:h-full rounded-sm">
                    <img src={features[2].image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={features[2].title} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white font-serif text-xl md:text-2xl drop-shadow-lg">{features[2].title}</h3>
                    </div>
                </div>
            </div>

             <div className="lg:col-span-3 lg:row-span-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group overflow-hidden cursor-pointer h-[200px] lg:h-full rounded-sm">
                    <img src={features[3].image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={features[3].title} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white font-serif text-xl md:text-2xl drop-shadow-lg">{features[3].title}</h3>
                    </div>
                </div>
                <div className="relative group overflow-hidden cursor-pointer h-[200px] lg:h-full rounded-sm">
                    <img src={features[4].image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={features[4].title} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white font-serif text-xl md:text-2xl drop-shadow-lg">{features[4].title}</h3>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Personal Brand */}
      <section id="about" className="py-32 bg-[#0c0c0e]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-16 items-center">
           <div className="md:w-1/2 relative">
              <div className="relative aspect-[3/4] max-w-md mx-auto md:ml-0 overflow-hidden">
                 <img 
                   src={brokerProfile.image} 
                   alt={brokerProfile.name} 
                   className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                 />
                 <div className="absolute inset-0 border border-white/10 m-4 pointer-events-none" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 border border-[#d4af37]/20 rounded-full animate-spin-slow hidden md:block" />
           </div>
           
           <div className="md:w-1/2 space-y-8">
              <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.2em]">Sobre a Especialista</span>
              <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight">
                Mais que imóveis, <br/>
                <span className="italic text-zinc-400">estratégias de investimento.</span>
              </h2>
              <div className="space-y-6 text-zinc-400 font-light leading-relaxed">
                 {/* This handles new lines in the description properly */}
                 {brokerProfile.description.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                 ))}
                 
                <ul className="space-y-3 pt-4">
                   {[
                     "Acesso a oportunidades Off-Market",
                     "Análise detalhada de ROI e Payback",
                     "Parceria com as maiores construtoras do país"
                   ].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-white text-sm">
                       <CheckCircle2 size={16} className="text-[#d4af37]" /> {item}
                     </li>
                   ))}
                </ul>
              </div>
              <div className="pt-8">
                 <a href={socialLinks.instagram} target="_blank" className="text-white border-b border-[#d4af37] pb-1 hover:text-[#d4af37] transition-colors uppercase text-xs tracking-widest font-bold">
                   Conheça meu Instagram
                 </a>
              </div>
           </div>
        </div>
      </section>

      {/* Portfolio Grid */}
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
                    <X size={12} /> Limpar Filtros
                  </button>
               )}
               <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm uppercase tracking-wider">
                  Ver todo o acervo <ArrowUpRight size={16} />
               </button>
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
                 >
                   <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 mb-6">
                      <img 
                        src={prop.image} 
                        alt={prop.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute top-0 left-0 bg-[#d4af37] text-black text-xs font-bold px-4 py-2 uppercase tracking-widest">
                        {prop.tag}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                         <p className="text-white font-serif text-2xl mb-1">{prop.price}</p>
                         <p className="text-zinc-400 text-sm">{prop.specs}</p>
                      </div>
                   </div>
                   
                   <div className="space-y-1">
                     <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-widest">
                        <MapPin size={12} /> {prop.location}
                     </div>
                     <h3 className="text-xl text-white font-serif group-hover:text-[#d4af37] transition-colors">{prop.title}</h3>
                     <p className="text-sm text-zinc-400">{prop.type}</p>
                   </div>
                 </motion.div>
               ))
             ) : (
                <div className="col-span-full py-12 text-center text-zinc-500 border border-dashed border-white/10 rounded-lg">
                   <p className="text-lg">Nenhum imóvel encontrado com estes filtros.</p>
                   <button onClick={clearFilters} className="mt-4 text-[#d4af37] hover:underline">Limpar busca</button>
                </div>
             )}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-24 bg-[#0c0c0e] border-t border-white/5">
         <div className="max-w-3xl mx-auto px-6">
            <h2 className="font-serif text-3xl md:text-4xl text-center text-white mb-16">Perguntas Frequentes</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-white/10 pb-4">
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left py-4 focus:outline-none group"
                  >
                     <span className="text-lg text-zinc-200 font-light group-hover:text-[#d4af37] transition-colors">{faq.q}</span>
                     <div className={`transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-[#d4af37]' : 'text-zinc-500'}`}>
                        <Minus size={20} className={openFaq === idx ? 'block' : 'hidden'} />
                        <Plus size={20} className={openFaq !== idx ? 'block' : 'hidden'} />
                     </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                         <p className="text-zinc-400 pb-6 leading-relaxed font-light text-sm md:text-base">
                           {faq.a}
                         </p>
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
               <div className="text-[#d4af37]">
                 <Building2 size={24} />
               </div>
               <span className="font-serif font-bold text-xl tracking-wide uppercase">{brokerProfile.name}</span>
             </div>
             <p className="text-zinc-500 text-sm font-light leading-relaxed">
               Consultoria imobiliária especializada em ativos de alta performance. Transformando metros quadrados em patrimônio sólido.
             </p>
           </div>
           
           <div className="flex flex-wrap gap-16 md:justify-end md:w-2/3">
              <div className="space-y-4">
                 <h4 className="text-sm font-bold uppercase tracking-widest text-[#d4af37]">Navegação</h4>
                 <ul className="space-y-2 text-zinc-400 text-sm">
                    <li><a href="#" className="hover:text-white">Início</a></li>
                    <li><a href="#about" className="hover:text-white">Sobre</a></li>
                    <li><a href="#portfolio" className="hover:text-white">Oportunidades</a></li>
                    <li><button onClick={() => setMode(AppMode.ADMIN)} className="flex items-center gap-1 hover:text-[#d4af37] transition-colors"><Lock size={12}/> Área do Corretor</button></li>
                 </ul>
              </div>
              <div className="space-y-4">
                 <h4 className="text-sm font-bold uppercase tracking-widest text-[#d4af37]">Contato</h4>
                 <ul className="space-y-2 text-zinc-400 text-sm">
                    <li className="flex items-center gap-2"><Instagram size={16} /> <a href={socialLinks.instagram} target="_blank">Instagram</a></li>
                    <li className="flex items-center gap-2"><MessageCircle size={16} /> <a href={socialLinks.whatsapp} target="_blank">WhatsApp</a></li>
                    <li className="flex items-center gap-2"><MapPin size={16} /> Balneário Camboriú, SC</li>
                 </ul>
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-zinc-600 text-xs">
           © 2024 {brokerProfile.name}. Todos os direitos reservados.
        </div>
      </footer>

    </div>
  );
};