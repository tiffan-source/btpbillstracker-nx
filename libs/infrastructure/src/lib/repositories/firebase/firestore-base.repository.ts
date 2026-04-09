import { collection, CollectionReference, DocumentData } from "firebase/firestore";
import { FirebaseAppService } from "./firebase-app";

export class FirestoreBaseRepository {
    private readonly store;
    protected collectionName: string;

    public constructor(firebaseAppService: FirebaseAppService) {
        this.store = FirebaseAppService.getAppFirestore();
        this.collectionName = '';
    }
    
    protected getCollection(): CollectionReference<DocumentData> {
        return collection(this.store, this.collectionName);
    }
    
}