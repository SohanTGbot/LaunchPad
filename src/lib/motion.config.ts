export const ease = {
    // Award-winning "snappy but smooth" easing
    snappy: [0.16, 1, 0.3, 1] as const,
    // Deep cinematic slow smooth
    smooth: [0.43, 0, 0.23, 1] as const,
    // High-performance spring
    spring: {
        type: "spring",
        damping: 30,
        stiffness: 200,
        mass: 1
    },
    // Gentle floating spring
    gentle: {
        type: "spring",
        damping: 40,
        stiffness: 100
    }
};

export const transition = {
    pageEntrance: {
        duration: 1.2,
        ease: ease.snappy,
    },
    stagger: (delay = 0.05) => ({
        staggerChildren: delay,
    }),
    micro: {
        duration: 0.4,
        ease: ease.snappy,
    }
};

export const variants = {
    fadeInUp: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    },
    fadeInScale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
    }
};
