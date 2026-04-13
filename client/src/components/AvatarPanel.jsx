import { motion } from "framer-motion";

const moodMessages = {
  waving: "Hello diva",
  excited: "Boss mode activated.",
  sleepy: "Someone's getting lazy",
  sad: "Focus broken.",
  calm: "The grind respects you.",
};

export function AvatarPanel({ profile }) {
  const mood = profile?.avatarMood || "waving";
  const message = moodMessages[mood] || "Legendary streak!";

  return (
    <motion.section
      className="rounded-3xl border border-mint-500/40 bg-black/25 p-4 text-mint-50 backdrop-blur"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg">{profile?.title}</h3>
        <span className="rounded-full border border-mint-300/30 px-2 py-1 text-xs">Lv {profile?.level}</span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <motion.svg
          viewBox="0 0 120 120"
          className="h-20 w-20"
          animate={{ rotate: mood === "excited" ? [0, 5, -5, 0] : 0 }}
          transition={{ duration: 0.8, repeat: mood === "excited" ? Infinity : 0 }}
        >
          <circle cx="60" cy="25" r="12" fill="#d4ffea" />
          <line x1="60" y1="37" x2="60" y2="78" stroke="#d4ffea" strokeWidth="6" />
          <line x1="60" y1="48" x2="42" y2="65" stroke="#d4ffea" strokeWidth="5" />
          <line x1="60" y1="48" x2="78" y2="65" stroke="#d4ffea" strokeWidth="5" />
          <line x1="60" y1="78" x2="46" y2="104" stroke="#d4ffea" strokeWidth="5" />
          <line x1="60" y1="78" x2="74" y2="104" stroke="#d4ffea" strokeWidth="5" />
          <circle cx="56" cy="22" r="1.6" fill="#072316" />
          <circle cx="64" cy="22" r="1.6" fill="#072316" />
          <path d="M55 28 Q60 32 65 28" stroke="#072316" strokeWidth="2" fill="none" />
        </motion.svg>

        <div>
          <motion.p
            className="text-sm text-mint-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {message}
          </motion.p>
          <p className="mt-1 text-xs text-mint-200/90">{profile?.name}</p>
        </div>
      </div>
    </motion.section>
  );
}
