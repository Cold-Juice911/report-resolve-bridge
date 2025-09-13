import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Plus, Activity, History, User } from 'lucide-react';

export const MobileNav = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navigation = [
    { name: t('nav.home'), href: '/', icon: Home },
    { name: t('nav.newComplaint'), href: '/complaint/new', icon: Plus },
    { name: t('nav.status'), href: '/status', icon: Activity },
    { name: t('nav.myComplaints'), href: '/complaints', icon: History },
    { name: t('nav.profile'), href: '/profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-40">
      <div className="flex items-center justify-around py-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                active
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${item.href === '/complaint/new' && active ? 'text-primary' : ''}`} />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
              {item.href === '/complaint/new' && (
                <div className="absolute -top-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};