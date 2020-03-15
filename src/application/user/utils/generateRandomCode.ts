export const generateRandomCode = () =>
  Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
