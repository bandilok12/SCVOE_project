import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight, BarChart3, Brain, Globe, Headphones, Check, Lock, Wheat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success(t('footer.subscribeSuccess') || 'Successfully subscribed to newsletter!');
      setEmail('');
    }
  };

  const features = [
    {
      icon: BarChart3,
      title: t('footer.featureAnalytics') || 'Real-Time Analytics',
      description: t('footer.featureAnalyticsDesc') || 'Access live crop data and market trends from 200+ weather stations',
      color: 'text-blue-400'
    },
    {
      icon: Brain,
      title: t('footer.featureAI') || 'AI-Powered Predictions',
      description: t('footer.featureAIDesc') || 'Machine learning models trained on 20+ years of agricultural data',
      color: 'text-purple-400'
    },
    {
      icon: Globe,
      title: t('footer.featureGlobal') || 'Global Coverage',
      description: t('footer.featureGlobalDesc') || 'Supporting farmers in 100+ countries across all climates',
      color: 'text-cyan-400'
    },
    {
      icon: Headphones,
      title: t('footer.featureSupport') || 'Expert Support',
      description: t('footer.featureSupportDesc') || 'Agricultural scientists and farming experts available 24/7',
      color: 'text-pink-400'
    }
  ];

  return (
    <footer className="bg-[#1a2e1a] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary">AgroSmart</span>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors">
                <Facebook className="w-5 h-5 text-primary" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors">
                <Twitter className="w-5 h-5 text-primary" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors">
                <Instagram className="w-5 h-5 text-primary" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors">
                <Linkedin className="w-5 h-5 text-primary" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">{t('footer.quickLinks') || 'Quick Links'}</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4" /> {t('nav.home')}</Link></li>
              <li><Link to="/predict" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4" /> {t('nav.prediction')}</Link></li>
              <li><Link to="/analytics" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4" /> {t('nav.analytics')}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4" /> {t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">{t('footer.resources') || 'Resources'}</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><Wheat className="w-4 h-4 text-yellow-500" /> {t('footer.riceGuide') || 'Rice Farming Guide'}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><Wheat className="w-4 h-4 text-amber-500" /> {t('footer.wheatCultivation') || 'Wheat Cultivation'}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><Leaf className="w-4 h-4 text-green-500" /> {t('footer.cottonTips') || 'Cotton Care Tips'}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><Globe className="w-4 h-4 text-orange-500" /> {t('footer.soilTesting') || 'Soil Testing'}</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">{t('footer.contactUs') || 'Contact Us'}</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <span className="text-xs text-gray-500">{t('contact.email') || 'Email'}</span>
                  <p className="text-sm">support@agrosmart.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <span className="text-xs text-gray-500">{t('footer.phone') || 'Phone'}</span>
                  <p className="text-sm">+91 1800-123-4567</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <span className="text-xs text-gray-500">{t('footer.address') || 'Address'}</span>
                  <p className="text-sm">123 Agricultural Ave, Farm City</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">{t('footer.newsletter')}</h4>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.newsletterSubtitle')}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#2a3e2a] border-[#3a4e3a] text-white placeholder:text-gray-500"
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {t('footer.subscribe')}
              </Button>
            </form>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-[#2a3e2a] rounded-xl p-6 hover:bg-[#3a4e3a] transition-colors">
              <feature.icon className={`w-8 h-8 ${feature.color} mb-4`} />
              <h5 className="font-semibold mb-2">{feature.title}</h5>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="border-t border-[#3a4e3a] pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Why AgroSmart */}
            <div>
              <h4 className="font-semibold mb-4 text-primary">{t('benefits.title')} {t('benefits.titleHighlight')}?</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> {t('footer.benefit1') || 'Increase crop yield by up to 40%'}</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> {t('footer.benefit2') || 'Reduce farming costs significantly'}</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> {t('footer.benefit3') || 'Make data-driven decisions'}</li>
              </ul>
            </div>

            {/* Privacy & Security */}
            <div>
              <h4 className="font-semibold mb-4 text-primary">{t('footer.privacySecurity') || 'Privacy & Security'}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><Lock className="w-4 h-4 text-yellow-500" /> {t('footer.encryption') || 'Bank-level data encryption'}</li>
                <li className="flex items-center gap-2"><Lock className="w-4 h-4 text-yellow-500" /> {t('footer.gdpr') || 'GDPR compliant'}</li>
                <li className="flex items-center gap-2"><Lock className="w-4 h-4 text-yellow-500" /> {t('footer.dataOwn') || 'Your data is your own'}</li>
              </ul>
            </div>

            {/* Supported Crops */}
            <div>
              <h4 className="font-semibold mb-4 text-primary">{t('footer.supportedCrops') || 'Supported Crops'}</h4>
              <p className="text-gray-400 text-sm">
                {t('footer.cropsList') || 'Rice, Wheat, Cotton, Barley, Millet, Groundnut, Maize, Soybean, Chickpea, Sorghum, and 50+ more varieties'}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#3a4e3a] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            {t('footer.copyright')}
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-primary transition-colors">{t('footer.privacy') || 'Privacy Policy'}</a>
            <a href="#" className="hover:text-primary transition-colors">{t('footer.terms') || 'Terms of Service'}</a>
            <a href="#" className="hover:text-primary transition-colors">{t('footer.cookies') || 'Cookie Policy'}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
