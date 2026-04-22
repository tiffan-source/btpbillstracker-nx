import { InjectionToken, Provider } from "@angular/core";
import { AppSupabaseConfig, SupabaseClientService } from "@btpbilltracker/infrastructure";

export const SUPABASE_APP_CONFIG = new InjectionToken<AppSupabaseConfig>('SUPABASE_APP_CONFIG');

export function provideSupabase(config: AppSupabaseConfig): Provider[] {
  return [
    { provide: SUPABASE_APP_CONFIG, useValue: config },
    {
      provide: SupabaseClientService,
      useFactory: (supabaseConfig: AppSupabaseConfig) => new SupabaseClientService(supabaseConfig),
      deps: [SUPABASE_APP_CONFIG],
    },
  ];
}