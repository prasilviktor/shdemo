"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

function pin(label: string, active: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="transform:translate(-50%,-100%)">
      <svg width="34" height="42" viewBox="0 0 34 42" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 0C8 0 1 7 1 16c0 11 16 26 16 26s16-15 16-26C33 7 26 0 17 0z" fill="${active ? "#33603F" : "#4A7C5A"}"/>
        <circle cx="17" cy="16" r="11" fill="#fff"/>
        <text x="17" y="20" text-anchor="middle" font-size="10" font-weight="700" fill="${active ? "#33603F" : "#4A7C5A"}" font-family="DM Sans, sans-serif">${label}</text>
      </svg>
    </div>`,
    iconSize: [34, 42],
    iconAnchor: [0, 0],
  });
}

export type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  location: string;
  matchScore: number;
};

export default function ProviderMapMultiInner({
  points,
  activeId,
  onSelect,
  height = "100%",
}: {
  points: MapPoint[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  height?: number | string;
}) {
  const center: [number, number] = points.length
    ? [
        points.reduce((s, p) => s + p.lat, 0) / points.length,
        points.reduce((s, p) => s + p.lng, 0) / points.length,
      ]
    : [50.08, 14.42];

  return (
    <MapContainer
      center={center}
      zoom={11}
      scrollWheelZoom
      style={{ height, width: "100%" }}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {points.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={pin(`${p.matchScore}`, activeId === p.id)}
          eventHandlers={{ click: () => onSelect?.(p.id) }}
        >
          <Popup>
            <strong>{p.name}</strong>
            <br />
            {p.location} · {p.matchScore} % shoda
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
