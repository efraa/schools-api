export const StudentResponses = {
  validator: (field: string, min?: number) => `Please, enter a ${field} with ${min || 3} or more characters.`,
  SCHOOL_NOT_FOUND: 'Oops! We\'ve not found this school.',
  USER_NOT_FOUND: 'Oops! We did not find this student in the organization.',
  NO_STUDENT_DATA: 'Oops! We haven\'t found any students in your organization.',
  SUBJECT: {
    PASSWORD_RESET: 'Students Password Reset',
  },
}
