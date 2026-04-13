import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FocusSession } from "../components/FocusSession";
import { LampToggle } from "../components/LampToggle";
import { PlayParticles } from "../components/PlayParticles";
import { RewardShop } from "../components/RewardShop";
import { Sidebar } from "../components/Sidebar";
import { TaskComposer } from "../components/TaskComposer";
import { TaskList } from "../components/TaskList";
import { useApp } from "../context/AppContext";
import { useLampMood } from "../hooks/useLampMood";
import { useSound } from "../hooks/useSound";

export function HomePage() {
  const {
    tasks,
    profile,
    isPlayMode,
    toggleMode,
    completeFocus,
    failFocus,
    focusFlash,
    beatDrop,
  } = useApp();
  const mood = useLampMood(tasks, profile || {}, isPlayMode);
  const { playSuccess, playFail } = useSound(profile?.settings?.soundEnabled ?? true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isBeatActive, setIsBeatActive] = useState(false);

  useEffect(() => {
    if (!beatDrop.tick) return undefined;
    setIsBeatActive(true);
    const timer = setTimeout(() => setIsBeatActive(false), 420);
    return () => clearTimeout(timer);
  }, [beatDrop.tick]);

  async function onFocusSuccess() {
    playSuccess();
  }

  async function onFocusFail() {
    await failFocus("Manual fail");
    playFail();
  }

  return (
    <motion.main
      className={`relative min-h-screen overflow-hidden px-4 pb-8 pt-28 transition-colors duration-700 sm:px-6 lg:px-8 ${
        isPlayMode
          ? "bg-gradient-to-b from-[#020b08] via-[#031510] to-[#021d14] text-mint-50"
          : "bg-[#d8e9d6] text-slate-800"
      } ${focusFlash ? "focus-broken" : ""} ${isBeatActive && isPlayMode ? "disco-hit-shake" : ""}`}
    >
      <LampToggle isPlayMode={isPlayMode} onToggle={toggleMode} mood={mood} />
      {isPlayMode && (
        <>
          <div className="play-mode-aura" />
          <div className="play-beam play-beam-a" />
          <div className="play-beam play-beam-b" />
          <div className="dance-floor-grid" />
          {beatDrop.tick > 0 && (
            <>
              <motion.div
                key={`flash-${beatDrop.tick}`}
                className="disco-hit-flash"
                initial={{ opacity: 0.58 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.32 }}
              />
              <motion.div
                key={`ring-${beatDrop.tick}`}
                className="disco-hit-ring"
                initial={{ scale: 0.3, opacity: 0.95 }}
                animate={{ scale: 1 + beatDrop.intensity * 0.95, opacity: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              />
            </>
          )}
        </>
      )}
      <PlayParticles enabled={isPlayMode} />

      <div className="mx-auto max-w-7xl">
        <header className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl">LumaTasks</h1>
            <p className="text-sm opacity-80">Calm simplicity when you focus. Rich delight when you need motivation.</p>
          </div>
          <div className="text-right">
            <span className={`inline-flex rounded-full px-3 py-2 text-sm font-semibold ${isPlayMode ? "bg-mint-500/20" : "bg-white/70"}`}>
              {profile?.points ?? 0} points
            </span>
            <button
              type="button"
              onClick={() => setShowSidebar((prev) => !prev)}
              className="mt-2 block text-xs opacity-80 lg:hidden"
            >
              {showSidebar ? "Hide dashboard" : "Show dashboard"}
            </button>
          </div>
        </header>

        {isPlayMode && (
          <div className="mb-4 rounded-2xl border border-mint-400/30 bg-black/20 p-2">
            <div className="mb-1 flex items-center justify-between text-xs text-mint-100">
              <span>XP {profile?.xp ?? 0}</span>
              <span>Level {profile?.level ?? 1}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-mint-100/20">
              <motion.div
                className="h-full bg-gradient-to-r from-mint-300 to-mint-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, ((profile?.xp ?? 0) % 240) / 2.4)}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[300px,1fr]">
          <div className={`${showSidebar ? "block" : "hidden"} lg:block`}>
            <Sidebar />
          </div>

          <section className="space-y-4">
            <TaskComposer />
            <FocusSession onSuccess={onFocusSuccess} onFail={onFocusFail} completeFocus={completeFocus} />
            <TaskList />
            {isPlayMode && <RewardShop />}
          </section>
        </div>
      </div>

      <button
        type="button"
        className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-mint-600 text-3xl text-white shadow-xl lg:hidden"
        onClick={() => document.querySelector("input")?.focus()}
      >
        +
      </button>
    </motion.main>
  );
}
