"use client"

import { useEffect, useState } from "react"
import { pharmacyService } from "@/lib/pharmacy-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Database, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "demo" | "error">("checking")
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    try {
      const result = await pharmacyService.checkConnection()

      if (result.connected) {
        setStatus("connected")
      } else {
        setStatus("demo")
        setError(result.error || "Connexion impossible")
      }
    } catch (err) {
      setStatus("error")
      setError("Erreur de vérification")
    }
  }

  const retryConnection = () => {
    setStatus("checking")
    checkDatabaseStatus()
  }

  if (status === "checking") {
    return (
      <Alert>
        <Database className="h-4 w-4 animate-spin" />
        <AlertTitle>Vérification de la base de données...</AlertTitle>
        <AlertDescription>Connexion en cours...</AlertDescription>
      </Alert>
    )
  }

  if (status === "connected") {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Base de données connectée</AlertTitle>
        <AlertDescription className="text-green-700">
          Supabase est configuré et opérationnel. Les données sont synchronisées en temps réel.
        </AlertDescription>
      </Alert>
    )
  }

  if (status === "demo") {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Mode démonstration</AlertTitle>
        <AlertDescription className="text-blue-700">
          <div className="space-y-2">
            <p>L'application fonctionne avec des données d'exemple.</p>

            {showDetails && (
              <div className="text-sm bg-blue-100 p-3 rounded border">
                <p className="font-medium mb-2">Détails de l'erreur :</p>
                <p className="text-blue-800">{error}</p>

                <div className="mt-3">
                  <p className="font-medium mb-1">Pour configurer Supabase :</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Créez un projet sur supabase.com</li>
                    <li>Ajoutez les variables d'environnement</li>
                    <li>Exécutez le script create-pharmacies-table.sql</li>
                    <li>Actualisez la page</li>
                  </ol>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-700 border-blue-300"
              >
                {showDetails ? "Masquer" : "Voir"} les détails
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={retryConnection}
                className="text-blue-700 border-blue-300 bg-transparent"
              >
                Réessayer
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erreur de configuration</AlertTitle>
      <AlertDescription>
        <div className="space-y-2">
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={retryConnection}>
            Réessayer
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
