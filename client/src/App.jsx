import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./services/api.js";

import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import Notes from "./pages/Notes.jsx";
import MyNotes from "./pages/MyNotes.jsx";
import Pricing from "./pages/Pricing.jsx";
import PaymentSucess from "./pages/PaymentSucess.jsx";
import PaymentFailed from "./pages/PaymentFailed.jsx";
import SingleNote from "./pages/SingleNote.jsx";

const App = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    getCurrentUser(dispatch);
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
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

        {/* Koi bhi unknown route -> /auth */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
