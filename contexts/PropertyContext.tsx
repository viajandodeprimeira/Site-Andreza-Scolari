import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { db, USE_FIREBASE } from '../services/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, setDoc, query, orderBy } from 'firebase/firestore';

export interface Property {
  id: string | number;
  title: string;
  location: string;
  price: string;
  type: string;
  specs: string;
  tag: string;
  image: string;
}

export interface BrokerProfile {
  name: string;
  title: string;
  description: string;
  image: string;
}

export interface SocialLinks {
  instagram: string;
  whatsapp: string;
}

export interface FAQ {
  id: string | number;
  q: string;
  a: string;
}

interface PropertyContextType {
  properties: Property[];
  brokerProfile: BrokerProfile;
  socialLinks: SocialLinks;
  faqs: FAQ[];
  addProperty: (property: Omit<Property, 'id'>) => void;
  removeProperty: (id: string | number) => void;
  importMockProperties: () => void;
  updateBrokerProfile: (profile: BrokerProfile) => void;
  updateSocialLinks: (links: SocialLinks) => void;
  addFaq: (faq: Omit<FAQ, 'id'>) => void;
  removeFaq: (id: string | number) => void;
  resetAllData: () => void;
  usingFirebase: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

// --- Default Data Constants ---
const DEFAULT_PROPERTIES: Property[] = [
  {
    id: 1,
    title: 'The Ocean Collection',
    location: 'Balneário Camboriú',
    price: 'R$ 5.200.000',
    type: 'Frente Mar',
    specs: '4 Suítes | 280m²',
    tag: 'Lançamento',
    image: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=2973&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Vogue Residence',
    location: 'Itapema',
    price: 'R$ 1.950.000',
    type: 'Quadra Mar',
    specs: '3 Suítes | 145m²',
    tag: 'Pré-Lançamento',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2900&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Investment Studio',
    location: 'São Paulo',
    price: 'R$ 780.000',
    type: 'Compacto de Luxo',
    specs: '1 Suíte | 42m²',
    tag: 'Renda Passiva',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2880&auto=format&fit=crop'
  }
];

const DEFAULT_PROFILE: BrokerProfile = {
  name: 'ANDREZA SCOLARI',
  title: 'Investimentos Imobiliários',
  description: 'Com anos de atuação no mercado imobiliário de luxo, me consolidei como referência para investidores que buscam segurança e alta rentabilidade.\nDiferente de corretores tradicionais, nossa abordagem é analítica e focada em números.\nEntendemos que um imóvel deve ser um ativo gerador de riqueza.',
  image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop'
};

const DEFAULT_SOCIALS: SocialLinks = {
  instagram: 'https://www.instagram.com/andrezascolari/?hl=pt',
  whatsapp: 'https://wa.me/'
};

const DEFAULT_FAQS: FAQ[] = [
  { id: 1, q: "Qual o ticket médio para investimento?", a: "Trabalhamos com oportunidades a partir de R$ 800.000 em regiões de alta demanda, com fluxo de pagamento facilitado durante a obra." },
  { id: 2, q: "Como funciona a gestão de renda passiva?", a: "Assessoramos na escolha de imóveis em regiões turísticas ou corporativas e indicamos parceiros para gestão de locação Short Stay (Airbnb)." },
  { id: 3, q: "Por que investir no Litoral Catarinense?", a: "Regiões como Balneário Camboriú e Itapema possuem os metros quadrados mais valorizados do Brasil, garantindo liquidez e segurança." },
];

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usingFirebase, setUsingFirebase] = useState(false);
  
  // Helper for LocalStorage
  const getInitialState = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  // State
  const [properties, setProperties] = useState<Property[]>(() => getInitialState('app_properties', DEFAULT_PROPERTIES));
  const [brokerProfile, setBrokerProfile] = useState<BrokerProfile>(() => getInitialState('app_profile', DEFAULT_PROFILE));
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(() => getInitialState('app_socials', DEFAULT_SOCIALS));
  const [faqs, setFaqs] = useState<FAQ[]>(() => getInitialState('app_faqs', DEFAULT_FAQS));

  // --- Initialize Firebase Listeners ---
  useEffect(() => {
    if (USE_FIREBASE && db) {
      setUsingFirebase(true);
      
      // Listen for Properties
      const unsubProps = onSnapshot(query(collection(db, 'properties'), orderBy('timestamp', 'desc')), (snapshot) => {
        const propsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
        if (propsData.length > 0) setProperties(propsData);
      });

      // Listen for Profile (Single Doc)
      const unsubProfile = onSnapshot(doc(db, 'settings', 'profile'), (doc) => {
        if (doc.exists()) setBrokerProfile(doc.data() as BrokerProfile);
      });

      // Listen for Socials (Single Doc)
      const unsubSocials = onSnapshot(doc(db, 'settings', 'socials'), (doc) => {
        if (doc.exists()) setSocialLinks(doc.data() as SocialLinks);
      });

      // Listen for FAQs
      const unsubFaqs = onSnapshot(collection(db, 'faqs'), (snapshot) => {
        const faqsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQ));
        if (faqsData.length > 0) setFaqs(faqsData);
      });

      return () => {
        unsubProps();
        unsubProfile();
        unsubSocials();
        unsubFaqs();
      };
    } else {
        // Fallback Persistence Effects for LocalStorage
        localStorage.setItem('app_properties', JSON.stringify(properties));
        localStorage.setItem('app_profile', JSON.stringify(brokerProfile));
        localStorage.setItem('app_socials', JSON.stringify(socialLinks));
        localStorage.setItem('app_faqs', JSON.stringify(faqs));
    }
  }, [properties, brokerProfile, socialLinks, faqs]); // Dependency array mostly for LocalStorage sync

  // --- Actions ---

  const addProperty = async (property: Omit<Property, 'id'>) => {
    if (usingFirebase) {
        await addDoc(collection(db, 'properties'), { ...property, timestamp: Date.now() });
    } else {
        const newProperty = { ...property, id: Date.now() };
        setProperties(prev => [newProperty, ...prev]);
    }
  };

  const removeProperty = async (id: string | number) => {
    if (usingFirebase) {
        await deleteDoc(doc(db, 'properties', id.toString()));
    } else {
        setProperties(prev => prev.filter(p => p.id !== id));
    }
  };

  const updateBrokerProfile = async (profile: BrokerProfile) => {
    if (usingFirebase) {
        await setDoc(doc(db, 'settings', 'profile'), profile);
    } else {
        setBrokerProfile(profile);
    }
  };

  const updateSocialLinks = async (links: SocialLinks) => {
    if (usingFirebase) {
        await setDoc(doc(db, 'settings', 'socials'), links);
    } else {
        setSocialLinks(links);
    }
  };

  const addFaq = async (faq: Omit<FAQ, 'id'>) => {
    if (usingFirebase) {
        await addDoc(collection(db, 'faqs'), faq);
    } else {
        setFaqs(prev => [...prev, { ...faq, id: Date.now() }]);
    }
  };

  const removeFaq = async (id: string | number) => {
    if (usingFirebase) {
        await deleteDoc(doc(db, 'faqs', id.toString()));
    } else {
        setFaqs(prev => prev.filter(f => f.id !== id));
    }
  };

  const resetAllData = () => {
    if (window.confirm('Tem certeza? Isso apagará suas edições LOCAIS. Se estiver usando Firebase, precisa deletar no painel.')) {
      if (!usingFirebase) {
        setProperties(DEFAULT_PROPERTIES);
        setBrokerProfile(DEFAULT_PROFILE);
        setSocialLinks(DEFAULT_SOCIALS);
        setFaqs(DEFAULT_FAQS);
      }
    }
  };

  const importMockProperties = () => {
    const newProps = [
      {
        title: 'Skyline Tower',
        location: 'Itajaí',
        price: 'R$ 3.500.000',
        type: 'Vista Mar',
        specs: '3 Suítes | 190m²',
        tag: 'Oportunidade',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000'
      },
      {
        title: 'Garden House',
        location: 'Jurerê',
        price: 'R$ 8.900.000',
        type: 'Casa em Condomínio',
        specs: '5 Suítes | 450m²',
        tag: 'Exclusivo',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000'
      }
    ];

    if (usingFirebase) {
        newProps.forEach(p => addProperty(p));
    } else {
        const localProps = newProps.map((p, i) => ({ ...p, id: Date.now() + i }));
        setProperties(prev => [...localProps, ...prev]);
    }
  };

  return (
    <PropertyContext.Provider value={{ 
      properties, 
      brokerProfile,
      socialLinks,
      faqs,
      addProperty, 
      removeProperty, 
      importMockProperties,
      updateBrokerProfile,
      updateSocialLinks,
      addFaq,
      removeFaq,
      resetAllData,
      usingFirebase
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};