import { ConditionLevel, ListingCategory, ListingMode } from '../types';

export interface AIListingSuggestion {
  title: string;
  category: ListingCategory;
  subject: string;
  author?: string;
  isbn?: string;
  edition?: string;
  branchCompatibility: string[];
  semesterCompatibility: number[];
  description: string;
  suggestedPrice: number;
  originalPriceEstimate: number;
  conditionNotesTemplate: string;
}

export function suggestListingDetails(userInput: string): AIListingSuggestion {
  const query = userInput.toLowerCase();

  if (query.includes('dbms') || query.includes('database') || query.includes('korth')) {
    return {
      title: 'Database System Concepts (6th Edition) – Silberschatz, Korth, Sudarshan',
      category: 'textbooks',
      subject: 'Database Management Systems',
      author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
      isbn: '978-0073523323',
      edition: '6th Edition',
      branchCompatibility: ['CSE', 'IT', 'ECE'],
      semesterCompatibility: [4, 5],
      description: 'Prescribed textbook for CSE 4th semester DBMS course. Minimal pencil highlights on Chapter 3 & 4 (Relational Model & SQL). Clean pages, no torn leaves, binding is firm and crisp.',
      suggestedPrice: 250,
      originalPriceEstimate: 900,
      conditionNotesTemplate: 'Light pencil notes in SQL chapters, covers laminated with clear plastic.',
    };
  }

  if (query.includes('algo') || query.includes('cormen') || query.includes('clrs')) {
    return {
      title: 'Introduction to Algorithms (CLRS 3rd Edition)',
      category: 'textbooks',
      subject: 'Design and Analysis of Algorithms',
      author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
      isbn: '978-0262033848',
      edition: '3rd Edition',
      branchCompatibility: ['CSE', 'IT'],
      semesterCompatibility: [4, 5, 6],
      description: 'The definitive algorithms bible. Essential for Design & Analysis of Algorithms (DAA) and coding interview prep. All 35 chapters intact with complete pseudocode diagrams.',
      suggestedPrice: 380,
      originalPriceEstimate: 1250,
      conditionNotesTemplate: 'Virtually brand new. No pen marks, pristine spine.',
    };
  }

  if (query.includes('drafter') || query.includes('drawing')) {
    return {
      title: 'Omega Deluxe Mini Drafter with Unbreakable Scale & Hard Carry Bag',
      category: 'engineering_drawing',
      subject: 'Engineering Graphics & Drawing',
      branchCompatibility: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EE'],
      semesterCompatibility: [1, 2],
      description: 'Standard engineering drawing mini drafter with steel clamp, smooth rotating protractor head, and clear acrylic scales. Approved for 1st/2nd semester Engineering Graphics.',
      suggestedPrice: 300,
      originalPriceEstimate: 850,
      conditionNotesTemplate: 'Scales are zero-scratched. Locking screws hold tight at all angles.',
    };
  }

  if (query.includes('calculator') || query.includes('casio') || query.includes('991')) {
    return {
      title: 'Casio fx-991EX ClassWiz Scientific Calculator (552 Functions)',
      category: 'calculators',
      subject: 'Engineering Mathematics & Physics',
      branchCompatibility: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EE'],
      semesterCompatibility: [1, 2, 3, 4, 5, 6, 7, 8],
      description: 'High-resolution natural textbook display. Handles 4x4 matrix calculations, equation solvers, QR code graph generation, numerical integration and derivatives. Approved for university semester exams.',
      suggestedPrice: 650,
      originalPriceEstimate: 1595,
      conditionNotesTemplate: 'Solar panel and battery working 100%. Hard slide-on cover included.',
    };
  }

  if (query.includes('lab coat')) {
    return {
      title: 'White Pure Cotton Chemistry/Workshop Lab Coat (Size 38 M)',
      category: 'lab_coats',
      subject: 'Engineering Chemistry & Material Labs',
      branchCompatibility: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EE'],
      semesterCompatibility: [1, 2],
      description: 'Sturdy 100% white cotton lab coat with 3 front pockets and durable buttons. Freshly laundered and ironed. Mandatory for 1st Year Chemistry and Material Science labs.',
      suggestedPrice: 150,
      originalPriceEstimate: 420,
      conditionNotesTemplate: 'No chemical stains or burns. Only worn for 1 semester lab sessions.',
    };
  }

  // Generic intelligent suggestion fallback
  return {
    title: userInput.charAt(0).toUpperCase() + userInput.slice(1),
    category: 'textbooks',
    subject: 'Core Engineering Curriculum',
    branchCompatibility: ['CSE', 'ECE', 'MECH'],
    semesterCompatibility: [3, 4],
    description: `Academic resource for university coursework: ${userInput}. Well-maintained and ready for another semester of use.`,
    suggestedPrice: 200,
    originalPriceEstimate: 600,
    conditionNotesTemplate: 'Clean pages, gently used with standard highlights.',
  };
}
