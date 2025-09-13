import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Globe, Palette, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Profile = () => {
  const { t, i18n } = useTranslation();
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    preferredLanguage: user?.preferredLanguage || 'en',
    theme: user?.theme || 'light'
  });

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({
        title: t('profile.updateSuccess'),
        description: t('profile.updateSuccessMessage'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('profile.updateError'),
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      preferredLanguage: user?.preferredLanguage || 'en',
      theme: user?.theme || 'light'
    });
    setIsEditing(false);
  };

  const handleLanguageChange = (language: string) => {
    const validLanguage = language as 'en' | 'hi';
    setFormData({ ...formData, preferredLanguage: validLanguage });
    i18n.changeLanguage(validLanguage);
  };

  const handleThemeChange = (theme: string) => {
    const validTheme = theme as 'light' | 'dark';
    setFormData({ ...formData, theme: validTheme });
    document.documentElement.setAttribute('data-theme', validTheme);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('auth.loginRequired')}</h1>
          <p className="text-muted-foreground">{t('auth.loginToView')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('nav.profile')}</h1>
        <p className="text-muted-foreground">{t('profile.description')}</p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('profile.personalInfo')}
            </CardTitle>
            <CardDescription>
              {t('profile.personalInfoDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t('auth.name')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-muted' : ''}
                />
              </div>
              <div>
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-muted' : ''}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">{t('auth.phone')}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className={!isEditing ? 'bg-muted' : ''}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t('profile.role')}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {user.role === 'admin' ? t('common.admin') : t('common.user')}
                </p>
              </div>
              {user.role === 'admin' && (
                <Button variant="outline" size="sm" asChild>
                  <a href="/admin">{t('nav.adminDashboard')}</a>
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  {t('common.edit')}
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave}>
                    {t('common.save')}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    {t('common.cancel')}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('profile.preferences')}
            </CardTitle>
            <CardDescription>
              {t('profile.preferencesDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <Label>{t('profile.language')}</Label>
              </div>
              <Select value={formData.preferredLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <Label>{t('profile.theme')}</Label>
              </div>
              <Select value={formData.theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t('theme.light')}</SelectItem>
                  <SelectItem value="dark">{t('theme.dark')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.accountActions')}</CardTitle>
            <CardDescription>
              {t('profile.accountActionsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={logout}>
              {t('auth.logout')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};