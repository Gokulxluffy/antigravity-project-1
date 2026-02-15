// ============================================================
// Animation System (Include 3)
// Framer Motion presets for premium fintech UI
// ============================================================

// ── Page Transitions ──
export const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
};

export const slideUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
};

export const slideInLeft = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
};

export const slideInRight = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
};

// ── Stagger Children ──
export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

export const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
};

// ── Scale Animations ──
export const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }, // spring-like
};

export const pulseScale = {
    animate: {
        scale: [1, 1.05, 1],
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
};

// ── Card Hover Effects ──
export const cardHover = {
    whileHover: {
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 },
    },
    whileTap: { scale: 0.98 },
};

export const glowCardHover = {
    whileHover: {
        scale: 1.02,
        y: -4,
        boxShadow: '0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1)',
        transition: { duration: 0.3 },
    },
};

// ── Number Counter Animation ──
export const counterSpring = {
    type: 'spring',
    stiffness: 100,
    damping: 30,
    mass: 1,
};

// ── Chart Entrance ──
export const chartReveal = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 1.5, ease: 'easeInOut' },
};

// ── HUD Overlay ──
export const hudOverlay = {
    initial: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    transition: { duration: 0.6, ease: 'easeOut' },
};

// ── Scroll-based animation config ──
export const scrollReveal = {
    viewport: { once: true, margin: '-50px' },
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
};

// ── Score Ring Animation ──
export const scoreRing = (score: number) => ({
    initial: { strokeDashoffset: 283 },
    animate: { strokeDashoffset: 283 - (283 * score) / 100 },
    transition: { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 },
});

// ── Skeleton Loading ──
export const shimmer = {
    animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
        transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
    },
};

// ── INVEST/DO NOT INVEST Verdict Animation ──
export const verdictReveal = {
    initial: { opacity: 0, scale: 0.5, rotateX: 90 },
    animate: { opacity: 1, scale: 1, rotateX: 0 },
    transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
};

// ── Live Data Pulse ──
export const livePulse = {
    animate: {
        opacity: [1, 0.4, 1],
        scale: [1, 1.1, 1],
        transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
};

// ── Progress Bar Fill ──
export const progressFill = (percent: number) => ({
    initial: { width: '0%' },
    animate: { width: `${percent}%` },
    transition: { duration: 1, ease: 'easeOut', delay: 0.2 },
});

// ── Micro-interaction: Button Press ──
export const buttonPress = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
};

// ── Ticker Scroll (for live market bar) ──
export const tickerScroll = (width: number) => ({
    animate: { x: [-width, 0] },
    transition: { duration: 20, repeat: Infinity, ease: 'linear' },
});

// ── Glow Effect ──
export const glowPulse = (color: string = 'rgba(59, 130, 246, 0.5)') => ({
    animate: {
        boxShadow: [
            `0 0 20px ${color}`,
            `0 0 40px ${color}`,
            `0 0 20px ${color}`,
        ],
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
});
