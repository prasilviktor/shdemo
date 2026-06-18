"use client";

import dynamic from "next/dynamic";
import type { MapPoint } from "./provider-map-multi-inner";

const Inner = dynamic(() => import("./provider-map-multi-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[400px] items-center justify-center bg-surface-2 text-[0.8667rem] text-ink-3">
      Načítám mapu…
    </div>
  ),
});

export type { MapPoint };

export function ProviderMapMulti(props: {
  points: MapPoint[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  height?: number | string;
}) {
  return <Inner {...props} />;
}
