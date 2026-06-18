"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";

// Vlastní marker (Leaflet default ikony se v bundleru rozbíjejí) — SVG pin v sage barvě.
const pinIcon = L.divIcon({
  className: "",
  html: `<div style="transform:translate(-50%,-100%)">
    <svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 23 15 23s15-12.5 15-23C30 6.7 23.3 0 15 0z" fill="#4A7C5A"/>
      <circle cx="15" cy="15" r="6" fill="#fff"/>
    </svg>
  </div>`,
  iconSize: [30, 38],
  iconAnchor: [0, 0],
});

export default function ProviderMapInner({
  lat,
  lng,
  name,
  location,
  height = 220,
}: {
  lat: number;
  lng: number;
  name: string;
  location: string;
  height?: number;
}) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height, width: "100%", borderRadius: "0.75rem" }}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // OpenStreetMap je zdarma a bez API klíče. Pro produkci s vyšším provozem
        // doporučujeme vlastní tile server nebo placený tile provider.
      />
      <Circle
        center={[lat, lng]}
        radius={350}
        pathOptions={{ color: "#4A7C5A", fillColor: "#4A7C5A", fillOpacity: 0.08, weight: 1 }}
      />
      <Marker position={[lat, lng]} icon={pinIcon}>
        <Popup>
          <strong>{name}</strong>
          <br />
          {location}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
