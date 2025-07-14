import type { Pharmacy } from "@/types/pharmacy";

/**
 * Typage pour un intervalle d'ouverture
 */
type OpeningInterval = {
  open: string; // format "HH:mm"
  close: string; // format "HH:mm"
};

/**
 * Vérifie si une pharmacie est ouverte à l'instant
 */
export function isPharmacyOpen(pharmacy: Pharmacy): boolean {
  const now = new Date();
  const currentDay = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"][
    now.getDay()
  ];
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const todayHours = pharmacy.opening_hours[currentDay];

  // 🟡 Si fermé aujourd’hui
  if (!todayHours || todayHours.closed) {
    return false;
  }

  // 🟢 Si ancien format { open, close }
  if (!Array.isArray(todayHours) && todayHours.open && todayHours.close) {
    const [openHour, openMin] = todayHours.open.split(":").map(Number);
    const [closeHour, closeMin] = todayHours.close.split(":").map(Number);

    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;

    return currentTime >= openTime && currentTime <= closeTime;
  }

  // 🟢 Si nouveau format (tableau de plages horaires)
  if (Array.isArray(todayHours)) {
    for (const interval of todayHours) {
      const [openHour, openMin] = interval.open.split(":").map(Number);
      const [closeHour, closeMin] = interval.close.split(":").map(Number);

      const openTime = openHour * 60 + openMin;
      const closeTime = closeHour * 60 + closeMin;

      if (currentTime >= openTime && currentTime <= closeTime) {
        return true; // Ouvert dans cette plage
      }
    }
  }

  return false; // Fermé
}

/**
 * Donne la prochaine heure d'ouverture
 */
export function getNextOpeningTime(pharmacy: Pharmacy): string | null {
  const now = new Date();
  const days = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];
  const dayNames = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(now.getDate() + i);
    const dayKey = days[checkDate.getDay()];
    const dayHours = pharmacy.opening_hours[dayKey] as OpeningInterval[];

    if (dayHours && dayHours.length > 0) {
      for (const interval of dayHours) {
        const [openHour, openMin] = interval.open.split(":").map(Number);
        const openTime = openHour * 60 + openMin;
        const currentTime =
          i === 0 ? now.getHours() * 60 + now.getMinutes() : 0;

        if (currentTime < openTime) {
          const dayLabel =
            i === 0 ? "Aujourd'hui" : dayNames[checkDate.getDay()];
          return `${dayLabel} à ${interval.open}`;
        }
      }
    }
  }

  return null; // Pas d'ouverture prévue dans les 7 jours
}

/**
 * Formate les horaires d'ouverture pour affichage
 */
export function formatOpeningHours(
  openingHours: Pharmacy["opening_hours"]
): string {
  const days = [
    { key: "lun", name: "Lundi" },
    { key: "mar", name: "Mardi" },
    { key: "mer", name: "Mercredi" },
    { key: "jeu", name: "Jeudi" },
    { key: "ven", name: "Vendredi" },
    { key: "sam", name: "Samedi" },
    { key: "dim", name: "Dimanche" },
  ];

  return days
    .map((day) => {
      const intervals = openingHours?.[day.key];

      // 🟡 Si pas défini ou si "closed: true"
      if (!intervals || (Array.isArray(intervals) && intervals.length === 0)) {
        return `${day.name}: Fermé`;
      }

      // 🟡 Si ancien format { open, close }
      if (!Array.isArray(intervals) && intervals.open && intervals.close) {
        return `${day.name}: ${intervals.open} - ${intervals.close}`;
      }

      // 🟢 Si c'est bien un tableau d'intervalles
      if (Array.isArray(intervals)) {
        const hoursStr = intervals
          .map(
            (interval: { open: string; close: string }) =>
              `${interval.open} - ${interval.close}`
          )
          .join(" / ");
        return `${day.name}: ${hoursStr}`;
      }

      return `${day.name}: Fermé`;
    })
    .join("\n");
}

/**
 * Statut actuel d'une pharmacie
 */
export function getCurrentDayStatus(pharmacy: Pharmacy): {
  isOpen: boolean;
  status: string;
  nextChange?: string;
} {
  const now = new Date();
  const currentDay = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"][
    now.getDay()
  ];
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const todayHours = pharmacy.opening_hours[currentDay];

  // 🟠 Jour fermé
  if (!todayHours || todayHours.closed) {
    const nextOpening = getNextOpeningTime(pharmacy);
    return {
      isOpen: false,
      status: "Fermé aujourd'hui",
      nextChange: nextOpening || undefined,
    };
  }

  // 🟢 Ancien format { open, close }
  if (!Array.isArray(todayHours) && todayHours.open && todayHours.close) {
    const [openHour, openMin] = todayHours.open.split(":").map(Number);
    const [closeHour, closeMin] = todayHours.close.split(":").map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;

    if (currentTime < openTime) {
      return {
        isOpen: false,
        status: "Fermé",
        nextChange: `Ouvre à ${todayHours.open}`,
      };
    }
    if (currentTime >= openTime && currentTime <= closeTime) {
      return {
        isOpen: true,
        status: "Ouvert",
        nextChange: `Ferme à ${todayHours.close}`,
      };
    }
  }

  // 🟢 Nouveau format (tableau de plages horaires)
  if (Array.isArray(todayHours)) {
    for (const interval of todayHours) {
      const [openHour, openMin] = interval.open.split(":").map(Number);
      const [closeHour, closeMin] = interval.close.split(":").map(Number);

      const openTime = openHour * 60 + openMin;
      const closeTime = closeHour * 60 + closeMin;

      if (currentTime < openTime) {
        return {
          isOpen: false,
          status: "Fermé",
          nextChange: `Ouvre à ${interval.open}`,
        };
      }
      if (currentTime >= openTime && currentTime <= closeTime) {
        return {
          isOpen: true,
          status: "Ouvert",
          nextChange: `Ferme à ${interval.close}`,
        };
      }
    }
  }

  const nextOpening = getNextOpeningTime(pharmacy);
  return {
    isOpen: false,
    status: "Fermé",
    nextChange: nextOpening || undefined,
  };
}

/**
 * Formate un numéro de téléphone marocain
 */
export function formatPhoneNumber(phone: string): string {
  if (phone.startsWith("+212")) {
    const number = phone.substring(4);
    if (number.length === 9) {
      return `+212 ${number.substring(0, 3)} ${number.substring(
        3,
        6
      )} ${number.substring(6)}`;
    }
  }
  return phone;
}

/**
 * Calcul la distance entre deux points GPS
 */
export function getDistanceFromUser(
  userLat: number,
  userLon: number,
  pharmacyLat: number,
  pharmacyLon: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = deg2rad(pharmacyLat - userLat);
  const dLon = deg2rad(pharmacyLon - userLon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(userLat)) *
      Math.cos(deg2rad(pharmacyLat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance en km
  return Math.round(d * 100) / 100; // Arrondir à 2 décimales
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
