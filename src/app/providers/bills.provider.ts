import { Provider } from "@angular/core";
import { BillRepository, CreateEnrichedBillUseCase, DocumentRepository, EditBillUseCase, GetAllUserConnectedBillsUseCase, PayMyBillUseCase, UploadBillPdfUseCase } from "@btpbilltracker/bills";
import { IdGeneratorPort } from "@btpbilltracker/chore";
import { FirebaseAppService, FirestoreBillRepository, SupabaseClientService, SupabaseDocumentRepository, UuidIdGeneratorService } from "@btpbilltracker/infrastructure";
import { AuthProvider } from "@btpbilltracker/auth";

export const BILL_PROVIDERS: Provider[] = [
    {provide: IdGeneratorPort, useClass: UuidIdGeneratorService},
    {provide: BillRepository, useFactory: (appService: FirebaseAppService) => new FirestoreBillRepository(appService), deps: [FirebaseAppService]},
    {provide: DocumentRepository, useFactory: (supabaseClient: SupabaseClientService) => new SupabaseDocumentRepository(supabaseClient), deps: [SupabaseClientService]},
    {provide: CreateEnrichedBillUseCase, useFactory: (repo: BillRepository, idGen: IdGeneratorPort, currentUser: AuthProvider) => new CreateEnrichedBillUseCase(repo, idGen, currentUser), deps: [BillRepository, IdGeneratorPort, AuthProvider]},
    {provide: EditBillUseCase, useFactory: (repo: BillRepository, currentUser: AuthProvider) => new EditBillUseCase(repo, currentUser), deps: [BillRepository, AuthProvider]},
    {provide: GetAllUserConnectedBillsUseCase, useFactory: (repo: BillRepository, currentUser: AuthProvider) => new GetAllUserConnectedBillsUseCase(repo, currentUser), deps: [BillRepository, AuthProvider]},    
    {provide: PayMyBillUseCase, useFactory: (repo: BillRepository, currentUser: AuthProvider) => new PayMyBillUseCase(repo, currentUser), deps: [BillRepository, AuthProvider]},    
    {provide: UploadBillPdfUseCase, useFactory: (repo: DocumentRepository, idGen: IdGeneratorPort, currentUser: AuthProvider) => new UploadBillPdfUseCase(repo, idGen, currentUser), deps: [DocumentRepository, IdGeneratorPort, AuthProvider]},
]
