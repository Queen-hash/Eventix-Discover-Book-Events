import { useNavigate } from "react-router-dom";
import { Ticket, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import useStore from "../store/store";
import TicketCard from "../components/features/TicketCard";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ui/Toast";
import { formatDate, formatPrice } from "../utils/helpers";

const downloadTicketPDF = async (ticket) => {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // Background
  doc.setFillColor(15, 23, 42); // slate-950
  doc.rect(0, 0, 210, 297, "F");

  // Header bar
  doc.setFillColor(99, 102, 241); // indigo-500
  doc.rect(0, 0, 210, 2, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Eventix", 20, 25);

  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFont("helvetica", "normal");
  doc.text("E-TICKET CONFIRMATION", 20, 33);

  // Divider
  doc.setDrawColor(51, 65, 85); // slate-700
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);

  // Event Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(ticket.eventTitle, 20, 55);

  // Info block
  const info = [
    ["Attendee", ticket.attendeeName],
    ["Email", ticket.attendeeEmail],
    ["Date", formatDate(ticket.eventDate)],
    ["Time", ticket.eventTime],
    ["Location", ticket.eventLocation],
    ["Quantity", `${ticket.quantity} ticket(s)`],
    ["Total Paid", formatPrice(ticket.totalPrice)],
    ["Status", "VALID"],
    ["Ticket ID", ticket.id],
    ["Booked At", new Date(ticket.bookedAt).toLocaleString()],
  ];

  let y = 70;
  info.forEach(([label, value]) => {
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFont("helvetica", "normal");
    doc.text(label.toUpperCase(), 20, y);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const displayValue = String(value ?? "");
    doc.text(displayValue, 20, y + 6);
    y += 16;
  });

  // Footer
  doc.setFillColor(99, 102, 241, 0.15);
  doc.rect(0, 270, 210, 27, "F");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text("This is an official Eventix e-ticket. Present this document at entry.", 20, 282);
  doc.text("eventix.id · support@eventix.id", 20, 289);

  doc.save(`ticket-${ticket.id}.pdf`);
};

export default function MyTickets() {
  const user = useStore((state) => state.user);
  const getUserTickets = useStore((state) => state.getUserTickets);
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const tickets = getUserTickets();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center text-center px-4 transition-colors duration-300">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none"
        >
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm dark:shadow-none">
            <Ticket size={28} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h2 className="text-slate-900 dark:text-white font-bold text-2xl mb-2">Sign in to view tickets</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">You need to be signed in to see your tickets.</p>
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

  const handleDownload = async (ticket) => {
    try {
      await downloadTicketPDF(ticket);
      addToast("PDF downloaded successfully!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to generate PDF.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300 pb-20">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center sm:text-left"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">My Tickets</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium">
            {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} booked
          </p>
        </motion.div>

        {tickets.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center py-24 px-4 text-center border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/50 shadow-xl shadow-slate-200/50 dark:shadow-none"
          >
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-sm dark:shadow-none">
              <Ticket size={32} className="text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-xl mb-3">No tickets yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-8 font-medium">
              Book your first event and it'll show up here.
            </p>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/30 dark:shadow-none"
            >
              Browse Events <ArrowRight size={16} />
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {tickets.slice().reverse().map((ticket, index) => (
              <TicketCard key={ticket.id} ticket={ticket} onDownload={handleDownload} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
