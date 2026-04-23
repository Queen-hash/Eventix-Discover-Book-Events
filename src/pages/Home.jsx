import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import useStore from "../store/store";
import EventCard from "../components/features/EventCard";
import EventCardSkeleton from "../components/features/EventCardSkeleton";
import { CATEGORIES, isEventPast } from "../utils/helpers";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const initEvents = useStore((state) => state.initEvents);
  const allEvents = useStore((state) => state.events);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get("q") || "";
  const activeTab = searchParams.get("tab") || "upcoming";
  const selectedCategory = searchParams.get("category") || "All";

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    initEvents();
    // Simulate network delay for skeleton loading effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [initEvents]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const isUpcoming = !isEventPast(event.date);
      const matchesTab = activeTab === "upcoming" ? isUpcoming : !isUpcoming;
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;
      return matchesTab && matchesSearch && matchesCategory;
    });
  }, [allEvents, searchQuery, activeTab, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Hero */}
      <section className="relative border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-white to-white dark:from-indigo-950/40 dark:via-[#020617] dark:to-[#020617] pointer-events-none transition-colors duration-300" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="max-w-2xl">
            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4"
            >
              Discover · Book · Attend
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4 tracking-tight"
            >
              Find events that{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">matter to you.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-xl leading-relaxed"
            >
              From local gigs to major festivals — discover and book tickets for
              the best events across Indonesia.
            </motion.p>

            {/* Search */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl blur-md group-hover:blur-lg transition-all" />
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => updateParams({ q: e.target.value })}
                  placeholder="Search events, locations, categories..."
                  className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm shadow-sm"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Tab Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 gap-1">
              {["upcoming", "past"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => updateParams({ tab: tab === "upcoming" ? null : tab })}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-0"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab === "upcoming" ? "Upcoming" : "Past Events"}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
              <SlidersHorizontal size={14} className="text-slate-400 flex-shrink-0 hidden sm:block" />
              <div className="flex gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateParams({ category: cat === "All" ? null : cat })}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                      selectedCategory === cat
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {activeTab === "upcoming" ? "Upcoming Events" : "Past Events"}
            <span className="ml-2 text-sm text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {filteredEvents.length}
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed"
          >
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <Search size={24} className="text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">No events found</h3>
            <p className="text-slate-500 text-sm max-w-xs">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                updateParams({ q: null, category: null });
              }}
              className="mt-4 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-700 dark:hover:text-indigo-300 underline underline-offset-4"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
