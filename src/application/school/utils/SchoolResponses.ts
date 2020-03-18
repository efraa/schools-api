export const SchoolResponses = {
  validator: (field: string, min?: number) => `Please, enter a ${field} with ${min || 3} or more characters.`,
  SCHOOL_EXISTS: 'Oops! School is already registered',
  USER_NOT_FOUND: 'Oops! We did not find this school in the organization.',
  SUBJECT: {
    PASSWORD_RESET: 'Schools Password Reset',
  },
}
