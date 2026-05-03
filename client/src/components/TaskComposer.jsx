import { useState } from "react";
import { useApp } from "../context/AppContext";

const colors = ["sage", "mint", "sand", "peach", "sky"];

export function TaskComposer() {
  const { createTask, selectedList, isPlayMode } = useApp();
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [priority, setPriority] = useState("normal");
  const [color, setColor] = useState("sage");

  async function submit(event) {
    event.preventDefault();
    if (!title.trim()) return;

    await createTask({
      title,
      list: selectedList === "Completed" ? "My Day" : selectedList,
      dueAt: dueAt || null,
      priority,
      color,
      locked: selectedList === "Locked",
    });

    setTitle("");
    setDueAt("");
    setPriority("normal");
  }

  return (
    <form
      onSubmit={submit}
      className={`rounded-3xl bg-paper p-3 shadow-soft ${isPlayMode ? "text-slate-800" : "text-slate-700"}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="h-11 flex-1 rounded-2xl border border-green-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-mint-600"
          placeholder="Add a luminous task"
        />
        <button
          type="submit"
          className="h-11 rounded-2xl bg-mint-600 px-5 text-sm font-semibold text-white transition hover:bg-mint-700"
        >
          Add
        </button>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <input
          type="datetime-local"
          value={dueAt}
          onChange={(event) => setDueAt(event.target.value)}
          className="h-10 rounded-xl border border-green-200 bg-white px-3 text-xs text-slate-800 outline-none"
        />
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
          className="h-10 rounded-xl border border-green-200 bg-white px-3 text-xs text-slate-800 outline-none"
        >
          <option value="normal">Normal</option>
          <option value="important">Important</option>
        </select>

        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-white px-3">
          {colors.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => setColor(swatch)}
              className={`h-5 w-5 rounded-full ${
                swatch === "sage"
                  ? "bg-[#9abb9b]"
                  : swatch === "mint"
                    ? "bg-[#8de3c1]"
                    : swatch === "sand"
                      ? "bg-[#dccb9e]"
                      : swatch === "peach"
                        ? "bg-[#ffc9a9]"
                        : "bg-[#9ecfff]"
              } ${color === swatch ? "ring-2 ring-black/45" : ""}`}
              aria-label={`Choose ${swatch}`}
            />
          ))}
        </div>
      </div>
    </form>
  );
}
