"use client";

type BarItem = { label: string; value: number; color?: string };

export function BarChart({ data, height = 160 }: { data: BarItem[]; height?: number }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 300;
  const pad = 26;
  const bw = 38;
  const gap = 12;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: "100%", overflow: "visible" }}>
      {data.map((d, i) => {
        const bh = Math.max(3, (d.value / max) * (height - 44));
        const x = pad + i * (bw + gap);
        const y = height - 24 - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} rx={5} fill={d.color || "var(--blue)"} opacity={0.8} />
            <text
              x={x + bw / 2}
              y={height - 6}
              textAnchor="middle"
              fill="#8e8e93"
              fontSize={9}
              fontFamily="Inter,system-ui"
            >
              {d.label.slice(0, 8)}
            </text>
            <text
              x={x + bw / 2}
              y={y - 5}
              textAnchor="middle"
              fill="#1d1d1f"
              fontSize={11}
              fontWeight={700}
              fontFamily="Inter,system-ui"
            >
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function LineChart({ data, height = 160 }: { data: BarItem[]; height?: number }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 300;
  const pad = 20;
  const inner = w - pad * 2;
  const points = data.map((d, i) => ({
    x: pad + i * (inner / Math.max(1, data.length - 1)),
    y: height - 22 - (d.value / max) * (height - 40),
    v: d.value,
    l: d.label,
  }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  const area = `${path} L${last.x},${height - 22} L${first.x},${height - 22} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: "100%", overflow: "visible" }}>
      <defs>
        <linearGradient id="blug" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0071e3" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#0071e3" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#blug)" />
      <path
        d={path}
        stroke="var(--blue)"
        strokeWidth={2.5}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3.5} fill="var(--blue)" stroke="white" strokeWidth={1.5} />
          <text
            x={p.x}
            y={p.y - 9}
            textAnchor="middle"
            fill="#1d1d1f"
            fontSize={10}
            fontWeight={700}
            fontFamily="Inter"
          >
            {p.v}
          </text>
          <text
            x={p.x}
            y={height - 5}
            textAnchor="middle"
            fill="#8e8e93"
            fontSize={9}
            fontFamily="Inter"
          >
            {p.l}
          </text>
        </g>
      ))}
    </svg>
  );
}
