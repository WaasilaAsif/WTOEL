import { motion } from "framer-motion";
import { useState } from "react";
import { FaClock, FaGripVertical, FaLock, FaPen, FaStar, FaTrash } from "react-icons/fa";
import { LISTS, useApp } from "../context/AppContext";
import { DeadlineEyes } from "./DeadlineEyes";

const colorStyles = {
  sage: { accent: "#9abb9b", ring: "rgba(154, 187, 155, 0.28)", tint: "rgba(154, 187, 155, 0.12)" },
  mint: { accent: "#8de3c1", ring: "rgba(141, 227, 193, 0.28)", tint: "rgba(141, 227, 193, 0.12)" },
  sand: { accent: "#dccb9e", ring: "rgba(220, 203, 158, 0.28)", tint: "rgba(220, 203, 158, 0.12)" },
  peach: { accent: "#ffc9a9", ring: "rgba(255, 201, 169, 0.28)", tint: "rgba(255, 201, 169, 0.12)" },
  sky: { accent: "#9ecfff", ring: "rgba(158, 207, 255, 0.28)", tint: "rgba(158, 207, 255, 0.12)" },
};

function nearDeadline(task) {
  if (!task.dueAt || task.completed) return false;
  const ms = new Date(task.dueAt).getTime() - Date.now();
  return ms > 0 && ms <= 10 * 60 * 1000;
}

export function TaskList() {
  const { filteredTasks, updateTask, deleteTask, reorderTask, isPlayMode } = useApp();
  const [dragId, setDragId] = useState(null);

  if (!filteredTasks.length) {
    return (
      <div className="rounded-3xl bg-paper/90 p-6 text-center text-sm text-slate-500 shadow-soft">
        Nothing here yet. Add a task and let the lamp guide your mode.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        (() => {
          const palette = colorStyles[task.color] || colorStyles.sage;

          return (
        <motion.article
          key={task.id}
          draggable
          onDragStart={() => setDragId(task.id)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (dragId && dragId !== task.id) reorderTask(dragId, task.id);
            setDragId(null);
          }}
          layout
          className={`group relative rounded-3xl border p-4 shadow-soft transition ${
            isPlayMode
              ? "border-mint-500/30 bg-black/30 text-mint-50"
              : "border-green-100 bg-paper text-slate-700"
          }`}
          style={{
            boxShadow: `0 0 0 1px ${palette.ring}, 0 10px 28px rgba(15, 30, 22, 0.08)`,
            borderLeft: `6px solid ${palette.accent}`,
            backgroundImage: `linear-gradient(90deg, ${palette.tint}, transparent 24%)`,
          }}
          whileHover={{ y: -2 }}
        >
          {nearDeadline(task) && <DeadlineEyes />}

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <button
                type="button"
                disabled={task.locked}
                className={`mt-1 h-5 w-5 rounded-full border ${task.completed ? "bg-mint-600" : "bg-transparent"} ${
                  task.locked ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={task.completed ? {} : { borderColor: palette.accent }}
                onClick={() => updateTask(task.id, { completed: !task.completed })}
              />
              <div>
                <p className={`text-sm font-semibold ${task.completed ? "line-through opacity-60" : ""}`}>
                  <span
                    className="mr-2 inline-flex h-2.5 w-2.5 rounded-full align-middle"
                    style={{ backgroundColor: palette.accent, boxShadow: `0 0 0 3px ${palette.tint}` }}
                    aria-hidden="true"
                  />
                  {task.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs opacity-85">
                  <span className="inline-flex items-center gap-1">
                    <FaGripVertical /> drag
                  </span>
                  {task.priority === "important" && (
                    <span className="inline-flex items-center gap-1 text-amber-300">
                      <FaStar /> pinned
                    </span>
                  )}
                  {task.locked && (
                    <span className="inline-flex items-center gap-1 text-rose-300">
                      <FaLock /> locked
                    </span>
                  )}
                  {task.dueAt && (
                    <span className="inline-flex items-center gap-1">
                      <FaClock /> {new Date(task.dueAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl p-2 text-rose-400 transition hover:bg-rose-400/10"
              onClick={() => deleteTask(task.id)}
              aria-label="Delete task"
            >
              <FaTrash />
            </button>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            <button
              type="button"
              disabled={task.locked}
              className={`rounded-xl border border-white/20 px-2 py-1 text-xs ${
                task.locked ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => {
                const nextTitle = window.prompt("Edit task", task.title);
                if (nextTitle?.trim()) updateTask(task.id, { title: nextTitle.trim() });
              }}
            >
              <span className="inline-flex items-center gap-1">
                <FaPen /> edit
              </span>
            </button>

            <button
              type="button"
              className="rounded-xl border border-white/20 px-2 py-1 text-xs"
              onClick={() =>
                updateTask(task.id, {
                  priority: task.priority === "important" ? "normal" : "important",
                })
              }
            >
              {task.priority === "important" ? "unpin" : "pin important"}
            </button>

            <select
              value={task.list}
              onChange={(event) => {
                const nextList = event.target.value;
                if (nextList === "Scheduled" && !task.dueAt) {
                  alert("Scheduled tasks must have a due date.");
                  return;
                }
                updateTask(task.id, { list: nextList });
              }}
              className="rounded-xl border border-white/20 bg-transparent px-2 py-1 text-xs"
            >
              {LISTS.filter((list) => !["Completed", "Important", "Locked"].includes(list)).map((list) => (
                <option key={list} value={list} className="text-slate-800">
                  {list}
                </option>
              ))}
            </select>
          </div>
        </motion.article>
          );
        })()
      ))}
    </div>
  );
}
