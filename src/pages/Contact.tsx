import React from 'react';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Mail, Phone, MapPin, Clock, Send, MessageCircle,
  Facebook, Twitter, Instagram, Linkedin, Youtube,
  Headphones, Building, Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import cropBg from '@/assets/wheat.avif';


const Contact: React.FC = () => {
  const heroAnimation = useScrollAnimation();
  const formAnimation = useScrollAnimation();
  const infoAnimation = useScrollAnimation();
  const socialAnimation = useScrollAnimation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for your message! We\'ll get back to you soon.');
  };

  return (
    <main className="min-h-screen bg-background ">
      {/* Hero Section */}
     <section
  className="relative min-h-[95vh] flex items-center justify-center"
  style={{
    backgroundImage: `url(${cropBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>

        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <Headphones className="w-9 h-9 text-red-500" />
            <span className="text-2xl font-bold text-black ">24/7 Support</span>
          </div>
          <h1 className="text-3xl md:text-8xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 via-black-600 to-purple-600 bg-clip-text text-transparent
 mb-4">
            Get in Touch with Us
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-3xl font-bold">
            Have questions about our services? Want to partner with us? We're here to help farmers succeed.
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div 
            ref={infoAnimation.ref}
            className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ${
              infoAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {[
              {
                icon: Phone,
                title: 'Call Us',
                content: '+91 1800-123-4567',
                subtitle: 'Toll Free (India)',
                color: 'bg-primary/10 text-primary',
              },
              {
                icon: Mail,
                title: 'Email Us',
                content: 'support@agrosmart.com',
                subtitle: 'We reply within 24 hours',
                color: 'bg-secondary/10 text-secondary',
              },
              {
                icon: MapPin,
                title: 'Visit Us',
                content: 'AgriTech Park, Pune',
                subtitle: 'Maharashtra, India 411001',
                color: 'bg-primary/10 text-primary',
              },
              {
                icon: Clock,
                title: 'Working Hours',
                content: 'Mon - Sat: 9AM - 6PM',
                subtitle: 'Sunday: Closed',
                color: 'bg-secondary/10 text-secondary',
              },
            ].map(({ icon: Icon, title, content, subtitle, color }, index) => (
              <div 
                key={title} 
                className="bg-card rounded-2xl border border-border p-6 text-center hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-foreground font-medium">{content}</p>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Company Info */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div 
              ref={formAnimation.ref}
              className={`bg-card rounded-2xl border border-border p-8 transition-all duration-700 ${
                formAnimation.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="h-50">
                  <h2 className="text-2xl font-bold text-foreground">Send us a Message</h2>
                  <p className="text-muted-foreground">We'd love to hear from you</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your query or requirements..." 
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full gap-2">
                  <Send className="w-5 h-5" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Company Information */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Building className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">About AgroSmart</h2>
                    <p className="text-muted-foreground">India's leading AgriTech platform</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  AgroSmart is dedicated to empowering Indian farmers with cutting-edge technology, 
                  AI-driven insights, and access to quality agricultural products. Founded in 2020, 
                  we've helped over 10,000 farmers improve their yields and livelihoods.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-foreground">Pan-India Presence</p>
                      <p className="text-sm text-muted-foreground">Operating across 8 states with 50+ service centers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Headphones className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-foreground">Dedicated Support Team</p>
                      <p className="text-sm text-muted-foreground">Agricultural experts available in regional languages</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div 
                ref={socialAnimation.ref}
                className={`bg-card rounded-2xl border border-border p-8 transition-all duration-700 ${
                  socialAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <h3 className="text-xl font-bold text-foreground mb-4">Connect with Us</h3>
                <p className="text-muted-foreground mb-6">
                  Follow us on social media for the latest updates, farming tips, and success stories.
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-600' },
                    { icon: Twitter, label: 'Twitter', color: 'hover:bg-sky-500' },
                    { icon: Instagram, label: 'Instagram', color: 'hover:bg-pink-600' },
                    { icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-blue-700' },
                    { icon: Youtube, label: 'YouTube', color: 'hover:bg-red-600' },
                  ].map(({ icon: Icon, label, color }) => (
                    <Button 
                      key={label} 
                      variant="outline" 
                      size="icon"
                      className={`rounded-xl ${color} hover:text-white transition-all duration-300`}
                    >
                      <Icon className="w-5 h-5" />
                    </Button>
                  ))}
                </div>
              </div>

              {/* Regional Offices */}
              <div className="bg-card rounded-2xl border border-border p-8">
                <h3 className="text-xl font-bold text-foreground mb-4">Regional Offices</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { city: 'Mumbai', address: 'Bandra Kurla Complex' },
                    { city: 'Delhi', address: 'Connaught Place' },
                    { city: 'Bangalore', address: 'Electronic City' },
                    { city: 'Hyderabad', address: 'HITEC City' },
                  ].map(({ city, address }) => (
                    <div key={city} className="p-3 bg-accent rounded-lg">
                      <p className="font-medium text-foreground">{city}</p>
                      <p className="text-sm text-muted-foreground">{address}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'How can I get started with AgroSmart?',
                a: 'Simply sign up for a free account, enter your farm details, and start using our crop prediction and analytics tools right away.',
              },
              {
                q: 'Is there a mobile app available?',
                a: 'Yes! Our mobile app is available for both Android and iOS devices. Download it from the respective app stores.',
              },
              {
                q: 'How accurate are the crop predictions?',
                a: 'Our AI models have a 95% accuracy rate, trained on years of agricultural data from across India.',
              },
              {
                q: 'Do you offer services in regional languages?',
                a: 'Yes, our platform and support team operate in Hindi, Marathi, Kannada, Tamil, Telugu, and Punjabi.',
              },
            ].map(({ q, a }, index) => (
              <div 
                key={index} 
                className="bg-card rounded-xl border border-border p-6 hover:shadow-card transition-all duration-300"
              >
                <h3 className="font-semibold text-foreground mb-2">{q}</h3>
                <p className="text-muted-foreground">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
