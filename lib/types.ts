export type Role = 'client' | 'developer' | 'admin' | 'pm';

export type AcademicLevel = 'Undergraduate' | 'Masters' | 'PhD' | 'Professional';

export type ProjectCategory =
  | 'Web Development'
  | 'Mobile App'
  | 'Machine Learning'
  | 'Data Analysis'
  | 'IoT'
  | 'Blockchain'
  | 'Cloud Computing'
  | 'Cybersecurity'
  | 'Other';

export interface User {
  id: string; // UUID
  name: string;
  email: string;
  role: Role;
  status?: 'onboarding' | 'pending' | 'approved' | 'rejected' | 'suspended';
  avatar?: string;
  university?: string;
  location?: string;

  // Profile
  headline?: string;
  bio?: string;
  companyName?: string;
  phone?: string;
  linkedin?: string;
  github?: string;

  // Managed Developer Network Fields (Internal)
  internal_rating?: number;
  hourly_rate?: number;
  vetting_status?: 'new' | 'interviewing' | 'verified' | 'probation' | 'gold';
  nda_signed?: boolean;
  public_alias?: string;

  balance?: number;
  created_at?: string;
  updated_at?: string;

  // For UI display helpers
  link?: string;
  reviews?: Review[];
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrls: string[];
  link?: string;
}

export interface Review {
  id: number;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  user_id?: string; // Who was reviewed
  reviewer_id?: string; // Who wrote it
}

export interface Message {
  id: number;
  senderId: string; // UUID
  receiverId: string; // UUID
  projectId?: number;
  content: string;
  read: boolean;
  isInternal?: boolean;
  timestamp: string;
}

export interface Meeting {
  id: number;
  hostId: string; // UUID
  hostName: string;
  attendeeId: string; // UUID
  attendeeName: string;
  title: string;
  startTime: string; // ISO string
  durationMinutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  link?: string;
}

export interface Notification {
  id: number;
  userId: string; // UUID
  type: 'message' | 'task' | 'system';
  content: string;
  link?: string;
  read: boolean;
  timestamp: string;
}

export interface Transaction {
  id: number;
  userId: string; // UUID
  type: 'credit' | 'debit';
  category: 'deposit' | 'payout' | 'refund' | 'fee';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
  reference?: string;
}

// Client Facing Project
export interface Project {
  id: number;
  clientId: string; // UUID
  clientName?: string; // Mapped for UI
  managerId?: string; // Assigned Admin

  title: string;
  description: string;
  requirements: string;

  budget: number; // Client Budget
  timeline: string;
  level: AcademicLevel;
  category: ProjectCategory;
  skills: string[];
  urgent: boolean;

  status: 'requested' | 'scoping' | 'active' | 'review' | 'completed' | 'cancelled';
  flyerUrl?: string;
  location?: string;

  createdAt: string;
}

// Internal Work Unit
export interface Task {
  id: number;
  projectId: number;
  assigneeId?: string; // Developer UUID

  title: string;
  description: string; // Technical Instructions
  status: 'open' | 'assigned' | 'in_progress' | 'qa_ready' | 'completed' | 'blocked';

  budgetPayout: number; // Developer Pay
  dueDate?: string;

  createdAt: string;
}

export interface QALog {
  id: number;
  taskId: number;
  reviewerId: string;
  status: 'pass' | 'fail' | 'warning';
  notes: string;
  createdAt: string;
}

// Form Data Helpers
export interface ProjectFormData {
  title: string;
  level: string;
  category: string;
  description: string;
  requirements: string;
  budget: string;
  timeline: string;
  skills: string;
  urgent: boolean;
  location: string;
  flyer: File | null;
}
