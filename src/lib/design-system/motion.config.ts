export const ease = {
    snappy: [0.16, 1, 0.3, 1] as const,
    smooth: [0.4, 0, 0.2, 1] as const,
} as const;

export const spring = {
    standard: { type: "spring", damping: 28, stiffness: 220 } as const,
    gentle: { type: "spring", damping: 40, stiffness: 180 } as const,
    bouncy: { type: "spring", damping: 12, stiffness: 200 } as const,
} as const;

export const transition = {
    default: { duration: 0.5, ease: ease.snappy } as const,
    ghost: { duration: 1.2, ease: ease.smooth } as const,
} as const;
