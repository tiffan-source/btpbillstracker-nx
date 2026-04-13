import { Provider } from "@angular/core";
import { IdGeneratorPort } from "@btpbilltracker/chore";
import { CreateQuickClientUseCase, ClientRepository } from "@btpbilltracker/clients";
import { UuidIdGeneratorService, FirebaseAppService } from "@btpbilltracker/infrastructure"
import { FirestoreClientRepository } from "@btpbilltracker/infrastructure";
import { AuthProvider } from "libs/auth/src/lib/ports/auth.provider";

export const CLIENT_PROVIDERS: Provider[] = [
    {provide: IdGeneratorPort, useClass: UuidIdGeneratorService},
    {provide: ClientRepository, useFactory: (appService: FirebaseAppService) => new FirestoreClientRepository(appService), deps: [FirebaseAppService]},
    {provide: CreateQuickClientUseCase, useFactory: (repo: ClientRepository, idGenerator: IdGeneratorPort, currentUser: AuthProvider) => new CreateQuickClientUseCase(repo, idGenerator, currentUser), deps: [ClientRepository, IdGeneratorPort, AuthProvider]}
]
