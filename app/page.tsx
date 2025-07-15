import { Suspense } from "react";
import { PharmaciesList } from "@/components/pharmacies-list";
import { PharmaciesMap } from "@/components/pharmacies-map";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Cross,
  Building2,
  MapPin,
  List,
  Clock,
  Phone,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PharmacyStats } from "@/components/pharmacy-stats";
import NearestPharmacyButton from "@/components/NearestPharmacyButton";

export const metadata = {
  title: "Pharmacies Harhoura - Horaires & Localisation en temps réel",
  description:
    "Consultez la liste et la carte des pharmacies de Harhoura avec horaires d'ouverture en temps réel, localisation précise et contacts directs.",
  keywords: [
    "pharmacies Harhoura",
    "pharmacie de garde",
    "horaires pharmacie",
    "localisation pharmacie Harhoura",
    "pharmacie ouverte Harhoura",
    "Harhoura.ma",
  ],
  authors: [{ name: "Harhoura.ma", url: "https://harhoura.ma" }],
  creator: "Harhoura.ma",
  metadataBase: new URL("https://harhoura.ma"),
  openGraph: {
    title: "Pharmacies Harhoura",
    description:
      "Trouvez rapidement les pharmacies ouvertes à Harhoura. Carte interactive, horaires en temps réel et contacts.",
    url: "https://harhoura.ma",
    siteName: "Pharmacies Harhoura",
    images: [
      {
        url: "https://harhoura.ma/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pharmacies Harhoura",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pharmacies Harhoura",
    description:
      "Trouvez les pharmacies ouvertes à Harhoura. Liste et carte interactive avec horaires mis à jour.",
    images: ["https://harhoura.ma/og-image.png"],
    creator: "@harhoura_ma",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Titre principal (toujours visible) */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center">
                <Cross className="h-5 w-5 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-green-800">
                Pharmacies Harhoura
              </h1>
            </div>

            {/* Sous-texte et actions (cachés en mobile) */}
            <div className="hidden md:flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuration
                  </Button>
                </Link>
              </div>
              <NearestPharmacyButton />

              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Statut en temps réel</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Localisation précise</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                <span>Contacts directs</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Suspense fallback={<StatsLoading />}>
            <PharmacyStats />
          </Suspense>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="list" className="flex items-center">
              <List className="h-4 w-4 mr-2" />
              Liste des pharmacies
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Carte interactive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Suspense fallback={<PharmaciesListSkeleton />}>
              <PharmaciesList />
            </Suspense>
          </TabsContent>

          <TabsContent value="map">
            <Suspense
              fallback={
                <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
              }
            >
              <PharmaciesMap />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Harhoura.ma - Tous droits réservés</p>
            <p className="text-sm mt-2">
              Informations mises à jour en temps réel
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PharmaciesListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-md p-6 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      ))}
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
