import { ApiError, apiRequest } from "./client";

export type LoginResponse = {
  flag: boolean;
  message: string;
};

export type RegistrationRequest = {
  userName: string;
  password: string;
  fullName: string;
  email: string;
  contactNumber: string;
  roleId: number;
  isActive: boolean;
};

function isLoginResponse(value: unknown): value is LoginResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "flag" in value &&
    typeof value.flag === "boolean" &&
    "message" in value &&
    typeof value.message === "string"
  );
}

export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response = await apiRequest("/user/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (!isLoginResponse(response)) {
    throw new ApiError("The backend returned an unexpected login response.");
  }

  return response;
}

export async function registerUser(
  registration: RegistrationRequest
): Promise<void> {
  const response = await apiRequest("/user/save", {
    method: "POST",
    body: JSON.stringify(registration),
  });

  if (response !== true) {
    throw new ApiError("Registration could not be completed.");
  }
}
