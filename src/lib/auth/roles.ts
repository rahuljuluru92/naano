import type { UserRole } from "@/lib/validation/auth";

// Pure, client-safe -- kept out of bootstrap.ts so importing it (e.g. from
// Nav.tsx, a Client Component) doesn't drag in that file's "server-only"
// marker and Supabase server-client code.
export function roleHomePath(role: UserRole): string {
  switch (role) {
    case "brand":
      return "/dashboard";
    case "creator":
      return "/creator";
    case "admin":
      return "/admin";
  }
}
