'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  Listing,
  RequestReservation,
  WishlistItem,
  Review,
  Report,
  NotificationItem,
  ImpactStats,
  PickupPoint,
  ListingMode,
  RequestStatus,
} from '../types';
import {
  SEED_CAMPUS,
  SEED_PICKUP_POINTS,
  SEED_USERS,
  SEED_LISTINGS,
  SEED_WISHLISTS,
  SEED_REVIEWS,
  SEED_NOTIFICATIONS,
  SEED_IMPACT_STATS,
} from '../data/seed-data';

interface CampusStoreContextType {
  activeUser: User;
  switchUser: (userId: string) => void;
  users: Record<string, User>;
  pickupPoints: PickupPoint[];
  listings: Listing[];
  requests: RequestReservation[];
  wishlists: WishlistItem[];
  reviews: Review[];
  reports: Report[];
  notifications: NotificationItem[];
  impactStats: ImpactStats;
  
  // Listing Actions
  createListing: (data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'savesCount' | 'owner' | 'campusId' | 'ownerId'>) => Listing;
  updateListing: (id: string, data: Partial<Listing>) => boolean;
  deleteListing: (id: string) => boolean;
  getListingById: (id: string) => Listing | undefined;

  // Reservation / Handover Actions
  createRequest: (params: {
    listingId: string;
    mode: ListingMode;
    pickupPointId: string;
    pickupTime: string;
    message?: string;
  }) => { success: boolean; request?: RequestReservation; error?: string };
  acceptRequest: (requestId: string, confirmedPickupTime?: string, confirmedPickupPointId?: string) => { success: boolean; error?: string };
  rejectRequest: (requestId: string, reason?: string) => { success: boolean; error?: string };
  cancelRequest: (requestId: string) => { success: boolean; error?: string };
  verifyHandoverCode: (requestId: string, enteredCode: string) => { success: boolean; error?: string };
  initiateReturn: (requestId: string) => { success: boolean; error?: string };
  confirmReturn: (requestId: string, returnCode: string) => { success: boolean; error?: string };

  // Chat Actions
  chatMessages: Record<string, Array<{ id: string; senderId: string; senderName: string; content: string; createdAt: string }>>;
  sendChatMessage: (requestId: string, content: string) => void;

  // Wishlist Actions
  addWishlistItem: (item: Omit<WishlistItem, 'id' | 'userId' | 'createdAt' | 'matchedListingId' | 'matchScorePercent'>) => WishlistItem;
  removeWishlistItem: (id: string) => void;

  // Review Actions
  addReview: (params: { requestId: string; listingId: string; revieweeId: string; rating: number; comment: string }) => void;

  // Moderation Actions
  reportItem: (params: { targetType: 'listing' | 'user'; targetId: string; targetTitle: string; reason: string; description: string }) => void;
  resolveReport: (reportId: string, resolutionNote: string) => void;

  // Notification Actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Demo Controls
  resetDemoData: () => void;
  isDemoMode: boolean;
  toggleCampusVerification: (userId: string) => void;
}

const STORAGE_KEY = 'campusloop_state_v2';

const CampusStoreContext = createContext<CampusStoreContextType | null>(null);

export const CampusStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string>('user-aarav'); // Default to Aarav (Requester)
  const [users, setUsers] = useState<Record<string, User>>(SEED_USERS);
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>(SEED_PICKUP_POINTS);
  const [listings, setListings] = useState<Listing[]>(SEED_LISTINGS);
  const [requests, setRequests] = useState<RequestReservation[]>([]);
  const [wishlists, setWishlists] = useState<WishlistItem[]>(SEED_WISHLISTS);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(SEED_NOTIFICATIONS);
  const [impactStats, setImpactStats] = useState<ImpactStats>(SEED_IMPACT_STATS);
  const [chatMessages, setChatMessages] = useState<Record<string, Array<{ id: string; senderId: string; senderName: string; content: string; createdAt: string }>>>({});

  // Initialize from LocalStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.listings && parsed.users) {
          setUsers(parsed.users);
          setListings(parsed.listings);
          setRequests(parsed.requests || []);
          setWishlists(parsed.wishlists || SEED_WISHLISTS);
          setReviews(parsed.reviews || SEED_REVIEWS);
          setReports(parsed.reports || []);
          setNotifications(parsed.notifications || SEED_NOTIFICATIONS);
          setImpactStats(parsed.impactStats || SEED_IMPACT_STATS);
          // Deduplicate chat messages by id to prevent React key collisions
          const rawChat: Record<string, Array<{ id: string; senderId: string; senderName: string; content: string; createdAt: string }>> = parsed.chatMessages || {};
          const dedupedChat = Object.fromEntries(
            Object.entries(rawChat).map(([key, msgs]) => [
              key,
              Array.from(new Map(msgs.map((m) => [m.id, m])).values()),
            ])
          );
          setChatMessages(dedupedChat);
          if (parsed.activeUserId) setActiveUserId(parsed.activeUserId);
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved state, using seed defaults', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const payload = {
        activeUserId,
        users,
        listings,
        requests,
        wishlists,
        reviews,
        reports,
        notifications,
        impactStats,
        chatMessages,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to sync to localStorage', e);
    }
  }, [isLoaded, activeUserId, users, listings, requests, wishlists, reviews, reports, notifications, impactStats, chatMessages]);

  const activeUser = users[activeUserId] || SEED_USERS['user-aarav'];

  const switchUser = useCallback((userId: string) => {
    if (users[userId]) {
      setActiveUserId(userId);
    }
  }, [users]);

  const toggleCampusVerification = useCallback((userId: string) => {
    setUsers((prev) => {
      const u = prev[userId];
      if (!u) return prev;
      return {
        ...prev,
        [userId]: { ...u, isVerified: !u.isVerified },
      };
    });
  }, []);

  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUsers(SEED_USERS);
    setPickupPoints(SEED_PICKUP_POINTS);
    setListings(SEED_LISTINGS);
    setRequests([]);
    setWishlists(SEED_WISHLISTS);
    setReviews(SEED_REVIEWS);
    setReports([]);
    setNotifications(SEED_NOTIFICATIONS);
    setImpactStats(SEED_IMPACT_STATS);
    setChatMessages({});
    setActiveUserId('user-aarav');
  }, []);

  const getListingById = useCallback((id: string) => {
    return listings.find((l) => l.id === id);
  }, [listings]);

  // Create Listing
  const createListing = useCallback((data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'savesCount' | 'owner' | 'campusId' | 'ownerId'>) => {
    const pickupPoint = pickupPoints.find((p) => p.id === data.pickupPointPreferenceId);
    const newId = `list-${Date.now()}`;
    const newListing: Listing = {
      ...data,
      id: newId,
      ownerId: activeUser.id,
      whatsappNumber: data.whatsappNumber || activeUser.whatsappNumber || '+919876543210',
      owner: {
        id: activeUser.id,
        name: activeUser.name,
        avatar: activeUser.avatar,
        department: activeUser.department,
        branch: activeUser.branch,
        semester: activeUser.semester,
        isVerified: activeUser.isVerified,
        rating: activeUser.rating,
        completedExchanges: activeUser.completedExchanges,
      },
      campusId: activeUser.campusId,
      pickupPointPreferenceName: pickupPoint ? pickupPoint.name : 'Central Library Entrance',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsCount: 1,
      savesCount: 0,
      availabilityStatus: 'available',
    };

    setListings((prev) => [newListing, ...prev]);

    // Check matching wishlists
    wishlists.forEach((w) => {
      const titleMatch = newListing.title.toLowerCase().includes(w.title.toLowerCase()) || w.title.toLowerCase().includes(newListing.subject.toLowerCase());
      const branchMatch = newListing.branchCompatibility.includes(w.branch);
      const budgetMatch = newListing.price <= w.budgetMax;
      if (titleMatch && budgetMatch) {
        const notif: NotificationItem = {
          id: `notif-${Date.now()}-${w.userId}`,
          userId: w.userId,
          title: 'New Wishlist Match!',
          message: `"${newListing.title}" was just listed for ₹${newListing.price}. Matches your wishlist!`,
          type: 'wishlist',
          link: `/listings/${newListing.id}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        setNotifications((prevN) => [notif, ...prevN]);
      }
    });

    setImpactStats((prev) => ({
      ...prev,
      activeListingsCount: prev.activeListingsCount + 1,
    }));

    return newListing;
  }, [activeUser, pickupPoints, wishlists]);

  const updateListing = useCallback((id: string, data: Partial<Listing>) => {
    let updated = false;
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          updated = true;
          return { ...item, ...data, updatedAt: new Date().toISOString() };
        }
        return item;
      })
    );
    return updated;
  }, []);

  const deleteListing = useCallback((id: string) => {
    let deleted = false;
    setListings((prev) => {
      const exists = prev.some((l) => l.id === id);
      if (exists) {
        deleted = true;
        return prev.filter((l) => l.id !== id);
      }
      return prev;
    });
    return deleted;
  }, []);

  // Request & Reservation Engine (Concurrency-Safe)
  const createRequest = useCallback((params: {
    listingId: string;
    mode: ListingMode;
    pickupPointId: string;
    pickupTime: string;
    message?: string;
  }) => {
    const listing = listings.find((l) => l.id === params.listingId);
    if (!listing) return { success: false, error: 'Listing not found.' };
    if (listing.availabilityStatus !== 'available') {
      return { success: false, error: 'This resource is currently reserved or unavailable.' };
    }
    if (listing.ownerId === activeUser.id) {
      return { success: false, error: 'You cannot request your own listed resource.' };
    }

    // Check existing pending request from same requester
    const existingReq = requests.find(
      (r) => r.listingId === params.listingId && r.requesterId === activeUser.id && ['REQUESTED', 'ACCEPTED', 'HANDOVER_PENDING'].includes(r.status)
    );
    if (existingReq) {
      return { success: false, error: 'You already have an active request for this resource.' };
    }

    const pickupPoint = pickupPoints.find((p) => p.id === params.pickupPointId);
    const owner = users[listing.ownerId] || SEED_USERS['user-priya'];
    const newRequestId = `req-${Date.now()}`;

    const newRequest: RequestReservation = {
      id: newRequestId,
      listingId: listing.id,
      listing,
      requesterId: activeUser.id,
      requester: activeUser,
      ownerId: listing.ownerId,
      owner,
      requestedMode: params.mode,
      status: 'REQUESTED',
      proposedPickupPointId: params.pickupPointId,
      proposedPickupPointName: pickupPoint ? pickupPoint.name : 'Central Library Entrance',
      proposedPickupTime: params.pickupTime,
      requesterMessage: params.message || 'Hi, I would like to reserve this item for pickup on campus.',
      handoverAttempts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);

    // Initial system message in chat
    setChatMessages((prev) => ({
      ...prev,
      [newRequestId]: [
        {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          senderId: activeUser.id,
          senderName: activeUser.name,
          content: params.message || `Hi! I submitted a request for "${listing.title}". Proposed pickup: ${newRequest.proposedPickupPointName} at ${params.pickupTime}.`,
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    // Notification to owner
    const notif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId: owner.id,
      title: 'New Resource Request!',
      message: `${activeUser.name} requested "${listing.title}". Review and accept handover schedule.`,
      type: 'request',
      link: `/transactions/${newRequestId}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true, request: newRequest };
  }, [listings, activeUser, requests, pickupPoints, users]);

  // Accept Request
  const acceptRequest = useCallback((requestId: string, confirmedPickupTime?: string, confirmedPickupPointId?: string) => {
    let result: { success: boolean; error?: string } = { success: false };

    setRequests((prevReqs) => {
      const target = prevReqs.find((r) => r.id === requestId);
      if (!target) {
        result = { success: false, error: 'Request not found.' };
        return prevReqs;
      }
      if (target.ownerId !== activeUser.id) {
        result = { success: false, error: 'Unauthorized: Only the resource owner can accept this request.' };
        return prevReqs;
      }
      if (target.status !== 'REQUESTED') {
        result = { success: false, error: `Invalid status: Request is already ${target.status}.` };
        return prevReqs;
      }

      // Generate a secure 6-digit OTP handover code
      const handoverCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(); // 48h validity
      const pickupPt = pickupPoints.find((p) => p.id === confirmedPickupPointId) || pickupPoints.find((p) => p.id === target.proposedPickupPointId);

      const updatedTarget: RequestReservation = {
        ...target,
        status: 'HANDOVER_PENDING',
        confirmedPickupPointId: pickupPt?.id || target.proposedPickupPointId,
        confirmedPickupPointName: pickupPt?.name || target.proposedPickupPointName,
        confirmedPickupTime: confirmedPickupTime || target.proposedPickupTime,
        handoverCode,
        handoverCodeExpiresAt: expiresAt,
        updatedAt: new Date().toISOString(),
      };

      // Atomically update listing availability status
      setListings((prevListings) =>
        prevListings.map((l) => (l.id === target.listingId ? { ...l, availabilityStatus: 'reserved' } : l))
      );

      // Auto-decline any concurrent pending requests for the same listing
      const updatedReqs = prevReqs.map((r) => {
        if (r.id === requestId) return updatedTarget;
        if (r.listingId === target.listingId && r.status === 'REQUESTED') {
          return {
            ...r,
            status: 'REJECTED' as RequestStatus,
            ownerMessage: 'Resource was accepted for another student reservation.',
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      });

      // Notify Requester
      const notif: NotificationItem = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        userId: target.requesterId,
        title: 'Request Accepted! Handover Scheduled',
        message: `${activeUser.name} accepted your request for "${target.listing.title}". Your 6-digit pickup code is ready.`,
        type: 'acceptance',
        link: `/transactions/${requestId}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [notif, ...prev]);

      // System chat announcement
      setChatMessages((prevMsgs) => ({
        ...prevMsgs,
        [requestId]: [
          ...(prevMsgs[requestId] || []),
          {
            id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            senderId: activeUser.id,
            senderName: activeUser.name,
            content: `Accepted! Pickup confirmed at ${updatedTarget.confirmedPickupPointName} around ${updatedTarget.confirmedPickupTime}. Bring your one-time verification code.`,
            createdAt: new Date().toISOString(),
          },
        ],
      }));

      result = { success: true };
      return updatedReqs;
    });

    return result;
  }, [activeUser, pickupPoints]);

  // Reject Request
  const rejectRequest = useCallback((requestId: string, reason?: string) => {
    let result: { success: boolean; error?: string } = { success: false };
    setRequests((prev) => {
      const target = prev.find((r) => r.id === requestId);
      if (!target) {
        result = { success: false, error: 'Request not found.' };
        return prev;
      }
      if (target.ownerId !== activeUser.id) {
        result = { success: false, error: 'Unauthorized.' };
        return prev;
      }

      result = { success: true };
      return prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'REJECTED' as RequestStatus, ownerMessage: reason || 'Owner declined request.', updatedAt: new Date().toISOString() }
          : r
      );
    });
    return result;
  }, [activeUser]);

  // Cancel Request
  const cancelRequest = useCallback((requestId: string) => {
    let result: { success: boolean; error?: string } = { success: false };
    setRequests((prev) => {
      const target = prev.find((r) => r.id === requestId);
      if (!target) {
        result = { success: false, error: 'Request not found.' };
        return prev;
      }
      if (target.requesterId !== activeUser.id && target.ownerId !== activeUser.id) {
        result = { success: false, error: 'Unauthorized.' };
        return prev;
      }

      // If was reserved, release listing back to available
      setListings((lPrev) =>
        lPrev.map((l) => (l.id === target.listingId ? { ...l, availabilityStatus: 'available' } : l))
      );

      result = { success: true };
      return prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'CANCELLED' as RequestStatus, updatedAt: new Date().toISOString() }
          : r
      );
    });
    return result;
  }, [activeUser]);

  // Verify Handover Code & Complete Exchange
  const verifyHandoverCode = useCallback((requestId: string, enteredCode: string) => {
    let result: { success: boolean; error?: string } = { success: false };

    setRequests((prevReqs) => {
      const target = prevReqs.find((r) => r.id === requestId);
      if (!target) {
        result = { success: false, error: 'Request not found.' };
        return prevReqs;
      }

      // Check authorization: Owner verifies code given by requester
      if (target.ownerId !== activeUser.id && activeUser.role !== 'admin') {
        result = { success: false, error: 'Only the resource owner or admin can verify the handover code.' };
        return prevReqs;
      }

      if (target.status !== 'HANDOVER_PENDING' && target.status !== 'ACCEPTED') {
        result = { success: false, error: `Invalid status for handover: currently ${target.status}.` };
        return prevReqs;
      }

      // Attempt limit protection
      if (target.handoverAttempts >= 5) {
        result = { success: false, error: 'Max verification attempts exceeded. Please contact campus moderator.' };
        return prevReqs;
      }

      // Check code matching
      const cleanedEntered = enteredCode.trim();
      if (cleanedEntered !== target.handoverCode) {
        result = { success: false, error: 'Invalid 6-digit code. Please verify the code displayed on requester screen.' };
        return prevReqs.map((r) => (r.id === requestId ? { ...r, handoverAttempts: r.handoverAttempts + 1 } : r));
      }

      // Successful verification! Determine next state:
      // If it's a borrow/lend, status becomes RETURN_PENDING with due date.
      // If it's a sell/donate/giveaway/exchange, status becomes COMPLETED.
      const isBorrow = target.requestedMode === 'borrow' || target.requestedMode === 'lend';
      const nextStatus: RequestStatus = isBorrow ? 'RETURN_PENDING' : 'COMPLETED';
      const returnDueDate = isBorrow ? new Date(Date.now() + (target.listing.maxLendingDays || 30) * 86400000).toISOString() : undefined;
      const returnCode = isBorrow ? Math.floor(100000 + Math.random() * 900000).toString() : undefined;

      const completedTarget: RequestReservation = {
        ...target,
        status: nextStatus,
        returnDueDate,
        returnHandoverCode: returnCode,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mark listing status
      setListings((lPrev) =>
        lPrev.map((l) => (l.id === target.listingId ? { ...l, availabilityStatus: isBorrow ? 'reserved' : 'exchanged' } : l))
      );

      // Calculate actual student money saved:
      const originalPrice = target.listing.originalPrice || target.listing.price * 2;
      const actualSavings = Math.max(0, originalPrice - target.listing.price);

      // Increment User completed stats
      setUsers((uPrev) => {
        const reqUser = uPrev[target.requesterId];
        const ownUser = uPrev[target.ownerId];
        return {
          ...uPrev,
          ...(reqUser ? { [reqUser.id]: { ...reqUser, completedExchanges: reqUser.completedExchanges + 1 } } : {}),
          ...(ownUser ? { [ownUser.id]: { ...ownUser, completedExchanges: ownUser.completedExchanges + 1 } } : {}),
        };
      });

      // Update Campus Impact metrics
      setImpactStats((iPrev) => ({
        ...iPrev,
        totalSavingsRupees: iPrev.totalSavingsRupees + actualSavings,
        resourcesReusedCount: iPrev.resourcesReusedCount + 1,
        completedTransactionsCount: iPrev.completedTransactionsCount + 1,
        booksCirculatedCount: ['textbooks', 'reference_books', 'notes'].includes(target.listing.category) ? iPrev.booksCirculatedCount + 1 : iPrev.booksCirculatedCount,
        labKitsReusedCount: ['engineering_drawing', 'calculators', 'lab_coats', 'electronics_kits'].includes(target.listing.category) ? iPrev.labKitsReusedCount + 1 : iPrev.labKitsReusedCount,
        co2AvoidedKg: Number((iPrev.co2AvoidedKg + 2.5).toFixed(1)),
        waterSavedLiters: iPrev.waterSavedLiters + 50,
      }));

      // Notifications
      const notifReq: NotificationItem = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}-1`,
        userId: target.requesterId,
        title: 'Handover Completed! 🎉',
        message: `Exchange verified with ${activeUser.name}. You saved ₹${actualSavings}! Don't forget to leave feedback.`,
        type: 'handover',
        link: `/transactions/${requestId}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      const notifOwn: NotificationItem = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}-2`,
        userId: target.ownerId,
        title: 'Handover Completed! 🎉',
        message: `Handover verified for "${target.listing.title}". Thank you for giving resources another semester!`,
        type: 'handover',
        link: `/transactions/${requestId}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((nPrev) => [notifReq, notifOwn, ...nPrev]);

      result = { success: true };
      return prevReqs.map((r) => (r.id === requestId ? completedTarget : r));
    });

    return result;
  }, [activeUser]);

  // Initiate Return (for borrowed items)
  const initiateReturn = useCallback((requestId: string) => {
    let result: { success: boolean; error?: string } = { success: false };
    setRequests((prev) => {
      const target = prev.find((r) => r.id === requestId);
      if (!target) return prev;
      result = { success: true };
      return prev.map((r) => (r.id === requestId ? { ...r, status: 'RETURN_PENDING' as RequestStatus, updatedAt: new Date().toISOString() } : r));
    });
    return result;
  }, []);

  // Confirm Return
  const confirmReturn = useCallback((requestId: string, returnCode: string) => {
    let result: { success: boolean; error?: string } = { success: false };
    setRequests((prev) => {
      const target = prev.find((r) => r.id === requestId);
      if (!target) return prev;
      if (target.returnHandoverCode && returnCode.trim() !== target.returnHandoverCode) {
        result = { success: false, error: 'Incorrect return verification code.' };
        return prev;
      }
      setListings((lPrev) => lPrev.map((l) => (l.id === target.listingId ? { ...l, availabilityStatus: 'available' } : l)));
      result = { success: true };
      return prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'RETURNED' as RequestStatus, returnConfirmedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          : r
      );
    });
    return result;
  }, []);

  // Chat message send
  const sendChatMessage = useCallback((requestId: string, content: string) => {
    if (!content.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      senderId: activeUser.id,
      senderName: activeUser.name,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    setChatMessages((prev) => ({
      ...prev,
      [requestId]: [...(prev[requestId] || []), newMsg],
    }));
  }, [activeUser]);

  // Wishlist Actions
  const addWishlistItem = useCallback((item: Omit<WishlistItem, 'id' | 'userId' | 'createdAt' | 'matchedListingId' | 'matchScorePercent'>) => {
    const newId = `wish-${Date.now()}`;
    // Check if any current listing matches immediately
    const matched = listings.find(
      (l) =>
        l.availabilityStatus === 'available' &&
        l.price <= item.budgetMax &&
        (l.title.toLowerCase().includes(item.title.toLowerCase()) || l.subject.toLowerCase().includes(item.subject.toLowerCase()))
    );

    const newItem: WishlistItem = {
      ...item,
      id: newId,
      userId: activeUser.id,
      matchedListingId: matched ? matched.id : undefined,
      matchScorePercent: matched ? 96 : undefined,
      createdAt: new Date().toISOString(),
    };

    setWishlists((prev) => [newItem, ...prev]);
    return newItem;
  }, [activeUser, listings]);

  const removeWishlistItem = useCallback((id: string) => {
    setWishlists((prev) => prev.filter((w) => w.id !== id));
  }, []);

  // Reviews
  const addReview = useCallback((params: { requestId: string; listingId: string; revieweeId: string; rating: number; comment: string }) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      requestId: params.requestId,
      listingId: params.listingId,
      reviewerId: activeUser.id,
      reviewerName: activeUser.name,
      reviewerAvatar: activeUser.avatar,
      revieweeId: params.revieweeId,
      rating: params.rating,
      comment: params.comment,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);

    // Recalculate reviewee average rating
    setUsers((uPrev) => {
      const targetUser = uPrev[params.revieweeId];
      if (!targetUser) return uPrev;
      const allReviewsForUser = [...reviews.filter((r) => r.revieweeId === params.revieweeId), newReview];
      const avg = Number((allReviewsForUser.reduce((acc, r) => acc + r.rating, 0) / allReviewsForUser.length).toFixed(1));
      return {
        ...uPrev,
        [params.revieweeId]: {
          ...targetUser,
          rating: avg,
          totalRatings: allReviewsForUser.length,
        },
      };
    });
  }, [activeUser, reviews]);

  // Reports
  const reportItem = useCallback((params: { targetType: 'listing' | 'user'; targetId: string; targetTitle: string; reason: string; description: string }) => {
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      reporterId: activeUser.id,
      reporterName: activeUser.name,
      targetType: params.targetType,
      targetId: params.targetId,
      targetTitle: params.targetTitle,
      reason: params.reason,
      description: params.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);
  }, [activeUser]);

  const resolveReport = useCallback((reportId: string, resolutionNote: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved', resolutionNote } : r))
    );
  }, []);

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  return (
    <CampusStoreContext.Provider
      value={{
        activeUser,
        switchUser,
        users,
        pickupPoints,
        listings,
        requests,
        wishlists,
        reviews,
        reports,
        notifications,
        impactStats,
        createListing,
        updateListing,
        deleteListing,
        getListingById,
        createRequest,
        acceptRequest,
        rejectRequest,
        cancelRequest,
        verifyHandoverCode,
        initiateReturn,
        confirmReturn,
        chatMessages,
        sendChatMessage,
        addWishlistItem,
        removeWishlistItem,
        addReview,
        reportItem,
        resolveReport,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
        isDemoMode: true,
        toggleCampusVerification,
      }}
    >
      {children}
    </CampusStoreContext.Provider>
  );
};

export const useCampusStore = () => {
  const context = useContext(CampusStoreContext);
  if (!context) {
    throw new Error('useCampusStore must be used within a CampusStoreProvider');
  }
  return context;
};
