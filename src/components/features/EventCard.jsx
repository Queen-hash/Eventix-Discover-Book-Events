import { Link } from "react-router-dom";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate, formatPrice, isEventPast, getCategoryColor } from "../../utils/helpers";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function EventCard({ event }) {
  const past = isEventPast(event.date);

  return (
    <motion.div
      variants={itemVariants}
      className={`group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:border-indigo-500/50 dark:hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-black/30 ${
        past ? "opacity-60 hover:opacity-80" : ""
      }`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80";
          }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {past && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-md text-xs text-slate-200 font-medium">
            Ended
          </div>
        )}
        <div
          className={`absolute top-3 right-3 px-2.5 py-1 border rounded-md text-xs font-medium backdrop-blur-sm ${getCategoryColor(event.category)}`}
        >
          {event.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {event.title}
        </h3>

        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            <Calendar size={15} className="flex-shrink-0 text-indigo-500 dark:text-slate-500" />
            <span>{formatDate(event.date)} · {event.time}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin size={15} className="flex-shrink-0 text-indigo-500 dark:text-slate-500" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className={`font-bold text-base ${event.price === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>
            {formatPrice(event.price)}
          </span>
          <Link
            to={`/events/${event.id}`}
            className={`flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-lg transition-all ${
              past
                ? "text-slate-500 bg-slate-100 dark:bg-slate-800 cursor-default pointer-events-none"
                : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
            }`}
          >
            {past ? "View Details" : "View Details"}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
