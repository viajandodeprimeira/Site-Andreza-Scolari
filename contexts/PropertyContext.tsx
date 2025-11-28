import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { db, USE_FIREBASE } from '../services/firebase';
// Importando funções do Realtime Database
import { ref, onValue, push, set, remove } from 'firebase/database';

export interface Property {
  id: string | number;
  title: string;
  location: string;
  price: string;
  type: string;
  specs: string;
  tag: string;
  image: string;
  downPayment?: string;
  installments?: string;
  balloonPayments?: string;
  deliveryDate?: string;
}

export interface BrokerProfile {
  name: string;
  title: string;
  description: string;
  image: string;
  logo?: string;
  heroImage?: string; // New field for Hero background
  pixelCode?: string;
  googleAnalyticsId?: string; // New field for GA4
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

export interface FeatureCategory {
  id: string | number;
  title: string;
  image: string;
}

export interface SocialPost {
  id: string | number;
  image: string;
  link: string;
  likes: string;
  comments: string;
}

interface PropertyContextType {
  properties: Property[];
  brokerProfile: BrokerProfile;
  socialLinks: SocialLinks;
  faqs: FAQ[];
  features: FeatureCategory[];
  socialPosts: SocialPost[];
  
  addProperty: (property: Omit<Property, 'id'>) => void;
  removeProperty: (id: string | number) => void;
  importMockProperties: () => void;
  
  updateBrokerProfile: (profile: BrokerProfile) => void;
  updateSocialLinks: (links: SocialLinks) => void;
  
  addFaq: (faq: Omit<FAQ, 'id'>) => void;
  removeFaq: (id: string | number) => void;
  
  addFeature: (feature: Omit<FeatureCategory, 'id'>) => void;
  removeFeature: (id: string | number) => void;

  addSocialPost: (post: Omit<SocialPost, 'id'>) => void;
  removeSocialPost: (id: string | number) => void;

  resetAllData: () => void;
  restoreBackup: (data: any) => void;
  usingFirebase: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

// --- Default Data Constants ---
const DEFAULT_PROPERTIES: Property[] = [
  {
    id: 1,
    title: 'The Ocean Collection',
    location: 'Balneário Camboriú',
    price: 'R$ 5.200.000,00',
    type: 'Frente Mar',
    specs: '4 Suítes | 280m²',
    tag: 'Lançamento',
    image: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=2973&auto=format&fit=crop',
    downPayment: 'R$ 1.040.000,00',
    installments: '60x de R$ 35.000,00',
    balloonPayments: '5x de R$ 412.000,00',
    deliveryDate: 'Dezembro/2026'
  },
  {
    id: 2,
    title: 'Vogue Residence',
    location: 'Itapema',
    price: 'R$ 1.950.000,00',
    type: 'Quadra Mar',
    specs: '3 Suítes | 145m²',
    tag: 'Pré-Lançamento',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2900&auto=format&fit=crop',
    downPayment: '20%',
    installments: '72x direto com a construtora',
    balloonPayments: 'Semestrais',
    deliveryDate: 'Junho/2025'
  },
  {
    id: 3,
    title: 'Investment Studio',
    location: 'Piçarras',
    price: 'R$ 780.000,00',
    type: 'Renda Passiva',
    specs: '1 Suíte | 42m²',
    tag: 'Proximo Beto Carrero',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2880&auto=format&fit=crop',
    downPayment: 'R$ 150.000,00',
    installments: 'Fluxo facilitado em 36x',
    balloonPayments: '-',
    deliveryDate: 'Pronto para Rentabilizar'
  }
];

const DEFAULT_PROFILE: BrokerProfile = {
  name: 'ANDREZA SCOLARI',
  title: 'Especialista em Investimentos Imobiliários',
  description: 'Minha assessoria vai além da venda: foco na alocação inteligente de capital. Especialista em imóveis na planta (Tabela Zero) e propriedades com alto potencial de renda passiva (Airbnb) próximas ao Beto Carrero e Balneário Camboriú.\n\nBuscamos liquidez e valorização acima da inflação.',
  image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop',
  logo: '',
  heroImage: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop',
  pixelCode: '',
  googleAnalyticsId: ''
};

const DEFAULT_SOCIALS: SocialLinks = {
  instagram: 'https://www.instagram.com/andrezascolari/?hl=pt',
  // SUBSTITUA O NÚMERO ABAIXO PELO SEU (55 + DDD + NÚMERO)
  whatsapp: 'https://wa.me/5547999999999' 
};

const DEFAULT_FAQS: FAQ[] = [
  { id: 1, q: "Por que investir em Imóveis na Planta?", a: "Comprar na planta, especialmente em regime de 'Tabela Zero' ou pré-lançamento, permite capturar a valorização máxima durante o período de obra, garantindo alavancagem financeira sobre o capital investido." },
  { id: 2, q: "Vale a pena investir perto do Beto Carrero?", a: "Sim. A região de Penha e Piçarras tem altíssima demanda por locação de temporada (Short Stay) devido ao parque, gerando renda passiva recorrente com taxas de ocupação elevadas o ano todo." },
  { id: 3, q: "Como funciona a gestão de Renda Passiva?", a: "Auxiliamos na escolha de ativos preparados para plataformas como Airbnb e Booking, conectando você a empresas de gestão que cuidam de tudo (check-in, limpeza), tornando o investimento 100% passivo." },
];

const DEFAULT_FEATURES: FeatureCategory[] = [
  { id: 1, title: "Lançamentos", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, title: "Frente Mar", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, title: "Beto Carrero / Penha", image: "https://images.unsplash.com/photo-1597039652232-4c3111818274?q=80&w=1000&auto=format&fit=crop" },
  { id: 4, title: "Imóveis na Planta", image: "https://images.unsplash.com/photo-1570129477492-45f003f2ddfa?q=80&w=1000&auto=format&fit=crop" },
  { id: 5, title: "Renda Passiva", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop" }
];

const DEFAULT_SOCIAL_POSTS: SocialPost[] = [
    { 
      id: 1, 
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop", 
      likes: "2.4k", 
      comments: "142",
      link: "https://www.instagram.com/andrezascolari/" 
    },
    { 
      id: 2, 
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop", 
      likes: "1.8k", 
      comments: "98",
      link: "https://www.instagram.com/andrezascolari/" 
    },
    { 
      id: 3, 
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop", 
      likes: "3.1k", 
      comments: "215",
      link: "https://www.instagram.com/andrezascolari/" 
    },
    { 
      id: 4, 
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop", 
      likes: "940", 
      comments: "34",
      link: "https://www.instagram.com/andrezascolari/" 
    }
];

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usingFirebase, setUsingFirebase] = useState(false);
  
  const getInitialState = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const [properties, setProperties] = useState<Property[]>(() => getInitialState('app_properties', DEFAULT_PROPERTIES));
  const [brokerProfile, setBrokerProfile] = useState<BrokerProfile>(() => getInitialState('app_profile', DEFAULT_PROFILE));
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(() => getInitialState('app_socials', DEFAULT_SOCIALS));
  const [faqs, setFaqs] = useState<FAQ[]>(() => getInitialState('app_faqs', DEFAULT_FAQS));
  const [features, setFeatures] = useState<FeatureCategory[]>(() => getInitialState('app_features', DEFAULT_FEATURES));
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => getInitialState('app_social_posts', DEFAULT_SOCIAL_POSTS));

  useEffect(() => {
    if (USE_FIREBASE && db) {
      setUsingFirebase(true);
      
      // Realtime Database Listeners
      const propsRef = ref(db, 'properties');
      const profileRef = ref(db, 'settings/profile');
      const socialsRef = ref(db, 'settings/socials');
      const faqsRef = ref(db, 'faqs');
      const featuresRef = ref(db, 'features');
      const postsRef = ref(db, 'social_posts');

      // Properties Listener
      const unsubProps = onValue(propsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Converte objeto { id1: {...}, id2: {...} } em array
          const list = Object.entries(data).map(([key, value]: any) => ({
            ...value,
            id: key
          }));
          // Reverte para mostrar mais recentes primeiro
          setProperties(list.reverse());
        } else {
            // Se estiver vazio no banco, não faz nada ou limpa
            setProperties([]);
        }
      });

      // Profile Listener
      const unsubProfile = onValue(profileRef, (snapshot) => {
        const data = snapshot.val();
        if (data) setBrokerProfile(data);
      });

      // Socials Listener
      const unsubSocials = onValue(socialsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) setSocialLinks(data);
      });

      // FAQs Listener
      const unsubFaqs = onValue(faqsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const list = Object.entries(data).map(([key, value]: any) => ({ ...value, id: key }));
            setFaqs(list);
        } else {
            setFaqs([]);
        }
      });

      // Features Listener
      const unsubFeatures = onValue(featuresRef, (snapshot) => {
        const data = snapshot.val();
         if (data) {
            const list = Object.entries(data).map(([key, value]: any) => ({ ...value, id: key }));
            setFeatures(list);
        } else {
            setFeatures([]);
        }
      });

      // Social Posts Listener
      const unsubPosts = onValue(postsRef, (snapshot) => {
        const data = snapshot.val();
         if (data) {
            const list = Object.entries(data).map(([key, value]: any) => ({ ...value, id: key }));
            setSocialPosts(list);
        } else {
            setSocialPosts([]);
        }
      });

      // Cleanup not strictly necessary for RTDB onValue in this context as they persist, but good practice if needed
      return () => {
         // onValue returns an unsubscribe function in newer SDKs, but often used directly.
         // React unmount will handle connection drop eventually.
      };
    } else {
        localStorage.setItem('app_properties', JSON.stringify(properties));
        localStorage.setItem('app_profile', JSON.stringify(brokerProfile));
        localStorage.setItem('app_socials', JSON.stringify(socialLinks));
        localStorage.setItem('app_faqs', JSON.stringify(faqs));
        localStorage.setItem('app_features', JSON.stringify(features));
        localStorage.setItem('app_social_posts', JSON.stringify(socialPosts));
    }
  }, [properties, brokerProfile, socialLinks, faqs, features, socialPosts, usingFirebase]);

  const addProperty = async (property: Omit<Property, 'id'>) => {
    if (usingFirebase) {
        // Push cria um ID único automaticamente no RTDB
        const newRef = push(ref(db, 'properties'));
        await set(newRef, { ...property, timestamp: Date.now() });
    } else {
        const newProperty = { ...property, id: Date.now() };
        setProperties(prev => [newProperty, ...prev]);
    }
  };

  const removeProperty = async (id: string | number) => {
    if (usingFirebase) {
        await remove(ref(db, `properties/${id}`));
    } else {
        setProperties(prev => prev.filter(p => p.id !== id));
    }
  };

  const updateBrokerProfile = async (profile: BrokerProfile) => {
    if (usingFirebase) {
        await set(ref(db, 'settings/profile'), profile);
    } else {
        setBrokerProfile(profile);
    }
  };

  const updateSocialLinks = async (links: SocialLinks) => {
    if (usingFirebase) {
        await set(ref(db, 'settings/socials'), links);
    } else {
        setSocialLinks(links);
    }
  };

  const addFaq = async (faq: Omit<FAQ, 'id'>) => {
    if (usingFirebase) {
        const newRef = push(ref(db, 'faqs'));
        await set(newRef, faq);
    } else {
        setFaqs(prev => [...prev, { ...faq, id: Date.now() }]);
    }
  };

  const removeFaq = async (id: string | number) => {
    if (usingFirebase) {
        await remove(ref(db, `faqs/${id}`));
    } else {
        setFaqs(prev => prev.filter(f => f.id !== id));
    }
  };

  const addFeature = async (feature: Omit<FeatureCategory, 'id'>) => {
    if (usingFirebase) {
       const newRef = push(ref(db, 'features'));
       await set(newRef, feature);
    } else {
       setFeatures(prev => [...prev, { ...feature, id: Date.now() }]);
    }
  };

  const removeFeature = async (id: string | number) => {
    if (usingFirebase) {
       await remove(ref(db, `features/${id}`));
    } else {
       setFeatures(prev => prev.filter(f => f.id !== id));
    }
  };

  const addSocialPost = async (post: Omit<SocialPost, 'id'>) => {
    if (usingFirebase) {
       const newRef = push(ref(db, 'social_posts'));
       await set(newRef, post);
    } else {
       setSocialPosts(prev => [...prev, { ...post, id: Date.now() }]);
    }
  };

  const removeSocialPost = async (id: string | number) => {
    if (usingFirebase) {
       await remove(ref(db, `social_posts/${id}`));
    } else {
       setSocialPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const resetAllData = () => {
    if (window.confirm('Tem certeza? Isso apagará suas edições LOCAIS e restaurará os valores padrão.')) {
      if (!usingFirebase) {
        setProperties(DEFAULT_PROPERTIES);
        setBrokerProfile(DEFAULT_PROFILE);
        setSocialLinks(DEFAULT_SOCIALS);
        setFaqs(DEFAULT_FAQS);
        setFeatures(DEFAULT_FEATURES);
        setSocialPosts(DEFAULT_SOCIAL_POSTS);
      }
    }
  };

  const restoreBackup = (data: any) => {
      try {
          if (data.properties) setProperties(data.properties);
          if (data.brokerProfile) setBrokerProfile(data.brokerProfile);
          if (data.socialLinks) setSocialLinks(data.socialLinks);
          if (data.faqs) setFaqs(data.faqs);
          if (data.features) setFeatures(data.features);
          if (data.socialPosts) setSocialPosts(data.socialPosts);
          alert('Backup restaurado com sucesso! Seus dados foram recuperados.');
      } catch (e) {
          console.error(e);
          alert('Erro ao restaurar backup. Arquivo inválido.');
      }
  };

  const importMockProperties = () => {
     const newProps = [
        {
          title: 'Skyline Tower',
          location: 'Itajaí',
          price: 'R$ 3.500.000,00',
          type: 'Vista Mar',
          specs: '3 Suítes | 190m²',
          tag: 'Pré-Lançamento',
          image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000',
          downPayment: '10%',
          installments: '100x',
          balloonPayments: 'Anuais',
          deliveryDate: 'Dez/2027'
        }
      ];
      if (!usingFirebase) {
          const localProps = newProps.map((p, i) => ({ ...p, id: Date.now() + i }));
          setProperties(prev => [...localProps, ...prev]);
      }
  };

  return (
    <PropertyContext.Provider value={{ 
      properties, brokerProfile, socialLinks, faqs, features, socialPosts,
      addProperty, removeProperty, importMockProperties,
      updateBrokerProfile, updateSocialLinks,
      addFaq, removeFaq,
      addFeature, removeFeature,
      addSocialPost, removeSocialPost,
      resetAllData, restoreBackup, usingFirebase
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