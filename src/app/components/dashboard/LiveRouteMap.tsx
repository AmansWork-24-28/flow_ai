import React, { useEffect, useRef, useState } from 'react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'hub' | 'depot' | 'stop';
  status: 'active' | 'congested' | 'offline';
}

interface RouteEdge {
  from: string;
  to: string;
  status: 'optimal' | 'congested' | 'bottleneck';
  vehicles: number;
}

interface VehicleDot {
  id: string;
  edgeFrom: string;
  edgeTo: string;
  progress: number; // 0–1
  speed: number;
}

interface MapData {
  nodes: Node[];
  edges: RouteEdge[];
}

const industryMaps: Record<string, MapData> = {
  logistics: {
    nodes: [
      { id: 'N1', label: 'Central Hub',    x: 50,  y: 45,  type: 'hub',   status: 'active' },
      { id: 'N2', label: 'North Depot',    x: 25,  y: 18,  type: 'depot', status: 'active' },
      { id: 'N3', label: 'South Depot',    x: 25,  y: 72,  type: 'depot', status: 'active' },
      { id: 'N4', label: 'East Zone',      x: 78,  y: 25,  type: 'stop',  status: 'congested' },
      { id: 'N5', label: 'West Zone',      x: 78,  y: 65,  type: 'stop',  status: 'active' },
      { id: 'N6', label: 'Airport Cargo',  x: 15,  y: 45,  type: 'stop',  status: 'active' },
      { id: 'N7', label: 'City Centre',    x: 60,  y: 82,  type: 'stop',  status: 'active' },
    ],
    edges: [
      { from: 'N1', to: 'N2', status: 'optimal',    vehicles: 3 },
      { from: 'N1', to: 'N3', status: 'optimal',    vehicles: 2 },
      { from: 'N1', to: 'N4', status: 'congested',  vehicles: 4 },
      { from: 'N1', to: 'N5', status: 'optimal',    vehicles: 2 },
      { from: 'N2', to: 'N6', status: 'optimal',    vehicles: 1 },
      { from: 'N3', to: 'N7', status: 'bottleneck', vehicles: 3 },
      { from: 'N4', to: 'N5', status: 'congested',  vehicles: 2 },
    ],
  },
  healthcare: {
    nodes: [
      { id: 'H1', label: 'Main Hospital', x: 50, y: 45, type: 'hub',   status: 'active' },
      { id: 'H2', label: 'Station Alpha', x: 20, y: 20, type: 'depot', status: 'active' },
      { id: 'H3', label: 'Station Beta',  x: 80, y: 20, type: 'depot', status: 'active' },
      { id: 'H4', label: 'Rural Clinic',  x: 15, y: 70, type: 'stop',  status: 'congested' },
      { id: 'H5', label: 'ICU Centre',    x: 82, y: 65, type: 'stop',  status: 'active' },
      { id: 'H6', label: 'Pharmacy Hub',  x: 50, y: 80, type: 'stop',  status: 'active' },
    ],
    edges: [
      { from: 'H1', to: 'H2', status: 'optimal',    vehicles: 2 },
      { from: 'H1', to: 'H3', status: 'optimal',    vehicles: 3 },
      { from: 'H1', to: 'H4', status: 'congested',  vehicles: 1 },
      { from: 'H1', to: 'H5', status: 'optimal',    vehicles: 2 },
      { from: 'H1', to: 'H6', status: 'bottleneck', vehicles: 2 },
      { from: 'H2', to: 'H4', status: 'congested',  vehicles: 1 },
    ],
  },
  transport: {
    nodes: [
      { id: 'T1', label: 'Central Station', x: 50, y: 48, type: 'hub',   status: 'active' },
      { id: 'T2', label: 'North Terminal',  x: 50, y: 12, type: 'depot', status: 'active' },
      { id: 'T3', label: 'East Terminal',   x: 85, y: 48, type: 'depot', status: 'active' },
      { id: 'T4', label: 'South Terminal',  x: 50, y: 85, type: 'depot', status: 'active' },
      { id: 'T5', label: 'West Terminal',   x: 15, y: 48, type: 'depot', status: 'active' },
      { id: 'T6', label: 'Airport Link',    x: 78, y: 20, type: 'stop',  status: 'congested' },
      { id: 'T7', label: 'Suburb Line',     x: 22, y: 78, type: 'stop',  status: 'active' },
    ],
    edges: [
      { from: 'T1', to: 'T2', status: 'optimal',    vehicles: 4 },
      { from: 'T1', to: 'T3', status: 'optimal',    vehicles: 3 },
      { from: 'T1', to: 'T4', status: 'congested',  vehicles: 4 },
      { from: 'T1', to: 'T5', status: 'optimal',    vehicles: 2 },
      { from: 'T2', to: 'T6', status: 'congested',  vehicles: 2 },
      { from: 'T5', to: 'T7', status: 'bottleneck', vehicles: 3 },
    ],
  },
};

const defaultMap: MapData = industryMaps.logistics;

function getMap(industryId: string | null): MapData {
  if (!industryId) return defaultMap;
  return industryMaps[industryId] ?? defaultMap;
}

const statusEdgeColor: Record<string, string> = {
  optimal:    '#22c55e',
  congested:  '#eab308',
  bottleneck: '#ef4444',
};
const statusNodeColor: Record<string, string> = {
  active:    '#3b82f6',
  congested: '#f97316',
  offline:   '#6b7280',
};
const typeNodeRadius: Record<string, number> = {
  hub:   18,
  depot: 13,
  stop:  9,
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface Props {
  industryId: string | null;
  optimized: boolean;
}

export function LiveRouteMap({ industryId, optimized }: Props) {
  const mapData = getMap(industryId);
  const W = 700;
  const H = 400;

  // Create a stable initial set of vehicle dots
  const initDots = (): VehicleDot[] => {
    const dots: VehicleDot[] = [];
    mapData.edges.forEach((edge) => {
      for (let v = 0; v < edge.vehicles; v++) {
        dots.push({
          id: `${edge.from}-${edge.to}-${v}`,
          edgeFrom: edge.from,
          edgeTo: edge.to,
          progress: v / edge.vehicles,
          speed: 0.0015 + Math.random() * 0.001,
        });
        // Return vehicles
        dots.push({
          id: `${edge.to}-${edge.from}-${v}`,
          edgeFrom: edge.to,
          edgeTo: edge.from,
          progress: (v + 0.5) / edge.vehicles,
          speed: 0.0012 + Math.random() * 0.001,
        });
      }
    });
    return dots;
  };

  const [dots, setDots] = useState<VehicleDot[]>(initDots);
  const animRef = useRef<number>(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let last = performance.now();
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      setDots(prev => prev.map(d => ({
        ...d,
        progress: (d.progress + d.speed * dt) % 1,
      })));
      setTick(t => t + 1);
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const nodeMap = Object.fromEntries(mapData.nodes.map(n => [n.id, n]));

  const px = (pct: number) => (pct / 100) * W;
  const py = (pct: number) => (pct / 100) * H;

  // Pulse animation for nodes
  const pulseR = (r: number) => r + Math.sin(tick * 0.05) * 2;

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
      {/* Grid background */}
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="block">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
          </pattern>
          {/* Glow filters */}
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-yellow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-red">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Animated dash */}
          <style>{`
            @keyframes dash { to { stroke-dashoffset: -40; } }
            .route-line { animation: dash 1.5s linear infinite; }
          `}</style>
        </defs>

        {/* Grid */}
        <rect width={W} height={H} fill="url(#grid)" />
        <rect width={W} height={H} fill="rgba(15,23,42,0.6)" />

        {/* Edges */}
        {mapData.edges.map((edge) => {
          const a = nodeMap[edge.from];
          const b = nodeMap[edge.to];
          if (!a || !b) return null;
          const col = optimized ? '#22c55e' : statusEdgeColor[edge.status];
          const filter = optimized ? 'url(#glow-green)' : edge.status === 'bottleneck' ? 'url(#glow-red)' : edge.status === 'congested' ? 'url(#glow-yellow)' : 'url(#glow-green)';
          return (
            <g key={`${edge.from}-${edge.to}`}>
              {/* Shadow line */}
              <line
                x1={px(a.x)} y1={py(a.y)} x2={px(b.x)} y2={py(b.y)}
                stroke={col} strokeWidth={6} opacity={0.15}
              />
              {/* Animated dashed route line */}
              <line
                x1={px(a.x)} y1={py(a.y)} x2={px(b.x)} y2={py(b.y)}
                stroke={col} strokeWidth={2} opacity={0.8}
                strokeDasharray="8 4"
                className="route-line"
                filter={filter}
              />
            </g>
          );
        })}

        {/* Vehicle dots */}
        {dots.map((dot) => {
          const fromNode = nodeMap[dot.edgeFrom];
          const toNode = nodeMap[dot.edgeTo];
          if (!fromNode || !toNode) return null;
          const edge = mapData.edges.find(
            e => (e.from === dot.edgeFrom && e.to === dot.edgeTo) || (e.from === dot.edgeTo && e.to === dot.edgeFrom)
          );
          const col = optimized ? '#22c55e' : (edge ? statusEdgeColor[edge.status] : '#22c55e');
          const cx = lerp(px(fromNode.x), px(toNode.x), dot.progress);
          const cy = lerp(py(fromNode.y), py(toNode.y), dot.progress);
          return (
            <g key={dot.id}>
              <circle cx={cx} cy={cy} r={5} fill={col} opacity={0.25} />
              <circle cx={cx} cy={cy} r={3} fill={col} />
              <circle cx={cx} cy={cy} r={1.5} fill="white" />
            </g>
          );
        })}

        {/* Nodes */}
        {mapData.nodes.map((node) => {
          const col = optimized ? '#3b82f6' : statusNodeColor[node.status];
          const r = typeNodeRadius[node.type];
          const pr = pulseR(r);
          return (
            <g key={node.id}>
              {/* Pulse ring */}
              <circle cx={px(node.x)} cy={py(node.y)} r={pr + 6} fill={col} opacity={0.1} />
              <circle cx={px(node.x)} cy={py(node.y)} r={pr + 2} fill={col} opacity={0.2} />
              {/* Node body */}
              <circle cx={px(node.x)} cy={py(node.y)} r={r} fill="#0f172a" stroke={col} strokeWidth={2} />
              <circle cx={px(node.x)} cy={py(node.y)} r={r - 4} fill={col} opacity={0.3} />
              {/* Hub icon dot */}
              {node.type === 'hub' && (
                <circle cx={px(node.x)} cy={py(node.y)} r={4} fill={col} />
              )}
              {/* Label */}
              <text
                x={px(node.x)}
                y={py(node.y) + r + 14}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize={10}
                fontFamily="monospace"
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {/* Live badge */}
        <g>
          <rect x={W - 70} y={8} width={62} height={20} rx={4} fill="#ef4444" opacity={0.15} />
          <circle cx={W - 58} cy={18} r={4} fill="#ef4444">
            <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
          </circle>
          <text x={W - 50} y={22} fill="#ef4444" fontSize={11} fontFamily="sans-serif" fontWeight="600">LIVE</text>
        </g>
      </svg>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-400 bg-slate-900/60">
        {[
          { color: '#22c55e', label: 'Optimal' },
          { color: '#eab308', label: 'Congested' },
          { color: '#ef4444', label: 'Bottleneck' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-8 border-t-2 border-dashed" style={{ borderColor: l.color }} />
            <span>{l.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-4">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400 border-2 border-blue-400" />
          <span>Hub / Major Node</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white" />
          <span>Moving Vehicle</span>
        </div>
      </div>
    </div>
  );
}
