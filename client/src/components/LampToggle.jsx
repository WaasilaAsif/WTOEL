import { motion } from "framer-motion";
import { useRef } from "react";
import { FaLightbulb } from "react-icons/fa";

export function LampToggle({ isPlayMode, onToggle, mood }) {
  const pulledRef = useRef(false);

  const triggerToggle = () => {
    if (pulledRef.current) return;
    pulledRef.current = true;
    onToggle();
    setTimeout(() => {
      pulledRef.current = false;
    }, 500);
  };

  return (
    <div className="pointer-events-none absolute left-1/2 top-0 z-30 -translate-x-1/2">
      <div className="pointer-events-auto flex flex-col items-center">
        <motion.div
          className={`lamp-shade ${isPlayMode ? "play disco-ball" : "calm"} ${mood.className}`}
          style={{ boxShadow: mood.glow }}
          initial={false}
          animate={{
            scale: isPlayMode ? 1.08 : 1,
            rotate: isPlayMode ? [0, 6, -6, 0] : 0,
          }}
          transition={{ duration: 0.8 }}
          title={`Lamp mood: ${mood.label}`}
        >
          {isPlayMode ? (
            <>
              <span className="disco-core" />
              <span className="disco-spark disco-spark-a" />
              <span className="disco-spark disco-spark-b" />
              <span className="disco-spark disco-spark-c" />
              <span className="disco-reflect disco-reflect-a" />
              <span className="disco-reflect disco-reflect-b" />
            </>
          ) : (
            <FaLightbulb className="text-2xl text-[#f9fff4]" />
          )}
        </motion.div>

        <motion.button
          type="button"
          onPointerDown={triggerToggle}
          onClick={triggerToggle}
          className="group flex flex-col items-center"
          whileTap={{ y: 18 }}
          whileHover={{ y: 3 }}
          aria-label="Pull lamp string"
        >
          <motion.div
            className="lamp-string"
            animate={{ rotate: isPlayMode ? [0, -6, 4, 0] : [0, 4, -4, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="lamp-knob group-active:scale-95" />
        </motion.button>
      </div>
    </div>
  );
}
