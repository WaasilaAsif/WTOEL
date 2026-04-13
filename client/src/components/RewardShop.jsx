import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";

export function RewardShop() {
  const { rewards, spendPoints } = useApp();

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
              onClick={() => spendPoints(reward.id)}
              className="rounded-xl bg-mint-500 px-3 py-2 text-xs font-semibold text-black"
            >
              Buy
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
