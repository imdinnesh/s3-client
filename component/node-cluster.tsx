'use client';

import { motion } from 'framer-motion';
import { HardDrive } from 'lucide-react';

interface NodeStatus {
    id: number;
    name: string;
    status: 'alive' | 'dead';
}

interface NodeClusterProps {
    nodes: NodeStatus[];
    uploading: boolean;
}

export default function NodeCluster({ nodes, uploading }: NodeClusterProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: 'spring' as const,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {nodes.map((node) => (
                <motion.div
                    key={node.id}
                    className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                >
                    {/* Status Indicator */}
                    <div className="absolute right-4 top-4 flex items-center gap-2">
                        <motion.div
                            className={`h-3 w-3 rounded-full ${node.status === 'alive'
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                                }`}
                            animate={
                                node.status === 'alive'
                                    ? { boxShadow: ['0 0 10px rgba(34, 197, 94, 0.5)', '0 0 20px rgba(34, 197, 94, 0.3)'] }
                                    : {}
                            }
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                        />
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {node.status}
                        </span>
                    </div>

                    {/* Icon */}
                    <motion.div
                        className="mb-4"
                        animate={uploading ? { y: [0, -8, 0] } : {}}
                        transition={{
                            duration: 1.5,
                            repeat: uploading ? Infinity : 0,
                            delay: node.id * 0.2,
                        }}
                    >
                        <HardDrive className="h-12 w-12 text-primary/60 transition-colors group-hover:text-primary" />
                    </motion.div>

                    {/* Node Name */}
                    <h3 className="font-semibold text-foreground">{node.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Storage Node</p>

                    {/* Upload Animation Overlay */}
                    {uploading && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center bg-primary/5 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: node.id * 0.2 }}
                        >
                            <motion.div
                                className="flex flex-col items-center gap-2"
                                animate={{ scale: [0.95, 1.05, 0.95] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: node.id * 0.2 }}
                            >
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-xs font-mono font-medium text-primary">WRITING SHARD...</span>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Metrics */}
                    <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Memory</span>
                            <span className="font-medium">85%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                            <motion.div
                                className="h-full w-[85%] bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: '85%' }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
