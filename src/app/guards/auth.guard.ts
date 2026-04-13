import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";
import { AppBootstrapOrchestrator } from "../services/app-bootstrap.orchestrator";

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const appBootstrapOrchestrator = inject(AppBootstrapOrchestrator);

    if (await authService.isSignedIn()) {
        appBootstrapOrchestrator.trigger();        
        return true;
    }

    return router.createUrlTree(['/login'])
};