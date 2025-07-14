"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Pharmacy } from "@/lib/supabase";

interface PharmacyFormProps {
  pharmacy?: Pharmacy;
  onSave: (data: Partial<Pharmacy>) => Promise<void>;
  onCancel: () => void;
}

const days = [
  { key: "monday", label: "Lundi" },
  { key: "tuesday", label: "Mardi" },
  { key: "wednesday", label: "Mercredi" },
  { key: "thursday", label: "Jeudi" },
  { key: "friday", label: "Vendredi" },
  { key: "saturday", label: "Samedi" },
  { key: "sunday", label: "Dimanche" },
];

const dayKeys = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];

type Interval = { open: string; close: string };

type OpeningHoursForm = Record<
  string,
  { closed: boolean; intervals: Interval[] }
>;

function formatOpeningHoursForForm(hours: any): OpeningHoursForm {
  const result: OpeningHoursForm = {};
  days.forEach((day, i) => {
    const dayData = hours?.[dayKeys[i]];
    if (Array.isArray(dayData)) {
      result[day.key] = {
        closed: false,
        intervals: dayData,
      };
    } else if (dayData?.closed) {
      result[day.key] = { closed: true, intervals: [] };
    } else if (dayData?.open && dayData?.close) {
      result[day.key] = {
        closed: false,
        intervals: [{ open: dayData.open, close: dayData.close }],
      };
    } else {
      result[day.key] = { closed: true, intervals: [] };
    }
  });
  return result;
}

function formatOpeningHoursForSave(
  hours: OpeningHoursForm
): Record<string, any> {
  const result: Record<string, any> = {};
  days.forEach((day, i) => {
    const value = hours[day.key];
    if (value.closed || value.intervals.length === 0) {
      result[dayKeys[i]] = { closed: true };
    } else {
      result[dayKeys[i]] = value.intervals;
    }
  });
  return result;
}

export function PharmacyForm({
  pharmacy,
  onSave,
  onCancel,
}: PharmacyFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: pharmacy?.name || "",
    address: pharmacy?.address || "",
    phone: pharmacy?.phone || "",
    latitude: pharmacy?.latitude?.toString() || "",
    longitude: pharmacy?.longitude?.toString() || "",
    image_url: pharmacy?.image_url || "",
    is_active: pharmacy?.is_active || false,
    opening_hours: pharmacy
      ? formatOpeningHoursForForm(pharmacy.opening_hours)
      : days.reduce((acc, day) => {
          acc[day.key] = {
            closed: false,
            intervals: [{ open: "", close: "" }],
          };
          return acc;
        }, {} as OpeningHoursForm),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        opening_hours: formatOpeningHoursForSave(formData.opening_hours),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {pharmacy ? "Modifier la pharmacie" : "Ajouter une pharmacie"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Adresse</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image_url">URL de l’image</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div>
            <Label>Horaires d’ouverture</Label>
            <div className="space-y-4 mt-2">
              {days.map((day) => (
                <div key={day.key} className="border p-2 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{day.label}</Label>
                    <Switch
                      checked={formData.opening_hours[day.key].closed}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          opening_hours: {
                            ...formData.opening_hours,
                            [day.key]: {
                              ...formData.opening_hours[day.key],
                              closed: checked,
                              intervals: checked
                                ? []
                                : [{ open: "", close: "" }],
                            },
                          },
                        })
                      }
                    />
                    <span>
                      {formData.opening_hours[day.key].closed
                        ? "Fermée"
                        : "Ouverte"}
                    </span>
                  </div>

                  {!formData.opening_hours[day.key].closed && (
                    <div className="space-y-2">
                      {formData.opening_hours[day.key].intervals.map(
                        (interval, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={interval.open}
                              onChange={(e) => {
                                const updatedIntervals = [
                                  ...formData.opening_hours[day.key].intervals,
                                ];
                                updatedIntervals[idx].open = e.target.value;
                                setFormData({
                                  ...formData,
                                  opening_hours: {
                                    ...formData.opening_hours,
                                    [day.key]: {
                                      ...formData.opening_hours[day.key],
                                      intervals: updatedIntervals,
                                    },
                                  },
                                });
                              }}
                            />
                            <span>-</span>
                            <Input
                              type="time"
                              value={interval.close}
                              onChange={(e) => {
                                const updatedIntervals = [
                                  ...formData.opening_hours[day.key].intervals,
                                ];
                                updatedIntervals[idx].close = e.target.value;
                                setFormData({
                                  ...formData,
                                  opening_hours: {
                                    ...formData.opening_hours,
                                    [day.key]: {
                                      ...formData.opening_hours[day.key],
                                      intervals: updatedIntervals,
                                    },
                                  },
                                });
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const updatedIntervals = formData.opening_hours[
                                  day.key
                                ].intervals.filter((_, i) => i !== idx);
                                setFormData({
                                  ...formData,
                                  opening_hours: {
                                    ...formData.opening_hours,
                                    [day.key]: {
                                      ...formData.opening_hours[day.key],
                                      intervals: updatedIntervals,
                                    },
                                  },
                                });
                              }}
                            >
                              Supprimer
                            </Button>
                          </div>
                        )
                      )}

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            opening_hours: {
                              ...formData.opening_hours,
                              [day.key]: {
                                ...formData.opening_hours[day.key],
                                intervals: [
                                  ...formData.opening_hours[day.key].intervals,
                                  { open: "", close: "" },
                                ],
                              },
                            },
                          });
                        }}
                      >
                        Ajouter un créneau
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
