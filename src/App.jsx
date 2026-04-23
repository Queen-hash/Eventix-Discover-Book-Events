import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import MyTickets from "./pages/MyTickets";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import useStore from "./store/store";

function ProtectedRoute({ children }) {
  const { user } = useStore();
  return user ? children : <Navigate to="/login" replace />;
}

function AuthRoute({ children }) {
  const { user } = useStore();
  return user ? <Navigate to="/" replace /> : children;
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

function AuthLayout({ children }) {
  return <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">{children}</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages - no navbar */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <AuthLayout>
                <Register />
              </AuthLayout>
            </AuthRoute>
          }
        />

        {/* App pages - with navbar */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/events/:id"
          element={
            <Layout>
              <EventDetail />
            </Layout>
          }
        />
        <Route
          path="/tickets"
          element={
            <Layout>
              <MyTickets />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />


        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
