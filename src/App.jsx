import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import HomeScreen from "./components/HomeScreen";
import OrderApp from "./components/OrderApp";

export default function App() {
  return (
    <Routes>
      {/* / → selector de recorridos */}
      <Route path="/" element={<LandingPage />} />

      {/* /recorrido/:id → pantalla de bienvenida del recorrido */}
      <Route path="/recorrido/:id" element={<HomeScreen />} />

      {/* /recorrido/:id/menu → menú + checkout */}
      <Route path="/recorrido/:id/menu" element={<OrderApp />} />
    </Routes>
  );
}
