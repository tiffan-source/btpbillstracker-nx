import { AuthUser } from "../domains/auth-user";

export abstract class AuthProvider {

  abstract getCurrentUser(): Promise<AuthUser | null>;

  abstract loginWithEmailAndPassword(email: string, password: string): Promise<void>;

  abstract registerWithEmailAndPassword(email: string, password: string): Promise<void>;
}