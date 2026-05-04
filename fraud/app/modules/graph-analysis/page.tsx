"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Tiny force-directed graph simulation (no D3 dependency) ───────────────
interface SimNode {
  id: string;
  group: number;
  size: number;
  suspicious?: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null;
  fy: number | null;
}

interface SimLink {
  source: string | SimNode;
  target: string | SimNode;
  value: number;
}

function runForceSimulation(
  nodes: SimNode[],
  links: SimLink[],
  width: number,
  height: number,
  iterations = 200
) {
  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  // Resolve link references
  const resolvedLinks = links.map((l) => ({
    source: typeof l.source === "string" ? nodeById.get(l.source)! : l.source,
    target: typeof l.target === "string" ? nodeById.get(l.target)! : l.target,
    value: l.value,
  }));

  // Random initial positions
  nodes.forEach((n) => {
    if (n.x === 0 && n.y === 0) {
      n.x = width / 2 + (Math.random() - 0.5) * 200;
      n.y = height / 2 + (Math.random() - 0.5) * 200;
    }
  });

  const alpha = { value: 1 };
  const alphaDecay = 0.02;
  const velocityDecay = 0.4;

  for (let iter = 0; iter < iterations; iter++) {
    alpha.value *= 1 - alphaDecay;
    if (alpha.value < 0.001) break;

    // Repulsion (charge)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = b.x - a.x || 0.01;
        const dy = b.y - a.y || 0.01;
        const dist2 = dx * dx + dy * dy;
        const strength = -300 / dist2;
        const fx = strength * dx;
        const fy = strength * dy;
        a.vx -= fx;
        a.vy -= fy;
        b.vx += fx;
        b.vy += fy;
      }
    }

    // Centering
    nodes.forEach((n) => {
      n.vx += (width / 2 - n.x) * 0.01 * alpha.value;
      n.vy += (height / 2 - n.y) * 0.01 * alpha.value;
    });

    // Link force
    resolvedLinks.forEach(({ source, target, value }) => {
      if (!source || !target) return;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const targetDist = 100;
      const strength = ((dist - targetDist) / dist) * 0.3 * alpha.value;
      source.vx += dx * strength;
      source.vy += dy * strength;
      target.vx -= dx * strength;
      target.vy -= dy * strength;
    });

    // Integrate
    nodes.forEach((n) => {
      if (n.fx !== null) { n.x = n.fx; n.vx = 0; }
      else { n.vx *= velocityDecay; n.x = Math.max(20, Math.min(width - 20, n.x + n.vx)); }
      if (n.fy !== null) { n.y = n.fy; n.vy = 0; }
      else { n.vy *= velocityDecay; n.y = Math.max(20, Math.min(height - 20, n.y + n.vy)); }
    });
  }

  return { nodes, links: resolvedLinks };
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function GraphAnalysisPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<SimNode | null>(null);
  const [minWeight, setMinWeight] = useState(1);
  const [graphData, setGraphData] = useState<{ nodes: SimNode[]; links: SimLink[] }>({
    nodes: [],
    links: [],
  });

  // Simulated nodes & links state (post-simulation)
  const simRef = useRef<{ nodes: SimNode[]; links: { source: SimNode; target: SimNode; value: number }[] }>({
    nodes: [],
    links: [],
  });

  useEffect(() => {
    fetch("http://localhost:8000/graph/suspicious-clusters")
      .then((res) => res.json())
      .then((data) =>
        setGraphData({
          nodes: data.nodes.map((n: any) => ({
            ...n, x: 0, y: 0, vx: 0, vy: 0, fx: null, fy: null,
          })),
          links: data.links,
        })
      )
      .catch(() => {
        // Fallback demo data when backend offline
        setGraphData({
          nodes: [
            { id: "U1", group: 1, size: 10, x: 0, y: 0, vx: 0, vy: 0, fx: null, fy: null },
            { id: "U2", group: 2, size: 20, x: 0, y: 0, vx: 0, vy: 0, fx: null, fy: null },
            { id: "U3", group: 2, size: 15, suspicious: true, x: 0, y: 0, vx: 0, vy: 0, fx: null, fy: null },
            { id: "U4", group: 1, size: 8, x: 0, y: 0, vx: 0, vy: 0, fx: null, fy: null },
            { id: "U5", group: 3, size: 30, suspicious: true, x: 0, y: 0, vx: 0, vy: 0, fx: null, fy: null },
          ],
          links: [
            { source: "U1", target: "U2", value: 3 },
            { source: "U2", target: "U3", value: 8 },
            { source: "U3", target: "U4", value: 2 },
            { source: "U4", target: "U5", value: 6 },
            { source: "U1", target: "U5", value: 4 },
          ],
        });
      });
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { nodes, links } = simRef.current;
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Links
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.5;
    links.forEach(({ source, target, value }) => {
      if (!source || !target) return;
      ctx.beginPath();
      ctx.lineWidth = Math.min(value, 6);
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
    });

    // Nodes
    nodes.forEach((n) => {
      const r = Math.max(n.size / 2, 8);
      // Glow for suspicious nodes
      if (n.suspicious) {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2.5);
        grad.addColorStop(0, "rgba(239,68,68,0.4)");
        grad.addColorStop(1, "rgba(239,68,68,0)");
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.5, 0, 2 * Math.PI);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      // Node circle
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
      ctx.fillStyle = n.suspicious ? "#ef4444" : "#3b82f6";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      // Label
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(n.id, n.x, n.y);
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || graphData.nodes.length === 0) return;

    const W = canvas.offsetWidth || 800;
    const H = canvas.offsetHeight || 580;
    canvas.width = W;
    canvas.height = H;

    // Deep clone to avoid mutating state
    const nodes: SimNode[] = graphData.nodes.map((n) => ({ ...n }));
    const filteredLinks = graphData.links.filter((l: any) => (l.value ?? 1) >= minWeight);

    const { nodes: simNodes, links: simLinks } = runForceSimulation(nodes, filteredLinks as SimLink[], W, H, 300);
    simRef.current = { nodes: simNodes, links: simLinks as any };
    draw();

    // Click to select node
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const hit = simRef.current.nodes.find((n) => {
        const r = Math.max(n.size / 2, 8);
        return Math.hypot(n.x - mx, n.y - my) <= r;
      });
      setSelectedNode(hit ?? null);
    };

    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [graphData, minWeight, draw]);

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <div className="flex-1 flex flex-col p-6 min-w-0">
        <h1 className="text-3xl font-bold mb-4">Graph Analysis &amp; Deep Networks</h1>

        <div className="mb-4 flex items-center gap-4">
          <label className="text-slate-300 text-sm font-medium">Min Edge Weight Filter:</label>
          <input
            type="range"
            min="1"
            max="10"
            value={minWeight}
            onChange={(e) => setMinWeight(parseInt(e.target.value))}
            className="w-48 accent-blue-500"
          />
          <span className="font-mono text-blue-400 w-4">{minWeight}</span>
          <span className="text-slate-500 text-xs ml-4">
            🔴 = Suspicious cluster &nbsp;|&nbsp; 🔵 = Normal node
          </span>
        </div>

        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-pointer"
            style={{ display: "block" }}
          />
          {graphData.nodes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none"
                stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <p className="text-sm text-center">Loading graph data...<br />Start the backend to see the network</p>
            </div>
          )}
        </div>
      </div>

      {selectedNode && (
        <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col shrink-0">
          <h2 className="text-xl font-bold mb-4 border-b border-slate-800 pb-2">Entity Context</h2>
          <div className="space-y-5 flex-1">
            <div>
              <span className="text-xs uppercase text-slate-500 font-semibold">Node ID</span>
              <p className="font-mono text-lg mt-1">{selectedNode.id}</p>
            </div>
            <div>
              <span className="text-xs uppercase text-slate-500 font-semibold">Transaction Volume</span>
              <p className="font-mono text-lg text-blue-400 mt-1">{selectedNode.size}</p>
            </div>
            <div>
              <span className="text-xs uppercase text-slate-500 font-semibold">Group / Cluster</span>
              <p className="font-mono text-lg mt-1">Cluster {selectedNode.group}</p>
            </div>
            <div>
              <span className="text-xs uppercase text-slate-500 font-semibold">Status</span>
              <p className={`font-mono text-lg mt-1 ${selectedNode.suspicious ? "text-red-500" : "text-emerald-500"}`}>
                {selectedNode.suspicious ? "⚠️ Suspicious Cluster" : "✅ Normal"}
              </p>
            </div>
            {selectedNode.suspicious && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
                This node is part of a suspicious transaction cluster. Consider freezing associated accounts.
              </div>
            )}
          </div>
          <button
            className="mt-8 bg-slate-800 hover:bg-slate-700 w-full py-2 rounded transition font-medium"
            onClick={() => setSelectedNode(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
