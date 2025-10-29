export default function getRandomAvatarColor(){
    const random = Math.floor(Math.random() * AVATAR_COLORS.length)
    return AVATAR_COLORS[random]
}


export const AVATAR_COLORS = [
    // 🔴 Reds & Oranges
    "#EF4444", // red-500
    "#F87171", // red-400
    "#F97316", // orange-500
    "#FB923C", // orange-400
    "#F59E0B", // amber-500
    "#FBBF24", // amber-400

    // 🟢 Greens
    "#10B981", // emerald-500
    "#34D399", // emerald-400
    "#22C55E", // green-500
    "#4ADE80", // green-400
    "#84CC16", // lime-500
    "#A3E635", // lime-400

    // 🔵 Blues
    "#3B82F6", // blue-500
    "#60A5FA", // blue-400
    "#2563EB", // blue-600
    "#1D4ED8", // blue-700
    "#0EA5E9", // sky-500
    "#38BDF8", // sky-400

    // 🟣 Purples
    "#8B5CF6", // violet-500
    "#A78BFA", // violet-400
    "#7C3AED", // violet-600
    "#6D28D9", // violet-700
    "#C084FC", // purple-400
    "#D8B4FE", // purple-300

    // 🩷 Pinks & Roses
    "#EC4899", // pink-500
    "#F472B6", // pink-400
    "#E11D48", // rose-600
    "#F43F5E", // rose-500
    "#FDA4AF", // rose-300

    // 🩵 Cyans & Teals
    "#06B6D4", // cyan-500
    "#22D3EE", // cyan-400
    "#14B8A6", // teal-500
    "#2DD4BF", // teal-400

    // 🟠 Yellows
    "#EAB308", // yellow-500
    "#FACC15", // yellow-400
    "#FDE047", // yellow-300

    // ⚪ Neutrals & Accents
    "#94A3B8", // slate-400
    "#64748B", // slate-500
    // "#475569", // slate-600
    // "#0F172A", // slate-900
];