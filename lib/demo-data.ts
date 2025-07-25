import type { Pharmacy } from "@/types/pharmacy";

export const DEMO_PHARMACIES: Pharmacy[] = [
  {
    id: "demo-1",
    name: "Pharmacie Centrale Harhoura",
    address: "Avenue Mohammed V, Centre Harhoura",
    phone: "+212537123456",
    opening_hours: {
      lun: { open: "08:00", close: "20:00" },
      mar: { open: "08:00", close: "20:00" },
      mer: { open: "08:00", close: "20:00" },
      jeu: { open: "08:00", close: "20:00" },
      ven: { open: "08:00", close: "20:00" },
      sam: { open: "09:00", close: "18:00" },
      dim: { closed: true },
    },
    latitude: 33.9716,
    longitude: -6.8498,
    image_url:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-2",
    name: "Pharmacie Al Amal",
    address: "Rue des Palmiers, Quartier Résidentiel",
    phone: "+212537789012",
    opening_hours: {
      lun: { open: "09:00", close: "19:00" },
      mar: { open: "09:00", close: "19:00" },
      mer: { open: "09:00", close: "19:00" },
      jeu: { open: "09:00", close: "19:00" },
      ven: { open: "09:00", close: "19:00" },
      sam: { open: "10:00", close: "17:00" },
      dim: { closed: true },
    },
    latitude: 33.972,
    longitude: -6.8505,
    image_url:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=200&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-3",
    name: "Pharmacie du Port",
    address: "Port de Plaisance Harhoura",
    phone: "+212537345678",
    opening_hours: {
      lun: { open: "08:30", close: "19:30" },
      mar: { open: "08:30", close: "19:30" },
      mer: { open: "08:30", close: "19:30" },
      jeu: { open: "08:30", close: "19:30" },
      ven: { open: "08:30", close: "19:30" },
      sam: { open: "09:00", close: "18:00" },
      dim: { open: "10:00", close: "16:00" },
    },
    latitude: 33.971,
    longitude: -6.849,
    image_url:
      "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=300&h=200&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-4",
    name: "Pharmacie Atlas",
    address: "Boulevard Atlas, Harhoura",
    phone: "+212537456789",
    opening_hours: {
      lun: { open: "08:00", close: "21:00" },
      mar: { open: "08:00", close: "21:00" },
      mer: { open: "08:00", close: "21:00" },
      jeu: { open: "08:00", close: "21:00" },
      ven: { open: "08:00", close: "21:00" },
      sam: { open: "09:00", close: "19:00" },
      dim: { open: "09:00", close: "17:00" },
    },
    latitude: 33.9725,
    longitude: -6.8485,
    image_url:
      "https://images.unsplash.com/photo-1585435557343-3b092031d8eb?w=300&h=200&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-5",
    name: "Pharmacie de la Plage",
    address: "Avenue de la Corniche",
    phone: "+212537567890",
    opening_hours: {
      lun: { open: "09:00", close: "20:00" },
      mar: { open: "09:00", close: "20:00" },
      mer: { open: "09:00", close: "20:00" },
      jeu: { open: "09:00", close: "20:00" },
      ven: { open: "09:00", close: "20:00" },
      sam: { open: "10:00", close: "18:00" },
      dim: { closed: true },
    },
    latitude: 33.97,
    longitude: -6.852,
    image_url:
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=200&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-6",
    name: "Pharmacie Moderne",
    address: "Centre Commercial Harhoura",
    phone: "+212537678901",
    opening_hours: {
      lun: { open: "10:00", close: "22:00" },
      mar: { open: "10:00", close: "22:00" },
      mer: { open: "10:00", close: "22:00" },
      jeu: { open: "10:00", close: "22:00" },
      ven: { open: "10:00", close: "22:00" },
      sam: { open: "10:00", close: "22:00" },
      dim: { open: "10:00", close: "20:00" },
    },
    latitude: 33.973,
    longitude: -6.8475,
    image_url:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];
