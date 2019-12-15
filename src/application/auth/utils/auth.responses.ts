export const AuthResponses: any = {
  validator: {
    name: 'Please, enter a name with 2 or more characters.',
    lastname: 'Please, enter a lastname with 2 or more characters.',
    username: 'Please, enter a username with 3 or more characters.',
    email: 'Please, include a valid email.',
    password: 'Please, enter a password with 6 or more characters.',
    commonPass: 'Oops!, your password is not safe, try using not so common words and numbers.',
    codeSchool: 'The institution code must be valid and is mandatory.',
    schoolNotExist: 'There is no institution with this code.',
    schoolDisabled: 'Sorry this institution is currently disabled.',
    maxTeachers: 'Oops! Your institution has reached the maximum number of registered teachers.',
    maxStudents: 'Oops! Your institution has reached the maximum number of registered students.',
    role: 'Please, enter a valid role.'
  },
  auth: {
    validator: {
      emailOrUsername: 'Please include a valid username or email',
    },
    accountDoesNotExist: 'Oops! There is no user with these credentials.',
    accountIsDisable: 'Oops! Your account is temporarily deactivated. Contact the institution.',
    badCredentials: 'Oops! Something in your credentials is wrong.',
  },
  changePassword: {
    validator: {
      pass: 'Your password is not correct.',
      newpass: 'Your new password must have 6 or more characters.',
    },
    equal: 'Your new password must be different from your current password.',
    incorrect: 'Your password is incorrect.',
    success: 'Your password has been updated successfully.',
  },
  forgotPass: {
    userNotFound: 'Password reset token is invalid or has expired.',
    success: 'Your password has been changed successfully.',
    validator: {
      token: 'Password reset token is required.',
    }
  },
  usernameExists: 'This username is already in use.',
  emailExists: 'This email is already in use.',
  nodemailer: {
    subject: 'Password reset request',
  }
}
