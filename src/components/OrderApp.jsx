import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import MenuScreen from "./MenuScreen";
import CheckoutScreen from "./CheckoutScreen";
import { menuByRecorrido } from "../constants/menu";
import { sendOrderEmail } from "../services/email";

export default function OrderApp() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialDelivery = searchParams.get("delivery");

  // Menú del recorrido actual (independiente por recorrido)
  const menuItems = menuByRecorrido[Number(id)] ?? menuByRecorrido[1];

  const [screen, setScreen] = useState("menu");
  const [category, setCategory] = useState("Cafeteria");
  const [cart, setCart] = useState([]);
  const [delivery, setDelivery] = useState(initialDelivery);
  const [payment, setPayment] = useState(null);
  const [seatNumber, setSeatNumber] = useState("");
  const [cocheNumber, setCocheNumber] = useState("");
  const [timeSlot, setTimeSlot] = useState(null);
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

  function getQty(id) {
    return cart.find((c) => c.id === id)?.qty ?? 0;
  }

  function handlePlaceOrder() {
    sendOrderEmail({
      cart,
      delivery,
      payment,
      seatNumber,
      cocheNumber,
      timeSlot,
      totalPrice,
      cashAmount,
    });
    setOrderPlaced(true);
    setTimeout(() => {
      navigate("/");
    }, 3500);
  }

  const canCheckout =
    payment !== null &&
    (delivery === "seat"
      ? seatNumber.trim().length > 0 && cocheNumber.trim().length > 0
      : delivery === "reserve"
      ? timeSlot !== null
      : false) &&
    (payment === "cash"
      ? cashAmount.trim() !== "" && Number(cashAmount) >= totalPrice
      : true);

  // ── Confirmación ──────────────────────────────────────────────────────────
  if (orderPlaced) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-8"
        style={{
          fontFamily: "Outfit, sans-serif",
          background: "linear-gradient(135deg, #091f41 0%, #1a5a9e 100%)",
        }}
      >
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
          <Check size={40} className="text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">
            ¡Pedido confirmado!
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            {delivery === "seat"
              ? `Tu pedido será llevado al coche ${cocheNumber}, asiento ${seatNumber} en breve.`
              : `Tu pedido estará listo para retirar en la barra del Coche Comedor ${timeSlot}.`}
          </p>
        </div>
        <p className="text-white/50 text-xs">Redirigiendo...</p>
      </div>
    );
  }

  // ── Menu + Checkout ───────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-background flex flex-col justify-center items-center p-0 md:p-6"
      style={{
        fontFamily: "Outfit, sans-serif",
        background: "linear-gradient(135deg, #020b18 0%, #0d203d 100%)",
      }}
    >
      <div className="w-full max-w-[1024px] min-h-screen md:min-h-[700px] md:h-[80vh] rounded-none md:rounded-3xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col md:flex-row relative bg-background">
        {/* Left Column: Menu */}
        <div
          className={`flex-1 flex flex-col h-full ${
            screen === "checkout" ? "hidden md:flex" : "flex"
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
          className={`w-full md:w-[400px] md:border-l border-border flex flex-col h-full ${
            screen === "menu" ? "hidden md:flex" : "flex"
          }`}
        >
          <CheckoutScreen
            cart={cart}
            delivery={delivery}
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
