import { Chantier, ChantierPersistenceError, ChantierRepository } from '@btpbilltracker/chantiers';
import { collection, CollectionReference, doc, DocumentData, DocumentReference, Firestore, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { FirebaseAppService } from './firebase-app';

type FirestorePlainChantier = {
  id: string;
  ownerUid: string;
  name: string;
};

export class FirestoreChantierRepository implements ChantierRepository {
    private readonly collectionName = 'chantiers';
    private readonly auth;
    private readonly store;

    public constructor(firebaseAppService: FirebaseAppService) {
        this.auth = FirebaseAppService.getAppAuth();
        this.store = FirebaseAppService.getAppFirestore();
    }

    private getCollection(): CollectionReference<DocumentData> {
        return collection(this.store, this.collectionName);
    }

    private async execute<T>(
        operation: (ownerUid: string) => Promise<T>,
        errorContext: { errorMessage?: string; context?: Record<string, unknown> }
    ): Promise<T> {
        try {
            const ownerUid = this.getOwnerUid();
            return await operation(ownerUid);
        } catch (error: unknown) {
            if (error instanceof ChantierPersistenceError) {
                throw error;
            }
            throw new ChantierPersistenceError(
                errorContext.errorMessage,
                { collection: this.collectionName, ...errorContext.context }
            );
        }
    }

    async save(chantier: Chantier): Promise<void> {
        return this.execute(async (ownerUid) => {
            await setDoc(this.getChantierDocRef(chantier.id), this.toPlainChantier(chantier, ownerUid));
        }, { context: { chantierId: chantier.id } });
    }

    async list(): Promise<Chantier[]> {
        return this.execute(async (ownerUid) => {
            const snapshot = await getDocs(this.getCollection());
            return snapshot.docs
                .map((entry) => entry.data() as FirestorePlainChantier)
                .filter((plainChantier) => plainChantier.ownerUid === ownerUid)
                .map((plainChantier) => this.toEntity(plainChantier));
        }, { errorMessage: 'Impossible de lire les chantiers.' });
    }

    async update(chantier: Chantier): Promise<void> {
        return this.execute(async (ownerUid) => {
            const existing = await getDoc(this.getChantierDocRef(chantier.id));
            
            if (!existing.exists() || (existing.data() as FirestorePlainChantier).ownerUid !== ownerUid) {
                throw new ChantierPersistenceError('Chantier introuvable pour mise à jour.', { chantierId: chantier.id });
            }

            await setDoc(this.getChantierDocRef(chantier.id), this.toPlainChantier(chantier, ownerUid));
        }, { 
            errorMessage: 'Impossible de mettre à jour le chantier.', 
            context: { chantierId: chantier.id } 
        });
    }

    async existsByName(name: string, excludeId?: string): Promise<boolean> {
        return this.execute(async () => {
            const normalizedName = name.trim().toLowerCase();
            const chantiers = await this.list();
            return chantiers.some((chantier) => chantier.name.trim().toLowerCase() === normalizedName && chantier.id !== excludeId);
        }, { 
            errorMessage: 'Impossible de vérifier l’unicité du chantier.',
            context: { name, excludeId } 
        });
    }

    private toEntity(plain: FirestorePlainChantier): Chantier {
        return new Chantier(plain.id, plain.name);
    }

    private toPlainChantier(chantier: Chantier, ownerUid: string): FirestorePlainChantier {
        return { id: chantier.id, ownerUid, name: chantier.name };
    }

    private getChantierDocRef(chantierId: string): DocumentReference<DocumentData> {
        return doc(this.getCollection(), chantierId);
    }

    private getOwnerUid(): string {
        const currentUser = this.auth.currentUser;
        if (!currentUser?.uid) {
            // throw new ChantierPersistenceError('Utilisateur non authentifié.', { collection: this.collectionName });
            return 'unknown';
        }
        return currentUser.uid;
    }
}
