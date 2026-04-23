import { format, isPast, isToday } from "date-fns";

export const formatDate = (dateStr) => {
  try {
    return format(new Date(dateStr), "dd MMM yyyy");
  } catch {
    return dateStr;
  }
};

export const formatDateTime = (dateStr, timeStr) => {
  try {
    return `${format(new Date(dateStr), "EEEE, dd MMMM yyyy")} · ${timeStr}`;
  } catch {
    return `${dateStr} ${timeStr}`;
  }
};

export const formatPrice = (price) => {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export const isEventPast = (dateStr) => {
  try {
    const date = new Date(dateStr);
    return isPast(date) && !isToday(date);
  } catch {
    return false;
  }
};

export const getCategoryColor = (category) => {
  const map = {
    Music: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    Technology: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Art: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    Food: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    Film: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    Sports: "bg-green-500/20 text-green-300 border-green-500/30",
    All: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  };
  return map[category] || "bg-slate-500/20 text-slate-300 border-slate-500/30";
};

export const CATEGORIES = ["All", "Music", "Technology", "Art", "Food", "Film", "Sports"];
