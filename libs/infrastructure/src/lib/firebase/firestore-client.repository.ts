import { Client, ClientRepository } from '@btpbilltracker/clients';
import { addDoc, collection, CollectionReference, doc, DocumentData, DocumentReference, Firestore, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { FirebaseAppService } from './firebase-app';
import { FirestoreBaseRepository } from './firestore-base.repository';

export type FirestorePlainClient = {
  id: string;
  ownerUid: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export class FirestoreClientRepository extends FirestoreBaseRepository implements ClientRepository {

    public constructor(firebaseAppService: FirebaseAppService) {
        super(firebaseAppService);
        this.collectionName = 'clients';
    }

    async save(client: Client, userId: string): Promise<void> {
      await addDoc(this.getCollection(), this.toPlainClient(client, userId));
    }

    async getAllUserClients(userId: string): Promise<Client[]> {
      const querySnapshot = await getDocs(this.getCollection());
      const clients: Client[] = [];

      querySnapshot.forEach((doc) => {
        const plainClient = doc.data() as FirestorePlainClient;
        if (plainClient.ownerUid === userId) {
          clients.push(this.fromPlainClient(plainClient));
        }
      });

      return clients;
    }

  private toPlainClient(client: Client, ownerUid: string): FirestorePlainClient {
    return {
      id: client.id,
      ownerUid,
      firstName: client.firstName || '',
      lastName: client.lastName || '',
      email: client.email || '',
      phone: client.phone || ''
    };
  }

  private fromPlainClient(plainClient: FirestorePlainClient): Client {
    return new Client(
      plainClient.id,
      plainClient.firstName,
    ).setLastName(plainClient.lastName || '')
     .setEmail(plainClient.email || '')
     .setPhone(plainClient.phone || '');
  }
}
