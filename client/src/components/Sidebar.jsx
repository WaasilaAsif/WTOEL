import { motion } from "framer-motion";
import { LISTS, useApp } from "../context/AppContext";
import { AvatarPanel } from "./AvatarPanel";

export function Sidebar() {
  const { selectedList, setSelectedList, listCounts, isPlayMode, profile } = useApp();

  return (
    <motion.aside
      className={`z-20 w-full rounded-3xl p-4 lg:w-[300px] ${
        isPlayMode
          ? "border border-mint-400/35 bg-gradient-to-b from-[#0d2318] to-[#08130e] text-mint-50"
          : "bg-forest-700 text-forest-50"
      }`}
      initial={false}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 17 }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-lg">Lists</h2>
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs">{profile?.points ?? 0} pts</span>
      </div>

      <ul className="space-y-2">
        {LISTS.map((list) => {
          const active = selectedList === list;
          return (
            <li key={list}>
              <button
                type="button"
                onClick={() => setSelectedList(list)}
                className={`w-full rounded-2xl px-3 py-2 text-left text-sm transition ${
                  active
                    ? "bg-white/25 shadow-md"
                    : "bg-white/10 hover:bg-white/15"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{list}</span>
                  <span className="text-xs opacity-80">{listCounts[list] || 0}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {isPlayMode && (
        <div className="mt-4 space-y-4">
          <AvatarPanel profile={profile} />
          <section className="rounded-3xl border border-mint-400/25 bg-black/20 p-4 text-sm">
            <h3 className="font-heading text-mint-100">Progress Deck</h3>
            <div className="mt-2 space-y-2 text-mint-100/95">
              <p>XP: {profile?.xp}</p>
              <p>Daily streak: {profile?.streaks?.daily ?? 0}</p>
              <p>Focus streak: {profile?.streaks?.focus ?? 0}</p>
              <p>No-fail: {profile?.streaks?.noFail ?? 0}</p>
              <p>Velocity: {profile?.stats?.taskVelocity ?? 0}/day</p>
              <p>Completion: {profile?.stats?.completionRate ?? 0}%</p>
            </div>
          </section>
        </div>
      )}
    </motion.aside>
  );
}
