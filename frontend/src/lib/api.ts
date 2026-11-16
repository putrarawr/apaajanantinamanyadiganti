/**
 * Helper to determine backend API base URL dynamically.
 * Works seamlessly across:
 * - Local development on localhost (http://localhost:8080/api)
 * - Local network testing via LAN IP (e.g. http://192.168.1.10:8080/api)
 * - Production / staging via explicit NEXT_PUBLIC_API_URL
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    // If NEXT_PUBLIC_API_URL is configured and not pointing to localhost, use it
    if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes("localhost")) {
      return process.env.NEXT_PUBLIC_API_URL;
    }

    // If accessed through a network IP or custom hostname (not localhost)
    if (window.location.hostname && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      return `${window.location.protocol}//${window.location.hostname}:8080/api`;
    }
  }

  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
}
