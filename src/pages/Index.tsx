import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, BarChart3, ShoppingBag, Brain, Shield, Zap, Users, 
  Sprout, Droplets, Sun, Tractor, Leaf, TrendingUp, CloudRain,
  Wheat, Globe, Target, Award, BookOpen, ChevronRight, Thermometer
} from 'lucide-react';
import { useScrollAnimation, useMultiScrollAnimation } from '@/hooks/use-scroll-animation';
import { useParallax, useScrollY } from '@/hooks/use-parallax';
import farmingTech from '@/assets/farming-technology.jpg';
import organicHarvest from '@/assets/organic-harvest.jpg';
import smartFarming from '@/assets/smart-farming.jpg';
import farmerTechnology from '@/assets/farmer-technology.jpg';
import soilAnalysis from '@/assets/soil-analysis.jpg';
import greenhouseTech from '@/assets/greenhouse-tech.jpg';

const Index: React.FC = () => {
  const scrollY = useScrollY();
  const bannerAnimation = useScrollAnimation();
  const featuresAnimation = useScrollAnimation();
  const { setRef: setFeatureRef, visibleItems: featureVisibility } = useMultiScrollAnimation(6, { threshold: 0.1 });
  const aboutAnimation = useScrollAnimation();
  const scienceAnimation = useScrollAnimation();
  const { setRef: setScienceCardRef, visibleItems: scienceCardVisibility } = useMultiScrollAnimation(3, { threshold: 0.2 });
  const benefitsAnimation = useScrollAnimation();
  const { setRef: setStatRef, visibleItems: statVisibility } = useMultiScrollAnimation(4, { threshold: 0.2 });
  const howItWorksAnimation = useScrollAnimation();
  const { setRef: setStepRef, visibleItems: stepVisibility } = useMultiScrollAnimation(4, { threshold: 0.2 });
  const testimonialsAnimation = useScrollAnimation();
  const { setRef: setTestimonialRef, visibleItems: testimonialVisibility } = useMultiScrollAnimation(3, { threshold: 0.2 });
  const ctaAnimation = useScrollAnimation();

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <main className="min-h-screen">
      <Hero />

      {/* Aerial Farmland Banner with Parallax */}
      
      {/* Features Section */}
      <section 
        ref={featuresAnimation.ref}
        className={`py-20 bg-background transition-all duration-700 ${
          featuresAnimation.isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 delay-100 ${
            featuresAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for
              <span className="text-primary"> Smart Farming</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Comprehensive tools and resources to maximize your agricultural success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI Crop Prediction',
                description: 'Get accurate crop recommendations based on soil conditions, weather, and historical data.',
                color: 'bg-primary/10 text-primary',
              },
              {
                icon: BarChart3,
                title: 'Power BI Analytics',
                description: 'Visualize trends, market rates, and yield patterns with interactive dashboards.',
                color: 'bg-secondary/10 text-secondary',
              },
              {
                icon: ShoppingBag,
                title: 'Agricultural E-Commerce',
                description: 'Shop for quality seeds, fertilizers, equipment, and more at competitive prices.',
                color: 'bg-primary/10 text-primary',
              },
              {
                icon: Shield,
                title: 'Secure Platform',
                description: 'Your data is protected with enterprise-grade security and encryption.',
                color: 'bg-success/10 text-success',
              },
              {
                icon: Zap,
                title: 'Real-time Updates',
                description: 'Stay informed with live market rates and weather-based recommendations.',
                color: 'bg-secondary/10 text-secondary',
              },
              {
                icon: Users,
                title: 'Community Support',
                description: 'Connect with fellow farmers and agricultural experts for guidance.',
                color: 'bg-primary/10 text-primary',
              },
            ].map(({ icon: Icon, title, description, color }, index) => (
              <div
                key={title}
                ref={setFeatureRef(index)}
                className={`group p-6 bg-card rounded-2xl shadow-soft hover:shadow-card transition-all duration-500 border border-border hover:-translate-y-2 ${
                  featureVisibility[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Agriculture Section */}
      <section 
        ref={aboutAnimation.ref}
        className={`py-20 bg-accent transition-all duration-700 ${
          aboutAnimation.isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-700 delay-200 ${
              aboutAnimation.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                <Sprout className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Sustainable Agriculture</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Empowering Farmers with Modern Technology
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Agriculture is the backbone of our economy, supporting over 58% of India's population. 
                With changing climate patterns and increasing demand, modern farming techniques have 
                become essential for sustainable growth.
              </p>
              <p className="text-muted-foreground mb-8">
                AgroSmart bridges the gap between traditional farming wisdom and cutting-edge technology, 
                helping farmers make data-driven decisions that improve yields, reduce costs, and promote 
                environmental sustainability.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-xl p-4 border border-border hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                  <Droplets className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold text-foreground">Smart Irrigation</h4>
                  <p className="text-sm text-muted-foreground">Optimize water usage with precision farming</p>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                  <Sun className="w-8 h-8 text-secondary mb-2" />
                  <h4 className="font-semibold text-foreground">Climate Analysis</h4>
                  <p className="text-sm text-muted-foreground">Weather-based crop recommendations</p>
                </div>
              </div>
            </div>
            <div className={`relative transition-all duration-700 delay-400 ${
              aboutAnimation.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <img
                src={farmingTech}
                alt="Farmers using modern technology in agricultural field"
                className="rounded-2xl shadow-card w-full hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-card border border-border animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">40%</p>
                    <p className="text-sm text-muted-foreground">Yield Increase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Science of Farming Section */}
      <section 
        ref={scienceAnimation.ref}
        className={`py-20 bg-background transition-all duration-700 ${
          scienceAnimation.isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 delay-100 ${
            scienceAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Agricultural Knowledge</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Science Behind <span className="text-primary">Smart Farming</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Understanding the fundamentals of modern agriculture helps farmers make informed decisions 
              that lead to better harvests and sustainable practices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { img: soilAnalysis, alt: 'Soil analysis and testing', title: 'Soil Health', desc: 'Healthy soil is the foundation of productive agriculture. Regular testing helps optimize nutrient levels and pH balance for maximum crop growth.' },
              { img: farmerTechnology, alt: 'Farmer using technology', title: 'Digital Tools', desc: 'Mobile apps and sensors enable real-time monitoring of crop health, weather conditions, and soil moisture levels from anywhere.' },
              { img: greenhouseTech, alt: 'Modern greenhouse technology', title: 'Controlled Environment', desc: 'Greenhouses and vertical farms allow year-round production with precise control over temperature, humidity, and light.' },
            ].map(({ img, alt, title, desc }, index) => (
              <div 
                key={title}
                ref={setScienceCardRef(index)}
                className={`relative overflow-hidden rounded-2xl group transition-all duration-500 hover:-translate-y-2 ${
                  scienceCardVisibility[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <img 
                  src={img} 
                  alt={alt} 
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-primary-foreground mb-2">{title}</h3>
                  <p className="text-primary-foreground/80 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Agricultural Facts */}
          <div className="bg-card rounded-2xl border border-border p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Key Agricultural Insights</h3>
                <ul className="space-y-4">
                  {[
                    { icon: Wheat, text: 'India is the world\'s second-largest producer of rice and wheat' },
                    { icon: Globe, text: 'Agriculture contributes about 18% to India\'s GDP' },
                    { icon: CloudRain, text: 'Monsoon patterns affect 60% of cultivated land in India' },
                    { icon: Target, text: 'Precision farming can reduce water usage by up to 30%' },
                  ].map(({ icon: Icon, text }, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-muted-foreground">{text}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Modern Farming Practices</h3>
                <ul className="space-y-4">
                  {[
                    { icon: Tractor, text: 'Mechanization increases productivity by 25-30% on average' },
                    { icon: Droplets, text: 'Drip irrigation saves 30-50% water compared to flood irrigation' },
                    { icon: Leaf, text: 'Organic farming improves soil fertility over time' },
                    { icon: Award, text: 'Quality seeds can boost yields by 20-25%' },
                  ].map(({ icon: Icon, text }, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-4 h-4 text-secondary" />
                      </div>
                      <p className="text-muted-foreground">{text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Crop Types Education */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            Major Crop Types & Their Requirements
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                name: 'Cereals', 
                crops: 'Rice, Wheat, Maize, Millets',
                season: 'Kharif & Rabi',
                water: 'Moderate to High',
                icon: Wheat,
                color: 'bg-amber-500/10 text-amber-600'
              },
              { 
                name: 'Pulses', 
                crops: 'Chickpea, Lentils, Pigeon Pea',
                season: 'Rabi Season',
                water: 'Low to Moderate',
                icon: Sprout,
                color: 'bg-emerald-500/10 text-emerald-600'
              },
              { 
                name: 'Cash Crops', 
                crops: 'Cotton, Sugarcane, Jute',
                season: 'Varies by crop',
                water: 'High',
                icon: TrendingUp,
                color: 'bg-blue-500/10 text-blue-600'
              },
              { 
                name: 'Oilseeds', 
                crops: 'Groundnut, Mustard, Soybean',
                season: 'Kharif & Rabi',
                water: 'Low to Moderate',
                icon: Sun,
                color: 'bg-yellow-500/10 text-yellow-600'
              },
            ].map(({ name, crops, season, water, icon: Icon, color }) => (
              <div key={name} className="bg-card rounded-xl p-6 border border-border hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{crops}</p>
                <div className="space-y-1 text-xs">
                  <p className="text-muted-foreground"><span className="font-medium">Season:</span> {season}</p>
                  <p className="text-muted-foreground"><span className="font-medium">Water:</span> {water}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Farming Tips */}
        <div className="mt-16 bg-card rounded-2xl border border-border p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Seasonal Farming Calendar
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-primary/5 rounded-xl">
              <CloudRain className="w-10 h-10 text-primary mx-auto mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Kharif Season</h4>
              <p className="text-sm text-muted-foreground mb-2">June - October</p>
              <p className="text-xs text-muted-foreground">
                Plant rice, maize, cotton, soybean. Prepare land before monsoon. Ensure proper drainage.
              </p>
            </div>
            <div className="text-center p-6 bg-secondary/5 rounded-xl">
              <Sun className="w-10 h-10 text-secondary mx-auto mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Rabi Season</h4>
              <p className="text-sm text-muted-foreground mb-2">October - March</p>
              <p className="text-xs text-muted-foreground">
                Plant wheat, mustard, chickpea. Use residual soil moisture. Apply winter fertilizers.
              </p>
            </div>
            <div className="text-center p-6 bg-success/5 rounded-xl">
              <Thermometer className="w-10 h-10 text-success mx-auto mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Zaid Season</h4>
              <p className="text-sm text-muted-foreground mb-2">March - June</p>
              <p className="text-xs text-muted-foreground">
                Plant watermelon, cucumber, vegetables. Requires irrigation. Focus on quick-maturing crops.
              </p>
            </div>
          </div>
        </div>

        {/* Sustainable Practices */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            Sustainable Farming Practices
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[
                { title: 'Crop Rotation', desc: 'Alternate crops each season to maintain soil fertility and break pest cycles. Legumes after cereals replenish nitrogen.' },
                { title: 'Organic Composting', desc: 'Convert farm waste into nutrient-rich compost. Reduces chemical fertilizer dependency and improves soil structure.' },
                { title: 'Integrated Pest Management', desc: 'Combine biological controls, crop rotation, and minimal pesticides for sustainable pest control.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Leaf className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{title}</h4>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[
                { title: 'Water Conservation', desc: 'Drip irrigation saves 30-50% water. Rainwater harvesting and mulching reduce evaporation losses.' },
                { title: 'Cover Cropping', desc: 'Plant cover crops during off-season to prevent erosion, suppress weeds, and add organic matter.' },
                { title: 'Agroforestry', desc: 'Integrate trees with crops for shade, windbreaks, and additional income from fruits or timber.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-1">
                    <Sprout className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{title}</h4>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Agricultural Benefits */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose <span className="text-primary">AgroSmart?</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of farmers who have transformed their agricultural practices
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative group overflow-hidden rounded-2xl">
              <img
                src={smartFarming}
                alt="Aerial view of modern agricultural farm with drone technology"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-primary-foreground mb-2">Precision Agriculture</h3>
                  <p className="text-primary-foreground/80">
                    Use drones, sensors, and AI to monitor crop health and optimize resources
                  </p>
                </div>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl">
              <img
                src={organicHarvest}
                alt="Fresh organic vegetables harvest from farm"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-primary-foreground mb-2">Quality Products</h3>
                  <p className="text-primary-foreground/80">
                    Access premium seeds, fertilizers, and equipment for better harvests
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { value: '10,000+', label: 'Active Farmers', icon: Users },
              { value: '8', label: 'States Covered', icon: Leaf },
              { value: '50+', label: 'Crop Varieties', icon: Sprout },
              { value: '95%', label: 'Prediction Accuracy', icon: Brain },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center p-6 bg-card rounded-xl border border-border">
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
                <p className="text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How <span className="text-primary">AgroSmart</span> Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Get started in just a few simple steps and transform your farming practices
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Sign Up', description: 'Create your free account and set up your farm profile with location and crop details.' },
              { step: '02', title: 'Input Data', description: 'Enter soil parameters like nitrogen, phosphorus, potassium, and pH levels.' },
              { step: '03', title: 'Get Predictions', description: 'Our AI analyzes your data and recommends the best crops for your conditions.' },
              { step: '04', title: 'Shop & Grow', description: 'Purchase quality inputs from our shop and track your progress with analytics.' },
            ].map(({ step, title, description }, index) => (
              <div key={step} className="relative">
                <div className="bg-card rounded-2xl p-6 border border-border h-full">
                  <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4">
                    <span className="text-primary-foreground font-bold">{step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm">{description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-accent overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What <span className="text-primary">Farmers</span> Say
            </h2>
            <p className="text-muted-foreground text-lg">
              Real stories from farmers who have benefited from AgroSmart
            </p>
          </div>
        </div>

        {/* Continuous scrolling testimonials */}
        <div className="relative">
          <div className="flex animate-scroll-left">
            {[
              {
                name: 'Rajesh Kumar',
                location: 'Punjab',
                quote: 'AgroSmart helped me increase my wheat yield by 35%. The crop predictions are incredibly accurate!',
                crop: 'Wheat & Rice',
              },
              {
                name: 'Priya Sharma',
                location: 'Maharashtra',
                quote: 'The analytics dashboard gives me insights I never had before. I can now plan my seasons better.',
                crop: 'Cotton & Soybean',
              },
              {
                name: 'Amit Patel',
                location: 'Gujarat',
                quote: 'Shopping for quality seeds and fertilizers has never been easier. Great prices and fast delivery!',
                crop: 'Groundnut & Castor',
              },
              {
                name: 'Sunita Devi',
                location: 'Uttar Pradesh',
                quote: 'The soil analysis feature transformed how I approach fertilization. My costs are down by 20%!',
                crop: 'Sugarcane & Potato',
              },
              {
                name: 'Vikram Singh',
                location: 'Rajasthan',
                quote: 'Water management insights helped me save precious resources while maintaining crop quality.',
                crop: 'Mustard & Cumin',
              },
              {
                name: 'Meena Kumari',
                location: 'Karnataka',
                quote: 'From prediction to harvest, AgroSmart guides me every step. Best investment for my farm!',
                crop: 'Coffee & Pepper',
              },
              // Duplicate for seamless loop
              {
                name: 'Rajesh Kumar',
                location: 'Punjab',
                quote: 'AgroSmart helped me increase my wheat yield by 35%. The crop predictions are incredibly accurate!',
                crop: 'Wheat & Rice',
              },
              {
                name: 'Priya Sharma',
                location: 'Maharashtra',
                quote: 'The analytics dashboard gives me insights I never had before. I can now plan my seasons better.',
                crop: 'Cotton & Soybean',
              },
              {
                name: 'Amit Patel',
                location: 'Gujarat',
                quote: 'Shopping for quality seeds and fertilizers has never been easier. Great prices and fast delivery!',
                crop: 'Groundnut & Castor',
              },
              {
                name: 'Sunita Devi',
                location: 'Uttar Pradesh',
                quote: 'The soil analysis feature transformed how I approach fertilization. My costs are down by 20%!',
                crop: 'Sugarcane & Potato',
              },
              {
                name: 'Vikram Singh',
                location: 'Rajasthan',
                quote: 'Water management insights helped me save precious resources while maintaining crop quality.',
                crop: 'Mustard & Cumin',
              },
              {
                name: 'Meena Kumari',
                location: 'Karnataka',
                quote: 'From prediction to harvest, AgroSmart guides me every step. Best investment for my farm!',
                crop: 'Coffee & Pepper',
              },
            ].map(({ name, location, quote, crop }, index) => (
              <div 
                key={`${name}-${index}`} 
                className="flex-shrink-0 w-80 md:w-96 mx-4 bg-card rounded-2xl p-6 border border-border shadow-soft"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">{name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{name}</p>
                    <p className="text-sm text-muted-foreground">{location}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">"{quote}"</p>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">{crop}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 left-20 gradient-hero">
        <div className="container left-20 mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of farmers who are already using AgroSmart to increase yields and optimize their agricultural practices.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/auth?mode=signup">
              <Button variant="gold" size="xl" className="gap-2">
                Start Free Today
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/predict">
              <Button 
                variant="outline" 
                size="xl" 
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Index;
