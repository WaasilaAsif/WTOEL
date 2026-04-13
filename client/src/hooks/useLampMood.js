import { useMemo } from "react";

export function useLampMood(tasks, profile, isPlayMode) {
  return useMemo(() => {
    const overdue = tasks.filter((task) => task.dueAt && !task.completed && new Date(task.dueAt) < new Date()).length;
    const remaining = tasks.filter((task) => !task.completed).length;

    if (remaining === 0) {
      return {
        label: "Sparkling Halo",
        className: "lamp-halo",
        glow: "0 0 40px rgba(168, 255, 203, 0.95)",
      };
    }

    if (overdue > 2) {
      return {
        label: "Nervous Flicker",
        className: "lamp-flicker",
        glow: "0 0 22px rgba(255, 228, 140, 0.45)",
      };
    }

    if (profile.streaks?.focus >= 3) {
      return {
        label: "Golden Focus",
        className: "lamp-golden",
        glow: "0 0 36px rgba(255, 208, 102, 0.9)",
      };
    }

    if (profile.avatarMood === "sad") {
      return {
        label: "Dimmed",
        className: "lamp-dim",
        glow: "0 0 10px rgba(199, 237, 217, 0.2)",
      };
    }

    return {
      label: isPlayMode ? "Charged Mint" : "Warm Soft",
      className: "",
      glow: isPlayMode
        ? "0 0 26px rgba(121, 255, 198, 0.7)"
        : "0 0 20px rgba(208, 245, 222, 0.65)",
    };
  }, [tasks, profile, isPlayMode]);
}
