export const TeacherResponses = {
  validator: (field: string, min?: number) => `Please, enter a ${field} with ${min || 3} or more characters.`,
  SCHOOL_EXISTS: 'Oops! Teacher is already registered',
  USER_NOT_FOUND: 'Oops! We did not find this teacher in the organization.',
  SUBJECT: {
    PASSWORD_RESET: 'Teachers Password Reset',
  },
}
