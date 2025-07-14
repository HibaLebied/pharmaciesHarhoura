import type { Pharmacy } from "@/types/pharmacy";
import { supabase } from "@/lib/supabase";
import { DEMO_PHARMACIES } from "@/lib/demo-data";

export class PharmacyService {
  private static instance: PharmacyService;
  private useDemo = false;
  private demoMode = false;

  static getInstance(): PharmacyService {
    if (!PharmacyService.instance) {
      PharmacyService.instance = new PharmacyService();
    }
    return PharmacyService.instance;
  }

  async getPharmacies(): Promise<{
    data: Pharmacy[];
    isDemo: boolean;
    error?: string;
  }> {
    // Si on est déjà en mode démo, retourner les données de démo
    if (this.demoMode) {
      return { data: DEMO_PHARMACIES, isDemo: true };
    }

    try {
      // Vérifier si Supabase est configuré
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.log(
          "Variables Supabase non configurées, utilisation des données de démo"
        );
        this.demoMode = true;
        return { data: DEMO_PHARMACIES, isDemo: true };
      }

      // Essayer de récupérer les données depuis Supabase
      const { data, error } = await supabase
        .from("pharmacies")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.warn(
          "Erreur Supabase, basculement vers les données de démo:",
          error.message
        );
        this.demoMode = true;
        return {
          data: DEMO_PHARMACIES,
          isDemo: true,
          error: `Supabase: ${error.message}`,
        };
      }

      // Si pas de données, utiliser les données de démo
      if (!data || data.length === 0) {
        console.log(
          "Aucune donnée dans Supabase, utilisation des données de démo"
        );
        return { data: DEMO_PHARMACIES, isDemo: true };
      }

      return { data, isDemo: false };
    } catch (error) {
      console.warn(
        "Erreur de connexion, utilisation des données de démo:",
        error
      );
      this.demoMode = true;
      return {
        data: DEMO_PHARMACIES,
        isDemo: true,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async checkConnection(): Promise<{ connected: boolean; error?: string }> {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        return {
          connected: false,
          error: "Variables d'environnement Supabase manquantes",
        };
      }

      const { error } = await supabase
        .from("pharmacies")
        .select("count", { count: "exact", head: true });

      if (error) {
        return { connected: false, error: error.message };
      }

      return { connected: true };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : "Erreur de connexion",
      };
    }
  }

  setDemoMode(demo: boolean) {
    this.demoMode = demo;
  }
}

export const pharmacyService = PharmacyService.getInstance();
