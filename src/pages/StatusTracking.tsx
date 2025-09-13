import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, Calendar, MapPin } from 'lucide-react';
import { Complaint, ComplaintCategory, ComplaintStatus } from '@/types/complaint';

export const StatusTracking = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      const allComplaints = JSON.parse(localStorage.getItem('sudhaar-complaints') || '[]');
      const userComplaints = allComplaints.filter((complaint: Complaint) => complaint.userId === user.id);
      setComplaints(userComplaints);
      setFilteredComplaints(userComplaints);
    }
  }, [user]);

  useEffect(() => {
    let filtered = complaints;

    // Search by ID or title
    if (searchQuery) {
      filtered = filtered.filter(complaint => 
        complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === statusFilter);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.category === categoryFilter);
    }

    setFilteredComplaints(filtered);
  }, [complaints, searchQuery, statusFilter, categoryFilter]);

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

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  const categories: ComplaintCategory[] = ['roads', 'water', 'sewage', 'garbage', 'streetLight', 'publicHealth', 'infrastructure', 'others'];
  const statuses: ComplaintStatus[] = ['pending', 'in_progress', 'resolved', 'rejected'];

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
        <h1 className="text-3xl font-bold mb-2">{t('nav.status')}</h1>
        <p className="text-muted-foreground">{t('status.trackingDescription')}</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t('common.filters')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('status.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('status.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {t(`status.${status}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('status.filterByCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {t(`categories.${category}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters}>
              {t('common.clearFilters')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">{t('status.noResults')}</h3>
              <p className="text-muted-foreground">{t('status.tryDifferentFilters')}</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {t('status.showingResults', { count: filteredComplaints.length, total: complaints.length })}
              </p>
            </div>
            
            {filteredComplaints.map((complaint) => (
              <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{complaint.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {t('common.id')}: {complaint.id}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(complaint.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {complaint.location}
                        </span>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(complaint.status)}>
                      {t(`status.${complaint.status}`)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground capitalize">
                      {t(`categories.${complaint.category}`)}
                    </span>
                    {complaint.messages.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {t('status.lastUpdate')}: {formatDate(complaint.updatedAt)}
                      </span>
                    )}
                  </div>

                  {complaint.messages.length > 0 && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium mb-1">{t('status.latestUpdate')}</p>
                      <p className="text-sm text-muted-foreground">
                        {complaint.messages[complaint.messages.length - 1].message}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
};