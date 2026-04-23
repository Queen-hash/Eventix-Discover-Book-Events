import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_EVENTS } from "../data/mockData";

const useStore = create(
  persist(
    (set, get) => ({
      // ─── THEME ───────────────────────────────────────────────
      theme: "dark",
      toggleTheme: () => {
        const next = useStore.getState().theme === "dark" ? "light" : "dark";
        if (next === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        set({ theme: next });
      },

      // ─── AUTH ────────────────────────────────────────────────
      user: null,
      users: [],

      register: (userData) => {
        const existing = get().users.find((u) => u.email === userData.email);
        if (existing) return { success: false, error: "Email already registered." };
        const newUser = {
          id: `user-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          password: userData.password,
          joinedAt: new Date().toISOString(),
        };
        set((state) => ({
          users: [...state.users, newUser],
          user: { id: newUser.id, name: newUser.name, email: newUser.email, joinedAt: newUser.joinedAt },
        }));
        return { success: true };
      },

      login: (email, password) => {
        const found = get().users.find((u) => u.email === email && u.password === password);
        if (!found) return { success: false, error: "Invalid email or password." };
        set({ user: { id: found.id, name: found.name, email: found.email, joinedAt: found.joinedAt } });
        return { success: true };
      },

      logout: () => set({ user: null }),

      // ─── EVENTS ──────────────────────────────────────────────
      events: [],
      _eventsVersion: 0,

      initEvents: () => {
        const currentVersion = get()._eventsVersion;
        if (currentVersion < 3 || get().events.length === 0) {
          set({ events: MOCK_EVENTS, _eventsVersion: 3 });
        }
      },

      addEvent: (eventData) => {
        const user = get().user;
        const newEvent = {
          id: `evt-${Date.now()}`,
          ...eventData,
          price: eventData.tiers?.length > 0 ? eventData.tiers[0].price : Number(eventData.price),
          capacity: Number(eventData.capacity) || 500,
          createdBy: user?.id || null,
        };
        set((state) => ({ events: [newEvent, ...state.events] }));
        return { success: true };
      },

      // ─── TICKETS ─────────────────────────────────────────────
      tickets: [],

      bookTicket: (ticketData) => {
        const newTicket = {
          id: `tkt-${Date.now()}`,
          ...ticketData,
          bookedAt: new Date().toISOString(),
          status: "valid",
        };
        set((state) => ({ tickets: [...state.tickets, newTicket] }));
        return { success: true, ticket: newTicket };
      },

      getUserTickets: () => {
        const userId = get().user?.id;
        if (!userId) return [];
        return get().tickets.filter((t) => t.userId === userId);
      },

      getTicketById: (ticketId) => {
        return get().tickets.find((t) => t.id === ticketId) || null;
      },

      // ─── ANALYTICS ───────────────────────────────────────────
      getOrganizerStats: () => {
        const { events, tickets } = get();
        const totalRevenue = tickets.reduce((s, t) => s + (t.totalPrice || 0), 0);
        const totalTicketsSold = tickets.reduce((s, t) => s + (t.quantity || 0), 0);

        // Monthly revenue — last 6 months
        const now = new Date();
        const monthlyData = Array.from({ length: 6 }, (_, i) => {
          const start = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
          const end = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 0, 23, 59, 59);
          const monthTickets = tickets.filter((t) => {
            const d = new Date(t.bookedAt);
            return d >= start && d <= end;
          });
          return {
            month: start.toLocaleDateString("id-ID", { month: "short", year: "2-digit" }),
            Revenue: monthTickets.reduce((s, t) => s + (t.totalPrice || 0), 0),
            Tickets: monthTickets.reduce((s, t) => s + (t.quantity || 0), 0),
          };
        });

        // Tickets by category (pie chart)
        const catMap = {};
        tickets.forEach((t) => {
          const evt = events.find((e) => e.id === t.eventId);
          if (evt) catMap[evt.category] = (catMap[evt.category] || 0) + t.quantity;
        });
        const pieData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

        // Per-event performance (top 5 by revenue)
        const eventStats = events
          .map((e) => {
            const evtTickets = tickets.filter((t) => t.eventId === e.id);
            return {
              ...e,
              revenue: evtTickets.reduce((s, t) => s + (t.totalPrice || 0), 0),
              sold: evtTickets.reduce((s, t) => s + (t.quantity || 0), 0),
            };
          })
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 6);

        return { totalRevenue, totalTicketsSold, monthlyData, pieData, eventStats };
      },
    }),
    {
      name: "eventix-storage",
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        users: state.users,
        events: state.events,
        tickets: state.tickets,
        _eventsVersion: state._eventsVersion,
      }),
    }
  )
);

export default useStore;
