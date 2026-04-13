import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";

export function FocusSession({ onSuccess, onFail }) {
  const { filteredTasks, profile, startFocus, completeFocus } = useApp();
  const [taskId, setTaskId] = useState("");
  const [duration, setDuration] = useState(25);

  const active = profile?.focusSession;
  const chosenTask = useMemo(
    () => filteredTasks.find((task) => task.id === (active?.taskId || taskId)),
    [active, filteredTasks, taskId]
  );

  return (
    <section className="rounded-3xl bg-paper p-4 shadow-soft">
      <h3 className="font-heading text-lg text-slate-800">Focus Session</h3>
      <p className="text-xs text-slate-500">Changing tabs instantly fails the session.</p>

      {!active ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <select
            value={taskId}
            onChange={(event) => setTaskId(event.target.value)}
            className="h-10 rounded-xl border border-green-200 px-3 text-xs"
          >
            <option value="">Select task</option>
            {filteredTasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>

          <select
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
            className="h-10 rounded-xl border border-green-200 px-3 text-xs"
          >
            {[15, 20, 25, 35, 45].map((mins) => (
              <option key={mins} value={mins}>
                {mins} min
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={async () => {
              if (!taskId) return;
              await startFocus(taskId, duration);
            }}
            className="h-10 rounded-xl bg-mint-600 px-3 text-sm font-semibold text-white"
          >
            Start
          </button>
        </div>
      ) : (
        <motion.div
          className="mt-3 rounded-2xl border border-mint-300 bg-mint-50 p-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm font-semibold text-slate-700">Locked on: {chosenTask?.title || "Task"}</p>
          <p className="text-xs text-slate-500">Duration: {active.durationMinutes} min</p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={async () => {
                await completeFocus(active.taskId);
                onSuccess();
              }}
              className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white"
            >
              Complete Focus
            </button>
            <button
              type="button"
              onClick={() => onFail()}
              className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white"
            >
              Fail Session
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
}
