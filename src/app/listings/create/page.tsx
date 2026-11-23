'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCampusStore } from '@/lib/store/campus-store';
import { ListingCategory, ConditionLevel, ListingMode } from '@/lib/types';
import { suggestListingDetails } from '@/lib/ai/listing-assistant';
import { formatCurrency } from '@/lib/utils';
import {
  Sparkles,
  Camera,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  Upload,
  AlertCircle,
  BookOpen,
  DollarSign,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export default function CreateListingPage() {
  const router = useRouter();
  const { createListing, pickupPoints, activeUser } = useCampusStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiNotice, setShowAiNotice] = useState(false);

  // Form State
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  ]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ListingCategory>('textbooks');
  const [subject, setSubject] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [branchCompatibility, setBranchCompatibility] = useState<string[]>(['CSE']);
  const [semesterCompatibility, setSemesterCompatibility] = useState<number[]>([4]);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [edition, setEdition] = useState('');
  const [condition, setCondition] = useState<ConditionLevel>('good');
  const [conditionNotes, setConditionNotes] = useState('');
  const [listingType, setListingType] = useState<ListingMode>('sell');
  const [price, setPrice] = useState<number>(250);
  const [deposit, setDeposit] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(900);
  const [maxLendingDays, setMaxLendingDays] = useState<number>(30);
  const [description, setDescription] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState(activeUser.whatsappNumber || '+919876543210');
  const [pickupPointPreferenceId, setPickupPointPreferenceId] = useState(pickupPoints[0]?.id || 'pickup-lib');

  // Trigger AI Auto-Fill
  const handleAiAutoFill = (inputToUse?: string) => {
    const query = inputToUse || aiPrompt || title;
    if (!query) return;

    setIsAiLoading(true);
    setTimeout(() => {
      const suggestion = suggestListingDetails(query);
      setTitle(suggestion.title);
      setCategory(suggestion.category);
      setSubject(suggestion.subject);
      if (suggestion.author) setAuthor(suggestion.author);
      if (suggestion.isbn) setIsbn(suggestion.isbn);
      if (suggestion.edition) setEdition(suggestion.edition);
      setBranchCompatibility(suggestion.branchCompatibility);
      setSemesterCompatibility(suggestion.semesterCompatibility);
      setDescription(suggestion.description);
      setPrice(suggestion.suggestedPrice);
      setOriginalPrice(suggestion.originalPriceEstimate);
      setConditionNotes(suggestion.conditionNotesTemplate);

      setIsAiLoading(false);
      setShowAiNotice(true);
    }, 400);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages([event.target.result as string, ...images]);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const toggleBranch = (b: string) => {
    setBranchCompatibility((prev) =>
      prev.includes(b) ? (prev.length > 1 ? prev.filter((item) => item !== b) : prev) : [...prev, b]
    );
  };

  const toggleSemester = (sem: number) => {
    setSemesterCompatibility((prev) =>
      prev.includes(sem) ? (prev.length > 1 ? prev.filter((item) => item !== sem) : prev) : [...prev, sem]
    );
  };

  const handlePublish = () => {
    const newListing = createListing({
      title: title || 'Academic Resource',
      description: description || 'Academic resource in good condition.',
      category,
      subject: subject || 'General Engineering',
      courseCode: courseCode || 'GEN101',
      branchCompatibility,
      semesterCompatibility,
      academicYear,
      author,
      isbn,
      edition,
      condition,
      conditionNotes,
      listingType,
      price: listingType === 'donate' || listingType === 'free_giveaway' ? 0 : price,
      deposit: listingType === 'borrow' || listingType === 'rent' ? deposit : 0,
      originalPrice,
      maxLendingDays,
      availabilityStatus: 'available',
      images,
      whatsappNumber,
      pickupPointPreferenceId,
    });

    router.push(`/listings/${newListing.id}`);
  };

  const totalSteps = 6;

  return (
    <div className="bg-slate-50/50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            List a Campus Resource
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pass your books, equipment, and lab items forward to fellow students.
          </p>
        </div>

        {/* AI Quick Assistant Bar */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>AI Fast Listing Assistant</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. 'Silberschatz DBMS 6th Edition' or 'Omega Mini Drafter'..."
              className="flex-1 bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={() => handleAiAutoFill()}
              disabled={isAiLoading || !aiPrompt.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors shrink-0"
            >
              {isAiLoading ? 'Analyzing...' : 'Auto-Fill Fields'}
            </button>
          </div>
          {showAiNotice && (
            <div className="text-[11px] text-emerald-800 bg-white/80 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>AI-generated suggestions applied — please verify details before publishing.</span>
            </div>
          )}
        </div>

        {/* Step Progress Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span className="text-emerald-700">
              {currentStep === 1 && 'Photo Upload'}
              {currentStep === 2 && 'Resource Details'}
              {currentStep === 3 && 'Condition & Notes'}
              {currentStep === 4 && 'Transaction Mode'}
              {currentStep === 5 && 'Price & Campus Pickup'}
              {currentStep === 6 && 'Review & Publish'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP CONTENT CONTAINER */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          {/* STEP 1: Image Upload */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h3 className="font-bold text-base text-slate-900">Upload Photographs</h3>
              <p className="text-xs text-slate-500">
                Clear photographs of the cover, spine, and interior pages increase reservation speed by 4x.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="upload" className="w-full h-full object-cover" />
                    {images.length > 1 && (
                      <button
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-rose-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Upload Box */}
                <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-500 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/30">
                  <Camera className="w-6 h-6 text-emerald-600 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">Add Photo</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG up to 5MB</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {/* Sample Photo Presets for Quick Demo */}
              <div className="pt-2">
                <span className="text-xs text-slate-500 block mb-2 font-medium">Or choose quick photo presets:</span>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setImages(['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'])}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg"
                  >
                    📚 Textbook Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => setImages(['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'])}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg"
                  >
                    📐 Drawing Kit Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => setImages(['https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80'])}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg"
                  >
                    🔢 Calculator Preset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Resource Details */}
          {currentStep === 2 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h3 className="font-bold text-base text-slate-900">Resource Information</h3>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Listing Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Database System Concepts (6th Edition)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Resource Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ListingCategory)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none capitalize"
                  >
                    <option value="textbooks">Textbooks</option>
                    <option value="reference_books">Reference Books</option>
                    <option value="engineering_drawing">Engineering Drawing Tools</option>
                    <option value="calculators">Calculators</option>
                    <option value="lab_coats">Lab Coats & Safety Gear</option>
                    <option value="electronics_kits">Electronics & IoT Kits</option>
                    <option value="notes">Handwritten Notes & Guides</option>
                    <option value="other">Other Academic Resources</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Subject Name *</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Database Management Systems"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Course Code</label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g. CS204"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Author / Brand</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Korth & Silberschatz"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">ISBN / Edition</label>
                  <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    placeholder="e.g. 978-0073523323"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Branch compatibility tags */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">
                  Compatible Academic Branches:
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['CSE', 'ECE', 'MECH', 'CIVIL', 'EE'].map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => toggleBranch(b)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        branchCompatibility.includes(b)
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Semester compatibility tags */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">
                  Compatible Semesters:
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleSemester(s)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all ${
                        semesterCompatibility.includes(s)
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Condition & Description */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h3 className="font-bold text-base text-slate-900">Resource Condition</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { value: 'like_new', label: 'Like New', desc: 'No marks, crisp spine' },
                  { value: 'good', label: 'Good', desc: 'Light pencil notes, fully intact' },
                  { value: 'fair', label: 'Fair', desc: 'Highlighted or minor wear' },
                  { value: 'heavily_used', label: 'Heavily Used', desc: 'Dog-eared, readable' },
                  { value: 'new', label: 'Brand New', desc: 'Unopened / unused' },
                ].map((c) => (
                  <button
                    type="button"
                    key={c.value}
                    onClick={() => setCondition(c.value as ConditionLevel)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      condition === c.value
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs">{c.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5">{c.desc}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Condition Notes (Honest details build campus trust):
                </label>
                <input
                  type="text"
                  value={conditionNotes}
                  onChange={(e) => setConditionNotes(e.target.value)}
                  placeholder="e.g. Pencil underlines in Chapter 4, clean covers"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Full Description:
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share how this book helped you in exams, any tips, or included extras..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Mode of Transaction */}
          {currentStep === 4 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h3 className="font-bold text-base text-slate-900">How would you like to share this?</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: 'sell', label: 'Sell Resource', desc: 'Junior buys and keeps the item' },
                  { value: 'borrow', label: 'Lend / Borrow', desc: 'Borrow for semester with refundable deposit' },
                  { value: 'donate', label: 'Free Giveaway / Donate', desc: '₹0 free to any junior in need' },
                  { value: 'exchange', label: 'Semester Book Exchange', desc: 'Swap with another core subject book' },
                ].map((m) => (
                  <button
                    type="button"
                    key={m.value}
                    onClick={() => setListingType(m.value as ListingMode)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      listingType === m.value
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-sm font-bold">{m.label}</div>
                    <div className="text-xs text-slate-500 font-normal mt-1">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Pricing & Pickup Point */}
          {currentStep === 5 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h3 className="font-bold text-base text-slate-900">Pricing & Campus Meeting Point</h3>

              {listingType !== 'donate' && listingType !== 'free_giveaway' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">
                      Your Price (₹ INR):
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">
                      New Retail Reference Price (₹ INR):
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Helps juniors see how much they save vs bookstore.
                    </span>
                  </div>
                </div>
              )}

              {/* Refundable deposit for lend/borrow */}
              {(listingType === 'borrow' || listingType === 'rent') && (
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Refundable Security Deposit (₹ INR):
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Returned to borrower once item is handed back in good condition.
                  </span>
                </div>
              )}

              {/* Preferred Campus Pickup Point */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Preferred Designated Pickup Point:
                </label>
                <select
                  value={pickupPointPreferenceId}
                  onChange={(e) => setPickupPointPreferenceId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {pickupPoints.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.name} — {pt.building}
                    </option>
                  ))}
                </select>
              </div>

              {/* WhatsApp Notification & Handover Coordination Number */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Your WhatsApp Number (for Direct Borrow / Request Alerts):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-xs">📱 WA:</span>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-16 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  When another student clicks &quot;Borrow Now&quot; or requests your resource, a direct notification is sent to this WhatsApp number.
                </span>
              </div>
            </div>
          )}

          {/* STEP 6: Review & Publish */}
          {currentStep === 6 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h3 className="font-bold text-base text-slate-900">Review & Confirmation</h3>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex gap-4 items-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={images[0]} alt="preview" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{title || 'Resource Title'}</h4>
                    <div className="text-xs text-slate-500">{subject} • {courseCode}</div>
                    <div className="flex gap-2 items-center pt-1">
                      <span className="text-emerald-700 font-extrabold text-sm">
                        {listingType === 'donate' ? 'FREE' : formatCurrency(price)}
                      </span>
                      <span className="text-[10px] uppercase font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                        {condition}
                      </span>
                      <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {listingType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                  <strong>Campus Pickup Point:</strong>{' '}
                  {pickupPoints.find((p) => p.id === pickupPointPreferenceId)?.name || 'Central Library'}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>By listing, you agree to verified on-campus physical handover using OTP protocol.</span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s + 1)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Publish Listing</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
