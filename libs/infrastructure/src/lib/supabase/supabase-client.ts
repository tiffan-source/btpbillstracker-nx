import { createClient, SupabaseClient } from '@supabase/supabase-js'

export type AppSupabaseConfig = {
    supabaseUrl: string;
    supabaseKey: string;
};

export class SupabaseClientService {

    private client: SupabaseClient;

    constructor(config: AppSupabaseConfig) {
        this.client = createClient(config.supabaseUrl, config.supabaseKey);
    }

    public getClient(): SupabaseClient {
        return this.client;
    }
}