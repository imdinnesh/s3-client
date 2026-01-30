'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SystemLogsProps {
  logs: string[];
}

export default function SystemLogs({ logs }: SystemLogsProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <motion.div
      className="overflow-hidden rounded-lg border border-border bg-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="border-b border-border/50 bg-secondary/30 px-4 py-3 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recent Activity
        </p>
      </div>

      {/* Logs Container */}
      <div className="relative h-64 overflow-y-auto bg-background/50 p-4 font-mono text-sm sm:p-6 sm:text-base">
        {logs.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Waiting for activity...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log, index) => (
              <motion.div
                key={`${index}-${log}`}
                className="flex items-start gap-3 text-xs sm:text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                }}
              >
                <span className="mt-0.5 flex-shrink-0 text-primary">➜</span>
                <span className="flex-1 break-words text-foreground/90">{log}</span>
              </motion.div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}

        {/* Gradient overlay for readability */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 bg-secondary/30 px-4 py-2 text-xs text-muted-foreground sm:px-6">
        {logs.length} events
      </div>
    </motion.div>
  );
}
