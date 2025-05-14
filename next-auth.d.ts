import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    id: string;
  }
  interface JWT extends DefaultJWT {
    id: string;
  }
}
