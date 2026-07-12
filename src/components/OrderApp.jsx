import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Mail } from "lucide-react";
import MenuScreen from "./MenuScreen";
import CheckoutScreen from "./CheckoutScreen";
import { menuByRecorrido } from "../constants/menu";
import { recorridos } from "../constants/recorridos";
import { sendClientConfirmationEmail } from "../services/email";

export default function OrderApp() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const recorrido = recorridos.find((r) => r.id === Number(id));
  const recorridoName = recorrido ? recorrido.nombre : "Recorrido";

  const initialDelivery = searchParams.get("delivery");
  const menuItems = menuByRecorrido[Number(id)] ?? menuByRecorrido[1];

  const [screen, setScreen] = useState("menu");
  const [category, setCategory] = useState("Bebidas");
  const [cart, setCart] = useState([]);
  const [delivery, setDelivery] = useState(initialDelivery);
  const [payment, setPayment] = useState(null);
  const [seatNumber, setSeatNumber] = useState("");
  const [cocheNumber, setCocheNumber] = useState("");
  const [timeSlot, setTimeSlot] = useState(null);
  const [clientEmail, setClientEmail] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cashAmount, setCashAmount] = useState("");

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing)
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (!existing || existing.qty === 1)
        return prev.filter((c) => c.id !== id);
      return prev.map((c) => (c.id === id ? { ...c, qty: c.qty - 1 } : c));
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
  };

  function getQty(id) {
    return cart.find((c) => c.id === id)?.qty ?? 0;
  }

  function handlePlaceOrder() {
    // ID único del pedido (para marcar como usado en localStorage)
    const orderId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // Codificar los datos del pedido en base64 para el link de confirmación
    const orderData = {
      orderId,
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
    const confirmUrl = `${window.location.origin}/confirmar?d=${encoded}`;

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
