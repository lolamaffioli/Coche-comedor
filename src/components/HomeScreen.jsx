import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Clock, ArrowLeft, Train } from "lucide-react";
import { recorridos } from "../constants/recorridos";
import logoImg from "../imports/Logo_Coche_Comedor_con_tren.png";

export default function HomeScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recorrido = recorridos.find((r) => r.id === Number(id));

  function handleStart() {
    navigate(`/recorrido/${id}/menu`);
  }

  function handleSchedule() {
    navigate(`/recorrido/${id}/menu?delivery=reserve`);
  }

  return (
    <div
      className="min-h-screen bg-background flex flex-col justify-center items-center p-0 md:p-6"
      style={{
        fontFamily: "Outfit, sans-serif",
        background: "linear-gradient(135deg, #020b18 0%, #0d203d 100%)",
      }}
    >
      <div className="w-full max-w-[1024px] min-h-screen md:min-h-[700px] md:h-[80vh] rounded-none md:rounded-3xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col md:flex-row relative bg-background">
        {/* Left side: Brand with train background */}
        <div className="relative bg-primary overflow-hidden flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[360px] md:min-h-full">
          <img
            src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&h=1200&fit=crop&auto=format"
            alt="Tren en viaje"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/75 via-primary/55 to-primary" />

          <div className="relative z-10 flex flex-col items-center gap-2">
            {/* Logo */}
            <div className="overflow-hidden w-[280px] h-[160px] mb-[-10px] md:w-[320px] md:h-[190px] md:mb-[-24px]">
              <img
                src={logoImg}
                alt="Logo Coche Comedor"
                className="block w-full h-auto mt-[-100px] md:mt-[-124px]"
              />
            </div>
            <h1
              className="text-white"
              style={{
                fontFamily: "DM Serif Display, Georgia, serif",
                fontSize: "clamp(2.4rem, 6vw, 3.5rem)",
                lineHeight: 1.1,
              }}
            >
              Coche<br />Comedor
            </h1>
            <span className="text-white/45 text-xs tracking-[0.2em] uppercase font-medium">
              Almacén a bordo
            </span>

            {/* Recorrido badge */}
            {recorrido && (
              <div
                className="flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.12)" }}
              >
                <Train size={12} className="text-white/70" />
                <span className="text-white/80 text-xs font-medium">
                  {recorrido.nombre}
                </span>
              </div>
            )}

            <p className="text-white/60 text-sm mt-4 leading-relaxed max-w-[280px] hidden md:block">
              Cafetería, sándwiches, bebidas y snacks para tu viaje en tren.
              Pedí para recibir en tu asiento.
            </p>
          </div>
        </div>

        {/* Right side: Action choices */}
        <div className="w-full md:w-[430px] bg-background flex flex-col justify-center px-8 py-10 md:py-8 gap-8 border-t md:border-t-0 md:border-l border-border">
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit cursor-pointer"
          >
            <ArrowLeft size={14} />
            Cambiar recorrido
          </button>

          <div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">
              Viajá cómodo
            </p>
            <h2 className="text-foreground text-2xl font-bold">
              ¿Qué querés pedir hoy?
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleStart}
              className="w-full bg-primary text-white rounded-2xl py-4 px-6 flex items-center justify-between text-left group active:scale-[0.97] transition-all shadow-lg shadow-primary/10 cursor-pointer"
            >
              <div>
                <div className="text-white text-base font-semibold">
                  Pedir ahora
                </div>
                <div className="text-white/65 text-xs font-normal mt-0.5">
                  Te lo llevamos a tu asiento
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                <ChevronRight size={16} className="text-white" />
              </div>
            </button>

            <button
              onClick={handleSchedule}
              className="w-full bg-card border border-border text-foreground rounded-2xl py-4 px-6 flex items-center justify-between text-left group active:scale-[0.97] transition-all hover:border-accent/40 cursor-pointer"
            >
              <div>
                <div className="text-foreground text-base font-semibold">
                  Retirar por barra
                </div>
                <div className="text-muted-foreground text-xs font-normal mt-0.5">
                  Retirá tu pedido por el coche bar
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-secondary/70 transition-colors">
                <Clock size={16} className="text-primary" />
              </div>
            </button>
          </div>

          {/* Menu preview */}
          <div className="mt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Lo más pedido del viaje
            </p>
            <div className="flex flex-col gap-2">
              {[
                { name: "Café con leche y dos medialunas", price: "$4000" },
                { name: "Pebete de jamón y queso", price: "$4000" },
                { name: "Agua mineral", price: "$1500" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between bg-card rounded-xl px-4 py-3 border border-border"
                >
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="text-sm font-semibold text-primary">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 py-6 px-6 text-xs text-white/50 font-medium tracking-wide">
      <span>
        © {new Date().getFullYear()} Coche Comedor. Todos los derechos
        reservados.
      </span>
      <span className="hidden sm:inline text-white/20">•</span>
      <div className="flex items-center gap-2">
        <span>Desarrollado por:</span>
        <img
          src="/logo-marca/Logo L&L blanco.png"
          alt="L&L Logo"
          className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
        />
      </div>
    </footer>
  );
}
