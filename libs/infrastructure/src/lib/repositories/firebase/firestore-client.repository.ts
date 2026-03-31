import { Client, ClientPersistenceError, ClientRepository } from '@btpbilltracker/clients';
import { collection, CollectionReference, doc, DocumentData, DocumentReference, Firestore, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { FirebaseAppService } from './firebase-app';

export type FirestorePlainClient = {
  id: string;
  ownerUid: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export class FirestoreClientRepository implements ClientRepository {
  private readonly collectionName = 'clients';
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
      if (error instanceof ClientPersistenceError) {
        throw error;
      }
      throw new ClientPersistenceError(
        errorContext.errorMessage,
        { collection: this.collectionName, ...errorContext.context },
      );
    }
  }

  async save(client: Client): Promise<void> {
    return this.execute(async (ownerUid) => {
      await setDoc(this.getClientDocRef(client.id), this.toPlainClient(client, ownerUid));
    }, { context: { clientId: client.id } });
  }

  async list(): Promise<Client[]> {
    return this.execute(async (ownerUid) => {
      const snapshot = await getDocs(this.getCollection());
      return snapshot.docs
        .map((item) => item.data() as FirestorePlainClient)
        .filter((plainClient) => plainClient.ownerUid === ownerUid)
        .map((plainClient) => this.toEntity(plainClient));
    }, { errorMessage: 'Impossible de lire les clients.' });
  }

  async update(client: Client): Promise<void> {
    return this.execute(async (ownerUid) => {
      const existing = await getDoc(this.getClientDocRef(client.id));

      if (!existing.exists() || (existing.data() as FirestorePlainClient).ownerUid !== ownerUid) {
        throw new ClientPersistenceError('Client introuvable pour mise à jour.', { clientId: client.id });
      }

      await setDoc(this.getClientDocRef(client.id), this.toPlainClient(client, ownerUid));
    }, { 
      errorMessage: 'Impossible de mettre à jour le client.', 
      context: { clientId: client.id } 
    });
  }

  private toEntity(plainClient: FirestorePlainClient): Client {
    const client = new Client(plainClient.id, plainClient.firstName);

    if (plainClient.firstName) {
      client.setFirstName(plainClient.firstName);
    }
    if (plainClient.lastName) {
      client.setLastName(plainClient.lastName);
    }
    if (plainClient.email) {
      client.setEmail(plainClient.email);
    }
    if (plainClient.phone) {
      client.setPhone(plainClient.phone);
    }

    return client;
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

  private getClientDocRef(clientId: string): DocumentReference<DocumentData> {
    return doc(this.getCollection(), clientId);
  }

  private getOwnerUid(): string {
    const currentUser = this.auth.currentUser;
    if (!currentUser?.uid) {
      throw new ClientPersistenceError('Utilisateur non authentifié.', { collection: this.collectionName });
    }

    return currentUser.uid;
  }
}
