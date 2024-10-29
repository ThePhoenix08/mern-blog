export const PrivilegeLevels = {
  0: "Admin",
  1: "Blogger",
  2: "User",
  3: "Guest",
};

export const envVars = {
  DEVMODE: import.meta.env.VITE_DEVMODE,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
};

export const backendBaseURL =
  envVars.API_BASE_URL || "http://localhost:4000/api/v1";
