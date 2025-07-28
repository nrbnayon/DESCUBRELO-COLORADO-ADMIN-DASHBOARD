// config\userTableConfig.ts
import {
  ColumnConfig,
  FormFieldConfig,
  FilterConfig,
  ActionConfig,
  TableConfig,
  EditModalConfig,
} from "@/types/dynamicTableTypes";
import {
  Eye,
  Edit,
  MessageSquare,
  Phone,
  Mail,
  Settings,
  UserCheck,
  UserX,
} from "lucide-react";

// Column Configuration for User Table
export const userColumns: ColumnConfig[] = [
  {
    key: "name",
    label: "User",
    sortable: true,
    searchable: true,
    showAvatar: true,
    width: "250px",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    sortable: true,
    searchable: true,
    width: "200px",
  },
  {
    key: "role",
    label: "Role",
    type: "select",
    sortable: true,
    filterable: true,
    options: [
      { value: "admin", label: "Admin", color: "#dc2626" },
      { value: "manager", label: "Manager", color: "#ea580c" },
      { value: "editor", label: "Editor", color: "#ca8a04" },
      { value: "user", label: "User", color: "#2563eb" },
      { value: "viewer", label: "Viewer", color: "#7c3aed" },
    ],
  },
  {
    key: "department",
    label: "Department",
    sortable: true,
    searchable: true,
    filterable: true,
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    sortable: true,
    filterable: true,
    options: [
      { value: "active", label: "Active", color: "#16a34a" },
      { value: "inactive", label: "Inactive", color: "#ca8a04" },
      { value: "suspended", label: "Suspended", color: "#dc2626" },
      { value: "pending", label: "Pending", color: "#6b7280" },
    ],
  },
  {
    key: "accountType",
    label: "Account Type",
    type: "select",
    sortable: true,
    filterable: true,
    options: [
      { value: "free", label: "Free", color: "#6b7280" },
      { value: "premium", label: "Premium", color: "#2563eb" },
      { value: "enterprise", label: "Enterprise", color: "#dc2626" },
    ],
  },
  {
    key: "performance",
    label: "Performance",
    type: "percentage",
    sortable: true,
    align: "center",
    render: (value) => {
      const numValue = Number(value) || 0;
      const color =
        numValue >= 90 ? "#16a34a" : numValue >= 70 ? "#ca8a04" : "#dc2626";
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full"
              style={{ width: `${numValue}%`, backgroundColor: color }}
            />
          </div>
          <span className="text-sm font-medium">{numValue}%</span>
        </div>
      );
    },
  },
  {
    key: "joinDate",
    label: "Join Date",
    type: "date",
    sortable: true,
    width: "120px",
  },
  {
    key: "lastLogin",
    label: "Last Login",
    type: "datetime-local",
    sortable: true,
    width: "160px",
    render: (value) => {
      if (!value) return <span className="text-gray-400">Never</span>;
      try {
        const date = new Date(value as string);
        const now = new Date();
        const diffDays = Math.floor(
          (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0)
          return <span className="text-green-600 font-medium">Today</span>;
        if (diffDays === 1)
          return <span className="text-yellow-600 font-medium">Yesterday</span>;
        if (diffDays <= 7)
          return (
            <span className="text-orange-600 font-medium">
              {diffDays} days ago
            </span>
          );
        return (
          <span className="text-red-600 font-medium">
            {date.toLocaleDateString()}
          </span>
        );
      } catch {
        return <span className="text-gray-400">Invalid date</span>;
      }
    },
  },
  {
    key: "isEmailVerified",
    label: "Email Verified",
    type: "checkbox",
    align: "center",
    render: (value) => (
      <div className="flex justify-center">
        {value ? (
          <UserCheck className="w-4 h-4 text-green-600" />
        ) : (
          <UserX className="w-4 h-4 text-red-600" />
        )}
      </div>
    ),
  },
];

// Form Field Configuration for User Edit Modal
export const userFormFields: FormFieldConfig[] = [
  // Personal Information Section
  {
    key: "firstName",
    label: "First Name",
    type: "text",
    required: true,
    section: "personal",
    gridCol: "half",
    validation: {
      minLength: 2,
      maxLength: 50,
    },
  },
  {
    key: "lastName",
    label: "Last Name",
    type: "text",
    required: true,
    section: "personal",
    gridCol: "half",
    validation: {
      minLength: 2,
      maxLength: 50,
    },
  },
  {
    key: "email",
    label: "Email Address",
    type: "email",
    required: true,
    section: "personal",
    gridCol: "half",
    validation: {
      pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
    },
  },
  {
    key: "phone",
    label: "Phone Number",
    type: "tel",
    section: "personal",
    gridCol: "half",
    placeholder: "+1-555-0123",
  },
  {
    key: "username",
    label: "Username",
    type: "text",
    required: true,
    section: "personal",
    gridCol: "half",
    validation: {
      minLength: 3,
      maxLength: 20,
      pattern: "^[a-zA-Z0-9_]+$",
    },
  },
  {
    key: "dateOfBirth",
    label: "Date of Birth",
    type: "date",
    section: "personal",
    gridCol: "half",
  },
  {
    key: "gender",
    label: "Gender",
    type: "select",
    section: "personal",
    gridCol: "half",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
      { value: "prefer-not-to-say", label: "Prefer not to say" },
    ],
  },
  {
    key: "avatar",
    label: "Profile Picture",
    type: "file",
    section: "personal",
    gridCol: "full",
    placeholder: "Upload profile picture (max 5MB)",
  },

  // Address Information Section
  {
    key: "address",
    label: "Street Address",
    type: "textarea",
    section: "address",
    gridCol: "full",
    placeholder: "123 Main Street, Apt 4B",
  },
  {
    key: "city",
    label: "City",
    type: "text",
    section: "address",
    gridCol: "third",
  },
  {
    key: "state",
    label: "State/Province",
    type: "text",
    section: "address",
    gridCol: "third",
  },
  {
    key: "zipCode",
    label: "ZIP/Postal Code",
    type: "text",
    section: "address",
    gridCol: "third",
  },
  {
    key: "country",
    label: "Country",
    type: "select",
    section: "address",
    gridCol: "half",
    options: [
      { value: "United States", label: "United States" },
      { value: "Canada", label: "Canada" },
      { value: "United Kingdom", label: "United Kingdom" },
      { value: "Australia", label: "Australia" },
      { value: "Germany", label: "Germany" },
      { value: "France", label: "France" },
      { value: "Other", label: "Other" },
    ],
  },

  // Professional Information Section
  {
    key: "role",
    label: "Role",
    type: "select",
    required: true,
    section: "professional",
    gridCol: "half",
    options: [
      { value: "admin", label: "Admin" },
      { value: "manager", label: "Manager" },
      { value: "editor", label: "Editor" },
      { value: "user", label: "User" },
      { value: "viewer", label: "Viewer" },
    ],
  },
  {
    key: "department",
    label: "Department",
    type: "select",
    required: true,
    section: "professional",
    gridCol: "half",
    options: [
      { value: "Engineering", label: "Engineering" },
      { value: "Design", label: "Design" },
      { value: "Marketing", label: "Marketing" },
      { value: "Sales", label: "Sales" },
      { value: "HR", label: "Human Resources" },
      { value: "Finance", label: "Finance" },
      { value: "Operations", label: "Operations" },
      { value: "Content", label: "Content" },
    ],
  },
  {
    key: "position",
    label: "Position/Title",
    type: "text",
    section: "professional",
    gridCol: "half",
    placeholder: "Senior Software Engineer",
  },
  {
    key: "employeeId",
    label: "Employee ID",
    type: "text",
    section: "professional",
    gridCol: "half",
    placeholder: "EMP-001",
  },
  {
    key: "manager",
    label: "Manager",
    type: "text",
    section: "professional",
    gridCol: "half",
    placeholder: "Manager's name",
  },
  {
    key: "salary",
    label: "Salary",
    type: "currency",
    section: "professional",
    gridCol: "half",
    validation: {
      min: 0,
      max: 1000000,
    },
  },
  {
    key: "joinDate",
    label: "Join Date",
    type: "date",
    required: true,
    section: "professional",
    gridCol: "half",
  },

  // Account & Access Section
  {
    key: "status",
    label: "Account Status",
    type: "select",
    required: true,
    section: "account",
    gridCol: "half",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "suspended", label: "Suspended" },
      { value: "pending", label: "Pending" },
    ],
  },
  {
    key: "accountType",
    label: "Account Type",
    type: "select",
    required: true,
    section: "account",
    gridCol: "half",
    options: [
      { value: "free", label: "Free" },
      { value: "premium", label: "Premium" },
      { value: "enterprise", label: "Enterprise" },
    ],
  },
  {
    key: "accessLevel",
    label: "Access Level",
    type: "select",
    required: true,
    section: "account",
    gridCol: "half",
    options: [
      { value: "basic", label: "Basic" },
      { value: "standard", label: "Standard" },
      { value: "advanced", label: "Advanced" },
      { value: "full", label: "Full" },
    ],
  },
  {
    key: "permissions",
    label: "Permissions",
    type: "multiselect",
    section: "account",
    gridCol: "full",
    options: [
      { value: "read", label: "Read" },
      { value: "write", label: "Write" },
      { value: "edit", label: "Edit" },
      { value: "delete", label: "Delete" },
      { value: "manage", label: "Manage" },
      { value: "admin", label: "Admin" },
      { value: "report", label: "Report" },
    ],
  },
  {
    key: "isEmailVerified",
    label: "Email Verified",
    type: "checkbox",
    section: "account",
    gridCol: "half",
  },
  {
    key: "isTwoFactorEnabled",
    label: "Two-Factor Authentication",
    type: "checkbox",
    section: "account",
    gridCol: "half",
  },

  // Skills & Preferences Section
  {
    key: "skills",
    label: "Skills",
    type: "multiselect",
    section: "skills",
    gridCol: "full",
    options: [
      { value: "React", label: "React" },
      { value: "TypeScript", label: "TypeScript" },
      { value: "Node.js", label: "Node.js" },
      { value: "Python", label: "Python" },
      { value: "AWS", label: "AWS" },
      { value: "Docker", label: "Docker" },
      { value: "Figma", label: "Figma" },
      { value: "Photoshop", label: "Adobe Photoshop" },
      { value: "SEO", label: "SEO" },
      { value: "Content Marketing", label: "Content Marketing" },
      { value: "Sales Strategy", label: "Sales Strategy" },
      { value: "Project Management", label: "Project Management" },
    ],
  },
  {
    key: "languages",
    label: "Languages",
    type: "multiselect",
    section: "skills",
    gridCol: "half",
    options: [
      { value: "English", label: "English" },
      { value: "Spanish", label: "Spanish" },
      { value: "French", label: "French" },
      { value: "German", label: "German" },
      { value: "Chinese", label: "Chinese" },
      { value: "Japanese", label: "Japanese" },
      { value: "Other", label: "Other" },
    ],
  },
  {
    key: "preferredCommunication",
    label: "Preferred Communication",
    type: "select",
    section: "skills",
    gridCol: "half",
    options: [
      { value: "email", label: "Email" },
      { value: "phone", label: "Phone" },
      { value: "slack", label: "Slack" },
      { value: "teams", label: "Microsoft Teams" },
    ],
  },
  {
    key: "notes",
    label: "Notes",
    type: "textarea",
    section: "skills",
    gridCol: "full",
    placeholder: "Additional notes about the user...",
  },
];

// Filter Configuration for User Table
export const userFilters: FilterConfig[] = [
  {
    key: "role",
    label: "Role",
    type: "select",
    options: [
      { value: "admin", label: "Admin" },
      { value: "manager", label: "Manager" },
      { value: "editor", label: "Editor" },
      { value: "user", label: "User" },
      { value: "viewer", label: "Viewer" },
    ],
  },
  {
    key: "department",
    label: "Department",
    type: "select",
    options: [
      { value: "Engineering", label: "Engineering" },
      { value: "Design", label: "Design" },
      { value: "Marketing", label: "Marketing" },
      { value: "Sales", label: "Sales" },
      { value: "HR", label: "Human Resources" },
      { value: "Finance", label: "Finance" },
      { value: "Operations", label: "Operations" },
      { value: "Content", label: "Content" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "suspended", label: "Suspended" },
      { value: "pending", label: "Pending" },
    ],
  },
  {
    key: "accountType",
    label: "Account Type",
    type: "select",
    options: [
      { value: "free", label: "Free" },
      { value: "premium", label: "Premium" },
      { value: "enterprise", label: "Enterprise" },
    ],
  },
  {
    key: "joinDate",
    label: "Join Date",
    type: "date",
  },
];

// Action Configuration for User Table
export const userActions: ActionConfig[] = [
  {
    key: "view",
    label: "View",
    icon: <Eye className="w-4 h-4" />,
    variant: "ghost",
    onClick: (item) => console.log("View user:", item.name),
  },
  {
    key: "edit",
    label: "Edit",
    icon: <Edit className="w-4 h-4" />,
    variant: "ghost",
    onClick: (item) => console.log("Edit user:", item.name),
  },
  {
    key: "message",
    label: "Message",
    icon: <MessageSquare className="w-4 h-4" />,
    variant: "ghost",
    onClick: (item) => console.log("Message user:", item.name),
    show: (item) => item.status === "active",
  },
  {
    key: "call",
    label: "Call",
    icon: <Phone className="w-4 h-4" />,
    variant: "ghost",
    onClick: (item) => window.open(`tel:${item.phone}`),
    show: (item) => Boolean(item.phone),
  },
  {
    key: "email",
    label: "Email",
    icon: <Mail className="w-4 h-4" />,
    variant: "ghost",
    onClick: (item) => window.open(`mailto:${item.email}`),
  },
  {
    key: "settings",
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
    variant: "ghost",
    onClick: (item) => console.log("User settings:", item.name),
    show: (item) => ["admin", "manager"].includes(item.role as string),
  },
];

// Table Configuration for User Management
export const userTableConfig: TableConfig = {
  title: "User Management",
  description: "Manage user accounts, roles, and permissions",
  searchPlaceholder: "Search users by name, email, or department...",
  itemsPerPage: 10,
  enableSearch: true,
  enableFilters: true,
  enablePagination: true,
  enableSelection: true,
  enableSorting: true,
  striped: true,
  emptyMessage: "No users found",
  loadingMessage: "Loading users...",
};

// Edit Modal Configuration for User Form
export const userEditModalConfig: EditModalConfig = {
  title: "Edit User",
  description: "Update user information and settings",
  width: "2xl",
  sections: [
    {
      key: "personal",
      title: "Personal Information",
      description: "Basic personal details and contact information",
    },
    {
      key: "address",
      title: "Address Information",
      description: "Location and address details",
    },
    {
      key: "professional",
      title: "Professional Information",
      description: "Job-related details and organizational information",
    },
    {
      key: "account",
      title: "Account & Access",
      description: "Account status, permissions, and security settings",
    },
    {
      key: "skills",
      title: "Skills & Preferences",
      description: "Skills, languages, and communication preferences",
    },
  ],
};
