import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Employee: a.model({
    employeeId: a.string().required(),
    fullName: a.string().required(),
    preferredName: a.string(),
    email: a.email().required(),
    phone: a.string(),
    dateOfBirth: a.date(),
    gender: a.string(),
    maritalStatus: a.string(),
    nationality: a.string(),
    nationalId: a.string(),
    residentialAddress: a.string(),
    emergencyContactName: a.string(),
    emergencyContactPhone: a.string(),
    
    // Employment Details
    department: a.string().required(),
    position: a.string().required(),
    employmentType: a.enum(['PERMANENT', 'CONTRACT', 'CASUAL', 'INTERN']),
    status: a.enum(['ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'SEPARATED']),
    hireDate: a.date().required(),
    contractStartDate: a.date(),
    contractEndDate: a.date(),
    supervisorId: a.string(),
    workLocation: a.string(),
    
    // Payroll & Compensation (Restricted)
    salary: a.float(),
    payFrequency: a.enum(['WEEKLY', 'FORTNIGHTLY', 'MONTHLY']),
    bankAccountNumber: a.string(),
    taxFileNumber: a.string(),
    
    // Leave & Attendance
    annualLeaveBalance: a.integer().default(20),
    sickLeaveBalance: a.integer().default(10),
    
    // Performance
    lastReviewDate: a.date(),
    performanceRating: a.string(),
    
    // Audit fields
    createdBy: a.string(),
    updatedBy: a.string(),
  })
  .authorization(allow => [
    allow.group('SUPER_ADMIN'), // Full access to everything
    allow.group('HR_ADMIN'),
    allow.group('HR_OFFICER').to(['read', 'create', 'update']),
    allow.authenticated().to(['read']),
  ]),

  LeaveRequest: a.model({
    employeeId: a.id().required(),
    employee: a.belongsTo('Employee', 'employeeId'),
    leaveType: a.enum(['ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'UNPAID']),
    startDate: a.date().required(),
    endDate: a.date().required(),
    daysRequested: a.integer().required(),
    status: a.enum(['PENDING', 'APPROVED', 'REJECTED']).default('PENDING'),
    reason: a.string(),
    approvedBy: a.string(),
    approvedAt: a.datetime(),
  })
  .authorization(allow => [
    allow.group('SUPER_ADMIN'),
    allow.group('HR_ADMIN'),
    allow.group('HR_OFFICER'),
    allow.authenticated().to(['read', 'create']),
  ]),

  PerformanceReview: a.model({
    employeeId: a.id().required(),
    employee: a.belongsTo('Employee', 'employeeId'),
    reviewDate: a.date().required(),
    reviewerId: a.string().required(),
    rating: a.integer().required(),
    strengths: a.string(),
    areasForImprovement: a.string(),
    goals: a.string(),
    comments: a.string(),
  })
  .authorization(allow => [
    allow.group('SUPER_ADMIN'),
    allow.group('HR_ADMIN'),
    allow.authenticated().to(['read']),
  ]),

  // System Audit Log (Super Admin only)
  AuditLog: a.model({
    action: a.string().required(),
    performedBy: a.string().required(),
    targetEntity: a.string().required(),
    targetId: a.string().required(),
    changes: a.json(),
    ipAddress: a.string(),
    timestamp: a.datetime().required(),
  })
  .authorization(allow => [
    allow.group('SUPER_ADMIN'),
  ]),

  // System Configuration (Super Admin only)
  SystemConfig: a.model({
    configKey: a.string().required(),
    configValue: a.json().required(),
    description: a.string(),
    isActive: a.boolean().default(true),
  })
  .authorization(allow => [
    allow.group('SUPER_ADMIN'),
  ]),

  // User Management (Super Admin only)
  UserRole: a.model({
    userId: a.string().required(),
    userEmail: a.string().required(),
    userName: a.string().required(),
    role: a.enum(['SUPER_ADMIN', 'HR_ADMIN', 'HR_OFFICER', 'EMPLOYEE']).required(),
    department: a.string(),
    assignedBy: a.string(),
    assignedAt: a.datetime(),
    isActive: a.boolean().default(true),
  })
  .authorization(allow => [
    allow.group('SUPER_ADMIN'),
    allow.group('HR_ADMIN').to(['read']),
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});