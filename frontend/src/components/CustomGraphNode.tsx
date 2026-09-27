import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Server,
  FileCode,
  Globe,
  Database,
  Package,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Layers
} from 'lucide-react';

interface CustomNodeProps {
  data: {
    id: string;
    label: string;
    nodeType: string;
    file?: string;
    line?: number;
    description: string;
    confidence: number;
    metadata?: Record<string, any>;
  };
  selected?: boolean;
}

export const CustomGraphNode: React.FC<CustomNodeProps> = ({ data, selected }) => {
  const getTypeConfig = () => {
    switch (data.nodeType) {
      case 'service':
        return {
          icon: <Server className="w-3.5 h-3.5 text-violet-600" />,
          badgeBg: 'bg-violet-50 text-violet-700 border-violet-200/80',
          dot: 'bg-violet-500',
          border: selected
            ? 'border-violet-500 ring-4 ring-violet-500/15 shadow-md shadow-violet-500/20'
            : 'border-violet-200/80 hover:border-violet-400'
        };
      case 'api':
        return {
          icon: <Globe className="w-3.5 h-3.5 text-emerald-600" />,
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
          border: selected
            ? 'border-emerald-500 ring-4 ring-emerald-500/15 shadow-md shadow-emerald-500/20'
            : 'border-emerald-200/80 hover:border-emerald-400'
        };
      case 'database':
        return {
          icon: <Database className="w-3.5 h-3.5 text-amber-600" />,
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500',
          border: selected
            ? 'border-amber-500 ring-4 ring-amber-500/15 shadow-md shadow-amber-500/20'
            : 'border-amber-200/80 hover:border-amber-400'
        };
      case 'business_rule':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />,
          badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
          dot: 'bg-cyan-500',
          border: selected
            ? 'border-cyan-500 ring-4 ring-cyan-500/15 shadow-md shadow-cyan-500/20'
            : 'border-cyan-200/80 hover:border-cyan-400'
        };
      case 'security_finding':
        return {
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />,
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dot: 'bg-rose-500',
          border: selected
            ? 'border-rose-500 ring-4 ring-rose-500/15 shadow-md shadow-rose-500/20'
            : 'border-rose-200/80 hover:border-rose-400'
        };
      case 'dependency':
        return {
          icon: <Package className="w-3.5 h-3.5 text-purple-600" />,
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200/80',
          dot: 'bg-purple-500',
          border: selected
            ? 'border-purple-500 ring-4 ring-purple-500/15 shadow-md shadow-purple-500/20'
            : 'border-purple-200/80 hover:border-purple-400'
        };
      case 'external_service':
        return {
          icon: <ExternalLink className="w-3.5 h-3.5 text-orange-600" />,
          badgeBg: 'bg-orange-50 text-orange-700 border-orange-200/80',
          dot: 'bg-orange-500',
          border: selected
            ? 'border-orange-500 ring-4 ring-orange-500/15 shadow-md shadow-orange-500/20'
            : 'border-orange-200/80 hover:border-orange-400'
        };
      default:
        return {
          icon: <FileCode className="w-3.5 h-3.5 text-slate-500" />,
          badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          border: selected
            ? 'border-violet-500 ring-4 ring-violet-500/15'
            : 'border-slate-200 hover:border-slate-400'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div
      className={`px-4 py-3.5 rounded-2xl bg-white border ${config.border} transition-all duration-200 min-w-[210px] max-w-[250px] text-xs shadow-[0_6px_20px_rgba(124,58,237,0.05)] hover:-translate-y-0.5 group relative`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 !bg-violet-600 !border-2 !border-white hover:!bg-violet-700 transition-colors shadow-sm"
      />

      {/* Header with Type Badge and Status Pip */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase tracking-wider ${config.badgeBg}`}
        >
          {config.icon}
          <span>{data.nodeType.replace('_', ' ')}</span>
        </span>

        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${config.dot} shadow-sm`} />
          <span className="text-[10px] font-mono font-bold text-slate-500">
            {Math.round((data.confidence || 0.95) * 100)}%
          </span>
        </div>
      </div>

      {/* Node Title */}
      <div className="font-extrabold text-slate-900 text-xs truncate tracking-tight group-hover:text-violet-700 transition-colors">
        {data.label}
      </div>

      {/* Description Snippet */}
      {data.description && (
        <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-snug">
          {data.description}
        </p>
      )}

      {/* File Coordinate Badge */}
      {data.file && (
        <div className="mt-2.5 pt-2 border-t border-purple-50 flex items-center justify-between text-[9px] font-mono text-slate-500">
          <span className="truncate max-w-[130px] font-medium text-slate-600">{data.file}</span>
          {data.line && <span className="text-violet-600 font-bold">L:{data.line}</span>}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 !bg-violet-600 !border-2 !border-white hover:!bg-violet-700 transition-colors shadow-sm"
      />
    </div>
  );
};
