import { Chantier, ChantierPersistenceError, ChantierRepository } from '@btpbilltracker/chantiers';
import { addDoc, collection, CollectionReference, doc, DocumentData, DocumentReference, Firestore, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { FirebaseAppService } from './firebase-app';
import { FirestoreBaseRepository } from './firestore-base.repository';

type FirestorePlainChantier = {
  id: string;
  ownerUid: string;
  name: string;
};

export class FirestoreChantierRepository extends FirestoreBaseRepository implements ChantierRepository {

    public constructor(firebaseAppService: FirebaseAppService) {
        super(firebaseAppService);
        this.collectionName = 'chantiers';
    }

    async save(chantier: Chantier, ownerUid: string): Promise<void> {
        await addDoc(this.getCollection(), this.toPlainChantier(chantier, ownerUid));
    }

    async existsByNameForUser(name: string, ownerUid: string): Promise<boolean> {
        const q = query(this.getCollection(), where('ownerUid', '==', ownerUid));
        const snapshot = await getDocs(q);
        const chantiers = snapshot.docs.map((doc) => doc.data());
        const normalizedName = name.trim().toLowerCase();
        return chantiers.some((chantier) => chantier['name'].trim().toLowerCase() === normalizedName);
    }

    async getAllUserChantiers(userId: string): Promise<Chantier[]> {
        const q = query(this.getCollection(), where('ownerUid', '==', userId));
        const querySnapshot = await getDocs(q);
        const chantiers: Chantier[] = [];

        querySnapshot.forEach((doc) => {
            const plainChantier = doc.data() as FirestorePlainChantier;
            chantiers.push(new Chantier(plainChantier.id, plainChantier.name));
        });

        return chantiers;
    }

    private toPlainChantier(chantier: Chantier, ownerUid: string): FirestorePlainChantier {
        return { id: chantier.id, ownerUid, name: chantier.name };
    }
}
