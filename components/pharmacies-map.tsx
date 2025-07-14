"use client"

import { useEffect, useState } from "react"
import type { Pharmacy } from "@/types/pharmacy"
import { pharmacyService } from "@/lib/pharmacy-service"
import { isPharmacyOpen } from "@/lib/pharmacy-utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function PharmaciesMap() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    fetchPharmacies()
  }, [])

  const fetchPharmacies = async () => {
    try {
      setLoading(true)
      const result = await pharmacyService.getPharmacies()

      setPharmacies(result.data)
      setIsDemo(result.isDemo)
    } catch (error) {
      console.error("Erreur lors du chargement des pharmacies:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Chargement de la carte...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Alerte mode démo */}
      {isDemo && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Mode démonstration</strong> - Positions simulées sur la carte
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Carte des pharmacies</h3>

        {/* Placeholder pour la carte - En production, utiliser Google Maps ou Leaflet */}
        <div className="h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="text-center z-10">
            <p className="text-gray-700 mb-2 font-medium">Carte interactive</p>
            <p className="text-sm text-gray-600">
              {pharmacies.length} pharmacie{pharmacies.length > 1 ? "s" : ""} à Harhoura
            </p>
            {isDemo && <p className="text-xs text-blue-600 mt-1">(Données de démonstration)</p>}
          </div>

          {/* Simulation de marqueurs avec animation */}
          {pharmacies.slice(0, 6).map((pharmacy, index) => (
            <div
              key={pharmacy.id}
              className={`absolute w-8 h-8 rounded-full border-3 border-white shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer ${
                isPharmacyOpen(pharmacy) ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
              style={{
                left: `${15 + index * 12}%`,
                top: `${25 + (index % 3) * 20}%`,
                animationDelay: `${index * 0.2}s`,
              }}
              title={`${pharmacy.name} - ${isPharmacyOpen(pharmacy) ? "Ouverte" : "Fermée"}`}
            >
              <div className="absolute inset-0 rounded-full bg-white bg-opacity-30"></div>
            </div>
          ))}

          {/* Effet de fond */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span>Ouverte</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Fermée</span>
            </div>
          </div>
          <p>Survolez les marqueurs pour plus d'infos</p>
        </div>
      </div>

      {/* Liste compacte sous la carte */}
      <div className="grid gap-3 md:grid-cols-2">
        {pharmacies.map((pharmacy) => (
          <div
            key={pharmacy.id}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{pharmacy.name}</h4>
              <p className="text-sm text-gray-600 truncate">{pharmacy.address}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${isPharmacyOpen(pharmacy) ? "bg-green-500" : "bg-red-500"}`} />
          </div>
        ))}
      </div>
    </div>
  )
}
