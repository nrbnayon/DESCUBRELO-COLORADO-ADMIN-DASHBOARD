import type { GenericDataItem } from "../types/dynamicTableTypes";

export interface UserDataItem extends GenericDataItem {
  // Basic Information
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone?: string;
  username: string;

  // Personal Details
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  nationality?: string;

  // Address Information
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;

  // Professional Information
  role: "admin" | "manager" | "editor" | "user" | "viewer";
  department: string;
  position?: string;
  employeeId?: string;
  manager?: string;
  salary?: number;
  joinDate: string;

  // Account Details
  status: "active" | "inactive" | "suspended" | "pending";
  accountType: "free" | "premium" | "enterprise";
  subscription?: "monthly" | "yearly" | "lifetime";

  // Permissions & Access
  permissions: string[];
  accessLevel: "basic" | "standard" | "advanced" | "full";
  lastLogin?: string;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;

  // Activity & Performance
  loginCount?: number;
  lastActivity?: string;
  performance?: number;
  rating?: number;

  // Skills & Interests
  skills?: string[];
  languages?: string[];
  interests?: string[];

  // Social & Communication
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  preferredCommunication?: "email" | "phone" | "slack" | "teams";

  // System Fields
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  notes?: string;
  tags?: string[];
  isActive: boolean;
}

// Sample user data
export const usersData: UserDataItem[] = [
  {
    id: "user-001",
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40&text=JD",
    email: "john.doe@company.com",
    phone: "+1-555-0123",
    username: "johndoe",

    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-05-15",
    gender: "male",
    nationality: "American",

    address: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    country: "United States",
    zipCode: "10001",

    role: "admin",
    department: "Engineering",
    position: "Senior Software Engineer",
    employeeId: "EMP-001",
    manager: "Jane Smith",
    salary: 95000,
    joinDate: "2022-01-15",

    status: "active",
    accountType: "enterprise",
    subscription: "yearly",

    permissions: ["read", "write", "delete", "admin"],
    accessLevel: "full",
    lastLogin: "2024-01-15T10:30:00Z",
    isEmailVerified: true,
    isTwoFactorEnabled: true,

    loginCount: 245,
    lastActivity: "2024-01-15T14:22:00Z",
    performance: 92,
    rating: 4.8,

    skills: ["React", "TypeScript", "Node.js", "AWS", "Docker"],
    languages: ["English", "Spanish"],
    interests: ["Technology", "Photography", "Travel"],

    socialMedia: {
      linkedin: "https://linkedin.com/in/johndoe",
      twitter: "https://twitter.com/johndoe",
      github: "https://github.com/johndoe",
    },
    preferredCommunication: "email",

    createdAt: "2022-01-15T09:00:00Z",
    updatedAt: "2024-01-15T14:22:00Z",
    createdBy: "system",
    notes: "Excellent performance, team lead material",
    tags: ["senior", "team-lead", "full-stack"],
    isActive: true,
  },
  {
    id: "user-002",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40&text=JS",
    email: "jane.smith@company.com",
    phone: "+1-555-0124",
    username: "janesmith",

    firstName: "Jane",
    lastName: "Smith",
    dateOfBirth: "1988-09-22",
    gender: "female",
    nationality: "Canadian",

    address: "456 Oak Avenue",
    city: "San Francisco",
    state: "CA",
    country: "United States",
    zipCode: "94102",

    role: "manager",
    department: "Design",
    position: "UX Design Manager",
    employeeId: "EMP-002",
    manager: "Robert Wilson",
    salary: 105000,
    joinDate: "2021-08-20",

    status: "active",
    accountType: "enterprise",
    subscription: "yearly",

    permissions: ["read", "write", "manage"],
    accessLevel: "advanced",
    lastLogin: "2024-01-14T16:45:00Z",
    isEmailVerified: true,
    isTwoFactorEnabled: true,

    loginCount: 189,
    lastActivity: "2024-01-14T17:30:00Z",
    performance: 88,
    rating: 4.6,

    skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
    languages: ["English", "French"],
    interests: ["Design", "Art", "Music"],

    socialMedia: {
      linkedin: "https://linkedin.com/in/janesmith",
      twitter: "https://twitter.com/janesmith",
    },
    preferredCommunication: "slack",

    createdAt: "2021-08-20T09:00:00Z",
    updatedAt: "2024-01-14T17:30:00Z",
    createdBy: "hr-system",
    notes: "Great team management skills",
    tags: ["manager", "design", "leadership"],
    isActive: true,
  },
  {
    id: "user-003",
    name: "Mike Johnson",
    avatar: "/placeholder.svg?height=40&width=40&text=MJ",
    email: "mike.johnson@company.com",
    phone: "+1-555-0125",
    username: "mikejohnson",

    firstName: "Mike",
    lastName: "Johnson",
    dateOfBirth: "1992-03-10",
    gender: "male",
    nationality: "British",

    address: "789 Pine Street",
    city: "Chicago",
    state: "IL",
    country: "United States",
    zipCode: "60601",

    role: "user",
    department: "Marketing",
    position: "Marketing Specialist",
    employeeId: "EMP-003",
    manager: "Sarah Davis",
    salary: 65000,
    joinDate: "2023-03-10",

    status: "active",
    accountType: "premium",
    subscription: "monthly",

    permissions: ["read", "write"],
    accessLevel: "standard",
    lastLogin: "2024-01-13T11:20:00Z",
    isEmailVerified: true,
    isTwoFactorEnabled: false,

    loginCount: 87,
    lastActivity: "2024-01-13T15:45:00Z",
    performance: 75,
    rating: 4.2,

    skills: ["SEO", "Content Marketing", "Google Analytics", "Social Media"],
    languages: ["English"],
    interests: ["Marketing", "Sports", "Gaming"],

    socialMedia: {
      linkedin: "https://linkedin.com/in/mikejohnson",
      twitter: "https://twitter.com/mikejohnson",
    },
    preferredCommunication: "email",

    createdAt: "2023-03-10T09:00:00Z",
    updatedAt: "2024-01-13T15:45:00Z",
    createdBy: "hr-system",
    notes: "Promising new hire, needs mentoring",
    tags: ["new-hire", "marketing", "potential"],
    isActive: true,
  },
  {
    id: "user-004",
    name: "Sarah Davis",
    avatar: "/placeholder.svg?height=40&width=40&text=SD",
    email: "sarah.davis@company.com",
    phone: "+1-555-0126",
    username: "sarahdavis",

    firstName: "Sarah",
    lastName: "Davis",
    dateOfBirth: "1985-11-18",
    gender: "female",
    nationality: "American",

    address: "321 Elm Street",
    city: "Austin",
    state: "TX",
    country: "United States",
    zipCode: "73301",

    role: "manager",
    department: "Sales",
    position: "Sales Director",
    employeeId: "EMP-004",
    salary: 120000,
    joinDate: "2020-06-01",

    status: "active",
    accountType: "enterprise",
    subscription: "yearly",

    permissions: ["read", "write", "manage", "report"],
    accessLevel: "advanced",
    lastLogin: "2024-01-15T08:15:00Z",
    isEmailVerified: true,
    isTwoFactorEnabled: true,

    loginCount: 312,
    lastActivity: "2024-01-15T12:30:00Z",
    performance: 95,
    rating: 4.9,

    skills: ["Sales Strategy", "CRM", "Team Leadership", "Negotiation"],
    languages: ["English", "Spanish"],
    interests: ["Business", "Fitness", "Reading"],

    socialMedia: {
      linkedin: "https://linkedin.com/in/sarahdavis",
    },
    preferredCommunication: "phone",

    createdAt: "2020-06-01T09:00:00Z",
    updatedAt: "2024-01-15T12:30:00Z",
    createdBy: "hr-system",
    notes: "Top performer, excellent leadership",
    tags: ["top-performer", "sales", "director"],
    isActive: true,
  },
  {
    id: "user-005",
    name: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40&text=DW",
    email: "david.wilson@company.com",
    phone: "+1-555-0127",
    username: "davidwilson",

    firstName: "David",
    lastName: "Wilson",
    dateOfBirth: "1993-07-25",
    gender: "male",
    nationality: "Australian",

    address: "654 Maple Avenue",
    city: "Seattle",
    state: "WA",
    country: "United States",
    zipCode: "98101",

    role: "editor",
    department: "Content",
    position: "Content Editor",
    employeeId: "EMP-005",
    manager: "Lisa Brown",
    salary: 58000,
    joinDate: "2023-09-15",

    status: "inactive",
    accountType: "premium",
    subscription: "monthly",

    permissions: ["read", "write", "edit"],
    accessLevel: "standard",
    lastLogin: "2024-01-10T14:20:00Z",
    isEmailVerified: true,
    isTwoFactorEnabled: false,

    loginCount: 45,
    lastActivity: "2024-01-10T16:45:00Z",
    performance: 68,
    rating: 3.8,

    skills: ["Content Writing", "Editing", "SEO", "WordPress"],
    languages: ["English"],
    interests: ["Writing", "Literature", "Movies"],

    socialMedia: {
      twitter: "https://twitter.com/davidwilson",
    },
    preferredCommunication: "email",

    createdAt: "2023-09-15T09:00:00Z",
    updatedAt: "2024-01-10T16:45:00Z",
    createdBy: "hr-system",
    notes: "On leave, performance review needed",
    tags: ["on-leave", "content", "review-needed"],
    isActive: false,
  },
];
