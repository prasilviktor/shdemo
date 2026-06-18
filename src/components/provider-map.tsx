"use client";

import dynamic from "next/dynamic";

// Leaflet potřebuje window → vypneme SSR.
const ProviderMapInner = dynamic(() => import("./provider-map-inner"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center rounded-xl bg-surface-2 text-[0.8667rem] text-ink-3"
      style={{ height: 220 }}
    >
      Načítám mapu…
    </div>
  ),
});

export function ProviderMap(props: {
  lat: number;
  lng: number;
  name: string;
  location: string;
  height?: number;
}) {
  return <ProviderMapInner {...props} />;
}
