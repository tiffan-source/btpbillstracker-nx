import { Provider } from "@angular/core";
import { IdGeneratorPort } from "@btpbilltracker/chore";
import { CreateQuickClientUseCase, ClientRepository, GetAllUserClientsUseCase } from "@btpbilltracker/clients";
import { UuidIdGeneratorService, FirebaseAppService } from "@btpbilltracker/infrastructure"
import { FirestoreClientRepository } from "@btpbilltracker/infrastructure";
import { AuthProvider } from "@btpbilltracker/auth";

export const CLIENT_PROVIDERS: Provider[] = [
    {provide: IdGeneratorPort, useClass: UuidIdGeneratorService},
    {provide: ClientRepository, useFactory: (appService: FirebaseAppService) => new FirestoreClientRepository(appService), deps: [FirebaseAppService]},
    {provide: CreateQuickClientUseCase, useFactory: (repo: ClientRepository, idGenerator: IdGeneratorPort, currentUser: AuthProvider) => new CreateQuickClientUseCase(repo, idGenerator, currentUser), deps: [ClientRepository, IdGeneratorPort, AuthProvider]},
    {provide: GetAllUserClientsUseCase, useFactory: (repo: ClientRepository, currentUser: AuthProvider) => new GetAllUserClientsUseCase(repo, currentUser), deps: [ClientRepository, AuthProvider]}
]
