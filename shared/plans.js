// Plan limits. "Unlimited" is represented as 100000.
export const PLANS = {
  free: { name: "Free", products: 5, images: 1, price: 0 },
  starter: { name: "Starter", products: 30, images: 3, price: 5000 },
  pro: { name: "Pro", products: 100000, images: 5, price: 10000 },
};

export function effectivePlan(user) {
  if (!user || !PLANS[user.plan] || user.plan === "free") return "free";
  return user.plan_expires_at && user.plan_expires_at > Date.now() ? user.plan : "free";
}
