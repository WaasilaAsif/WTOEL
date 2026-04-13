import { motion } from "framer-motion";

export function PlayParticles({ enabled }) {
  if (!enabled) return null;

  const discoPalette = [
    "bg-[#8bffd6]",
    "bg-[#7fe3ff]",
    "bg-[#ff90d2]",
    "bg-[#d3ff8f]",
    "bg-[#b7a4ff]",
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 14 }).map((_, index) => (
        <motion.span
          key={index}
          className={`absolute h-2 w-2 rounded-full ${discoPalette[index % discoPalette.length]}`}
          initial={{
            x: `${Math.random() * 100}%`,
            y: "105%",
            opacity: 0,
          }}
          animate={{
            y: "-10%",
            opacity: [0, 1, 0],
            scale: [0.6, 1.7, 0.7],
            rotate: [0, 140, 280],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
}
