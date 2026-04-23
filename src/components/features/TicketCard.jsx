import { QRCodeSVG } from "qrcode.react";
import { Download, MapPin, Calendar, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate, formatPrice } from "../../utils/helpers";

export default function TicketCard({ ticket, onDownload, index = 0 }) {
  const qrData = JSON.stringify({
    ticketId: ticket.id,
    event: ticket.eventTitle,
    attendee: ticket.attendeeName,
    date: ticket.eventDate,
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200 dark:hover:border-slate-700 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Left: Event Image */}
        <div className="sm:w-40 h-48 sm:h-auto flex-shrink-0 bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
          <img
            src={ticket.eventImage}
            alt={ticket.eventTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/30 pointer-events-none" />
        </div>

        {/* Divider line */}
        <div className="hidden sm:block relative w-px bg-slate-200 dark:bg-slate-800 flex-shrink-0 border-dashed border-l border-slate-200 dark:border-slate-700">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-50 dark:bg-[#020617] rounded-full shadow-inner" />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-50 dark:bg-[#020617] rounded-full shadow-inner" />
        </div>

        {/* Middle: Event Info */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight line-clamp-2">{ticket.eventTitle}</h3>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1 rounded-full flex-shrink-0">
                <CheckCircle size={14} />
                {ticket.status === "valid" ? "Valid" : "Used"}
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-2.5">
                <Calendar size={16} className="text-indigo-500 dark:text-slate-500 flex-shrink-0" />
                <span>{formatDate(ticket.eventDate)} · {ticket.eventTime}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={16} className="text-indigo-500 dark:text-slate-500 flex-shrink-0" />
                <span className="line-clamp-1">{ticket.eventLocation}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 mb-1 uppercase tracking-wide">Attendee</p>
              <p className="text-sm text-slate-900 dark:text-white font-bold">{ticket.attendeeName}</p>
              <p className="text-xs text-slate-500 font-medium">{ticket.attendeeEmail}</p>
              {ticket.tierName && (
                <span className="inline-flex items-center mt-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                  {ticket.tierName}
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 mb-1 uppercase tracking-wide">{ticket.quantity}× ticket</p>
              <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{formatPrice(ticket.totalPrice)}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block relative w-px bg-slate-200 dark:bg-slate-800 flex-shrink-0 border-dashed border-l border-slate-200 dark:border-slate-700">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-50 dark:bg-[#020617] rounded-full shadow-inner" />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-50 dark:bg-[#020617] rounded-full shadow-inner" />
        </div>

        {/* Right: QR + Download */}
        <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center p-6 sm:p-8 gap-5 sm:w-48 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 dark:border-white/10">
            <QRCodeSVG value={qrData} size={88} level="M" />
          </div>
          <button
            onClick={() => onDownload(ticket)}
            className="w-full flex items-center justify-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-white bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-600 dark:hover:bg-indigo-500 border border-indigo-200 dark:border-indigo-500/20 px-4 py-2.5 rounded-xl transition-all shadow-sm dark:shadow-none whitespace-nowrap"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>

      {/* Ticket ID */}
      <div className="px-6 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
        <p className="text-xs font-mono font-medium text-slate-400 dark:text-slate-600 tracking-widest text-center sm:text-left">ID: {ticket.id}</p>
      </div>
    </motion.div>
  );
}
