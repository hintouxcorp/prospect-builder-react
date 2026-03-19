import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents
} from "react-leaflet";
import { useEffect, useCallback, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import "./Map.css";

import LeadForm from "./LeadForm/LeadForm";
import SearchEngine from "./SearchEngine";
import MapFilter from "./MapFilter";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/* ================= LEAFLET FIX ================= */

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

/* ================= TYPES ================= */

export type Status =
  | "none"
  | "lead"
  | "interested"
  | "not_interested"
  | "client";

export type LeadType = "base" | "client";

export type House = {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  email?: string;
  phone?: string;
  whatsapp?: string;
  status: Status;
  type: LeadType;
  radius?: number;
};

type Crime = {
  latitude: number;
  longitude: number;
};

type LatLng = {
  lat: number;
  lng: number;
};

/* ================= CONFIG ================= */

const API = "http://127.0.0.1:8000/api/houses/";
const CRIME_API = "http://127.0.0.1:8000/api/crimes/";
const DEFAULT_RADIUS = 500;

/* ================= ICON ================= */

function statusColor(status: Status) {
  switch (status) {
    case "client":
      return "green";
    case "lead":
      return "blue";
    case "interested":
      return "orange";
    case "not_interested":
      return "red";
    default:
      return "grey";
  }
}

function getIcon(status: Status) {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${statusColor(
      status
    )}.png`,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });
}

/* ================= MAP CLICK ================= */

function MapClick({
  onAdd,
  disabled
}: {
  onAdd: (p: LatLng) => void;
  disabled?: boolean;
}) {
  useMapEvents({
    click: e => {
      if (disabled) return; // 🔥 impede criação quando necessário
      onAdd(e.latlng);
    }
  });

  return null;
}

/* ================= HEATMAP ================= */

function HeatLayer({ points }: { points: number[][] }) {
  const map = useMapEvents({});

  useEffect(() => {
    if (!points.length) return;

    const heat = (L as any).heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 16
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [points]);

  return null;
}

/* ================= MAIN ================= */

export default function Map() {
  const [houses, setHouses] = useState<House[]>([]);
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [selected, setSelected] = useState<House | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

  /* ================= FETCH HOUSES (COM FILTRO) ================= */

  const fetchHouses = useCallback(async (filter?: string | null) => {
    let url = API;

    if (filter) {
      url += `?business_type=${filter}`;
    }

    const res = await fetch(url, { credentials: "include" });
    const data = await res.json();

    setHouses(data);
  }, []);

  const fetchCrimes = useCallback(async () => {
    const res = await fetch(CRIME_API);
    setCrimes(await res.json());
  }, []);

  useEffect(() => {
    fetchHouses(null); // 🔥 carrega sem filtro
    fetchCrimes();
  }, [fetchHouses, fetchCrimes]);

  /* ================= CREATE ================= */

  function createHouse(pos: LatLng) {
    setSelected({
      name: "",
      latitude: pos.lat,
      longitude: pos.lng,
      status: "none",
      type: "base",
      radius: DEFAULT_RADIUS
    });
  }

  /* ================= SAVE ================= */

  async function saveHouse() {
    if (!selected) return;

    const method = selected.id ? "PUT" : "POST";
    const url = selected.id ? `${API}${selected.id}/` : API;

    await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected)
    });

    setSelected(null);
    fetchHouses(); // 🔥 mantém filtro? pode evoluir depois
  }

  /* ================= DELETE ================= */

  async function deleteHouse() {
    if (!selected?.id) return;

    await fetch(`${API}${selected.id}/`, {
      method: "DELETE",
      credentials: "include"
    });

    setSelected(null);
    fetchHouses();
  }

  /* ================= HEAT ================= */

  const heatPoints = crimes.map(c => [c.latitude, c.longitude, 1]);

  return (
    <>
      <SearchEngine onSearch={value => console.log("Pesquisar:", value)} />

      <button
        className="heat-toggle"
        onClick={() => setShowHeatmap(!showHeatmap)}
      >
        Heatmap: {showHeatmap ? "ON" : "OFF"}
      </button>

      <MapContainer
        center={[-22.28, -42.53]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🔥 BLOQUEIO OPCIONAL QUANDO FORM ABERTO */}
        <MapClick onAdd={createHouse} disabled={!!selected} />

        {/* 🔥 AQUI ESTÁ A CONEXÃO */}
        <MapFilter onFilter={fetchHouses} />

        {showHeatmap && <HeatLayer points={heatPoints} />}

        {houses.map(h => (
          <div key={h.id}>
            <Marker
              position={[h.latitude, h.longitude]}
              icon={getIcon(h.status)}
              eventHandlers={{ click: () => setSelected(h) }}
            />

            {h.type === "base" && h.radius && (
              <Circle
                center={[h.latitude, h.longitude]}
                radius={h.radius}
                pathOptions={{ fillOpacity: 0.15 }}
              />
            )}
          </div>
        ))}
      </MapContainer>

      {selected && (
        <LeadForm
          data={selected}
          onChange={setSelected}
          onSave={saveHouse}
          onCancel={() => setSelected(null)}
          onDelete={deleteHouse}
        />
      )}
    </>
  );
}