import React, { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Cart from "./components/Cart";
import routes from "tempo-routes";

// Lazy load components
const BookingPage = lazy(() => import("./pages/booking"));
const ServicesPage = lazy(() => import("./pages/services"));
const AdminLoginPage = lazy(() => import("./pages/admin/login"));
const AdminDashboardPage = lazy(() => import("./pages/admin/dashboard"));

function App() {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<Home />} />
          <Route path="/contact" element={<Home />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Routes>
      </Suspense>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </>
  );
}

export default App;
