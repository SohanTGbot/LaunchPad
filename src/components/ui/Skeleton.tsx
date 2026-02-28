"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'circle';
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton-shimmer",
        variant === 'circle' && "rounded-full",
        variant === 'card' && "rounded-2xl",
        variant === 'text' && "rounded h-4 w-full",
        className
      )}
    />
  );
}
