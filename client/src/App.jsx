import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./services/api.js";
import { AnimatePresence } from "motion/react";

import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import Notes from "./pages/Notes.jsx";
import MyNotes from "./pages/MyNotes.jsx";
import Pricing from "./pages/Pricing.jsx";
import PaymentSucess from "./pages/PaymentSucess.jsx";
import PaymentFailed from "./pages/PaymentFailed.jsx";
import SingleNote from "./pages/SingleNote.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import WelcomeMascot from "./pages/WelcomeMascot.jsx";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    getCurrentUser(dispatch);
  }, [dispatch]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Default: / -> /auth (agar logged out), / -> /home (agar logged in) */}
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/auth" />}
        />

        {/* Auth page: agar already logged in toh Home pe jao */}
        <Route
          path="/auth"
          element={userData ? <Navigate to="/" /> : <Auth />}
        />

        <Route path="/notes" element={<Notes />} />
        <Route path="/my-notes" element={<MyNotes />} />
        <Route path="/credits" element={<Pricing />} />
        <Route path="/credits/success" element={<PaymentSucess />} />
        <Route path="/credits/cancel" element={<PaymentFailed />} />
        <Route path="/notes/:id" element={<SingleNote />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/welcome" element={<WelcomeMascot />} />

        {/* Koi bhi unknown route -> /auth */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </AnimatePresence>
  );
};
export default App;
