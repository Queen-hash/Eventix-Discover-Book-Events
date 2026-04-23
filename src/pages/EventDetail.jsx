import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapPin, Calendar, Clock, Users, Tag, ArrowLeft, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import useStore from "../store/store";
import { formatDate, formatPrice, isEventPast } from "../utils/helpers";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ui/Toast";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const events = useStore((state) => state.events);
  const user = useStore((state) => state.user);
  const bookTicket = useStore((state) => state.bookTicket);
  const { toasts, addToast, removeToast } = useToast();

  const event = events.find((e) => e.id === id);

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedTier, setSelectedTier] = useState(() =>
    event?.tiers?.length > 0 ? event.tiers[0] : null
  );

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-4">Event not found.</p>
          <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const past = isEventPast(event.date);
  const activePrice = selectedTier ? selectedTier.price : event.price;
  const total = activePrice * quantity;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required.";
    if (!formData.email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Enter a valid email.";
    return errs;
  };

  const handleBook = async () => {
    if (!user) {
      addToast("Please sign in to book tickets.", "error");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    bookTicket({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      eventImage: event.image,
      userId: user.id,
      attendeeName: formData.name,
      attendeeEmail: formData.email,
      quantity,
      totalPrice: total,
      unitPrice: activePrice,
      tierId: selectedTier?.id || null,
      tierName: selectedTier?.name || null,
    });

    setLoading(false);
    addToast("Ticket booked successfully! 🎉", "success");
    setTimeout(() => navigate("/tickets"), 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300 pb-20">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Hero Image */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-200 dark:bg-slate-900">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/20 to-transparent dark:from-[#020617] dark:via-[#020617]/40" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 sm:left-8 flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-black/60 transition-all font-medium shadow-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {past && (
          <div className="absolute top-6 right-4 sm:right-8 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-sm text-slate-200 font-medium">
            This event has ended
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none"
          >
            {/* Title */}
            <div>
              <span className="inline-block px-3 py-1 text-xs font-bold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/30 rounded-full mb-4">
                {event.category}
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-3">
                {event.title}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Organized by <span className="text-slate-900 dark:text-slate-200">{event.organizer}</span>
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Calendar, label: "Date", value: formatDate(event.date) },
                { icon: Clock, label: "Time", value: event.time },
                { icon: MapPin, label: "Location", value: event.location },
                { icon: Users, label: "Capacity", value: `${event.capacity?.toLocaleString()} attendees` },
                { icon: Tag, label: "Price", value: formatPrice(event.price) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl">
                  <div className="w-10 h-10 bg-white dark:bg-slate-800 shadow-sm dark:shadow-none rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">{label}</p>
                    <p className="text-sm text-slate-900 dark:text-white font-bold">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About This Event</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">{event.description}</p>
            </div>
          </motion.div>

          {/* Right: Booking Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-1 lg:sticky lg:top-24"
          >
            <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                  {event.tiers?.length > 0 ? "Starting from" : "Price per ticket"}
                </p>
                <p className={`text-4xl font-extrabold tracking-tight ${activePrice === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>
                  {activePrice === 0 ? "Free" : formatPrice(activePrice)}
                </p>
              </div>

              {/* Tier Selector */}
              {event.tiers?.length > 0 && !past && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Select Ticket Type</p>
                  {event.tiers.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTier(tier)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                        selectedTier?.id === tier.id
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                            selectedTier?.id === tier.id
                              ? "border-indigo-500 bg-indigo-500"
                              : "border-slate-300 dark:border-slate-600"
                          }`} />
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{tier.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{tier.description}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-extrabold flex-shrink-0 ${
                          selectedTier?.id === tier.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"
                        }`}>
                          {formatPrice(tier.price)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {past ? (
                <div className="text-center py-6 text-slate-500 dark:text-slate-400 font-medium text-sm border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  This event has already ended.
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, name: e.target.value }));
                        setErrors((p) => ({ ...p, name: null }));
                      }}
                      placeholder="Full Name"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                    {errors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, email: e.target.value }));
                        setErrors((p) => ({ ...p, email: null }));
                      }}
                      placeholder="you@email.com"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                    {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">{errors.email}</p>}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quantity</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-white disabled:opacity-40"
                        disabled={quantity <= 1}
                      >
                        <Minus size={18} />
                      </button>
                      <span className="text-slate-900 dark:text-white font-bold text-lg w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                        className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-white disabled:opacity-40"
                        disabled={quantity >= 10}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  {event.price > 0 && (
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Total</span>
                      <span className="text-slate-900 dark:text-white font-extrabold text-xl">{formatPrice(total)}</span>
                    </div>
                  )}

                  <button
                    onClick={handleBook}
                    disabled={loading}
                    className="w-full py-4 mt-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30 dark:shadow-none flex items-center justify-center"
                  >
                    {loading ? (
                       <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : "Confirm Booking"}
                  </button>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center">
                    Secure booking · Instant confirmation
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
