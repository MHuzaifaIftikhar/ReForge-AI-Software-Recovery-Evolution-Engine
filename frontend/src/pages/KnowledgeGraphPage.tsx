import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { CustomGraphNode } from '../components/CustomGraphNode';
import {
  Server,
  FileCode,
  Globe,
  Database,
  ShieldAlert,
  CheckCircle2,
  Package,
  X,
  ExternalLink,
  HelpCircle,
  Filter,
  Search,
  Maximize2,
  RotateCcw,
  Activity,
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';

interface KnowledgeGraphPageProps {
  initialNodes: any[];
  initialEdges: any[];
  stats: any;
  onOpenAskWhyWithNode: (nodeName: string) => void;
  onJumpToCode: (file: string, line?: number) => void;
  onSimulateTarget?: (targetName: string) => void;
}

const nodeTypes = {
  customNode: CustomGraphNode,
};

// Dagre layout helper
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, ranksep: 120, nodesep: 40 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 220, height: 90 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 110,
        y: nodeWithPosition.y - 45,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const KnowledgeGraphPage: React.FC<KnowledgeGraphPageProps> = ({
  initialNodes,
  initialEdges,
  stats,
  onOpenAskWhyWithNode,
  onJumpToCode,
  onSimulateTarget
}) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node.data);
  }, []);

  const handleApplyDagre = (direction = 'LR') => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      direction
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  };

  const filteredNodes = useMemo(() => {
    return nodes.map((node) => {
      const nodeData = (node.data || {}) as Record<string, any>;
      const label = String(nodeData.label || '');
      const nodeType = String(nodeData.nodeType || '');
      const matchesFilter = filterType === 'all' || nodeType === filterType;
      const matchesSearch =
        !searchQuery ||
        label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nodeType.toLowerCase().includes(searchQuery.toLowerCase());

      const isVisible = matchesFilter;
      const isDimmed = searchQuery && !matchesSearch;

      return {
        ...node,
        hidden: !isVisible,
        style: {
          opacity: isDimmed ? 0.2 : 1,
          transition: 'opacity 0.2s ease',
        },
      };
    });
  }, [nodes, filterType, searchQuery]);

  // Compute connected callers and downstream dependencies for selected node
  const connectedCallers = useMemo(() => {
    if (!selectedNode) return [];
    return edges
      .filter((e) => e.target === selectedNode.id)
      .map((e) => {
        const sourceNode = nodes.find((n) => n.id === e.source);
        const sourceData = (sourceNode?.data || {}) as Record<string, any>;
        return {
          id: e.source,
          name: String(sourceData.label || e.source),
          type: String(sourceData.nodeType || 'node'),
          relationship: String(e.label || 'CALLS'),
        };
      });
  }, [selectedNode, edges, nodes]);

  const connectedDependencies = useMemo(() => {
    if (!selectedNode) return [];
    return edges
      .filter((e) => e.source === selectedNode.id)
      .map((e) => {
        const targetNode = nodes.find((n) => n.id === e.target);
        const targetData = (targetNode?.data || {}) as Record<string, any>;
        return {
          id: e.target,
          name: String(targetData.label || e.target),
          type: String(targetData.nodeType || 'node'),
          relationship: String(e.label || 'DEPENDS_ON'),
        };
      });
  }, [selectedNode, edges, nodes]);

  return (
    <div className="flex h-full w-full relative overflow-hidden bg-[#faf8ff]">
      {/* Top Filter and Search Bar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 max-w-4xl">
        {/* Search Input */}
        <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl px-3.5 py-1.5 flex items-center gap-2 shadow-sm">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes in graph..."
            className="bg-transparent border-none text-xs text-slate-700 placeholder-slate-400 focus:outline-none w-44 font-mono font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Type Filter Pills */}
        <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl p-1 flex items-center gap-1 shadow-sm text-xs">
          {[
            { id: 'all', label: 'All', count: stats?.total_nodes || 27 },
            { id: 'service', label: 'Services', count: stats?.services || 4 },
            { id: 'api', label: 'APIs', count: stats?.apis || 4 },
            { id: 'business_rule', label: 'Rules', count: stats?.business_rules || 5 },
            { id: 'database', label: 'Database', count: 3 },
            { id: 'security_finding', label: 'Security', count: stats?.security_findings || 4 },
            { id: 'test', label: 'Tests', count: stats?.tests || 2 },
            { id: 'dependency', label: 'Packages', count: 4 },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                filterType === item.id
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25'
                  : 'text-slate-500 hover:text-violet-700 hover:bg-violet-50/70'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                  filterType === item.id ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-700'
                }`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* Layout Engine Toggles */}
        <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl p-1 flex items-center gap-1 shadow-sm text-xs">
          <button
            onClick={() => handleApplyDagre('LR')}
            className="px-2.5 py-1.5 rounded-xl text-slate-700 hover:bg-violet-50 hover:text-violet-700 flex items-center gap-1 font-bold text-[11px] transition-colors"
            title="Auto-organize Horizontal"
          >
            <RotateCcw className="w-3 h-3 text-violet-600" />
            <span>Align LR</span>
          </button>
          <button
            onClick={() => handleApplyDagre('TB')}
            className="px-2.5 py-1.5 rounded-xl text-slate-700 hover:bg-violet-50 hover:text-violet-700 flex items-center gap-1 font-bold text-[11px] transition-colors"
            title="Auto-organize Vertical"
          >
            <RotateCcw className="w-3 h-3 text-cyan-600 rotate-90" />
            <span>Align TB</span>
          </button>
        </div>
      </div>

      {/* Main React Flow Canvas */}
      <div className="flex-1 h-full w-full">
        <ReactFlow
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={2}
          className="bg-[#faf8ff]"
        >
          <Background color="#ddd6fe" gap={24} size={1} />
          <Controls className="!bg-white !border-purple-100 !fill-slate-600 !shadow-sm !rounded-2xl" />
          <MiniMap
            nodeColor={(n: any) => {
              switch (n.data?.nodeType) {
                case 'service': return '#7c3aed';
                case 'api': return '#10b981';
                case 'business_rule': return '#06b6d4';
                case 'security_finding': return '#f43f5e';
                case 'database': return '#f59e0b';
                case 'dependency': return '#a855f7';
                default: return '#94a3b8';
              }
            }}
            className="!bg-white !border-purple-100 !rounded-2xl !shadow-md"
          />
        </ReactFlow>
      </div>

      {/* Bottom Visual Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl px-4 py-2 flex items-center gap-4 text-[11px] font-mono text-slate-600 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-600 shadow-sm" />
          <span className="font-bold">Service</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
          <span className="font-bold">API Route</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
          <span className="font-bold">Database</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-sm" />
          <span className="font-bold">Business Rule</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
          <span className="font-bold">Security Flaw</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm" />
          <span className="font-bold">Dependency</span>
        </div>
      </div>

      {/* Right-Side Node Inspector Drawer */}
      {selectedNode && (
        <div className="w-[420px] bg-white/95 backdrop-blur-2xl border-l border-purple-100 h-full p-6 flex flex-col z-20 shadow-xl overflow-y-auto animate-in slide-in-from-right duration-200 text-slate-800">
          <div className="flex items-start justify-between border-b border-purple-50 pb-4 mb-4">
            <div>
              <span className="uppercase tracking-wider font-mono text-[9px] text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-200 font-bold block w-fit mb-1.5">
                {selectedNode.nodeType.replace('_', ' ')}
              </span>
              <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">{selectedNode.label}</h3>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-violet-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 flex-1 text-xs">
            {/* Description */}
            <div>
              <span className="text-slate-500 block mb-1 font-mono uppercase text-[10px] font-bold">
                Responsibilities
              </span>
              <p className="text-slate-700 leading-relaxed bg-violet-50/40 p-3.5 rounded-2xl border border-purple-100">
                {selectedNode.description}
              </p>
            </div>

            {/* Source Coordinates */}
            {selectedNode.file && (
              <div>
                <span className="text-slate-500 block mb-1 font-mono uppercase text-[10px] font-bold">
                  Source Coordinates
                </span>
                <div className="flex items-center justify-between bg-violet-50/40 p-3.5 rounded-2xl border border-purple-100">
                  <span className="font-mono text-violet-800 font-bold truncate">
                    {selectedNode.file}:{selectedNode.line || 1}
                  </span>
                  <button
                    onClick={() => onJumpToCode(selectedNode.file, selectedNode.line)}
                    className="flex items-center gap-1.5 text-xs text-violet-700 hover:text-violet-900 font-bold px-2.5 py-1 rounded-xl bg-violet-100/80 hover:bg-violet-200 transition-colors shadow-sm"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Callers & Dependencies */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-violet-50/30 p-3.5 rounded-2xl border border-purple-100 space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                  Incoming Callers ({connectedCallers.length})
                </span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {connectedCallers.length === 0 ? (
                    <span className="text-[11px] text-slate-400 italic">None detected</span>
                  ) : (
                    connectedCallers.map((c, i) => (
                      <div key={i} className="text-[11px] font-mono text-slate-700 font-medium truncate">
                        • {c.name}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-violet-50/30 p-3.5 rounded-2xl border border-purple-100 space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                  Dependencies ({connectedDependencies.length})
                </span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {connectedDependencies.length === 0 ? (
                    <span className="text-[11px] text-slate-400 italic">None detected</span>
                  ) : (
                    connectedDependencies.map((d, i) => (
                      <div key={i} className="text-[11px] font-mono text-slate-700 font-medium truncate">
                        • {d.name}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Code Evidence snippet if available */}
            {selectedNode.metadata?.evidence && (
              <div>
                <span className="text-slate-500 block mb-1 font-mono uppercase text-[10px] font-bold">
                  Grounded Code Evidence
                </span>
                <pre className="text-[11px] font-mono text-violet-950 bg-slate-50 p-3.5 rounded-2xl border border-purple-100 overflow-x-auto whitespace-pre-wrap">
                  {selectedNode.metadata.evidence}
                </pre>
              </div>
            )}
          </div>

          {/* Quick Action Drawer Footer */}
          <div className="pt-4 border-t border-purple-50 mt-4 space-y-2">
            <button
              onClick={() => onSimulateTarget && onSimulateTarget(selectedNode.label)}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <Activity className="w-4 h-4" />
              <span>Simulate Blast Radius for {selectedNode.label}</span>
            </button>

            <button
              onClick={() => onOpenAskWhyWithNode(selectedNode.label)}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-violet-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Ask Why {selectedNode.label} Exists</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
