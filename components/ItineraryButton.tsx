"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Map } from "lucide-react";

interface ItineraryButtonProps {
  latitude: number;
  longitude: number;
}

export default function ItineraryButton({
  latitude,
  longitude,
}: ItineraryButtonProps) {
  const [preferredMap, setPreferredMap] = useState<string>("");

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${latitude},${longitude}`;
  const wazeUrl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setPreferredMap("apple");
    } else if (/android/i.test(userAgent)) {
      setPreferredMap("google");
    } else {
      setPreferredMap("menu"); // 🖥️ Desktop fallback
    }
  }, []);

  const openPreferredMap = () => {
    if (preferredMap === "apple") {
      window.open(appleMapsUrl, "_blank");
    } else if (preferredMap === "google") {
      window.open(googleMapsUrl, "_blank");
    }
  };

  return preferredMap !== "menu" ? (
    <Button onClick={openPreferredMap}>
      <Map className="h-5 w-5 mr-2" />
      Ouvrir dans {preferredMap === "apple" ? "Apple Maps" : "Google Maps"}
    </Button>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Map className="h-5 w-5 mr-2" />
          Choisir l’application
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            Google Maps
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a
            href={appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            Apple Maps
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            Waze
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
