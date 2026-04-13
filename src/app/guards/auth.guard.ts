import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (await authService.isSignedIn()) {
        return true;
    }

    return router.createUrlTree(['/login'])
};