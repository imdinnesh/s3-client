'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Server, HardDrive, UploadCloud, Activity } from 'lucide-react';
import NodeCluster from '@/component/node-cluster';
import UploadArea from '@/component/upload-area';
import SystemLogs from '@/component/system-logs';

interface NodeStatus {
  id: number;
  name: string;
  status: 'alive' | 'dead';
}

export default function Dashboard() {
  const [nodes, setNodes] = useState<NodeStatus[]>([
    { id: 1, name: 'Storage-1', status: 'alive' },
    { id: 2, name: 'Storage-2', status: 'alive' },
    { id: 3, name: 'Storage-3', status: 'alive' },
  ]);
  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState<string[]>(['System Ready. Waiting for input...']);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 20));
  };

  // Poll system health every 2 seconds
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Simulate API call - replace with actual endpoint
        // const res = await axios.get('http://localhost:8080/status');
        // setNodes(res.data);
      } catch (err) {
        console.error("[v0] Failed to fetch status", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    addLog(`🛫 Starting upload: ${file.name}`);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        addLog(`✅ Success! File sharded into ${data.shards} pieces.`);
      } else {
        addLog('❌ Upload failed. Check console.');
      }
    } catch (err) {
      addLog('❌ Upload failed. Check console.');
      console.error("[v0] Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="rounded-lg bg-primary/10 p-2.5"
                whileHover={{ scale: 1.05 }}
              >
                <Server className="h-6 w-6 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-text-balance">TitanDrive</h1>
                <p className="text-xs text-muted-foreground sm:text-sm">Distributed Storage Control Deck</p>
              </div>
            </div>
            <motion.div 
              className="flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-2"
              animate={{ opacity: [0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Activity className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium text-muted-foreground sm:text-sm">System Online</span>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <motion.div 
            className="rounded-lg border border-border bg-card p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Nodes</p>
            <p className="mt-2 text-2xl font-bold">{nodes.filter(n => n.status === 'alive').length}/{nodes.length}</p>
          </motion.div>
          <motion.div 
            className="rounded-lg border border-border bg-card p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Storage Used</p>
            <p className="mt-2 text-2xl font-bold">4.2 TB</p>
          </motion.div>
          <motion.div 
            className="rounded-lg border border-border bg-card p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Replication</p>
            <p className="mt-2 text-2xl font-bold">3x</p>
          </motion.div>
        </div>

        {/* Node Cluster */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="mb-4 text-lg font-semibold">Storage Cluster</h2>
          <NodeCluster nodes={nodes} uploading={uploading} />
        </motion.div>

        {/* Upload Area */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="mb-4 text-lg font-semibold">File Upload</h2>
          <UploadArea uploading={uploading} onUpload={handleUpload} />
        </motion.div>

        {/* System Logs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="mb-4 text-lg font-semibold">System Activity</h2>
          <SystemLogs logs={logs} />
        </motion.div>
      </main>
    </div>
  );
}
