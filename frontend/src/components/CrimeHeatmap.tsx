// @ts-ignore
import "leaflet.heat";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

type Crime = {
  latitude: number;
  longitude: number;
  severity: number;
};

export default function CrimeHeatmap({ crimes }: { crimes: Crime[] }) {
  const map = useMap();

  useEffect(() => {
    if (!crimes.length) return;

    const points = crimes.map(c => [
      c.latitude,
      c.longitude,
      c.severity || 1
    ]);

    // @ts-ignore
    const heat = L.heatLayer(points, {
      radius: 40,
      blur: 25,
      maxZoom: 17
    });

    heat.addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [crimes, map]);

  return null;
}
