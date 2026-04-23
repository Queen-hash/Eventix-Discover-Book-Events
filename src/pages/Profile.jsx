import { useNavigate } from "react-router-dom";
import { User, Mail, Ticket, Calendar, LogOut, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import useStore from "../store/store";
import { isEventPast } from "../utils/helpers";

export default function Profile() {
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const getUserTickets = useStore((state) => state.getUserTickets);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center text-center px-4 transition-colors duration-300">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none"
        >
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm dark:shadow-none">
            <User size={28} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h2 className="text-slate-900 dark:text-white font-bold text-2xl mb-2">Sign in to view profile</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">You need to be signed in to see your profile.</p>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/30 dark:shadow-none mx-auto"
          >
            Sign In <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    );
  }

  const tickets = getUserTickets();
  const totalTickets = tickets.reduce((sum, t) => sum + t.quantity, 0);
  const eventsAttended = tickets.filter((t) => {
    return isEventPast(t.eventDate);
  }).length;

  const joinedDate = user.joinedAt
    ? format(new Date(user.joinedAt), "MMMM yyyy")
    : "Recently";

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const stats = [
    { label: "Total Tickets Booked", value: totalTickets, icon: Ticket },
    { label: "Events Attended", value: eventsAttended, icon: Calendar },
    { label: "Upcoming Events", value: tickets.length - eventsAttended, icon: ArrowRight },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-2xl font-extrabold text-white shadow-lg shadow-indigo-500/30">
              {initials}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">{user.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Member since {joinedDate}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 text-red-600 dark:text-red-400 hover:text-white border border-red-200 dark:border-red-500/30 hover:border-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 rounded-xl text-sm font-bold transition-all shadow-sm dark:shadow-none"
          >
            <LogOut size={16} />
            Logout
          </button>
        </motion.div>

        {/* User Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-300"
        >
          <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            Account Information
          </h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm dark:shadow-none">
                <User size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-0.5">Full Name</p>
                <p className="text-slate-900 dark:text-white text-base font-bold">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm dark:shadow-none">
                <Mail size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-0.5">Email Address</p>
                <p className="text-slate-900 dark:text-white text-base font-bold">{user.email}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8"
        >
          {stats.map(({ label, value, icon: Icon }, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.1) }}
              key={label}
              className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center shadow-xl shadow-slate-200/50 dark:shadow-none"
            >
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-600 dark:text-indigo-400">
                <Icon size={18} />
              </div>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{value}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-tight uppercase tracking-wide">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Tickets */}
        {tickets.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-300"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Recent Bookings
              </h2>
              <button
                onClick={() => navigate("/tickets")}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                View all
              </button>
            </div>
            <div className="space-y-4">
              {tickets.slice(-3).reverse().map((ticket) => {
                 const isPast = isEventPast(ticket.eventDate);
                 return (
                  <div
                    key={ticket.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 shadow-sm dark:shadow-none">
                        <img
                          src={ticket.eventImage}
                          alt={ticket.eventTitle}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&q=60"; }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base text-slate-900 dark:text-white font-bold truncate mb-1">{ticket.eventTitle}</p>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{ticket.quantity} ticket(s) • {format(new Date(ticket.eventDate), "MMM d, yyyy")}</p>
                      </div>
                    </div>
                    <span className={`self-start sm:self-center text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 ${
                      isPast 
                        ? "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" 
                        : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20"
                    }`}>
                      {isPast ? "Past" : "Valid"}
                    </span>
                  </div>
                 );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
