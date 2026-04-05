import type { LucideIcon } from "lucide-react";
import {
  Stethoscope,
  Utensils,
  BookOpen,
  Home,
  Wrench,
  Users,
  Heart,
  Sparkles,
} from "lucide-react";

/** Canonical values stored on expenses and used for donor impact aggregation */
export const EXPENSE_CATEGORY_OPTIONS: Array<{
  value: string;
  label: string;
  Icon: LucideIcon;
  gradient: string;
}> = [
  {
    value: "Medical & Health",
    label: "Medical & Health",
    Icon: Stethoscope,
    gradient: "from-rose-400 to-pink-500",
  },
  {
    value: "Food & Nutrition",
    label: "Food & Nutrition",
    Icon: Utensils,
    gradient: "from-orange-400 to-amber-400",
  },
  {
    value: "Education & Supplies",
    label: "Education & Supplies",
    Icon: BookOpen,
    gradient: "from-pink-400 to-rose-400",
  },
  {
    value: "Housing & Infrastructure",
    label: "Housing & Infrastructure",
    Icon: Home,
    gradient: "from-violet-400 to-purple-500",
  },
  {
    value: "Operations & Maintenance",
    label: "Operations & Maintenance",
    Icon: Wrench,
    gradient: "from-slate-400 to-slate-600",
  },
  {
    value: "Community Programs",
    label: "Community Programs",
    Icon: Users,
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    value: "Other",
    label: "Other",
    Icon: Sparkles,
    gradient: "from-fuchsia-400 to-pink-500",
  },
];

const OTHER_VALUE = "Other";

export function getCategoryDisplay(category: string | null | undefined) {
  const raw = (category || "").trim();
  const found = EXPENSE_CATEGORY_OPTIONS.find((o) => o.value === raw);
  if (found) return found;
  return {
    value: raw || "General",
    label: raw || "General",
    Icon: Heart,
    gradient: "from-pink-400 to-rose-400",
  };
}

export function resolveExpenseCategory(selected: string, otherDetail: string): string {
  if (selected === OTHER_VALUE) {
    const t = otherDetail.trim();
    return t || OTHER_VALUE;
  }
  return selected;
}

export { OTHER_VALUE };
