import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Property {
  id: number;
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
  id: number;
  q: string;
  a: string;
}

interface PropertyContextType {
  properties: Property[];
  brokerProfile: BrokerProfile;
  socialLinks: SocialLinks;
  faqs: FAQ[];
  addProperty: (property: Omit<Property, 'id'>) => void;
  removeProperty: (id: number) => void;
  importMockProperties: () => void;
  updateBrokerProfile: (profile: BrokerProfile) => void;
  updateSocialLinks: (links: SocialLinks) => void;
  addFaq: (faq: Omit<FAQ, 'id'>) => void;
  removeFaq: (id: number) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- Properties State ---
  const [properties, setProperties] = useState<Property[]>([
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
  ]);

  // --- Broker Profile State ---
  const [brokerProfile, setBrokerProfile] = useState<BrokerProfile>({
    name: 'ANDREZA SCOLARI',
    title: 'Investimentos Imobiliários',
    description: 'Com anos de atuação no mercado imobiliário de luxo, me consolidei como referência para investidores que buscam segurança e alta rentabilidade. Diferente de corretores tradicionais, nossa abordagem é analítica e focada em números. Entendemos que um imóvel deve ser um ativo gerador de riqueza.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop'
  });

  // --- Social Links State ---
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    instagram: 'https://www.instagram.com/andrezascolari/?hl=pt',
    whatsapp: 'https://wa.me/'
  });

  // --- FAQ State ---
  const [faqs, setFaqs] = useState<FAQ[]>([
    { id: 1, q: "Qual o ticket médio para investimento?", a: "Trabalhamos com oportunidades a partir de R$ 800.000 em regiões de alta demanda, com fluxo de pagamento facilitado durante a obra." },
    { id: 2, q: "Como funciona a gestão de renda passiva?", a: "Assessoramos na escolha de imóveis em regiões turísticas ou corporativas e indicamos parceiros para gestão de locação Short Stay (Airbnb)." },
    { id: 3, q: "Por que investir no Litoral Catarinense?", a: "Regiões como Balneário Camboriú e Itapema possuem os metros quadrados mais valorizados do Brasil, garantindo liquidez e segurança." },
  ]);

  // --- Actions ---

  const addProperty = (property: Omit<Property, 'id'>) => {
    const newProperty = { ...property, id: Date.now() };
    setProperties(prev => [newProperty, ...prev]);
  };

  const removeProperty = (id: number) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const updateBrokerProfile = (profile: BrokerProfile) => {
    setBrokerProfile(profile);
  };

  const updateSocialLinks = (links: SocialLinks) => {
    setSocialLinks(links);
  };

  const addFaq = (faq: Omit<FAQ, 'id'>) => {
    setFaqs(prev => [...prev, { ...faq, id: Date.now() }]);
  };

  const removeFaq = (id: number) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  const importMockProperties = () => {
    const newProps = [
      {
        id: Date.now() + 1,
        title: 'Skyline Tower',
        location: 'Itajaí',
        price: 'R$ 3.500.000',
        type: 'Vista Mar',
        specs: '3 Suítes | 190m²',
        tag: 'Oportunidade',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000'
      },
      {
        id: Date.now() + 2,
        title: 'Garden House',
        location: 'Jurerê',
        price: 'R$ 8.900.000',
        type: 'Casa em Condomínio',
        specs: '5 Suítes | 450m²',
        tag: 'Exclusivo',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000'
      }
    ];
    setProperties(prev => [...newProps, ...prev]);
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
      removeFaq
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