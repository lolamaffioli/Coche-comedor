import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Clock, ArrowLeft, Train, Flame, Plus, Minus, XCircle, AlertTriangle, X } from "lucide-react";
import { recorridos } from "../constants/recorridos";
import { menuByRecorrido } from "../constants/menu";
import logoImg from "../imports/Logo-Coche-Comedor-con-tren.png";

export default function HomeScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recorrido = recorridos.find((r) => r.id === Number(id));

  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(`cart-${id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // ── Estado del modal de arrepentimiento ──
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelEmail, setCancelEmail] = useState("");
  const [cancelOrderNum, setCancelOrderNum] = useState("");
  const [cancelSubmitted, setCancelSubmitted] = useState(false);
  const [cancelError, setCancelError] = useState("");

  function handleCancelSubmit(e) {
    e.preventDefault();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cancelEmail.trim());
    if (!emailValid) {
      setCancelError("Por favor ingresá un mail válido.");
      return;
    }
    if (!cancelOrderNum.trim()) {
      setCancelError("Por favor ingresá el número de pedido.");
      return;
    }
    setCancelError("");
    setCancelSubmitted(true);
  }

  function closeCancelModal() {
    setShowCancelModal(false);
    setCancelEmail("");
    setCancelOrderNum("");
    setCancelSubmitted(false);
    setCancelError("");
  }

  const [heatingItem, setHeatingItem] = useState(null);

  useEffect(() => {
    localStorage.setItem(`cart-${id}`, JSON.stringify(cart));
  }, [cart, id]);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Mapear los productos más pedidos del menú real para este recorrido
  const menuItems = menuByRecorrido[Number(id)] || {};
  const allProducts = Object.values(menuItems).flat();
  const targetIds = [900, 307, 101]; // [Café con leche + Medialunas, Pebete, Agua]
  const masPedidosItems = targetIds
    .map((tid) => allProducts.find((p) => p.id === tid))
    .filter(Boolean);

  const needsHeatingOption = (item) => {
    const nameLower = item.name.toLowerCase();
    return nameLower.includes("medialuna") || nameLower.includes("pebete");
  };

  function handleIncrement(item) {
    if (needsHeatingOption(item)) {
      const existing = cart.find((c) => c.id === item.id);
      if (existing) {
        performAddToCart(item, existing.caliente);
      } else {
        setHeatingItem(item);
      }
    } else {
      performAddToCart(item);
    }
  }

  function performAddToCart(item, caliente) {
    const cartItemId = caliente !== undefined ? `${item.id}-${caliente ? "caliente" : "frio"}` : String(item.id);
    const updated = (() => {
      const existing = cart.find((c) => c.cartItemId === cartItemId);
      if (existing) {
        return cart.map((c) =>
          c.cartItemId === cartItemId ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...cart, { ...item, cartItemId, caliente, qty: 1 }];
    })();
    saveCart(updated);
  }

  function handleDecrement(item) {
    const existingIndex = cart.map((c) => c.id).lastIndexOf(item.id);
    if (existingIndex === -1) return;
    const existing = cart[existingIndex];
    let updated;
    if (existing.qty === 1) {
      updated = cart.filter((_, idx) => idx !== existingIndex);
    } else {
      updated = cart.map((c, idx) =>
        idx === existingIndex ? { ...c, qty: c.qty - 1 } : c
      );
    }
    saveCart(updated);
  }

  function saveCart(newCart) {
    setCart(newCart);
    localStorage.setItem(`cart-${id}`, JSON.stringify(newCart));
  }

  function getQty(productId) {
    return cart.filter((c) => c.id === productId).reduce((s, c) => s + c.qty, 0);
  }

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
            <img
              src={logoImg}
              alt="Logo Coche Comedor"
              className="w-[240px] h-auto object-contain md:w-[280px]"
            />
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
        <div className={`w-full md:w-[430px] bg-background flex flex-col justify-center px-8 py-10 md:py-8 gap-8 border-t md:border-t-0 md:border-l border-border relative ${cart.length > 0 ? "pb-24 md:pb-24" : ""}`}>
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

            {/* Botón de Arrepentimiento */}
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full border-2 border-red-500/60 text-red-500 rounded-2xl py-3.5 px-6 flex items-center justify-between text-left group active:scale-[0.97] transition-all hover:bg-red-500/8 hover:border-red-500 cursor-pointer"
            >
              <div>
                <div className="text-red-500 text-sm font-semibold">
                  Arrepentimiento de compra
                </div>
                <div className="text-red-400/70 text-xs font-normal mt-0.5">
                  Cancelar un pedido realizado
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                <XCircle size={16} className="text-red-500" />
              </div>
            </button>
          </div>

          {/* Menu preview */}
          {masPedidosItems.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Lo más pedido del viaje
              </p>
              <div className="flex flex-col gap-2">
                {masPedidosItems.map((item) => {
                  const qty = getQty(item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-card rounded-xl px-4 py-3 border border-border animate-fade-in"
                    >
                      <div className="flex flex-col gap-0.5 max-w-[65%]">
                        <span className="text-sm font-medium text-foreground truncate block">
                          {item.name}
                        </span>
                        <span className="text-xs text-primary font-semibold">
                          ${item.price}
                        </span>
                      </div>
                      <div>
                        {item.outOfStock ? (
                          <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1.5 rounded-xl">
                            Agotado
                          </span>
                        ) : qty > 0 ? (
                          <div className="flex items-center gap-2 bg-secondary rounded-xl p-1 border border-border">
                            <button
                              onClick={() => handleDecrement(item)}
                              className="w-7 h-7 rounded-lg bg-card flex items-center justify-center text-foreground hover:bg-border active:scale-90 transition-all cursor-pointer"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold px-1.5 min-w-[16px] text-center">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleIncrement(item)}
                              className="w-7 h-7 rounded-lg bg-card flex items-center justify-center text-foreground hover:bg-border active:scale-90 transition-all cursor-pointer"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleIncrement(item)}
                            className="text-xs font-bold bg-primary text-white px-3 py-2 rounded-xl active:scale-95 hover:bg-primary/95 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Plus size={12} />
                            <span>Agregar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Floating Cart Banner */}
          {cart.length > 0 && (
            <div className="fixed md:absolute bottom-0 left-0 right-0 bg-primary text-white px-6 py-4 flex items-center justify-between shadow-2xl z-40 border-t border-primary-foreground/10 animate-slide-up md:rounded-b-3xl">
              <div className="flex flex-col">
                <span className="text-xs text-white/70 font-medium">Carrito actual</span>
                <span className="text-sm font-bold text-white">
                  {totalItems} {totalItems === 1 ? "ítem" : "ítems"} • ${totalPrice}
                </span>
              </div>
              <button
                onClick={() => navigate(`/recorrido/${id}/menu?screen=checkout`)}
                className="bg-white text-primary font-bold text-xs px-4 py-2.5 rounded-xl active:scale-95 transition-all flex items-center gap-1 shadow-md shadow-primary/10 cursor-pointer hover:bg-white/90"
              >
                <span>Finalizar</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal de Calentado ── */}
      {heatingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 transition-all duration-300">
          <div className="bg-card border border-border w-full max-w-sm rounded-[24px] p-6 shadow-2xl flex flex-col items-center gap-5 text-center transform scale-100 transition-all">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 animate-bounce">
              <Flame size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1.5">¿Querés calentarlo?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Elegí si preferís que calentemos tu {heatingItem.name.toLowerCase().includes("medialuna") ? "medialuna" : "pebete"} antes de entregártelo.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              <button
                onClick={() => {
                  performAddToCart(heatingItem, true);
                  setHeatingItem(null);
                }}
                className="py-3.5 rounded-xl text-sm font-semibold bg-accent text-white hover:bg-accent/90 active:scale-95 transition-all cursor-pointer text-center"
              >
                Sí, caliente 🔥
              </button>
              <button
                onClick={() => {
                  performAddToCart(heatingItem, false);
                  setHeatingItem(null);
                }}
                className="py-3.5 rounded-xl text-sm font-semibold bg-secondary text-primary hover:bg-secondary/80 active:scale-95 transition-all cursor-pointer text-center"
              >
                No, frío ❄️
              </button>
            </div>
            <button
              onClick={() => setHeatingItem(null)}
              className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors mt-1 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── Modal de Arrepentimiento de Compra ── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-card border border-red-500/30 w-full max-w-sm rounded-[24px] p-6 shadow-2xl flex flex-col gap-5 relative">
            {/* Close button */}
            <button
              onClick={closeCancelModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition-colors cursor-pointer"
            >
              <X size={15} className="text-muted-foreground" />
            </button>

            {cancelSubmitted ? (
              /* ── Estado: Solicitud enviada ── */
              <div className="flex flex-col items-center gap-4 text-center py-2">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle size={36} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">Solicitud recibida</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Recibimos tu solicitud de arrepentimiento de compra para el pedido <strong className="text-foreground">#{cancelOrderNum}</strong>.
                    Nos contactaremos a <strong className="text-foreground">{cancelEmail}</strong> para gestionar la cancelación.
                  </p>
                </div>
                <button
                  onClick={closeCancelModal}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              /* ── Formulario ── */
              <>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle size={24} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground leading-tight">Arrepentimiento de compra</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Completá los datos de tu pedido para iniciar la cancelación.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleCancelSubmit} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      Mail del cliente
                    </label>
                    <input
                      type="email"
                      value={cancelEmail}
                      onChange={(e) => { setCancelEmail(e.target.value); setCancelError(""); }}
                      placeholder="tu@mail.com"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/60 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      Número de pedido
                    </label>
                    <input
                      type="text"
                      value={cancelOrderNum}
                      onChange={(e) => { setCancelOrderNum(e.target.value); setCancelError(""); }}
                      placeholder="Ej: 4823"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/60 transition-colors"
                    />
                  </div>

                  {cancelError && (
                    <p className="text-xs text-red-400 font-medium">{cancelError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all cursor-pointer shadow-lg shadow-red-500/20 mt-1"
                  >
                    Solicitar cancelación
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

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
