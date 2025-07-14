import type { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: "Administration - Pharmacies Harhoura",
  description:
    "Espace d'administration des pharmacies de Harhoura : gérez les informations, horaires et contacts en toute simplicité.",
  keywords: [
    "pharmacies Harhoura",
    "administration",
    "gestion pharmacies",
    "tableau de bord",
    "connexion administration",
    "Harhoura Maroc",
  ],
  robots: {
    index: false, // ❌ Ne pas indexer les pages admin
    follow: false,
  },
  openGraph: {
    title: "Administration - Pharmacies Harhoura",
    description:
      "Accédez à l'espace d'administration pour gérer les pharmacies de Harhoura.",
    url: "https://harhoura.ma/admin",
    siteName: "Pharmacies Harhoura",
    images: [
      {
        url: "https://harhoura.ma/og-admin.png", // ✅ Mets ici ton image OG
        width: 1200,
        height: 630,
        alt: "Administration Pharmacies Harhoura",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Administration - Pharmacies Harhoura",
    description:
      "Espace d'administration pour gérer les pharmacies Harhoura : horaires, contacts et localisation.",
    images: ["https://harhoura.ma/og-admin.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
