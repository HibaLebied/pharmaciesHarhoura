import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone } from "lucide-react";
import {
  getCurrentDayStatus,
  formatOpeningHours,
  formatPhoneNumber,
} from "@/lib/pharmacy-utils";
import ItineraryButton from "@/components/ItineraryButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: pharmacy } = await supabase
    .from("pharmacies")
    .select("name")
    .eq("id", id)
    .single();

  return {
    title: pharmacy?.name || "Pharmacie",
    description: "Détails de la pharmacie et horaires d'ouverture",
  };
}

export default async function PharmacyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center sm:text-left">
        {pharmacy.name}
      </h1>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center text-gray-700">
          <MapPin className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2 text-gray-500" />
          <span className="text-base sm:text-lg">{pharmacy.address}</span>
        </div>

        {pharmacy.phone && (
          <div className="flex flex-col sm:flex-row sm:items-center text-gray-700">
            <Phone className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2 text-gray-500" />
            <span className="text-base sm:text-lg">
              {formatPhoneNumber(pharmacy.phone)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Statut actuel</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
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
            <span className="text-sm text-gray-500">
              {dayStatus.nextChange}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Horaires d'ouverture
        </h2>
        {pharmacy.opening_hours ? (
          <pre className="text-sm sm:text-base text-gray-700 whitespace-pre-line font-sans">
            {formatOpeningHours(pharmacy.opening_hours)}
          </pre>
        ) : (
          <p className="text-sm text-gray-500">Aucun horaire disponible.</p>
        )}
      </div>

      <div className="mt-8">
        <ItineraryButton latitude={latitude} longitude={longitude} />
      </div>
    </div>
  );
}
