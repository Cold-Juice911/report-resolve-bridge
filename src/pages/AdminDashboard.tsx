import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, Clock, XCircle, Users, BarChart3, Calendar, MessageSquare } from 'lucide-react';
import { Complaint, ComplaintStatus } from '@/types/complaint';
import { useToast } from '@/hooks/use-toast';

export const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('pending');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = () => {
    const allComplaints = JSON.parse(localStorage.getItem('sudhaar-complaints') || '[]');
    setComplaints(allComplaints);
  };

  const getStatusStats = () => {
    const pending = complaints.filter(c => c.status === 'pending').length;
    const inProgress = complaints.filter(c => c.status === 'in_progress').length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const rejected = complaints.filter(c => c.status === 'rejected').length;
    
    return { pending, inProgress, resolved, rejected, total: complaints.length };
  };

  const getCategoryStats = () => {
    const categories = ['roads', 'water', 'sewage', 'garbage', 'streetLight', 'publicHealth', 'infrastructure', 'others'];
    return categories.map(category => ({
      category,
      count: complaints.filter(c => c.category === category).length
    }));
  };

  const getFilteredComplaints = () => {
    if (categoryFilter === 'all') return complaints;
    return complaints.filter(c => c.category === categoryFilter);
  };

  const handleStatusUpdate = (complaint: Complaint) => {
    if (!responseMessage.trim()) {
      toast({
        title: t('common.error'),
        description: t('admin.responseRequired'),
        variant: 'destructive',
      });
      return;
    }

    const updatedComplaints = complaints.map(c => {
      if (c.id === complaint.id) {
        const updatedComplaint = {
          ...c,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          messages: [
            ...c.messages,
            {
              id: `msg-${Date.now()}`,
              type: 'admin' as const,
              message: responseMessage,
              timestamp: new Date().toISOString(),
              adminId: user?.id
            }
          ]
        };
        return updatedComplaint;
      }
      return c;
    });

    localStorage.setItem('sudhaar-complaints', JSON.stringify(updatedComplaints));
    setComplaints(updatedComplaints);
    setSelectedComplaint(null);
    setResponseMessage('');
    setNewStatus('pending');

    toast({
      title: t('admin.updateSuccess'),
      description: t('admin.complaintUpdated'),
    });
  };

  const getStatusBadgeVariant = (status: ComplaintStatus) => {
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

  const stats = getStatusStats();
  const categoryStats = getCategoryStats();
  const filteredComplaints = getFilteredComplaints();

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('admin.accessDenied')}</h1>
          <p className="text-muted-foreground">{t('admin.adminOnly')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('nav.adminDashboard')}</h1>
        <p className="text-muted-foreground">{t('admin.dashboardDescription')}</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">{t('admin.overview')}</TabsTrigger>
          <TabsTrigger value="complaints">{t('admin.complaints')}</TabsTrigger>
          <TabsTrigger value="responded">{t('admin.responded')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('status.pending')}</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('status.in_progress')}</p>
                    <p className="text-2xl font-bold">{stats.inProgress}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('status.resolved')}</p>
                    <p className="text-2xl font-bold">{stats.resolved}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('admin.total')}</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.categoryBreakdown')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categoryStats.map(({ category, count }) => (
                  <div key={category} className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-sm font-medium text-muted-foreground capitalize">
                      {t(`categories.${category}`)}
                    </p>
                    <p className="text-xl font-bold">{count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints" className="space-y-6">
          {/* Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Label>{t('admin.filterByCategory')}</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="roads">{t('categories.roads')}</SelectItem>
                    <SelectItem value="water">{t('categories.water')}</SelectItem>
                    <SelectItem value="sewage">{t('categories.sewage')}</SelectItem>
                    <SelectItem value="garbage">{t('categories.garbage')}</SelectItem>
                    <SelectItem value="streetLight">{t('categories.streetLight')}</SelectItem>
                    <SelectItem value="publicHealth">{t('categories.publicHealth')}</SelectItem>
                    <SelectItem value="infrastructure">{t('categories.infrastructure')}</SelectItem>
                    <SelectItem value="others">{t('categories.others')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Complaints List */}
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{complaint.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {t('common.id')}: {complaint.id} • {formatDate(complaint.createdAt)}
                      </p>
                      <p className="text-sm capitalize">
                        {t(`categories.${complaint.category}`)} • {complaint.location}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(complaint.status)}>
                      {t(`status.${complaint.status}`)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {complaint.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {complaint.messages.length} {t('admin.responses')}
                    </span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setNewStatus(complaint.status);
                          }}
                        >
                          {t('admin.manage')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{selectedComplaint?.title}</DialogTitle>
                        </DialogHeader>
                        {selectedComplaint && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <Label>{t('common.id')}</Label>
                                <p>{selectedComplaint.id}</p>
                              </div>
                              <div>
                                <Label>{t('complaints.category')}</Label>
                                <p className="capitalize">{t(`categories.${selectedComplaint.category}`)}</p>
                              </div>
                              <div className="col-span-2">
                                <Label>{t('complaints.location')}</Label>
                                <p>{selectedComplaint.location}</p>
                              </div>
                            </div>

                            <div>
                              <Label>{t('complaints.description')}</Label>
                              <p className="text-sm mt-1">{selectedComplaint.description}</p>
                            </div>

                            {selectedComplaint.photos.length > 0 && (
                              <div>
                                <Label>{t('complaints.photos')}</Label>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                  {selectedComplaint.photos.map((photo, index) => (
                                    <img
                                      key={index}
                                      src={photo}
                                      alt={`Complaint photo ${index + 1}`}
                                      className="w-full h-20 object-cover rounded border"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            <Separator />

                            <div className="space-y-3">
                              <Label>{t('admin.updateStatus')}</Label>
                              <Select value={newStatus} onValueChange={(value: ComplaintStatus) => setNewStatus(value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">{t('status.pending')}</SelectItem>
                                  <SelectItem value="in_progress">{t('status.in_progress')}</SelectItem>
                                  <SelectItem value="resolved">{t('status.resolved')}</SelectItem>
                                  <SelectItem value="rejected">{t('status.rejected')}</SelectItem>
                                </SelectContent>
                              </Select>

                              <div>
                                <Label>{t('admin.responseMessage')}</Label>
                                <Textarea
                                  value={responseMessage}
                                  onChange={(e) => setResponseMessage(e.target.value)}
                                  placeholder={t('admin.responseMessagePlaceholder')}
                                  className="mt-1"
                                  rows={3}
                                />
                              </div>

                              <Button 
                                onClick={() => handleStatusUpdate(selectedComplaint)}
                                className="w-full"
                              >
                                {t('admin.updateComplaint')}
                              </Button>
                            </div>

                            {selectedComplaint.messages.length > 0 && (
                              <>
                                <Separator />
                                <div>
                                  <Label>{t('admin.previousResponses')}</Label>
                                  <div className="space-y-2 mt-2">
                                    {selectedComplaint.messages.map((message) => (
                                      <div key={message.id} className="bg-muted p-3 rounded text-sm">
                                        <div className="flex items-center justify-between mb-1">
                                          <Badge variant="outline">
                                            {message.type === 'admin' ? t('common.admin') : t('common.user')}
                                          </Badge>
                                          <span className="text-xs text-muted-foreground">
                                            {formatDate(message.timestamp)}
                                          </span>
                                        </div>
                                        <p>{message.message}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
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
        </TabsContent>

        <TabsContent value="responded">
          <div className="space-y-4">
            {complaints.filter(c => c.messages.length > 0).map((complaint) => (
              <Card key={complaint.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{complaint.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('common.id')}: {complaint.id} • {formatDate(complaint.updatedAt)}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(complaint.status)}>
                      {t(`status.${complaint.status}`)}
                    </Badge>
                  </div>
                  <div className="bg-muted p-3 rounded">
                    <p className="text-sm font-medium mb-1">{t('admin.lastResponse')}</p>
                    <p className="text-sm">
                      {complaint.messages[complaint.messages.length - 1]?.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};