
import { RobloxGame } from "../types";

export async function generateRobloxGame(idea: string): Promise<RobloxGame> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idea }),
  });

  if (!response.ok) {
    // Try to get a specific error message from the server response
    const contentType = response.headers.get("content-type");
    let errorText = `Request failed with status ${response.status}`;

    if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json().catch(() => null);
        if (errorData && errorData.error) {
            errorText = errorData.error;
        }
    } else {
        // If not JSON, use the raw text response as the error
        errorText = await response.text();
    }
    
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json();
}
