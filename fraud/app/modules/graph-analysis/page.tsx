"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function GraphAnalysisPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [minWeight, setMinWeight] = useState(1);
  const [graphData, setGraphData] = useState<{nodes: any[], links: any[]}>({ nodes: [], links: [] });

  useEffect(() => {
    fetch("http://localhost:8000/graph/suspicious-clusters")
      .then(res => res.json())
      .then(data => setGraphData(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!canvasRef.current || graphData.nodes.length === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const width = canvas.width;
    const height = canvas.height;

    // Filter links
    const filteredLinks = graphData.links.filter((l: any) => l.value >= minWeight);
    const linkedNodeIds = new Set(filteredLinks.flatMap((l: any) => [l.source.id || l.source, l.target.id || l.target]));
    const filteredNodes = graphData.nodes.filter((n: any) => linkedNodeIds.has(n.id) || n.suspicious);

    const nodes = filteredNodes.map((d: any) => Object.create(d));
    const links = filteredLinks.map((d: any) => Object.create(d));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    d3.select(canvas)
      .call(d3.drag()
        .subject((event) => simulation.find(event.x, event.y, 20))
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    d3.select(canvas).on("click", (event) => {
        const x = event.x - canvas.getBoundingClientRect().left;
        const y = event.y - canvas.getBoundingClientRect().top;
        const node = simulation.find(x, y, 20);
        setSelectedNode(node);
    });

    simulation.on("tick", () => {
      context.clearRect(0, 0, width, height);

      context.beginPath();
      links.forEach(d => {
        context.moveTo(d.source.x, d.source.y);
        context.lineTo(d.target.x, d.target.y);
      });
      context.strokeStyle = "#475569";
      context.lineWidth = 2;
      context.stroke();

      nodes.forEach(d => {
        context.beginPath();
        context.moveTo(d.x + d.size, d.y);
        context.arc(d.x, d.y, d.size, 0, 2 * Math.PI);
        context.fillStyle = d.suspicious ? "#E24B4A" : "#3b82f6";
        context.fill();
        context.strokeStyle = "#fff";
        context.lineWidth = 1.5;
        context.stroke();
      });
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [graphData, minWeight]);

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-3xl font-bold mb-4">Graph Analysis & Deep Networks</h1>
        
        <div className="mb-4">
          <label className="mr-4 text-slate-300">Min Edge Weight Filter:</label>
          <input 
            type="range" 
            min="1" max="10" 
            value={minWeight} 
            onChange={e => setMinWeight(parseInt(e.target.value))}
            className="w-64"
          />
          <span className="ml-4 font-mono">{minWeight}</span>
        </div>

        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
          <canvas 
            ref={canvasRef} 
            width={800} 
            height={600} 
            className="w-full h-full cursor-pointer"
          />
        </div>
      </div>

      {selectedNode && (
        <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-4 border-b border-slate-800 pb-2">Entity Context</h2>
          <div className="space-y-4">
            <div>
              <span className="text-slate-400">Node ID</span>
              <p className="font-mono text-lg">{selectedNode.id}</p>
            </div>
            <div>
              <span className="text-slate-400">Transaction Volume</span>
              <p className="font-mono text-lg text-blue-400">{selectedNode.size}</p>
            </div>
            <div>
              <span className="text-slate-400">Status</span>
              <p className={`font-mono text-lg ${selectedNode.suspicious ? 'text-red-500' : 'text-emerald-500'}`}>
                {selectedNode.suspicious ? 'Suspicious Cluster' : 'Normal'}
              </p>
            </div>
          </div>
          <button 
            className="mt-8 bg-slate-800 hover:bg-slate-700 w-full py-2 rounded transition"
            onClick={() => setSelectedNode(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
