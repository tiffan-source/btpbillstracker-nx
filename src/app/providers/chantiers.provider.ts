import { Provider } from "@angular/core";
import { ChantierRepository, CreateChantierUseCase } from "@btpbilltracker/chantiers"
import { CurrentUserIdPort, IdGeneratorPort } from "@btpbilltracker/chore";
import { FirestoreChantierRepository, UuidIdGeneratorService, FirebaseAppService } from "@btpbilltracker/infrastructure";

export const CHANTIER_PROVIDERS: Provider[] = [
    {provide: CreateChantierUseCase, useFactory: (repo: ChantierRepository, idGen: IdGeneratorPort, currentUserId: CurrentUserIdPort) => new CreateChantierUseCase(repo, idGen, currentUserId), deps: [ChantierRepository, IdGeneratorPort, CurrentUserIdPort]},
    {provide: IdGeneratorPort, useClass: UuidIdGeneratorService},
    {provide: ChantierRepository, useFactory: (appService: FirebaseAppService) => new FirestoreChantierRepository(appService), deps: [FirebaseAppService]}
];
