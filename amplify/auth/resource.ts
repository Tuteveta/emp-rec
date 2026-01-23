import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ['SUPER_ADMIN', 'HR_ADMIN', 'HR_OFFICER', 'EMPLOYEE'],
  userAttributes: {
    email: {
      required: true,
      mutable: false,
    },
    name: {
      required: true,
      mutable: true,
    },
    'custom:department': {
      dataType: 'String',
      mutable: true,
    },
    'custom:employeeId': {
      dataType: 'String',
      mutable: true,
    },
    'custom:role': {
      dataType: 'String',
      mutable: true,
    },
  },
});