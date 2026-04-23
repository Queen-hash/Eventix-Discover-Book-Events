# Eventix 🎟️

**Eventix** adalah platform manajemen tiket event modern yang dibangun dalam satu malam penuh "war ticket" inspiration. Aplikasi ini dirancang untuk memberikan pengalaman booking yang cepat, responsif, dan estetik bagi para pencinta event.

<div align="center">
  <img src="Mockup Eventix.jpg" alt="Eventix Mockup Display" width="100%">
</div>

---

## 🚀 Key Features

* **Dynamic Event Discovery:** Grid event dengan filter kategori (Music, Tech, etc.) dan status (Upcoming/Past).
* **Real-time Search:** Fitur pencarian yang responsif untuk menemukan event favorit secara instan.
* **State Persistence:** Menggunakan **Zustand** dengan persist middleware, sehingga data tiket di keranjang tidak hilang saat browser di-refresh.
* **Instant Ticketing:** Dilengkapi dengan fitur **QR Code** dan tombol **Download PDF** untuk tiket yang sudah dipesan.
* **Full Management:** Halaman "Add Event" dengan fitur preview gambar secara real-time sebelum dipublish.

## 🛠️ Tech Stack

* **Frontend Framework:** [React.js](https://reactjs.org/) (Vite)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand)
* **Icons:** Lucide React & DevIcon
* **Deployment:** [Vercel](https://vercel.com/)

## 📂 Project Structure
      ```text
      src/
      ├── components/      # UI (Navbar, Toast) & Features (EventCard, TicketCard)
      ├── hooks/           # Custom React hooks (useToast)
      ├── store/           # Zustand store with persistence logic
      ├── utils/           # Formatters & helper functions
      └── pages/           # Route views (Home, EventDetail, MyTickets, Profile)
⚡ Quick Start
  1. Clone the repo:

    ```Bash
    git clone [https://github.com/username-lu/eventix.git](https://github.com/username-lu/eventix.git)
  2. Install dependencies:
     
    ```Bash
    npm install
  4. Run development server:

    ```Bash
    npm run dev
    
🤝 Contributions
This app was created as part of a personal portfolio project. 
If you have any suggestions, find a bug, or would like to contribute by adding new features, please feel free to create 
a Pull Request or open an Issue.

📞 Contact & Profile
Designed and developed with ❤️ by Munawardy (DY).

📸 Instagram: @_nrrdyy

💼 LinkedIn: Munawardy

📧 Email: wincakardi.040105@gmail.com

🌐 Website: munawardy.com
