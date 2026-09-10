"use client";

import { useMemo } from "react";

interface Bulb {
  id: number;
  x: number;
  y: number;
  angle: number;
  color: "white" | "blue";
  duration: number;
  delay: number;
}

function getCubicBezier(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  t: number
) {
  const mt = 1 - t;
  const x = mt * mt * mt * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t * t * t * p3[0];
  const y = mt * mt * mt * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t * t * t * p3[1];
  const dx = 3 * mt * mt * (p1[0] - p0[0]) + 6 * mt * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
  const dy = 3 * mt * mt * (p1[1] - p0[1]) + 6 * mt * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
  const slopeAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return { x, y, angle: slopeAngle * 0.25 };
}

export function ChristmasLights() {
  const bulbs = useMemo<Bulb[]>(() => {
    // Two natural drooping swags spanning the area above the heading
    const swag1: [[number, number], [number, number], [number, number], [number, number]] = [
      [15, 18],
      [95, 48],
      [225, 48],
      [315, 18],
    ];
    const swag2: [[number, number], [number, number], [number, number], [number, number]] = [
      [315, 18],
      [405, 48],
      [535, 48],
      [625, 18],
    ];

    const tValues = [0.08, 0.18, 0.28, 0.38, 0.50, 0.62, 0.72, 0.82, 0.92];

    // Mostly white with a couple of blue ones (accent positions 2, 6 in swag 1, and 2, 6 in swag 2)
    const list: Bulb[] = [];

    tValues.forEach((t, i) => {
      const pos = getCubicBezier(swag1[0], swag1[1], swag1[2], swag1[3], t);
      const isBlue = i === 2 || i === 6; // Blue accents
      list.push({
        id: i + 1,
        x: Math.round(pos.x * 10) / 10,
        y: Math.round(pos.y * 10) / 10,
        angle: Math.round(pos.angle * 10) / 10,
        color: isBlue ? "blue" : "white",
        duration: 2.2 + (i % 4) * 0.5,
        delay: -(i * 0.4),
      });
    });

    tValues.forEach((t, i) => {
      const pos = getCubicBezier(swag2[0], swag2[1], swag2[2], swag2[3], t);
      const isBlue = i === 2 || i === 6; // Blue accents
      list.push({
        id: i + 10,
        x: Math.round(pos.x * 10) / 10,
        y: Math.round(pos.y * 10) / 10,
        angle: Math.round(pos.angle * 10) / 10,
        color: isBlue ? "blue" : "white",
        duration: 2.4 + ((i + 2) % 4) * 0.5,
        delay: -((i + 3) * 0.35),
      });
    });

    return list;
  }, []);

  return (
    <div className="hero-christmas-lights" aria-hidden="true">
      <svg
        viewBox="0 0 640 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="c9-strand-svg"
      >
        <defs>
          {/* Warm White Bulb Gradient */}
          <radialGradient id="c9WhiteGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fff9e6" />
            <stop offset="75%" stopColor="#fde09e" />
            <stop offset="100%" stopColor="#eab308" stopOpacity="0.9" />
          </radialGradient>

          {/* Ice Blue Bulb Gradient */}
          <radialGradient id="c9BlueGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#bae6fd" />
            <stop offset="75%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </radialGradient>

          {/* Warm White Glow Filter */}
          <filter id="c9WhiteGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="blur1" />
            <feGaussianBlur stdDeviation="7" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Blue Glow Filter */}
          <filter id="c9BlueGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="blur1" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient background glow beneath the wire */}
        <path
          d="M 15 20 C 95 50, 225 50, 315 20 C 405 50, 535 50, 625 20"
          stroke="rgba(255, 244, 204, 0.18)"
          strokeWidth="16"
          strokeLinecap="round"
          filter="url(#c9WhiteGlow)"
        />

        {/* Deep Green/Black Cord */}
        <path
          d="M 15 19 C 95 49, 225 49, 315 19 C 405 49, 535 49, 625 19"
          stroke="#051009"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 15 18 C 95 48, 225 48, 315 18 C 405 48, 535 48, 625 18"
          stroke="#163824"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* C9 Bulbs hanging along the wire */}
        {bulbs.map((bulb) => {
          const isBlue = bulb.color === "blue";
          return (
            <g
              key={bulb.id}
              transform={`translate(${bulb.x}, ${bulb.y}) rotate(${bulb.angle})`}
              className={`c9-bulb-wrap c9-${bulb.color}`}
              style={
                {
                  "--pulse-duration": `${bulb.duration}s`,
                  "--pulse-delay": `${bulb.delay}s`,
                } as React.CSSProperties
              }
            >
              {/* Soft outer glow circle */}
              <circle
                cx="0"
                cy="12"
                r="14"
                fill={isBlue ? "rgba(56, 189, 248, 0.28)" : "rgba(253, 224, 158, 0.32)"}
                filter={isBlue ? "url(#c9BlueGlow)" : "url(#c9WhiteGlow)"}
              />

              {/* Socket cap (dark spruce green) */}
              <rect
                x="-3.5"
                y="-2"
                width="7"
                height="5"
                rx="1"
                fill="#0d2416"
                stroke="#051009"
                strokeWidth="0.8"
              />
              <rect x="-4.5" y="0" width="9" height="1.8" fill="#051009" rx="0.5" />

              {/* Classic Faceted C9 Bulb Shape */}
              <path
                d="M -5.5 3 C -8.5 8, -7.5 16, 0 24 C 7.5 16, 8.5 8, 5.5 3 Z"
                fill={isBlue ? "url(#c9BlueGrad)" : "url(#c9WhiteGrad)"}
                filter={isBlue ? "url(#c9BlueGlow)" : "url(#c9WhiteGlow)"}
                className="c9-bulb-glass"
              />

              {/* Bright glowing filament center */}
              <ellipse cx="0" cy="11" rx="1.8" ry="5.5" fill="#ffffff" opacity="0.95" />

              {/* Glass reflection highlight */}
              <path
                d="M -3 5.5 Q -4 11 -1.5 15"
                stroke="#ffffff"
                strokeWidth="0.9"
                strokeLinecap="round"
                fill="none"
                opacity="0.65"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
