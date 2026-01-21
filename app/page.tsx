'use client';
import { useState } from 'react';
import axios from 'axios';
import { Server, HardDrive, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

// Types for our Nodes
interface NodeStatus {
  id: number;
  name: string;
  status: 'alive' | 'dead';
}

function App() {
  const [nodes, setNodes] = useState<NodeStatus[]>([
    { id: 1, name: 'Storage-1', status: 'alive' },
    { id: 2, name: 'Storage-2', status: 'alive' },
    { id: 3, name: 'Storage-3', status: 'alive' },
  ]);
  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setUploading(true);
    addLog(`🛫 Starting upload: ${file.name}`);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Talk to our Go Gateway
      const res = await axios.post('http://localhost:8080/upload', formData);
      addLog(`✅ Success! File sharded into ${res.data.shards} pieces.`);
    } catch (err) {
      addLog('❌ Upload failed. Check console.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="mb-10 flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Server size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">TitanDrive</h1>
            <p className="text-slate-400">Distributed Object Storage Control Deck</p>
          </div>
        </header>

        {/* The Cluster Visualizer */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {nodes.map((node) => (
            <div key={node.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center relative overflow-hidden">
              <div className={`w-3 h-3 rounded-full absolute top-4 right-4 ${node.status === 'alive' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`} />
              <HardDrive size={48} className="text-slate-300 mb-4" />
              <h3 className="font-bold text-lg">{node.name}</h3>
              <span className="text-xs text-slate-500 uppercase tracking-wider mt-1">{node.status}</span>

              {/* Animation trigger when uploading */}
              {uploading && (
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: node.id * 0.2 }}
                  className="absolute inset-0 bg-blue-500/10 flex items-center justify-center"
                >
                  <span className="text-xs font-mono text-blue-300">WRITING SHARD...</span>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Upload Area */}
        <div className="bg-slate-800 p-8 rounded-xl border border-dashed border-slate-600 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
          <input
            type="file"
            onChange={handleUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-4">
            {uploading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <UploadCloud size={48} className="text-blue-500" />
              </motion.div>
            ) : (
              <UploadCloud size={48} className="text-slate-400" />
            )}
            <div>
              <p className="text-xl font-medium">Drag file here to upload</p>
              <p className="text-slate-500 text-sm mt-1">Files will be erasure-coded and scattered.</p>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="mt-8 bg-black/30 p-4 rounded-lg font-mono text-sm h-48 overflow-y-auto border border-white/10">
          {logs.length === 0 && <span className="text-slate-600">System Ready. Waiting for input...</span>}
          {logs.map((log, i) => (
            <div key={i} className="mb-1 flex items-center gap-2">
              <span className="text-blue-500">➜</span>
              {log}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;