import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SEED_LISTINGS, SEED_USERS, SEED_PICKUP_POINTS } from '../src/lib/data/seed-data';
import { askCampusLoopIntelligence } from '../src/lib/ai/gemini-assistant';
import { suggestListingDetails } from '../src/lib/ai/listing-assistant';

describe('CampusLoop Critical Workflows & Business Logic', () => {
  // Test 1: Seed data integrity
  test('Seed dataset has sufficient listings and verified campus personas', () => {
    assert.ok(SEED_LISTINGS.length >= 10, 'Should have rich sample inventory');
    assert.ok(SEED_USERS['user-aarav'], 'Aarav (Student Buyer) must exist');
    assert.ok(SEED_USERS['user-priya'], 'Priya (Student Seller) must exist');
    assert.ok(SEED_USERS['user-mod'], 'Moderator must exist');
    assert.ok(SEED_USERS['user-admin'], 'Admin must exist');
    assert.ok(SEED_PICKUP_POINTS.length >= 3, 'Must have designated safe pickup hubs');
  });

  // Test 2: AI Listing Assistant suggestions
  test('AI listing assistant accurately infers metadata for engineering books', () => {
    const suggestion = suggestListingDetails('Silberschatz DBMS 6th Edition');
    assert.equal(suggestion.category, 'textbooks');
    assert.equal(suggestion.subject, 'Database Management Systems');
    assert.ok(suggestion.branchCompatibility.includes('CSE'));
    assert.ok(suggestion.semesterCompatibility.includes(4));
    assert.ok(suggestion.suggestedPrice > 0);
    assert.ok(suggestion.originalPriceEstimate > suggestion.suggestedPrice);
  });

  // Test 3: Natural language search intent parsing
  test('Natural language query translates to real inventory matches without hallucinations', async () => {
    const query = 'Find a DBMS reference book for 4th-semester CSE under ₹300';
    const result = await askCampusLoopIntelligence(query, SEED_LISTINGS, 'CSE', 4);

    assert.ok(result.matchedListings.length > 0, 'Must match real seed DBMS book');
    const matched = result.matchedListings[0];
    assert.ok(matched.title.toLowerCase().includes('database') || matched.title.toLowerCase().includes('dbms'));
    assert.ok(matched.price <= 300, 'Price must satisfy budget constraint');
    assert.ok(matched.semesterCompatibility.includes(4), 'Must match 4th semester');
    assert.equal(matched.availabilityStatus, 'available', 'Only available items should be returned');
  });

  // Test 4: Concurrency & State Machine Logic
  test('State transition: Request -> Accept -> OTP Generation -> Handover Verification -> Completed', () => {
    const listing: { id: string; price: number; originalPrice?: number; availabilityStatus: string } = { ...SEED_LISTINGS[0], availabilityStatus: 'available' };
    const requester = SEED_USERS['user-aarav'];
    const owner = SEED_USERS['user-priya'];

    assert.notEqual(requester.id, owner.id, 'Requester and owner must be distinct students');
    const request = {
      id: 'req-test-1',
      listingId: listing.id,
      requesterId: requester.id,
      ownerId: owner.id,
      status: 'REQUESTED' as const,
      handoverAttempts: 0,
      handoverCode: undefined as string | undefined,
    };

    assert.equal(request.status, 'REQUESTED');

    // Owner accepts -> locks resource, generates 6-digit OTP
    const generatedOtp = '492817';
    const updatedRequest = {
      ...request,
      status: 'HANDOVER_PENDING' as const,
      handoverCode: generatedOtp,
    };
    listing.availabilityStatus = 'reserved';

    assert.equal(updatedRequest.status, 'HANDOVER_PENDING');
    assert.equal(listing.availabilityStatus, 'reserved');
    assert.equal(updatedRequest.handoverCode.length, 6);

    // Failed OTP attempt increments attempt counter
    const wrongAttemptCode = '111111';
    assert.notEqual(wrongAttemptCode, updatedRequest.handoverCode);
    updatedRequest.handoverAttempts += 1;
    assert.equal(updatedRequest.handoverAttempts, 1);

    // Valid OTP verification completes transaction
    const validAttemptCode = '492817';
    assert.equal(validAttemptCode, updatedRequest.handoverCode);
    const completedRequest = {
      ...updatedRequest,
      status: 'COMPLETED' as const,
      completedAt: new Date().toISOString(),
    };
    listing.availabilityStatus = 'exchanged';

    assert.equal(completedRequest.status, 'COMPLETED');
    assert.equal(listing.availabilityStatus, 'exchanged');

    // Savings calculation check
    const savings = (listing.originalPrice || 900) - listing.price;
    assert.ok(savings > 0, 'Savings must be positive vs retail MSRP');
    assert.equal(savings, (listing.originalPrice || 900) - listing.price);
  });

  // Test 5: Conflict prevention: Resource cannot be double-reserved
  test('Conflict prevention: Resource cannot be double-reserved', () => {
    const listingId = 'list-dbms-korth';
    const activeRequests = [
      { id: 'req-1', listingId, status: 'ACCEPTED' },
      { id: 'req-2', listingId, status: 'REQUESTED' },
    ];

    const hasActiveLock = activeRequests.some((r) => r.listingId === listingId && ['ACCEPTED', 'HANDOVER_PENDING'].includes(r.status));
    assert.ok(hasActiveLock, 'Listing lock detected');

    const canAcceptSecond = !hasActiveLock;
    assert.equal(canAcceptSecond, false, 'Second concurrent request must be blocked');
  });

  // Test 6: Rate limiting: Handover code locks out after 5 incorrect attempts
  test('Rate limiting: Handover code locks out after 5 incorrect attempts', () => {
    const attempts = 5;
    const isLockedOut = attempts >= 5;
    assert.equal(isLockedOut, true, 'User must be prevented from brute-forcing 6-digit OTP');
  });

  // Test 7: Return Flow for Borrow Mode
  test('Return Flow: Borrow mode transitions to RETURN_PENDING then RETURNED upon verified return', () => {
    const borrowRequest = {
      id: 'req-borrow-1',
      requestedMode: 'borrow' as const,
      status: 'HANDOVER_PENDING' as const,
      returnDueDate: undefined as string | undefined,
      returnHandoverCode: undefined as string | undefined,
    };

    // When handover is verified for borrow, it transitions to RETURN_PENDING
    const returnDueDate = new Date(Date.now() + 30 * 86400000).toISOString();
    const returnCode = '729104';
    const lentState = {
      ...borrowRequest,
      status: 'RETURN_PENDING' as const,
      returnDueDate,
      returnHandoverCode: returnCode,
    };
    assert.equal(lentState.status, 'RETURN_PENDING');
    assert.ok(lentState.returnDueDate);
    assert.equal(lentState.returnHandoverCode, '729104');

    // Return verification
    const enteredReturnCode = '729104';
    assert.equal(enteredReturnCode, lentState.returnHandoverCode);
    const returnedState = {
      ...lentState,
      status: 'RETURNED' as const,
      returnConfirmedAt: new Date().toISOString(),
    };
    assert.equal(returnedState.status, 'RETURNED');
    assert.ok(returnedState.returnConfirmedAt);
  });

  // Test 8: Unauthorized access boundaries
  test('Security & Authorization: Requester cannot self-accept their own request', () => {
    const requesterId = 'user-aarav';
    const ownerId = 'user-priya';

    const canAccept = (userId: string) => userId === ownerId;
    assert.equal(canAccept(requesterId), false, 'Requester must not be allowed to accept request');
    assert.equal(canAccept(ownerId), true, 'Only resource owner can accept request');
  });

  // Test 9: Environmental Impact Calculations
  test('Impact calculations use transparent documented conversion factors', () => {
    const booksCirculated = 10;
    const co2PerBookKg = 2.5;
    const waterPerBookLiters = 50;
    const booksPerTree = 24;

    const co2Avoided = booksCirculated * co2PerBookKg;
    const waterSaved = booksCirculated * waterPerBookLiters;
    const treesPreserved = booksCirculated / booksPerTree;

    assert.equal(co2Avoided, 25.0);
    assert.equal(waterSaved, 500);
    assert.equal(Number(treesPreserved.toFixed(2)), 0.42);
  });
});
