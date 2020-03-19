export const StudentResponses = {
  validator: (field: string, min?: number) => `Please, enter a ${field} with ${min || 3} or more characters.`,
  SCHOOL_EXISTS: 'Oops! Student is already registered',
  USER_NOT_FOUND: 'Oops! We did not find this student in the organization.',
  SUBJECT: {
    PASSWORD_RESET: 'Students Password Reset',
  },
}
