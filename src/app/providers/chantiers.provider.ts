import { Provider } from "@angular/core";
import { ChantierRepository, CreateChantierUseCase, GetAllUserChantiersUseCase } from "@btpbilltracker/chantiers"
import {  IdGeneratorPort } from "@btpbilltracker/chore";
import { FirestoreChantierRepository, UuidIdGeneratorService, FirebaseAppService } from "@btpbilltracker/infrastructure";
import { AuthProvider } from "@btpbilltracker/auth";

export const CHANTIER_PROVIDERS: Provider[] = [
    {provide: CreateChantierUseCase, useFactory: (repo: ChantierRepository, idGen: IdGeneratorPort, currentUser: AuthProvider) => new CreateChantierUseCase(repo, idGen, currentUser), deps: [ChantierRepository, IdGeneratorPort, AuthProvider]},
    {provide: IdGeneratorPort, useClass: UuidIdGeneratorService},
    {provide: ChantierRepository, useFactory: (appService: FirebaseAppService) => new FirestoreChantierRepository(appService), deps: [FirebaseAppService]},
    {provide: GetAllUserChantiersUseCase, useFactory: (repo: ChantierRepository, currentUser: AuthProvider) => new GetAllUserChantiersUseCase(repo, currentUser), deps: [ChantierRepository, AuthProvider]}
];
