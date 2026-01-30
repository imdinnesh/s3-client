'use client';

import React from "react"

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';

interface UploadAreaProps {
    uploading: boolean;
    onUpload: (file: File) => void;
}

export default function UploadArea({ uploading, onUpload }: UploadAreaProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files?.[0];
        if (file) {
            onUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <motion.div
            className="relative rounded-lg border-2 border-dashed border-border bg-card/50 p-8 transition-all hover:border-primary/50 hover:bg-card sm:p-12"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            whileHover={{ scale: 1.01 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
                disabled={uploading}
            />

            <div className="flex flex-col items-center gap-4">
                {uploading ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    >
                        <UploadCloud className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                    </motion.div>
                ) : (
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <UploadCloud className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground transition-colors hover:text-primary" />
                    </motion.div>
                )}

                <div className="text-center">
                    <p className="text-lg font-semibold text-foreground sm:text-xl">
                        {uploading ? 'Uploading...' : 'Drag file here to upload'}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {uploading
                            ? 'Your file is being sharded and distributed'
                            : 'Files will be erasure-coded and scattered across nodes'}
                    </p>
                </div>

                {!uploading && (
                    <motion.button
                        className="mt-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Select File
                    </motion.button>
                )}

                {uploading && (
                    <motion.div
                        className="w-full max-w-xs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary via-accent to-primary"
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            />
                        </div>
                        <p className="mt-2 text-center text-xs text-muted-foreground">
                            Processing... This may take a moment
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
