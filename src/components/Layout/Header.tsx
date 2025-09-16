import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import sudhaarlLogo from '@/assets/sudhar-logo.png';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user, logout, updateProfile } = useAuth();

  const toggleTheme = () => {
    const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark');
    if (user) {
      updateProfile({ theme: newTheme });
    } else {
      localStorage.setItem('sudhaar-theme', newTheme);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    if (user) {
      updateProfile({ preferredLanguage: newLang });
    }
  };

  const navigation = user?.role === 'admin' 
    ? [
        { name: t('nav.home'), href: '/' },
        { name: t('nav.profile'), href: '/profile' },
      ]
    : [
        { name: t('nav.home'), href: '/' },
        { name: t('nav.newComplaint'), href: '/complaint/new' },
        { name: t('nav.myComplaints'), href: '/complaints' },
        { name: t('nav.status'), href: '/status' },
        { name: t('nav.profile'), href: '/profile' },
      ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and App Name */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={sudhaarlLogo} alt="Sudhaar Setu Logo" className="w-10 h-10" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">{t('app.name')}</h1>
              <p className="text-sm text-muted-foreground -mt-1">{t('app.tagline')}</p>
            </div>
          </Link>

          {/* Desktop Navigation - Only for non-admin users */}
          {user?.role !== 'admin' && (
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={t('common.theme.toggle')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              aria-label={t('common.language.toggle')}
              className="relative"
            >
              <Globe className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 text-xs font-bold bg-primary text-primary-foreground rounded px-1">
                {i18n.language.toUpperCase()}
              </span>
            </Button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              {user ? (
                <Button variant="outline" size="sm" onClick={logout}>
                  {t('nav.logout')}
                </Button>
              ) : (
                <Link to="/auth">
                  <Button variant="default" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Hidden for admin */}
        {isMenuOpen && user?.role !== 'admin' && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-border">
                {user ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Admin Mobile Navigation - Only Home & Profile */}
        {isMenuOpen && user?.role === 'admin' && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/profile"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/profile')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.profile')}
              </Link>
              <div className="pt-2 border-t border-border">
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                >
                  {t('nav.logout')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};