"use client";

import { useMemo } from "react";

interface Light {
  id: number;
  x: number;
  y: number;
  size: number;
  color: "white" | "warm" | "blue";
  duration: number;
  delay: number;
}

export function TwinklingLights() {
  const lights = useMemo<Light[]>(() => {
    return [
      // Top header band (4% - 15% height in deep navy sky)
      { id: 1, x: 5, y: 6, size: 3, color: "white", duration: 3.2, delay: -0.4 },
      { id: 2, x: 12, y: 10, size: 4, color: "blue", duration: 2.8, delay: -1.2 }, // blue
      { id: 3, x: 21, y: 5, size: 3, color: "warm", duration: 4.1, delay: -2.3 },
      { id: 4, x: 29, y: 12, size: 2, color: "white", duration: 3.5, delay: -0.8 },
      { id: 5, x: 38, y: 7, size: 4, color: "white", duration: 2.4, delay: -1.9 },
      { id: 6, x: 47, y: 11, size: 3, color: "warm", duration: 3.9, delay: -3.1 },
      { id: 7, x: 56, y: 5, size: 4, color: "white", duration: 3.1, delay: -0.5 },
      { id: 8, x: 65, y: 9, size: 4, color: "blue", duration: 3.4, delay: -1.6 }, // blue
      { id: 9, x: 74, y: 6, size: 3, color: "white", duration: 4.4, delay: -2.7 },
      { id: 10, x: 82, y: 11, size: 4, color: "white", duration: 2.9, delay: -1.5 },
      { id: 11, x: 90, y: 5, size: 3, color: "warm", duration: 3.7, delay: -0.9 },
      { id: 12, x: 96, y: 10, size: 2, color: "white", duration: 4.0, delay: -2.1 },

      // Mid sky band (14% - 26% height)
      { id: 13, x: 3, y: 19, size: 4, color: "white", duration: 3.6, delay: -1.7 },
      { id: 14, x: 10, y: 25, size: 3, color: "warm", duration: 2.6, delay: -0.3 },
      { id: 15, x: 18, y: 17, size: 4, color: "white", duration: 4.2, delay: -3.4 },
      { id: 16, x: 26, y: 23, size: 3, color: "blue", duration: 3.3, delay: -1.4 }, // blue
      { id: 17, x: 35, y: 18, size: 2, color: "white", duration: 2.7, delay: -2.5 },
      { id: 18, x: 45, y: 22, size: 4, color: "warm", duration: 3.8, delay: -0.7 },
      { id: 19, x: 54, y: 16, size: 3, color: "white", duration: 4.5, delay: -3.9 },
      { id: 20, x: 63, y: 24, size: 4, color: "white", duration: 2.5, delay: -1.1 },
      { id: 21, x: 71, y: 18, size: 3, color: "warm", duration: 3.6, delay: -2.8 },
      { id: 22, x: 80, y: 22, size: 4, color: "blue", duration: 3.2, delay: -0.6 }, // blue
      { id: 23, x: 89, y: 17, size: 4, color: "white", duration: 3.0, delay: -1.8 },
      { id: 24, x: 95, y: 24, size: 2, color: "warm", duration: 4.3, delay: -2.4 },

      // Lower sky band (25% - 38% height)
      { id: 25, x: 7, y: 32, size: 3, color: "warm", duration: 3.4, delay: -2.2 },
      { id: 26, x: 15, y: 29, size: 4, color: "white", duration: 2.9, delay: -0.4 },
      { id: 27, x: 23, y: 35, size: 2, color: "white", duration: 4.1, delay: -3.2 },
      { id: 28, x: 33, y: 30, size: 3, color: "white", duration: 3.2, delay: -1.6 },
      { id: 29, x: 42, y: 33, size: 4, color: "blue", duration: 3.6, delay: -0.9 }, // blue
      { id: 30, x: 60, y: 31, size: 4, color: "warm", duration: 2.8, delay: -2.4 },
      { id: 31, x: 70, y: 34, size: 2, color: "white", duration: 4.0, delay: -1.3 },
      { id: 32, x: 79, y: 29, size: 3, color: "white", duration: 3.5, delay: -3.6 },
      { id: 33, x: 87, y: 32, size: 4, color: "warm", duration: 2.7, delay: -0.8 },
      { id: 34, x: 94, y: 36, size: 3, color: "white", duration: 4.2, delay: -1.7 },
    ];
  }, []);

  return (
    <div className="twinkling-sky" aria-hidden="true">
      {lights.map((light) => (
        <span
          key={light.id}
          className={`twinkle-light twinkle-${light.color}`}
          style={
            {
              left: `${light.x}%`,
              top: `${light.y}%`,
              width: `${light.size}px`,
              height: `${light.size * 2.2}px`,
              "--bulb-angle": `${(light.id % 5 - 2) * 9}deg`,
              "--twinkle-duration": `${light.duration}s`,
              "--twinkle-delay": `${light.delay}s`,
            } as React.CSSProperties
          }
        >
          <span className="mini-bulb-glass" />
        </span>
      ))}
    </div>
  );
}
