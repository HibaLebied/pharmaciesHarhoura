import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, Phone, Clock, Map } from "lucide-react";
import {
  getCurrentDayStatus,
  formatOpeningHours,
  formatPhoneNumber,
} from "@/lib/pharmacy-utils";
import ItineraryButton from "@/components/ItineraryButton"; // 👉 bouton itinéraire détecte client

export default async function PharmacyPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // 📡 Fetch Supabase côté serveur
  const { data: pharmacy, error } = await supabase
    .from("pharmacies")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !pharmacy) {
    return notFound();
  }

  const dayStatus = getCurrentDayStatus(pharmacy);
  const { latitude, longitude } = pharmacy;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{pharmacy.name}</h1>

      <div className="mb-4 flex items-center text-gray-600">
        <MapPin className="h-5 w-5 mr-2" />
        <span>{pharmacy.address}</span>
      </div>

      {pharmacy.phone && (
        <div className="mb-4 flex items-center text-gray-600">
          <Phone className="h-5 w-5 mr-2" />
          <span>{formatPhoneNumber(pharmacy.phone)}</span>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Statut actuel</h2>
        <div className="flex items-center gap-2">
          <Badge
            variant={dayStatus.isOpen ? "default" : "secondary"}
            className={
              dayStatus.isOpen
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600 text-white"
            }
          >
            {dayStatus.status}
          </Badge>
          {dayStatus.nextChange && (
            <span className="text-sm text-gray-600">
              {dayStatus.nextChange}
            </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Horaires d'ouverture</h2>
        {pharmacy.opening_hours ? (
          <pre className="text-sm text-gray-700 whitespace-pre-line font-sans">
            {formatOpeningHours(pharmacy.opening_hours)}
          </pre>
        ) : (
          <p className="text-sm text-gray-500">Aucun horaire disponible.</p>
        )}
      </div>

      {/* Bouton Itinéraire (Client Component) */}
      <div className="mt-8">
        <ItineraryButton latitude={latitude} longitude={longitude} />
      </div>
    </div>
  );
}
