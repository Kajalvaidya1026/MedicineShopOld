export const API_BASE_URL = "http://localhost:8085";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function readApiErrorMessage(body: unknown): string | undefined {
  if (typeof body === "object" && body !== null && "message" in body) {
    const { message } = body;
    return typeof message === "string" ? message : undefined;
  }

  return undefined;
}

export async function apiRequest(
  path: string,
  init: RequestInit = {}
): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(
      "Unable to reach the backend. Please check that the server is running."
    );
  }

  const responseText = await response.text();
  let responseBody: unknown;

  try {
    responseBody = responseText ? JSON.parse(responseText) : null;
  } catch {
    throw new ApiError(
      "The backend returned an unreadable response.",
      response.status
    );
  }

  if (!response.ok) {
    const backendMessage = readApiErrorMessage(responseBody);
    const message =
      backendMessage ||
      (response.status >= 500
        ? "The backend is currently unavailable. Please try again later."
        : `The request failed with status ${response.status}.`);

    throw new ApiError(message, response.status);
  }

  return responseBody;
}
