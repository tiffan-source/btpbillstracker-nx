import { Provider } from "@angular/core";
import { BillRepository, CreateEnrichedBillUseCase } from "@btpbilltracker/bills";
import { IdGeneratorPort } from "@btpbilltracker/chore";
import { FirebaseAppService, FirestoreBillRepository, UuidIdGeneratorService,  } from "@btpbilltracker/infrastructure";

export const BILL_PROVIDERS: Provider[] = [
    {provide: IdGeneratorPort, useClass: UuidIdGeneratorService},
    {provide: BillRepository, useFactory: (appService: FirebaseAppService) => new FirestoreBillRepository(appService), deps: [FirebaseAppService]},
    {provide: CreateEnrichedBillUseCase, useFactory: (repo: BillRepository, idGen: IdGeneratorPort) => new CreateEnrichedBillUseCase(repo, idGen), deps: [BillRepository, IdGeneratorPort]},
]