import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Flame, Loader2, WifiOff } from "lucide-react";
import MenuScreen from "./MenuScreen";
import CheckoutScreen from "./CheckoutScreen";
import { menuByRecorrido } from "../constants/menu";
import { recorridos } from "../constants/recorridos";
import { sendClientConfirmationEmail } from "../services/email";
import { obtenerMenuAPI } from "../services/productos";


export default function OrderApp() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const recorrido = recorridos.find((r) => r.id === Number(id));
  const recorridoName = recorrido ? recorrido.nombre : "Recorrido";

  const initialDelivery = searchParams.get("delivery");
  // Menú estático como fallback si la API no responde
  const staticMenuItems = menuByRecorrido[Number(id)] ?? menuByRecorrido[1];

  const initialScreen = searchParams.get("screen") || "menu";
  const [screen, setScreen] = useState(initialScreen);
  const [category, setCategory] = useState("Bebidas");

  // ── Estado del menú cargado desde la API ──────────────────────────────────
  const [apiMenuItems, setApiMenuItems] = useState(null); // null = aún no cargó
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState(false);

  // Carga el menú desde la API al montar el componente
  useEffect(() => {
    let cancelled = false;
    setMenuLoading(true);
    setMenuError(false);

    obtenerMenuAPI()
      .then((productos) => {
        if (cancelled) return;

        if (!productos || productos.length === 0) {
          // La BD está vacía — usamos el menú estático
          setApiMenuItems(null);
          setMenuError(false);
        } else {
          // Normalizar nombres de columna de la BD al formato que espera MenuScreen
          // La BD usa: nombre, descripcion, precio, imagen, categoria
          // El componente espera: name, desc, price, img, category
          const grouped = {};
          productos.forEach((p) => {
            const cat = p.categoria || p.category || "Otros";
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push({
              id: p.id,
              codigo: p.codigo || String(p.id),
              name: p.nombre || p.name,
              desc: p.descripcion || p.desc || "",
              price: Number(p.precio ?? p.price ?? 0),
              img: p.imagen || p.img || "",
              category: cat,
              disponible: p.disponible !== false,
              stock: p.stock ?? 99,
            });
          });
          setApiMenuItems(grouped);
        }
        setMenuLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn("⚠️ No se pudo cargar el menú desde la API. Usando menú estático.", err.message);
        setApiMenuItems(null);
        setMenuError(true);
        setMenuLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  // El menú efectivo: API si cargó bien, estático si falló o está vacío
  const menuItems = apiMenuItems ?? staticMenuItems;

  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(`cart-${id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(`cart-${id}`, JSON.stringify(cart));
  }, [cart, id]);
  const [delivery, setDelivery] = useState(initialDelivery);
  const [payment, setPayment] = useState(null);
  const [seatNumber, setSeatNumber] = useState("");
  const [cocheNumber, setCocheNumber] = useState("");
  const [timeSlot, setTimeSlot] = useState(null);
  const [clientEmail, setClientEmail] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cashAmount, setCashAmount] = useState("");
  const [heatingItem, setHeatingItem] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const needsHeatingOption = (item) => {
    const nameLower = item.name.toLowerCase();
    return nameLower.includes("medialuna") || nameLower.includes("pebete");
  };

  function addToCart(item) {
    if (needsHeatingOption(item)) {
      setHeatingItem(item);
    } else {
      performAddToCart(item);
    }
  }

  function performAddToCart(item, caliente) {
    const cartItemId = caliente !== undefined ? `${item.id}-${caliente ? "caliente" : "frio"}` : String(item.id);
    setCart((prev) => {
      const existing = prev.find((c) => c.cartItemId === cartItemId);
      if (existing)
        return prev.map((c) =>
          c.cartItemId === cartItemId ? { ...c, qty: c.qty + 1 } : c
        );
      return [...prev, { ...item, cartItemId, caliente, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart((prev) => {
      const existingIndex = prev.map((c) => c.id).lastIndexOf(id);
      if (existingIndex === -1) return prev;
      const existing = prev[existingIndex];
      if (existing.qty === 1) {
        return prev.filter((_, idx) => idx !== existingIndex);
      }
      return prev.map((c, idx) =>
        idx === existingIndex ? { ...c, qty: c.qty - 1 } : c
      );
    });
  }

  const resetApp = () => {
    setCart([]);
    setDelivery(null);
    setPayment(null);
    setSeatNumber("");
    setCocheNumber("");
    setTimeSlot(null);
    setClientEmail("");
    setCashAmount("");
    setOrderNumber(null);
  };

  function getQty(id) {
    return cart.filter((c) => c.id === id).reduce((s, c) => s + c.qty, 0);
  }

  function handlePlaceOrder() {
    // ID único del pedido (para marcar como usado en localStorage)
    const orderId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const generatedOrderNumber = Math.floor(1000 + Math.random() * 9000);
    setOrderNumber(generatedOrderNumber);

    // Codificar los datos del pedido en base64 para el link de confirmación
    const orderData = {
      orderId,
      orderNumber: generatedOrderNumber,
      expiresAt: Date.now() + 15 * 60 * 1000, // expira en 15 minutos
      cart,
      delivery,
      payment,
      seatNumber,
      cocheNumber,
      timeSlot,
      totalPrice,
      cashAmount,
      clientEmail,
      recorridoName,
    };

    const encoded = encodeURIComponent(btoa(JSON.stringify(orderData)));
    const baseUrl = window.location.href.split("#")[0];
    const confirmUrl = `${baseUrl}#/confirmar?d=${encoded}`;

    sendClientConfirmationEmail({ orderData, confirmUrl });
    setOrderPlaced(true);
  }


  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim());

  const canCheckout =
    payment !== null &&
    isEmailValid &&
    (delivery === "seat"
      ? seatNumber.trim().length > 0 && cocheNumber.trim().length > 0
      : delivery === "reserve"
      ? timeSlot !== null
      : false) &&
    (payment === "cash"
      ? cashAmount.trim() !== "" && Number(cashAmount) >= totalPrice
      : true);

  // ── Pantalla de carga mientras se obtiene el menú de la API ───────────────
  if (menuLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ background: "linear-gradient(135deg, #091f41 0%, #1a5a9e 100%)", fontFamily: "Outfit, sans-serif" }}
      >
        <Loader2 size={44} className="text-white animate-spin" />
        <p className="text-white/70 text-sm">Cargando menú…</p>
      </div>
    );
  }

  // ── Pantalla de Confirmación Simplificada ──────────────────────────────────
  if (orderPlaced) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-8 text-center"
        style={{
          fontFamily: "Outfit, sans-serif",
          background: "linear-gradient(135deg, #091f41 0%, #1a5a9e 100%)",
        }}
      >
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
          <Mail size={40} className="text-white" />
        </div>
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-white mb-2">
            ¡Valida tu pedido!
          </h2>
          <p className="text-white/80 text-sm leading-relaxed mb-6">
            Te enviamos un correo a <strong className="text-white">{clientEmail}</strong>.<br />
            Ingresá a tu bandeja de entrada y confirmalo para validar tu pedido.
            {orderNumber && (
              <>
                <span className="block mt-4 text-amber-300 font-bold text-lg tracking-wide bg-white/10 py-2 rounded-xl border border-white/10">
                  N° de pedido: #{orderNumber}
                </span>
                <span className="block text-xs text-white/60 mt-1 font-medium">
                  (Por favor, guardá este número hasta recibir tu pedido)
                </span>
              </>
            )}
          </p>
          <button
            onClick={() => {
              resetApp();
              navigate("/");
            }}
            className="bg-white text-primary font-semibold text-sm px-6 py-3 rounded-xl shadow-lg hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    );
  }

  // ── Menu + Checkout (Contenedor que fluye naturalmente en mobile) ──────────
  return (
    <div
      className="min-h-screen bg-background flex flex-col justify-center items-center p-0 md:p-6 pb-4 md:pb-6"
      style={{
        fontFamily: "Outfit, sans-serif",
        background: "linear-gradient(135deg, #020b18 0%, #0d203d 100%)",
      }}
    >
      <div className="w-full max-w-[1024px] rounded-none md:rounded-3xl shadow-2xl shadow-black/50 md:h-[80vh] md:overflow-hidden flex flex-col md:flex-row relative bg-background">
        {/* Banner de fallback cuando la API no responde */}
        {menuError && (
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-2 bg-amber-500/90 backdrop-blur-sm px-4 py-2 text-white text-xs font-medium">
            <WifiOff size={13} className="flex-shrink-0" />
            <span>Menú estático — no se pudo conectar con el servidor. Los precios pueden no estar actualizados.</span>
          </div>
        )}

        {/* Left Column: Menu */}
        <div
          className={`flex-1 flex flex-col md:overflow-hidden ${
            screen === "checkout" ? "hidden" : "flex"
          }`}
        >
          <MenuScreen
            menuItems={menuItems}
            category={category}
            setCategory={setCategory}
            delivery={delivery}
            setDelivery={setDelivery}
            totalItems={totalItems}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            getQty={getQty}
            onBack={() => navigate(`/recorrido/${id}`)}
            onCheckout={() => setScreen("checkout")}
          />
        </div>

        {/* Right Column: Checkout */}
        <div
          className={`flex-1 flex flex-col md:overflow-hidden ${
            screen === "menu" ? "hidden" : "flex"
          }`}
        >
          <CheckoutScreen
            cart={cart}
            delivery={delivery}
            setDelivery={setDelivery}
            payment={payment}
            setPayment={setPayment}
            seatNumber={seatNumber}
            setSeatNumber={setSeatNumber}
            cocheNumber={cocheNumber}
            setCocheNumber={setCocheNumber}
            timeSlot={timeSlot}
            setTimeSlot={setTimeSlot}
            totalPrice={totalPrice}
            canCheckout={canCheckout}
            onBack={() => setScreen("menu")}
            onPlace={handlePlaceOrder}
            cashAmount={cashAmount}
            setCashAmount={setCashAmount}
            clientEmail={clientEmail}
            setClientEmail={setClientEmail}
          />
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
