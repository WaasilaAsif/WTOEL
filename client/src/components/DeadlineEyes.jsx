import { motion } from "framer-motion";

export function DeadlineEyes() {
  return (
    <motion.div
      className="absolute -right-2 -top-3 flex items-center gap-1 rounded-full bg-black/90 px-2 py-1"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: [0.5, 1, 0.7], y: [2, -1, 2], x: [0, 2, -2, 0] }}
      transition={{ duration: 1.6, repeat: Infinity }}
    >
      <span className="eye-orb" />
      <span className="eye-orb" />
    </motion.div>
  );
}
