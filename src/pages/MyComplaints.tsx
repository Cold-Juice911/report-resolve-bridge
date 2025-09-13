import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Camera, MessageSquare } from 'lucide-react';
import { Complaint } from '@/types/complaint';

export const MyComplaints = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    if (user) {
      const allComplaints = JSON.parse(localStorage.getItem('sudhaar-complaints') || '[]');
      const userComplaints = allComplaints.filter((complaint: Complaint) => complaint.userId === user.id);
      setComplaints(userComplaints);
    }
  }, [user]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in_progress': return 'default';
      case 'resolved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('nav.myComplaints')}</h1>
        <p className="text-muted-foreground">{t('complaints.myComplaintsDescription')}</p>
      </div>

      {complaints.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">{t('complaints.noComplaints')}</h3>
            <p className="text-muted-foreground mb-4">{t('complaints.createFirst')}</p>
            <Button asChild>
              <a href="/complaint/new">{t('nav.newComplaint')}</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {complaints.map((complaint) => (
            <Card key={complaint.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{complaint.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span className="capitalize">{t(`categories.${complaint.category}`)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(complaint.createdAt)}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(complaint.status)}>
                    {t(`status.${complaint.status}`)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4" />
                  {complaint.location}
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {complaint.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Camera className="h-4 w-4" />
                    {complaint.photos.length} {t('complaints.photos')}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(complaint)}>
                        {t('complaints.viewDetails')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{selectedComplaint?.title}</DialogTitle>
                      </DialogHeader>
                      {selectedComplaint && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge variant={getStatusBadgeVariant(selectedComplaint.status)}>
                              {t(`status.${selectedComplaint.status}`)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              ID: {selectedComplaint.id}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">{t('complaints.category')}</h4>
                            <p className="capitalize">{t(`categories.${selectedComplaint.category}`)}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">{t('complaints.location')}</h4>
                            <p>{selectedComplaint.location}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">{t('complaints.description')}</h4>
                            <p>{selectedComplaint.description}</p>
                          </div>

                          {selectedComplaint.photos.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">{t('complaints.photos')}</h4>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {selectedComplaint.photos.map((photo, index) => (
                                  <img
                                    key={index}
                                    src={photo}
                                    alt={`Complaint photo ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-md border"
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedComplaint.messages.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">{t('complaints.adminResponses')}</h4>
                              <div className="space-y-3">
                                {selectedComplaint.messages.map((message) => (
                                  <div key={message.id} className="bg-muted p-3 rounded-md">
                                    <div className="flex items-center justify-between mb-2">
                                      <Badge variant="outline">
                                        {message.type === 'admin' ? t('common.admin') : t('common.user')}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {formatDate(message.timestamp)}
                                      </span>
                                    </div>
                                    <p className="text-sm">{message.message}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};