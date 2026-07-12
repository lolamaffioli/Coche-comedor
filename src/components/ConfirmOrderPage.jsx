import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, Loader, AlertTriangle, Clock } from "lucide-react";
import { sendStaffOrderEmail } from "../services/email";

const STORAGE_KEY = "confirmed_orders";

function isOrderConfirmed(orderId) {
  try {
    const confirmed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return confirmed.includes(orderId);
  } catch {
    return false;
  }
}

function markOrderConfirmed(orderId) {
  try {
    const confirmed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    confirmed.push(orderId);
    // Guardamos solo los últimos 50 para no llenar el storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(confirmed.slice(-50)));
  } catch {
    // Si falla, no es crítico
  }
}

export default function ConfirmOrderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | success | already_confirmed | expired | invalid | error

  useEffect(() => {
    const raw = searchParams.get("d");
    if (!raw) { setStatus("invalid"); return; }

    try {
      const decoded = JSON.parse(atob(decodeURIComponent(raw)));

      // Verificar expiración (15 minutos)
      if (decoded.expiresAt && Date.now() > decoded.expiresAt) {
        setStatus("expired");
        return;
      }

      // Verificar si ya fue confirmado en este dispositivo
      if (decoded.orderId && isOrderConfirmed(decoded.orderId)) {
        setStatus("already_confirmed");
        return;
      }

      setOrderData(decoded);
    } catch {
      setStatus("invalid");
    }
  }, []);

  function handleConfirm() {
    if (!orderData) return;
    setStatus("sending");

    sendStaffOrderEmail(orderData)
      .then(() => {
        // Marcar como confirmado para evitar duplicados
        if (orderData.orderId) markOrderConfirmed(orderData.orderId);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }

  // ── Link expirado ────────────────────────────────────────────
  if (status === "expired") {
    return (
      <Screen>
        <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
          <Clock size={32} className="text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Link expirado</h2>
        <p className="text-white/70 text-sm text-center leading-relaxed">
          El link de confirmación venció (15 minutos). Volvé a hacer el pedido desde la app.
        </p>
        <button onClick={() => navigate("/")} className="mt-2 bg-white/20 text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-white/30 active:scale-95 transition-all cursor-pointer">
          Volver al inicio
        </button>
      </Screen>
    );
  }

  // ── Ya confirmado antes ──────────────────────────────────────
  if (status === "already_confirmed") {
    return (
      <Screen>
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Check size={32} className="text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Pedido ya confirmado</h2>
        <p className="text-white/70 text-sm text-center leading-relaxed">
          Este pedido ya fue confirmado anteriormente. El personal del Coche Comedor lo recibió.
        </p>
        <button onClick={() => navigate("/")} className="mt-2 bg-white/20 text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-white/30 active:scale-95 transition-all cursor-pointer">
          Volver al inicio
        </button>
      </Screen>
    );
  }

  // ── Link inválido ────────────────────────────────────────────
  if (status === "invalid") {
    return (
      <Screen>
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertTriangle size={32} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Link inválido</h2>
        <p className="text-white/70 text-sm text-center">El link de confirmación no es válido.</p>
        <button onClick={() => navigate("/")} className="mt-2 bg-white/20 text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-white/30 active:scale-95 transition-all cursor-pointer">
          Volver al inicio
        </button>
      </Screen>
    );
  }

  // ── Pedido enviado con éxito ─────────────────────────────────
  if (status === "success") {
    return (
      <Screen>
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Check size={40} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">¡Pedido enviado!</h2>
        <p className="text-white/80 text-sm text-center leading-relaxed">
          Tu pedido fue enviado al personal del Coche Comedor. En breve se pondrán en contacto o lo recibirás en tu asiento.
        </p>
        <p className="text-white/40 text-xs text-center mt-1">⚠️ Recordá que el pago es presencial al recibir/retirar.</p>
        <button onClick={() => navigate("/")} className="mt-4 bg-white text-primary font-semibold text-sm px-6 py-3 rounded-xl shadow-lg hover:bg-white/90 active:scale-95 transition-all cursor-pointer">
          Volver al inicio
        </button>
      </Screen>
    );
  }

  // ── Error al enviar ─────────────────────────────────────────
  if (status === "error") {
    return (
      <Screen>
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertTriangle size={32} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Hubo un problema</h2>
        <p className="text-white/70 text-sm text-center">No pudimos enviar el pedido. Volvé a intentarlo.</p>
        <button onClick={handleConfirm} className="mt-2 bg-white/20 text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-white/30 active:scale-95 transition-all cursor-pointer">
          Reintentar
        </button>
      </Screen>
    );
  }

  // ── Cargando ────────────────────────────────────────────────
  if (!orderData) {
    return (
      <Screen>
        <Loader size={32} className="text-white/60 animate-spin" />
        <p className="text-white/60 text-sm">Cargando tu pedido...</p>
      </Screen>
    );
  }

  // ── Vista principal: resumen + botón confirmar ────────────────
  const { cart, delivery, cocheNumber, seatNumber, timeSlot, payment, cashAmount, totalPrice, recorridoName, clientEmail, expiresAt } = orderData;
  const change = Number(cashAmount) - totalPrice;

  // Tiempo restante
  const minutosRestantes = expiresAt ? Math.max(0, Math.ceil((expiresAt - Date.now()) / 60000)) : null;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-12 px-4"
      style={{ fontFamily: "Outfit, sans-serif", background: "linear-gradient(135deg, #020b18 0%, #0d203d 100%)" }}
    >
      <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6" style={{ background: "linear-gradient(135deg, #091f41 0%, #1a5a9e 100%)" }}>
          <h1 className="text-white font-bold text-xl mb-1">Confirmá tu pedido</h1>
          <p className="text-white/70 text-sm">Revisá los detalles y confirmá para enviarlo al Coche Comedor.</p>
          {minutosRestantes !== null && (
            <div className="flex items-center gap-1.5 mt-3 bg-white/10 rounded-full px-3 py-1.5 w-fit">
              <Clock size={12} className="text-white/70" />
              <span className="text-white/70 text-xs font-medium">
                {minutosRestantes > 0 ? `Expira en ${minutosRestantes} min` : "Expirando..."}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Productos */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tu compra</p>
            <div className="flex flex-col gap-2">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center gap-4">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-foreground truncate">
                      {item.qty > 1 && <span className="font-semibold text-accent mr-1">{item.qty}×</span>}
                      {item.name}
                    </span>
                    {item.codigo && <span className="text-[10px] font-mono text-muted-foreground">COD {item.codigo}</span>}
                  </div>
                  <span className="text-sm font-medium text-foreground flex-shrink-0">${(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 mt-1 border-t border-border">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="text-base font-bold text-primary">${totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Detalles de entrega */}
          <div className="bg-secondary rounded-2xl p-4 flex flex-col gap-1.5 border border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Detalles</p>
            <Row label="Recorrido" value={recorridoName} />
            <Row label="Entrega" value={delivery === "seat" ? `Coche ${cocheNumber} — Asiento ${seatNumber}` : `Retirar por barra (${timeSlot || "De inmediato"})`} />
            <Row label="Pago" value={payment === "cash" ? `Efectivo (con $${Number(cashAmount).toLocaleString()}, vuelto $${change >= 0 ? change.toLocaleString() : "0"})` : "Tarjeta Física"} />
            <Row label="Email" value={clientEmail} />
          </div>

          {/* Aviso */}
          <div className="bg-amber-500/8 border border-amber-500/20 rounded-2xl p-4">
            <p className="text-xs text-amber-400 font-semibold mb-1">⚠️ Importante</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Este email <strong>no sirve como comprobante de pago</strong>. El pago se realiza de forma presencial al recibir o retirar el pedido.
            </p>
          </div>

          {/* Botón principal */}
          <button
            onClick={handleConfirm}
            disabled={status === "sending"}
            className="w-full bg-primary text-white rounded-xl py-4 font-semibold text-sm active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === "sending" ? (
              <>
                <Loader size={16} className="animate-spin" />
                Enviando pedido...
              </>
            ) : (
              <>
                <Check size={16} />
                Confirmar mi pedido
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Screen({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-5 px-8 text-center"
      style={{ fontFamily: "Outfit, sans-serif", background: "linear-gradient(135deg, #091f41 0%, #1a5a9e 100%)" }}
    >
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-3 text-xs">
      <span className="text-muted-foreground flex-shrink-0">{label}</span>
      <span className="text-foreground text-right">{value}</span>
    </div>
  );
}
