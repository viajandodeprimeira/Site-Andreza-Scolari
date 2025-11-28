import React from 'react';
import { useProperties } from '../../contexts/PropertyContext';

export const SEOHead: React.FC = () => {
  const { brokerProfile, properties, faqs, socialLinks } = useProperties();

  // Helper para determinar o tipo de schema do imóvel com base no título/tipo
  const getPropertyType = (title: string, type: string) => {
    const text = (title + type).toLowerCase();
    if (text.includes('casa') || text.includes('mansão') || text.includes('sobrado')) {
      return 'SingleFamilyResidence';
    }
    return 'Apartment'; // Padrão para mercado de luxo vertical (BC/Itapema)
  };

  // Helper para limpar preço para número
  const parsePrice = (priceString: string) => {
    // Remove tudo que não é dígito ou vírgula
    const clean = priceString.replace(/[^0-9,]/g, '').replace(',', '.');
    return Number(clean) || 0;
  };

  // URL Segura (Evita quebra em SSR/Build)
  const currentUrl = typeof window !== 'undefined' ? window.location.href : "https://www.andrezascolaricorretora.com.br";

  // 1. Schema do Corretor (RealEstateAgent) - Enriquecido com Expertise
  const agentSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": brokerProfile.name,
    "image": brokerProfile.image,
    "description": brokerProfile.description,
    "url": currentUrl,
    "telephone": socialLinks.whatsapp.replace('https://wa.me/', '+'),
    "email": "contato@andrezascolaricorretora.com.br", 
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Balneário Camboriú",
      "addressRegion": "SC",
      "addressCountry": "BR"
    },
    "areaServed": [
      "Balneário Camboriú",
      "Itapema",
      "Balneário Piçarras",
      "Penha",
      "Praia Brava",
      "Litoral Norte SC"
    ],
    "knowsAbout": [
      "Investimento Imobiliário",
      "Renda Passiva",
      "Imóveis na Planta",
      "Short Stay (Airbnb)",
      "Turismo Beto Carrero World",
      "Mercado de Luxo",
      "Alavancagem Financeira"
    ],
    "openingHours": "Mo-Su 08:00-22:00", 
    "priceRange": "$$$$",
    "sameAs": [
      socialLinks.instagram,
      socialLinks.whatsapp
    ]
  };

  // 2. Schema de FAQ (FAQPage)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  // 3. Schema de Lista de Produtos (OfferCatalog) - Com tipagem específica
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "Catálogo de Investimentos Imobiliários",
    "itemListElement": properties.map((prop, index) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": getPropertyType(prop.title, prop.type),
        "name": prop.title,
        "description": `${prop.type} em ${prop.location}. ${prop.specs}. ${prop.tag}. Ideal para investimento ou moradia próximo ao mar e atrações como Beto Carrero.`,
        "image": prop.image,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": prop.location,
            "addressRegion": "SC",
            "addressCountry": "BR"
        },
        "numberOfRooms": prop.specs.includes('Suítes') ? parseInt(prop.specs) : undefined,
        "offers": {
            "@type": "Offer",
            "price": parsePrice(prop.price),
            "priceCurrency": "BRL",
            "availability": "https://schema.org/InStock",
            "url": `${currentUrl}#portfolio`
        }
      },
      "position": index + 1
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
};