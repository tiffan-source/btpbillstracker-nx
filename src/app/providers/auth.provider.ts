import { Provider } from "@angular/core";
import { AuthProvider, GetCurrentUserUseCase, LoginWithEmailAndPasswordUseCase, RegisterWithEmailAndPasswordUseCase } from "@btpbilltracker/auth";
import { FirebaseAppService, FirebaseAuthProvider } from "@btpbilltracker/infrastructure";

export const AUTH_PROVIDERS: Provider[] = [
    {provide: AuthProvider, useFactory: (appService: FirebaseAppService) => new FirebaseAuthProvider(appService), deps: [FirebaseAppService]},
    {provide: GetCurrentUserUseCase, useFactory: (authProvider: AuthProvider) => new GetCurrentUserUseCase(authProvider), deps: [AuthProvider]},
    {provide: LoginWithEmailAndPasswordUseCase, useFactory: (authProvider: AuthProvider) => new LoginWithEmailAndPasswordUseCase(authProvider), deps: [AuthProvider]},
    {provide: RegisterWithEmailAndPasswordUseCase, useFactory: (authProvider: AuthProvider) => new RegisterWithEmailAndPasswordUseCase(authProvider), deps: [AuthProvider]}
]