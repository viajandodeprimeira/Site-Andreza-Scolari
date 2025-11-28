import React from 'react';
import { useProperties } from '../../contexts/PropertyContext';

export const SEOHead: React.FC = () => {
  const { brokerProfile, properties, faqs, socialLinks } = useProperties();

  // 1. Schema do Corretor (RealEstateAgent)
  const agentSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": brokerProfile.name,
    "image": brokerProfile.image,
    "description": brokerProfile.description,
    "url": window.location.href,
    "telephone": socialLinks.whatsapp.replace('https://wa.me/', '+'),
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Penha",
      "addressRegion": "SC",
      "addressCountry": "BR"
    },
    "priceRange": "$$$$"
  };

  // 2. Schema de FAQ (FAQPage) - Excelente para aparecer nas perguntas do Google
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

  // 3. Schema de Lista de Produtos (OfferCatalog) - Para os Imóveis
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "Catálogo de Imóveis Exclusivos",
    "itemListElement": properties.map((prop, index) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Product", // Ou 'SingleFamilyResidence' / 'Apartment' se formos mais específicos
        "name": prop.title,
        "description": `${prop.type} em ${prop.location}. ${prop.specs}.`,
        "image": prop.image,
        "offers": {
            "@type": "Offer",
            "price": prop.price.replace(/[^0-9,]/g, '').replace(',', '.'), // Limpa para número
            "priceCurrency": "BRL",
            "availability": "https://schema.org/InStock"
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
