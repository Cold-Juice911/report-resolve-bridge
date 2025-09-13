export interface Complaint {
  id: string;
  userId: string;
  title: string;
  category: ComplaintCategory;
  location: string;
  description: string;
  photos: string[];
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  messages: ComplaintMessage[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type ComplaintCategory = 
  | 'roads'
  | 'water'
  | 'sewage'
  | 'garbage'
  | 'streetLight'
  | 'publicHealth'
  | 'infrastructure'
  | 'others';

export type ComplaintStatus = 
  | 'pending'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export interface ComplaintMessage {
  id: string;
  type: 'user' | 'admin';
  message: string;
  timestamp: string;
  adminId?: string;
  attachments?: string[];
}

export interface ComplaintFormData {
  title: string;
  category: ComplaintCategory;
  location: string;
  description: string;
  photos: File[];
}