import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, ShoppingBag, Leaf, Sparkles } from 'lucide-react';
import heroVideo from '@/assets/hero-video.mp4';
import heroImage from '@/assets/hero-farm.jpg';
import { useScrollY } from '@/hooks/use-parallax';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const scrollY = useScrollY();
  const parallaxOffset = scrollY * 0.4;
  const contentOffset = scrollY * 0.15;
  const opacityFade = Math.max(0, 1 - scrollY / 600);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Video with Parallax */}
      <div 
        className="absolute inset-0 z-0 will-change-transform"
        style={{ 
          transform: `translateY(${parallaxOffset}px) scale(${1 + scrollY * 0.0002})`,
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={heroImage}
          className="w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
          {/* Fallback to image if video doesn't load */}
          
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent" />
      </div>

      {/* Content with subtle parallax */}
      <div 
        className="container mx-auto px-4 relative z-10 pt-20 will-change-transform"
        style={{ 
          transform: `translateY(${contentOffset}px)`,
          opacity: opacityFade
        }}
      >
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-foreground">{t('hero.badge')}</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight animate-slide-up">
            {t('hero.title')}
            <span className="block text-secondary">{t('hero.titleHighlight')}</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/auth?mode=signup">
              <Button variant="gold" size="xl" className="gap-2">
                {t('hero.getStarted')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/predict">
              <Button variant="outline" size="xl" className="bg-card/20 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-card/40 hover:text-primary-foreground">
                {t('hero.tryPrediction')}
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: BarChart3, title: t('features.aiPrediction'), desc: t('features.aiPredictionDesc').slice(0, 30) + '...' },
              { icon: Leaf, title: t('features.analytics'), desc: t('features.analyticsDesc').slice(0, 30) + '...' },
              { icon: ShoppingBag, title: t('features.ecommerce'), desc: t('features.ecommerceDesc').slice(0, 30) + '...' },
            ].map(({ icon: Icon, title, desc }, index) => (
              <div
                key={index}
                className="bg-card/20 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/10 hover:bg-card/30 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <Icon className="w-8 h-8 text-secondary mb-2" />
                <h3 className="font-semibold text-primary-foreground">{title}</h3>
                <p className="text-sm text-primary-foreground/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating decorative elements with parallax */}
      <div 
        className="absolute bottom-10 right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow will-change-transform"
        style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
      />
      <div 
        className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-float will-change-transform"
        style={{ transform: `translateY(${-scrollY * 0.3}px)` }}
      />
      
      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-300"
        style={{ opacity: opacityFade }}
      >
        <span className="text-primary-foreground/60 text-sm">{t('hero.scrollToExplore')}</span>
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary-foreground/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
