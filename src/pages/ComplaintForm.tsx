import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Camera, X, MapPin, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ComplaintCategory, ComplaintFormData } from '@/types/complaint';

export const ComplaintForm = () => {
  const [formData, setFormData] = useState<ComplaintFormData>({
    title: '',
    category: 'roads',
    location: '',
    description: '',
    photos: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories: { value: ComplaintCategory; label: string }[] = [
    { value: 'roads', label: t('complaint.categories.roads') },
    { value: 'water', label: t('complaint.categories.water') },
    { value: 'sewage', label: t('complaint.categories.sewage') },
    { value: 'garbage', label: t('complaint.categories.garbage') },
    { value: 'streetLight', label: t('complaint.categories.streetLight') },
    { value: 'publicHealth', label: t('complaint.categories.publicHealth') },
    { value: 'infrastructure', label: t('complaint.categories.infrastructure') },
    { value: 'others', label: t('complaint.categories.others') }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('complaint.validation.titleRequired');
    }

    if (!formData.category) {
      newErrors.category = t('complaint.validation.categoryRequired');
    }

    if (!formData.location.trim()) {
      newErrors.location = t('complaint.validation.locationRequired');
    }

    if (formData.description.trim().length < 20) {
      newErrors.description = t('complaint.validation.descriptionRequired');
    }

    if (formData.photos.length < 3) {
      newErrors.photos = t('complaint.validation.photosRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (formData.photos.length + files.length > 5) {
      toast({
        title: t('common.error'),
        description: t('complaint.maxPhotos'),
        variant: 'destructive'
      });
      return;
    }

    const newPhotos = [...formData.photos, ...files];
    setFormData(prev => ({ ...prev, photos: newPhotos }));

    // Create previews
    const newPreviews = [...photoPreviews];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviews.push(e.target.result as string);
          setPhotoPreviews([...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (errors.photos) {
      setErrors(prev => ({ ...prev, photos: '' }));
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    
    setFormData(prev => ({ ...prev, photos: newPhotos }));
    setPhotoPreviews(newPreviews);
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: `${prev.location} (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`
          }));
          toast({
            title: t('common.success'),
            description: 'Location added successfully'
          });
        },
        (error) => {
          toast({
            title: t('common.error'),
            description: 'Unable to get location',
            variant: 'destructive'
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Convert photos to base64 for localStorage (in real app, would upload to server)
      const photoUrls = await Promise.all(
        formData.photos.map(async (file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
        })
      );

      const complaint = {
        id: `C${Date.now()}`,
        userId: user.id,
        title: formData.title,
        category: formData.category,
        location: formData.location,
        description: formData.description,
        photos: photoUrls,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      };

      // Save to localStorage
      const complaints = JSON.parse(localStorage.getItem('sudhaar-complaints') || '[]');
      complaints.push(complaint);
      localStorage.setItem('sudhaar-complaints', JSON.stringify(complaints));

      toast({
        title: t('complaint.submitted'),
        description: `${t('complaint.id')}: ${complaint.id}`
      });

      navigate('/complaints');
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to submit complaint',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-4">Please login to submit a complaint</p>
            <Button onClick={() => navigate('/auth')}>Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('complaint.new')}</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">{t('complaint.title')}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of the issue"
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">{t('complaint.category')}</Label>
              <Select
                value={formData.category}
                onValueChange={(value: ComplaintCategory) => 
                  setFormData(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">{t('complaint.location')}</Label>
              <div className="flex space-x-2">
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter address or landmark"
                  className={errors.location ? 'border-destructive' : ''}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={requestLocation}
                  title="Get current location"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t('complaint.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed description of the issue (minimum 20 characters)"
                rows={4}
                className={errors.description ? 'border-destructive' : ''}
              />
              <p className="text-sm text-muted-foreground">
                {formData.description.length}/20 characters minimum
              </p>
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            {/* Photos */}
            <div className="space-y-2">
              <Label>{t('complaint.photos')}</Label>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={formData.photos.length >= 5}
                    className="flex items-center space-x-2"
                  >
                    <Camera className="h-4 w-4" />
                    <span>{t('complaint.addPhotos')}</span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.photos.length}/5 photos
                  </span>
                </div>

                {/* Photo Grid */}
                {photoPreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {photoPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  {t('complaint.minPhotos')} - {t('complaint.maxPhotos')}
                </p>
                {errors.photos && <p className="text-sm text-destructive">{errors.photos}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? t('common.loading') : t('complaint.submit')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};