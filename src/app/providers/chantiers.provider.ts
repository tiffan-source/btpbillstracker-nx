import { Provider } from "@angular/core";
import { ChantierRepository, CreateChantierUseCase } from "@btpbilltracker/chantiers"
import { IdGeneratorPort } from "@btpbilltracker/chore";
import { FirestoreChantierRepository, UuidIdGeneratorService, FirebaseAppService } from "@btpbilltracker/infrastructure";

export const CHANTIER_PROVIDERS: Provider[] = [
    {provide: CreateChantierUseCase, useFactory: (repo: ChantierRepository, idGen: IdGeneratorPort) => new CreateChantierUseCase(repo, idGen), deps: [ChantierRepository, IdGeneratorPort]},
    {provide: IdGeneratorPort, useClass: UuidIdGeneratorService},
    {provide: ChantierRepository, useFactory: (appService: FirebaseAppService) => new FirestoreChantierRepository(appService), deps: [FirebaseAppService]}
];