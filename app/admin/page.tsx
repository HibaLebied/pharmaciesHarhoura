"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PharmacyForm } from "@/components/pharmacy-form";
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  Home,
  CalendarRange,
  List,
} from "lucide-react";
import Link from "next/link";
import { supabase, type Pharmacy } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { PharmacyStats } from "@/components/pharmacy-stats";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState<Pharmacy | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchPharmacies();
    }
  }, [user]);

  useEffect(() => {
    const channel = supabase
      .channel("pharmacies-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pharmacies" },
        (payload) => {
          console.log("Changement détecté :", payload);
          fetchPharmacies();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    } else {
      router.push("/admin/login");
    }
    setLoading(false);
  };

  const fetchPharmacies = async () => {
    try {
      const { data, error } = await supabase
        .from("pharmacies")
        .select("*")
        .order("name");
      if (error) throw error;
      setPharmacies(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des pharmacies :", error);
    }
  };

  const handleSave = async (data: Partial<Pharmacy>) => {
    try {
      let error;

      if (editingPharmacy) {
        const res = await supabase
          .from("pharmacies")
          .update(data)
          .eq("id", editingPharmacy.id);
        error = res.error;
      } else {
        const res = await supabase.from("pharmacies").insert([data]);
        error = res.error;
      }

      if (error) throw error;

      await fetchPharmacies();
      setShowForm(false);
      setEditingPharmacy(null);
    } catch (error: any) {
      if (error && typeof error === "object" && "message" in error) {
        console.error("Erreur Supabase :", error.message, error.details || "");
      } else {
        console.error("Erreur inconnue :", JSON.stringify(error, null, 2));
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("pharmacies").delete().eq("id", id);
      if (error) throw error;
      await fetchPharmacies();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Bloc gauche : icône + titre */}
            <div className="flex items-center gap-3">
              {/* Icône */}
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-lg shadow-md flex items-center justify-center">
                <CalendarRange className="w-5 h-5 text-white" />
              </div>
              {/* Titre principal */}
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">
                  Tableau de bord
                </h1>
                {/* Sous-titre masqué sur sm/md */}
                <p className="hidden lg:block text-sm text-gray-600">
                  Gestion des pharmacies
                </p>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Accueil</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Suspense fallback={<StatsLoading />}>
            <PharmacyStats />
          </Suspense>
        </div>
        {showForm ? (
          <PharmacyForm
            pharmacy={editingPharmacy || undefined}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingPharmacy(null);
            }}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <List />
                <h2 className="text-xl font-semibold">Liste des pharmacies</h2>
              </div>

              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une pharmacie
              </Button>
            </div>

            <div className="grid gap-4">
              {pharmacies.map((pharmacy) => (
                <Card key={pharmacy.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{pharmacy.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {pharmacy.address}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPharmacy(pharmacy);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmer la suppression
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer cette
                                pharmacie ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(pharmacy.id)}
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        Statut : {pharmacy.is_active ? "Active" : "Inactive"}
                      </span>
                      {pharmacy.phone && <span>Tél : {pharmacy.phone}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
}
