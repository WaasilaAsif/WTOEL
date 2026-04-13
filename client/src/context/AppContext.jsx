import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const AppContext = createContext(null);

export const LISTS = ["My Day", "Important", "Scheduled", "Completed", "Locked"];

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [rewards, setRewards] = useState({ shop: [], inventory: [] });
  const [selectedList, setSelectedList] = useState("My Day");
  const [isPlayMode, setIsPlayMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [focusFlash, setFocusFlash] = useState(false);
  const [beatDrop, setBeatDrop] = useState({ tick: 0, intensity: 1 });

  const triggerBeatDrop = useCallback((intensity = 1) => {
    setBeatDrop({ tick: Date.now(), intensity });
  }, []);

  useEffect(() => {
    async function bootstrap() {
      try {
        setLoading(true);
        const [tasksRes, profileRes, rewardsRes] = await Promise.all([
          api.getTasks(),
          api.getProfile(),
          api.getRewards(),
        ]);
        setTasks(tasksRes);
        setProfile(profileRes);
        setRewards(rewardsRes);
        setIsPlayMode(Boolean(profileRes.settings?.playMode));
      } catch (err) {
        setError(err.message || "Unable to load app data.");
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, []);

  useEffect(() => {
    const activeFocus = profile?.focusSession;
    if (!activeFocus) return undefined;

    const onVisibility = async () => {
      if (document.hidden) {
        setFocusFlash(true);
        await failFocus("Tab switched");
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [profile]);

  useEffect(() => {
    if (!focusFlash) return undefined;
    const timer = setTimeout(() => setFocusFlash(false), 1200);
    return () => clearTimeout(timer);
  }, [focusFlash]);

  async function createTask(payload) {
    const task = await api.createTask(payload);
    setTasks((prev) => [task, ...prev]);
  }

  async function updateTask(taskId, updates) {
    const updated = await api.updateTask(taskId, updates);
    setTasks((prev) => prev.map((task) => (task.id === taskId ? updated : task)));

    if (updates.completed === true) {
      const refreshedProfile = await api.getProfile();
      setProfile(refreshedProfile);
      triggerBeatDrop(1.35);
    }
  }

  async function deleteTask(taskId) {
    await api.deleteTask(taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }

  async function reorderTask(taskId, targetId) {
    const sourceIndex = tasks.findIndex((task) => task.id === taskId);
    const targetIndex = tasks.findIndex((task) => task.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return;

    const next = [...tasks];
    const [moving] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moving);
    setTasks(next);
  }

  async function startFocus(taskId, durationMinutes) {
    const next = await api.startFocus({ taskId, durationMinutes });
    setProfile(next);
  }

  async function failFocus(reason) {
    const next = await api.failFocus({ reason });
    setProfile(next);
  }

  async function completeFocus(taskId) {
    const next = await api.completeFocus({ taskId });
    setProfile(next);
    const taskRes = await api.getTasks();
    setTasks(taskRes);
    triggerBeatDrop(2.1);
  }

  async function spendPoints(rewardId) {
    const next = await api.spendReward(rewardId);
    setProfile(next.profile);
    setRewards(next.rewards);
  }

  async function toggleMode() {
    const nextPlayMode = !isPlayMode;
    setIsPlayMode(nextPlayMode);
    if (!profile) return;

    const updated = await api.updateProfile({
      settings: { ...profile.settings, playMode: nextPlayMode },
    });
    setProfile(updated);
  }

  const listCounts = useMemo(() => {
    const counts = { "My Day": 0, Important: 0, Scheduled: 0, Completed: 0, Locked: 0 };
    tasks.forEach((task) => {
      if (task.completed) counts.Completed += 1;
      else counts[task.list] = (counts[task.list] || 0) + 1;
      if (task.priority === "important" && !task.completed) counts.Important += 1;
      if (task.locked && !task.completed) counts.Locked += 1;
    });
    return counts;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (selectedList === "Completed") return tasks.filter((task) => task.completed);
    if (selectedList === "Important") return tasks.filter((task) => task.priority === "important" && !task.completed);
    if (selectedList === "Locked") return tasks.filter((task) => task.locked && !task.completed);
    if (selectedList === "Scheduled") return tasks.filter((task) => task.dueAt && !task.completed);
    return tasks.filter((task) => task.list === selectedList && !task.completed);
  }, [selectedList, tasks]);

  const value = {
    tasks,
    filteredTasks,
    profile,
    rewards,
    selectedList,
    setSelectedList,
    listCounts,
    isPlayMode,
    loading,
    error,
    focusFlash,
    beatDrop,
    createTask,
    updateTask,
    deleteTask,
    reorderTask,
    startFocus,
    failFocus,
    completeFocus,
    spendPoints,
    toggleMode,
    triggerBeatDrop,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
