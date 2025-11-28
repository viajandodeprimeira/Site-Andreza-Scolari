import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Building2 } from '../ui/Icons';
import { useProperties } from '../../contexts/PropertyContext';

interface PrivacyPolicyViewProps {
  goBack: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ goBack }) => {
  const { brokerProfile, socialLinks } = useProperties();
  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-zinc-300 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <button onClick={goBack} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold font-serif text-white flex items-center gap-2">
            <Lock size={16} className="text-[#d4af37]" /> Política de Privacidade
        </h1>
      </header>

      <div className="max-w-4xl mx-auto p-6 md:p-12">
        <div className="bg-[#18181b] border border-white/5 p-8 md:p-12 rounded-sm shadow-xl space-y-8">
            
            <div className="border-b border-white/5 pb-8">
                <h2 className="text-3xl font-serif text-white mb-4">Política de Privacidade</h2>
                <p className="text-sm text-zinc-500">Última atualização: {currentDate}</p>
            </div>

            <section className="space-y-4">
                <h3 className="text-xl font-bold text-white">1. Introdução</h3>
                <p className="leading-relaxed">
                    A sua privacidade é importante para nós. É política de <strong>{brokerProfile.name}</strong> respeitar a sua privacidade em relação a qualquer informação que possamos coletar no site, e outros meios digitais que possuímos e operamos.
                </p>
            </section>

            <section className="space-y-4">
                <h3 className="text-xl font-bold text-white">2. Coleta de Dados</h3>
                <p className="leading-relaxed">
                    Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço (ex: agendar uma visita ou enviar apresentação de imóvel). Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.
                </p>
                <p className="leading-relaxed">
                    Os dados que comumente coletamos através de formulários ou contato via WhatsApp incluem:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                    <li>Nome completo;</li>
                    <li>Número de telefone / WhatsApp;</li>
                    <li>Endereço de e-mail;</li>
                    <li>Interesses de investimento imobiliário.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h3 className="text-xl font-bold text-white">3. Uso de Informações</h3>
                <p className="leading-relaxed">
                    Utilizamos seus dados para:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                    <li>Entrar em contato para apresentar oportunidades imobiliárias;</li>
                    <li>Melhorar a experiência do usuário em nosso site;</li>
                    <li>Enviar comunicações de marketing e newsletters (caso autorizado);</li>
                    <li>Cumprir obrigações legais.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h3 className="text-xl font-bold text-white">4. Cookies e Tecnologias de Rastreamento</h3>
                <p className="leading-relaxed">
                    Nosso site utiliza cookies e tecnologias semelhantes (como Pixels do Facebook e Tags do Google Analytics) para melhorar a navegação e entender como os visitantes interagem com nosso conteúdo.
                </p>
                <p className="leading-relaxed">
                    Essas ferramentas ajudam em campanhas de publicidade (Google Ads e Meta Ads) para mostrar imóveis relevantes ao seu perfil. Você pode desativar os cookies nas configurações do seu navegador, mas isso pode afetar a funcionalidade do site.
                </p>
            </section>

            <section className="space-y-4">
                <h3 className="text-xl font-bold text-white">5. Compartilhamento de Dados</h3>
                <p className="leading-relaxed">
                    Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei ou estritamente necessário para a concretização de um negócio imobiliário (ex: envio de documentação para construtora), sempre com seu consentimento.
                </p>
            </section>

            <section className="space-y-4">
                <h3 className="text-xl font-bold text-white">6. Contato</h3>
                <p className="leading-relaxed">
                    Se você tiver dúvidas sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco através dos nossos canais oficiais:
                </p>
                <div className="bg-black/30 p-4 rounded-sm border border-white/10 mt-4">
                    <p className="font-bold text-white">{brokerProfile.name}</p>
                    <p className="text-sm text-zinc-400 mt-1">{brokerProfile.title}</p>
                    <div className="mt-3 flex flex-col gap-2 text-sm">
                        <a href={socialLinks.whatsapp} target="_blank" className="hover:text-[#d4af37] transition-colors">WhatsApp Oficial</a>
                        <a href={socialLinks.instagram} target="_blank" className="hover:text-[#d4af37] transition-colors">Instagram: @andrezascolari</a>
                    </div>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};