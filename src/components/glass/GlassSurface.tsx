"use client";

import React, { useEffect, useRef, useState, useId } from "react";

export interface GlassSurfaceProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: "R" | "G" | "B";
  yChannel?: "R" | "G" | "B";
  mixBlendMode?:
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten"
    | "color-dodge"
    | "color-burn"
    | "hard-light"
    | "soft-light"
    | "difference"
    | "exclusion"
    | "hue"
    | "saturation"
    | "color"
    | "luminosity";
  className?: string;
  style?: React.CSSProperties;
}

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDark;
};

const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  width = "auto",
  height = "auto",
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 55,
  opacity = 0.9,
  blur = 12,
  displace = 0,
  backgroundOpacity = 0.2,
  saturation = 1.4,
  distortionScale = -160,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = "R",
  yChannel = "G",
  mixBlendMode = "difference",
  className = "",
  style = {},
}) => {
  const id = useId().replace(/:/g, "");
  const filterId = `glass-filter-${id}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const isDark = useDarkMode();

  const generateMap = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const w = rect?.width || 300;
    const h = rect?.height || 120;
    const edge = Math.min(w, h) * borderWidth;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
        <rect width="${w}" height="${h}" fill="black"/>
        <rect rx="${borderRadius}" width="${w}" height="${h}"
          fill="hsl(0 0% ${brightness}% / ${opacity})"
          style="filter: blur(${blur}px)" />
        <rect x="${edge}" y="${edge}"
          rx="${borderRadius}"
          width="${w - edge * 2}"
          height="${h - edge * 2}"
          fill="white"/>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  useEffect(() => {
    feImageRef.current?.setAttribute("href", generateMap());
  }, [
    width,
    height,
    borderRadius,
    borderWidth,
    brightness,
    opacity,
    blur,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: isDark
          ? `rgba(0,0,0,${backgroundOpacity})`
          : `rgba(255,255,255,${backgroundOpacity})`,
        backdropFilter: `url(#${filterId}) saturate(${saturation})`,
        WebkitBackdropFilter: `url(#${filterId}) saturate(${saturation})`,
        ...style,
      }}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id={filterId}>
            <feImage
              ref={feImageRef}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={distortionScale + redOffset}
              xChannelSelector={xChannel}
              yChannelSelector={yChannel}
            />
          </filter>
        </defs>
      </svg>

      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export default GlassSurface;
