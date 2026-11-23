export type UserRole = 'student' | 'moderator' | 'admin';

export type ListingCategory =
  | 'textbooks'
  | 'reference_books'
  | 'engineering_drawing'
  | 'calculators'
  | 'lab_coats'
  | 'lab_equipment'
  | 'electronics_kits'
  | 'project_kits'
  | 'notes'
  | 'study_guides'
  | 'stationery'
  | 'other';

export type ConditionLevel =
  | 'new'
  | 'like_new'
  | 'good'
  | 'fair'
  | 'heavily_used';

export type ListingMode =
  | 'sell'
  | 'borrow'
  | 'rent'
  | 'lend'
  | 'exchange'
  | 'donate'
  | 'free_giveaway';

export type ListingStatus = 'available' | 'reserved' | 'exchanged' | 'closed';

export type RequestStatus =
  | 'AVAILABLE'
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'RESERVED'
  | 'HANDOVER_PENDING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'RETURN_PENDING'
  | 'RETURNED'
  | 'DISPUTED';

export interface Campus {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  domain: string;
  activeListingsCount: number;
  studentsCount: number;
  totalSavingsRupees: number;
}

export interface Department {
  id: string;
  campusId: string;
  name: string;
  code: string;
  semestersCount: number;
}

export interface PickupPoint {
  id: string;
  campusId: string;
  name: string;
  building: string;
  description: string;
  operatingHours: string;
  accessibility: string;
  meetingInstructions: string;
  isSafeZone: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  campusId: string;
  campusName: string;
  department: string;
  branch: string;
  semester: number;
  studentId: string;
  isVerified: boolean;
  rating: number;
  totalRatings: number;
  completedExchanges: number;
  responseRatePercent: number;
  memberSince: string;
  bio: string;
  badges: string[];
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: ListingCategory;
  subject: string;
  courseCode: string;
  branchCompatibility: string[];
  semesterCompatibility: number[];
  academicYear: string;
  author?: string;
  isbn?: string;
  edition?: string;
  condition: ConditionLevel;
  conditionNotes?: string;
  listingType: ListingMode;
  price: number; // in INR ₹
  deposit?: number; // for borrow/rent
  originalPrice?: number; // for savings calculation e.g. new price ₹900
  maxLendingDays?: number;
  availabilityStatus: ListingStatus;
  images: string[];
  ownerId: string;
  owner: {
    id: string;
    name: string;
    avatar: string;
    department: string;
    branch: string;
    semester: number;
    isVerified: boolean;
    rating: number;
    completedExchanges: number;
  };
  campusId: string;
  pickupPointPreferenceId?: string;
  pickupPointPreferenceName?: string;
  createdAt: string;
  updatedAt: string;
  viewsCount: number;
  savesCount: number;
}

export interface RequestReservation {
  id: string;
  listingId: string;
  listing: Listing;
  requesterId: string;
  requester: User;
  ownerId: string;
  owner: User;
  requestedMode: ListingMode;
  status: RequestStatus;
  proposedPickupPointId: string;
  proposedPickupPointName: string;
  confirmedPickupPointId?: string;
  confirmedPickupPointName?: string;
  proposedPickupTime: string;
  confirmedPickupTime?: string;
  requesterMessage?: string;
  ownerMessage?: string;
  handoverCode?: string; // 6-digit one time code
  handoverCodeExpiresAt?: string;
  handoverAttempts: number;
  returnDueDate?: string;
  returnHandoverCode?: string;
  returnConfirmedAt?: string;
  disputeReason?: string;
  disputeNotes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface ChatMessage {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface WishlistItem {
  id: string;
  userId: string;
  title: string;
  subject: string;
  category: ListingCategory;
  branch: string;
  semester: number;
  budgetMax: number;
  preferredCondition?: ConditionLevel;
  matchedListingId?: string;
  matchScorePercent?: number;
  createdAt: string;
}

export interface Review {
  id: string;
  requestId: string;
  listingId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  revieweeId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'listing' | 'user';
  targetId: string;
  targetTitle: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  resolutionNote?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'acceptance' | 'handover' | 'wishlist' | 'message' | 'system';
  link: string;
  isRead: boolean;
  createdAt: string;
}

export interface ImpactStats {
  totalSavingsRupees: number;
  resourcesReusedCount: number;
  completedTransactionsCount: number;
  booksCirculatedCount: number;
  labKitsReusedCount: number;
  itemsDonatedCount: number;
  activeListingsCount: number;
  participatingStudentsCount: number;
  co2AvoidedKg: number;
  waterSavedLiters: number;
  treesSavedEstimate: number;
}
