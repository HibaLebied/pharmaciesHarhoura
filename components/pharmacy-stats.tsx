"use client";

import { useEffect, useState } from "react";
import type { Pharmacy } from "@/types/pharmacy";
import { pharmacyService } from "@/lib/pharmacy-service";
import { isPharmacyOpen } from "@/lib/pharmacy-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Phone, Store } from "lucide-react";

export function PharmacyStats() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPharmacies();
    // Mettre à jour toutes les minutes
    const interval = setInterval(fetchPharmacies, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchPharmacies = async () => {
    try {
      const result = await pharmacyService.getPharmacies();
      setPharmacies(result.data);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const openPharmacies = pharmacies.filter(isPharmacyOpen);
  const closedPharmacies = pharmacies.filter((p) => !isPharmacyOpen(p));
  const pharmaciesWithPhone = pharmacies.filter((p) => p.phone);

  const stats = [
    {
      title: "Total pharmacies",
      value: pharmacies.length,
      icon: Store,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Ouvertes maintenant",
      value: openPharmacies.length,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Fermées",
      value: closedPharmacies.length,
      icon: Clock,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Avec téléphone",
      value: pharmaciesWithPhone.length,
      icon: Phone,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.title === "Ouvertes maintenant" &&
                `${Math.round(
                  (stat.value / pharmacies.length) * 100
                )}% du total`}
              {stat.title === "Total pharmacies" && "à Harhoura"}
              {stat.title === "Fermées" &&
                `${Math.round(
                  (stat.value / pharmacies.length) * 100
                )}% du total`}
              {stat.title === "Avec téléphone" &&
                `${Math.round(
                  (stat.value / pharmacies.length) * 100
                )}% du total`}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
