import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variables d'environnement Supabase manquantes")
  console.log("Assurez-vous d'avoir configuré :")
  console.log("- NEXT_PUBLIC_SUPABASE_URL")
  console.log("- NEXT_PUBLIC_SUPABASE_ANON_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log("🔄 Test de connexion à Supabase...")

    // Test de connexion basique
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("❌ Erreur de connexion:", error.message)
      return
    }

    console.log("✅ Connexion à Supabase réussie")

    // Test de la table pharmacies
    console.log("🔄 Vérification de la table pharmacies...")

    const { data: pharmacies, error: tableError } = await supabase
      .from("pharmacies")
      .select("count", { count: "exact", head: true })

    if (tableError) {
      if (tableError.message.includes("does not exist")) {
        console.log('⚠️  La table "pharmacies" n\'existe pas encore')
        console.log("📝 Exécutez le script create-pharmacies-table.sql dans Supabase")
      } else {
        console.error("❌ Erreur table:", tableError.message)
      }
      return
    }

    console.log("✅ Table pharmacies trouvée")
    console.log(`📊 Nombre de pharmacies: ${pharmacies?.count || 0}`)
  } catch (error) {
    console.error("❌ Erreur générale:", error.message)
  }
}

testConnection()
