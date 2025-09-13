import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Users, 
  Eye, 
  Camera, 
  Globe, 
  Shield, 
  MapPin,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';
import sudhaarlLogo from '@/assets/sudhaar-official-logo.jpg';

export const Home = () => {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Users,
      title: t('home.features.userFriendly.title'),
      description: t('home.features.userFriendly.description'),
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Eye,
      title: t('home.features.tracking.title'),
      description: t('home.features.tracking.description'),
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Camera,
      title: t('home.features.photoReporting.title'),
      description: t('home.features.photoReporting.description'),
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Globe,
      title: t('home.features.multilingual.title'),
      description: t('home.features.multilingual.description'),
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      icon: Shield,
      title: t('home.features.privacy.title'),
      description: t('home.features.privacy.description'),
      color: 'text-red-600 dark:text-red-400'
    },
    {
      icon: MapPin,
      title: t('home.features.localAuthority.title'),
      description: t('home.features.localAuthority.description'),
      color: 'text-indigo-600 dark:text-indigo-400'
    }
  ];

  const faqs = [
    {
      question: t('home.faq.q1'),
      answer: t('home.faq.a1')
    },
    {
      question: t('home.faq.q2'),
      answer: t('home.faq.a2')
    },
    {
      question: t('home.faq.q3'),
      answer: t('home.faq.a3')
    },
    {
      question: t('home.faq.q4'),
      answer: t('home.faq.a4')
    },
    {
      question: t('home.faq.q5'),
      answer: t('home.faq.a5')
    },
    {
      question: t('home.faq.q6'),
      answer: t('home.faq.a6')
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            {/* Large Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-56 lg:h-56 bg-white/50 dark:bg-card/50 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 p-6">
                <img src={sudhaarlLogo} alt="Sudhaar Setu Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {t('home.hero.title')}
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            
            <Link to="/complaint/new">
              <Button className="btn-hero text-lg px-12 py-4 h-auto">
                <Plus className="mr-2 h-6 w-6" />
                {t('home.hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-4 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
        <div className="absolute bottom-1/4 right-4 w-32 h-32 bg-primary-glow/20 rounded-full blur-2xl" />
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t('home.features.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="feature-card group">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`p-3 rounded-xl bg-primary/10 ${feature.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t('home.faq.title')}
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <Collapsible 
                  open={openFaq === index} 
                  onOpenChange={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors">
                      <h3 className="text-left text-lg font-semibold text-foreground">
                        {faq.question}
                      </h3>
                      <ChevronDown 
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                          openFaq === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img src={sudhaarlLogo} alt="Sudhaar Setu Logo" className="w-8 h-8" />
              <span className="text-xl font-bold text-foreground">{t('app.name')}</span>
            </div>
            <p className="text-muted-foreground">
              © 2024 Sudhaar Setu. All rights reserved. | Contact: support@sudhaarsetu.gov.in
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};