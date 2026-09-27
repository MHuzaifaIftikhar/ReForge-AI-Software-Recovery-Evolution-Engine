import React, { useState, useEffect } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { api } from '../services/api';
import {
  FolderTree,
  FileCode,
  GitCompare,
  Code2,
  FileText,
  RotateCcw
} from 'lucide-react';

interface CodeExplorerPageProps {
  initialFile?: string;
  initialLine?: number;
}

export const CodeExplorerPage: React.FC<CodeExplorerPageProps> = ({
  initialFile = 'services/payment.js',
  initialLine = 1
}) => {
  const [activeFile, setActiveFile] = useState<string>(initialFile);
  const [fileContent, setFileContent] = useState<string>('');
  const [diffMode, setDiffMode] = useState<boolean>(false);
  const [diffData, setDiffData] = useState<{ legacy_content: string; modern_content: string }>({
    legacy_content: '',
    modern_content: ''
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fileTree = [
    {
      category: 'Services',
      files: ['services/payment.js', 'services/pricing.js', 'services/orders.js', 'services/user.js']
    },
    {
      category: 'Routes & Controllers',
      files: ['routes/checkout.js', 'routes/users.js', 'routes/orders.js', 'routes/products.js']
    },
    {
      category: 'Integrations & DB',
      files: ['integrations/legacyGateway.js', 'repositories/orderRepository.js', 'config/database.js']
    },
    {
      category: 'Middleware & Config',
      files: ['middleware/auth.js', 'package.json', 'app.js']
    },
    {
      category: 'Tests',
      files: ['tests/payment.test.js', 'tests/pricing.test.js', 'tests/run-all.js']
    }
  ];

  useEffect(() => {
    loadFile(activeFile);
  }, [activeFile]);

  const loadFile = async (path: string) => {
    setLoading(true);
    try {
      const data = await api.getFileContent(path);
      setFileContent(data.content);
      const diff = await api.getFileDiff(path);
      setDiffData(diff);
    } catch (err) {
      console.error('Failed to load file', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-white overflow-hidden text-slate-800">
      {/* File Tree Sidebar */}
      <div className="w-64 bg-slate-50/70 border-r border-purple-100/80 flex flex-col h-full text-xs">
        <div className="p-3.5 border-b border-purple-50 flex items-center justify-between text-slate-500 font-mono text-[11px]">
          <span className="flex items-center gap-1.5 uppercase tracking-wider font-bold">
            <FolderTree className="w-3.5 h-3.5 text-violet-600" /> Explorer
          </span>
          <span className="text-[10px] bg-violet-100 text-violet-800 px-2 py-0.5 rounded-full font-bold">
            legacy-shop
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
          {fileTree.map((group) => (
            <div key={group.category} className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 block font-bold">
                {group.category}
              </span>
              {group.files.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFile(f)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2 truncate transition-all ${
                    activeFile === f
                      ? 'bg-violet-100/70 text-violet-900 font-bold border border-violet-200 shadow-sm'
                      : 'text-slate-600 hover:text-violet-700 hover:bg-violet-50/50'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 flex-shrink-0 text-violet-500" />
                  <span className="truncate">{f.split('/').pop()}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        {/* Editor Tab Bar */}
        <div className="h-12 bg-white border-b border-purple-100 px-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-800 font-bold">
            <FileCode className="w-4 h-4 text-violet-600" />
            <span>{activeFile}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDiffMode(!diffMode)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                diffMode
                  ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-violet-500/25'
                  : 'bg-white hover:bg-violet-50 text-slate-700 border border-purple-200/80'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5 text-violet-600" />
              <span>{diffMode ? 'Exit Diff View' : 'Side-by-Side Diff (Legacy vs Modern)'}</span>
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 w-full h-full relative">
          {diffMode ? (
            <DiffEditor
              height="100%"
              language={activeFile.endsWith('.json') ? 'json' : 'javascript'}
              original={diffData.legacy_content}
              modified={diffData.modern_content}
              theme="light"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 12,
                scrollBeyondLastLine: false,
                renderSideBySide: true
              }}
            />
          ) : (
            <Editor
              height="100%"
              language={activeFile.endsWith('.json') ? 'json' : 'javascript'}
              value={fileContent}
              theme="light"
              options={{
                readOnly: true,
                minimap: { enabled: true },
                fontSize: 12,
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                wordWrap: 'on'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
