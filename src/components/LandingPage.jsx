import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Train, MapPin } from "lucide-react";
import { recorridos } from "../constants/recorridos";
import logoImg from "../imports/Logo-Coche-Comedor-con-tren.png";

export default function LandingPage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  function handleSelect(r) {
    navigate(`/recorrido/${r.id}`);
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: "Outfit, sans-serif",
        background: "linear-gradient(135deg, #020b18 0%, #0d203d 100%)",
      }}
    >
      {/* ── Header ── */}
      <header className="flex flex-col items-center pt-10 pb-6 px-6 gap-2">
        {/* Logo */}
        <img
          src={logoImg}
          alt="Logo Coche Comedor"
          className="w-[280px] h-auto object-contain"
        />
        <h1
          className="text-white text-center"
          style={{
            fontFamily: "DM Serif Display, Georgia, serif",
            fontSize: "clamp(2.2rem, 6vw, 3rem)",
            lineHeight: 1.1,
          }}
        >
          Coche Comedor
        </h1>
        <span className="text-white/45 text-xs tracking-[0.22em] uppercase font-medium">
          Almacén a bordo
        </span>

        {/* Divider */}
        <div className="mt-5 flex items-center gap-3 w-full max-w-[460px]">
          <div className="flex-1 h-px bg-white/10" />
          <div className="flex items-center gap-1.5 text-white/50">
            <Train size={14} />
            <span className="text-xs font-medium tracking-wide">
              Elegí tu recorrido
            </span>
          </div>
          <div className="flex-1 h-px bg-white/10" />
        </div>
      </header>

      {/* ── Grid de recorridos ── */}
      <main className="flex-1 flex flex-col items-center px-4 pb-10">
        <div className="w-full max-w-[620px]">
          <div className="flex flex-col gap-4">
            {recorridos.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelect(r)}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
                className="group relative flex items-center justify-between rounded-2xl px-6 py-5 text-left transition-all duration-200 active:scale-[0.98] cursor-pointer border min-h-[96px]"
                style={{
                  background:
                    hovered === r.id
                      ? "rgba(26, 90, 158, 0.28)"
                      : "rgba(255,255,255,0.04)",
                  borderColor:
                    hovered === r.id
                      ? "rgba(26, 90, 158, 0.7)"
                      : "rgba(255,255,255,0.09)",
                  boxShadow:
                    hovered === r.id
                      ? "0 0 0 1px rgba(26,90,158,0.4), 0 8px 24px rgba(0,0,0,0.3)"
                      : "none",
                }}
              >
                {/* Imagen del recorrido */}
                <div className="flex-shrink-0 w-16 h-16 mr-4 flex items-center justify-center bg-white/5 rounded-xl p-1.5">
                  {r.imagen ? (
                    <img
                      src={r.imagen}
                      alt={r.nombre}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-lg font-bold text-white/40">{r.id}</span>
                  )}
                </div>

                {/* Texto */}
                <div className="flex-1 min-w-0">
                  <div
                    className="text-base md:text-lg font-bold truncate transition-colors duration-200"
                    style={{
                      color: hovered === r.id ? "#fff" : "rgba(255,255,255,0.9)",
                    }}
                  >
                    {r.nombre}
                  </div>
                  {r.descripcion && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin size={12} className="text-white/40 flex-shrink-0" />
                      <span className="text-xs md:text-sm text-white/45 truncate">
                        {r.descripcion}
                      </span>
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ml-3 transition-all duration-200"
                  style={{
                    background:
                      hovered === r.id
                        ? "rgba(26, 90, 158, 0.7)"
                        : "rgba(255,255,255,0.06)",
                  }}
                >
                  <ChevronRight
                    size={16}
                    style={{
                      color:
                        hovered === r.id
                          ? "#fff"
                          : "rgba(255,255,255,0.4)",
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 py-5 px-6 text-xs text-white/30 font-medium tracking-wide border-t border-white/5">
        <span>
          © {new Date().getFullYear()} Coche Comedor. Todos los derechos
          reservados.
        </span>
        <span className="hidden sm:inline text-white/15">•</span>
        <div className="flex items-center gap-2">
          <span>Desarrollado por:</span>
          <img
            src="/logo-marca/Logo L&L blanco.png"
            alt="L&L Logo"
            className="h-7 w-auto object-contain opacity-60 hover:opacity-90 transition-opacity"
          />
        </div>
      </footer>
    </div>
  );
}
