import { AuthUser } from "../domains/auth-user";

export abstract class AuthProvider {

  abstract getCurrentUser(): Promise<AuthUser | null>;

}