import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";

export function RewardShop() {
  const { rewards, tasks, spendPoints } = useApp();

  async function handleRewardClick(reward) {
    if (reward.id === "unlock-task") {
      // Show locked tasks for selection
      const lockedTasks = tasks.filter((t) => t.locked && !t.completed);
      if (lockedTasks.length === 0) {
        alert("No locked tasks to unlock!");
        return;
      }

      const taskList = lockedTasks.map((t, i) => `${i + 1}. ${t.title}`).join("\n");
      const selected = window.prompt(
        `Which task to unlock? (enter number):\n\n${taskList}`,
        ""
      );

      if (selected?.trim()) {
        const index = parseInt(selected.trim(), 10) - 1;
        if (index >= 0 && index < lockedTasks.length) {
          const task = lockedTasks[index];
          await spendPoints(reward.id, task.id);
        } else {
          alert("Invalid selection.");
        }
      }
    } else {
      await spendPoints(reward.id);
    }
  }

  return (
    <section className="rounded-3xl border border-mint-500/30 bg-black/30 p-4">
      <h3 className="font-heading text-lg text-mint-100">Barter Shop</h3>
      <p className="text-xs text-mint-200/85">Points are spendable. XP is permanent progression.</p>

      <div className="mt-3 space-y-2">
        {rewards.shop.map((reward) => (
          <motion.div
            key={reward.id}
            className="flex items-center justify-between rounded-2xl border border-mint-300/20 bg-black/20 p-2"
            whileHover={{ scale: 1.01 }}
          >
            <div>
              <p className="text-sm text-mint-50">{reward.name}</p>
              <p className="text-xs text-mint-200">{reward.cost} pts</p>
            </div>
            <button
              type="button"
              onClick={() => handleRewardClick(reward)}
              className="rounded-xl bg-mint-500 px-3 py-2 text-xs font-semibold text-black hover:bg-mint-600 transition"
              title={reward.name}
            >
              {reward.cost} pts
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
