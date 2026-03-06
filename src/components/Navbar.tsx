import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Leaf, ShoppingCart, Menu, X, BarChart3, Store, Package, Shield, History, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

import LanguageSelector from './LanguageSelector';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  isAdmin?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout, isAdmin = false }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t('nav.home'), icon: Leaf },
    { path: '/predict', label: t('nav.prediction'), icon: BarChart3 },
    { path: '/analytics', label: t('nav.analytics'), icon: BarChart3 },
    { path: '/shop', label: t('nav.shop'), icon: Store },
    ...(isAuthenticated ? [{ path: '/history', label: t('nav.history'), icon: History }] : []),
    ...(isAuthenticated ? [{ path: '/orders', label: t('nav.orders'), icon: Package }] : []),
    ...(isAdmin ? [{ path: '/admin', label: t('nav.admin'), icon: Shield }] : []),
    { path: '/contact', label: t('nav.contact'), icon: Phone },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-12  left-0 right-0 z-50 gap-0 bg-transparent  backdrop-blur-lg border-b border-border">
      <div className="container  px-4">
        <div className="flex items-center justify-between font-bold h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center font-bold shadow-soft group-hover:shadow-glow transition-all duration-300">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">AgroSmart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 font-bold">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button
                  variant={isActive(path) ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-1 font-bold  h-[48px] px-[18px] text-[15px]"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
          <LanguageSelector />
            <ThemeToggle />
            
            {isAuthenticated && (
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center font-medium">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onLogout}>
                  {t('nav.logout')}
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button variant="hero" size="sm">
                    {t('nav.signup')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(path) ? 'default' : 'ghost'}
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                </Link>
              ))}
              <div className="border-t border-border pt-2 mt-2">
                {isAuthenticated ? (
                  <Button variant="outline" className="w-full" onClick={onLogout}>
                    {t('nav.logout')}
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        {t('nav.login')}
                      </Button>
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="hero" className="w-full">
                        {t('nav.signup')}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
