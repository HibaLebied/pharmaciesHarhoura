# Pharmacies Harhoura

Sous-domaine dédié aux pharmacies de Harhoura avec page publique et dashboard administratif.

## 🚀 Configuration rapide

### 1. Variables d'environnement

Créez un fichier `.env.local` avec :

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service
\`\`\`

### 2. Base de données

1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor**
3. Exécutez le script `scripts/create-pharmacies-table.sql`

### 3. Test de connexion

\`\`\`bash
node scripts/test-connection.js
\`\`\`

## 📁 Structure du projet

\`\`\`
├── app/
│   ├── page.tsx              # Page d'accueil publique
│   └── admin/                # Dashboard administratif
├── components/
│   ├── pharmacies-list.tsx   # Liste des pharmacies
│   ├── pharmacies-map.tsx    # Carte interactive
│   └── pharmacy-card.tsx     # Carte individuelle
├── lib/
│   ├── supabase.ts          # Client Supabase
│   └── pharmacy-utils.ts    # Utilitaires horaires
└── scripts/
    └── create-pharmacies-table.sql  # Script d'initialisation
\`\`\`

## 🔧 Fonctionnalités

### Page publique (`/`)
- ✅ Liste des pharmacies avec statut temps réel
- ✅ Carte interactive
- ✅ Filtres et recherche
- ✅ Design responsive

### Dashboard admin (`/admin`)
- ✅ Authentification Supabase
- ✅ CRUD des pharmacies
- ✅ Statistiques

## 🛠️ Développement

\`\`\`bash
npm run dev
\`\`\`

L'application sera disponible sur `http://localhost:3000`

## 📊 Base de données

### Table `pharmacies`

| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| name | VARCHAR | Nom de la pharmacie |
| address | TEXT | Adresse complète |
| phone | VARCHAR | Numéro de téléphone |
| opening_hours | JSONB | Horaires d'ouverture |
| latitude | DECIMAL | Latitude GPS |
| longitude | DECIMAL | Longitude GPS |
| image_url | TEXT | URL de l'image |
| is_active | BOOLEAN | Statut actif/inactif |

### Format des horaires

\`\`\`json
{
  "lun": {"open": "08:00", "close": "20:00"},
  "mar": {"open": "08:00", "close": "20:00"},
  "mer": {"open": "08:00", "close": "20:00"},
  "jeu": {"open": "08:00", "close": "20:00"},
  "ven": {"open": "08:00", "close": "20:00"},
  "sam": {"open": "09:00", "close": "18:00"},
  "dim": {"closed": true}
}
\`\`\`

## 🔒 Sécurité

- Row Level Security (RLS) activé
- Lecture publique pour les pharmacies actives
- Modification réservée aux utilisateurs authentifiés

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints Tailwind CSS
- Interface adaptative tablette/desktop
