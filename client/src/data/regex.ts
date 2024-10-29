export const regexPatterns = {
  noSymbol: /^[a-zA-Z0-9\s]*$/,
  noDigit: /^[^0-9]*$/,
  UsernameMinLength: /^.{2,}$/,
  NameMinLength: /^.{2,}$/,
  PasswordMinLength: /^.{8,}$/,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasDigit: /\d/,
  hasSymbol: /[@_]/,
  noSymbolExceptPermittedOnes: /^[A-Za-z\d@_]+$/,
  validEmail: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

export type regexNames = keyof typeof regexPatterns;

export const regexErrorMessages: {
  [key in keyof typeof regexPatterns]: string;
} = {
  noSymbol: "No symbol allowed",
  noDigit: "No digit allowed",
  UsernameMinLength: "Username must be at least 2 characters long",
  NameMinLength: "Full Name must be at least 2 characters long",
  PasswordMinLength: "Password must be at least 8 characters long",
  hasUppercase: "Password must have at least one uppercase letter",
  hasLowercase: "Password must have at least one lowercase letter",
  hasDigit: "Password must have at least one digit",
  hasSymbol: "Password must have at least one symbol",
  noSymbolExceptPermittedOnes:
    "Password must have at least one symbol out of @ and _ and no other symbols",
  validEmail: "Invalid email address",
};
