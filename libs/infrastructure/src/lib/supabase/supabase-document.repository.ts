    import { DocumentRepository } from "@btpbilltracker/bills";
    import { SupabaseClientService } from "./supabase-client";

    // const supabaseUrl = 'https://nkpeuqodeuzsmcychbrh.supabase.co'
    // const supabaseKey = 'sb_publishable_ZfjHv78MgBjAoy6NZ3OdeQ_HlsRFwIH'
    // const supabase = createClient(supabaseUrl, supabaseKey)

    export class SupabaseDocumentRepository implements DocumentRepository {
        private readonly supabaseClient: SupabaseClientService;

        public constructor(supabaseClient: SupabaseClientService) {
            this.supabaseClient = supabaseClient;
        }

        public async saveDocument(documentId: string, file: File, ownerUid: string): Promise<void> {
            const { data, error } = await this.supabaseClient.getClient().storage  
            .from('btpbilltracker')  
            .upload('public/' + documentId, file)

        }

        public async deleteDocument(documentId: string): Promise<void> {
            const { data, error } = await this.supabaseClient.getClient().storage  
            .from('btpbilltracker')  
            .remove(['public/' + documentId])
        }

        public async getDocumentUrl(documentId: string): Promise<string> {
            const { data } = this.supabaseClient.getClient().storage
            .from('btpbilltracker')
            .getPublicUrl('public/' + documentId);

            console.log(data);
            

            if (!data.publicUrl) {
                throw new Error('Failed to resolve document URL');
            }

            return data.publicUrl;
        }
    }