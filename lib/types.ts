export type Role = 'client' | 'developer' | 'admin';

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
  status?: 'pending' | 'approved' | 'rejected' | 'suspended';
  avatar?: string; // Emoji char
  university?: string;
  location?: string;

  // Detailed Info (Onboarding)
  headline?: string;
  phone?: string;
  linkedin?: string;
  github?: string;

  // Stats
  projectsPosted?: number;
  activeProjects?: number;
  proposalsReceived?: number;
  completedProjects?: number;
  proposalsSent?: number;
  acceptedProposals?: number;
  successRate?: number;
  totalEarnings?: number;
  // Reputation
  reviews?: Review[];
  rating?: number; // 0-5
  // User Preferences
  savedProjectIds?: number[]; // Projects still use BigInt/number IDs
  balance?: number;
  pendingBalance?: number;
  bio?: string;
  portfolio?: PortfolioItem[];
  created_at?: string;
  updated_at?: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrls: string[]; // Updated for multiple images
  link?: string;
}

export interface Message {
  id: number;
  senderId: string; // UUID
  receiverId: string; // UUID
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Contract {
  id: number;
  projectId: number;
  projectTitle: string;
  clientId: string; // UUID
  clientName: string;
  developerId: string; // UUID
  developerName: string;
  amount: number;
  startDate: string;
  status: 'active' | 'completed' | 'terminated';
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
  link?: string; // e.g., Google Meet link
}

export interface Review {
  id: number;
  reviewerId: string; // UUID
  reviewerName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  projectId: number;
}

export interface Notification {
  id: number;
  userId: string; // UUID
  type: 'message' | 'proposal' | 'contract' | 'system';
  content: string;
  link?: string;
  read: boolean;
  timestamp: string;
}

export interface Transaction {
  id: number;
  userId: string; // UUID
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}

export interface Proposal {
  id: number;
  developerId: string; // UUID
  developerName: string;
  developerAvatar: string;
  coverLetter: string;
  amount: number;
  timeline: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Project {
  id: number;
  title: string;
  description: string;
  requirements: string;
  budget: number;
  timeline: string;
  level: AcademicLevel;
  category: ProjectCategory;
  skills: string[];
  urgent: boolean;
  status: 'open' | 'in_progress' | 'completed' | 'pending_approval' | 'rejected';
  createdAt: string;

  // Client info
  clientId: string; // UUID
  clientName: string;
  university?: string;

  // Proposals
  proposals: Proposal[];

  // New Fields
  flyerUrl?: string; // Optional URL for flyer
  location?: string; // Optional preferred location
}

// ... existing code ...

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

  // New Fields
  location: string;
  flyer: File | null; // For handling file upload in state
}

export interface FilterState {
  level: string;
  category: string;
  budget: string;
  status: string;
}
