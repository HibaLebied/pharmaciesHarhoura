"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Copy, ExternalLink, Database, Code, Settings } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function SetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const steps = [
    {
      title: "Créer un projet Supabase",
      description: "Rendez-vous sur supabase.com et créez un nouveau projet",
      action: (
        <Button variant="outline" size="sm" asChild>
          <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ouvrir Supabase
          </a>
        </Button>
      ),
    },
    {
      title: "Configurer les variables d'environnement",
      description: "Créez un fichier .env.local avec vos clés Supabase",
      code: `NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service`,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            copyToClipboard(
              `NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service`,
              2,
            )
          }
        >
          <Copy className="h-4 w-4 mr-2" />
          {copiedStep === 2 ? "Copié !" : "Copier"}
        </Button>
      ),
    },
    {
      title: "Exécuter le script SQL",
      description: "Dans l'éditeur SQL de Supabase, exécutez le script d'initialisation",
      action: (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/scripts/create-pharmacies-table.sql" target="_blank" rel="noreferrer">
              <Code className="h-4 w-4 mr-2" />
              Voir le script
            </a>
          </Button>
        </div>
      ),
    },
    {
      title: "Redémarrer l'application",
      description: "Redémarrez votre serveur de développement pour prendre en compte les changements",
      code: "npm run dev",
      action: (
        <Button variant="outline" size="sm" onClick={() => copyToClipboard("npm run dev", 4)}>
          <Copy className="h-4 w-4 mr-2" />
          {copiedStep === 4 ? "Copié !" : "Copier"}
        </Button>
      ),
    },
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Guide de configuration Supabase
        </CardTitle>
        <CardDescription>
          Suivez ces étapes pour connecter votre application à Supabase et utiliser des données réelles.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-blue-200 bg-blue-50">
          <Database className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Mode actuel :</strong> Démonstration avec données d'exemple
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 p-4 border rounded-lg">
              <div className="flex-shrink-0">
                <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                  {index + 1}
                </Badge>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
                {step.code && (
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                    <code>{step.code}</code>
                  </pre>
                )}
                <div>{step.action}</div>
              </div>
            </div>
          ))}
        </div>

        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Une fois configuré, l'application basculera automatiquement vers les données Supabase et vous pourrez gérer
            les pharmacies via le dashboard administratif.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
