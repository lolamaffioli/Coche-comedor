import { useState } from "react";
import { ShoppingCart, Plus, Minus, ChevronLeft, Clock, MapPin, CreditCard, Banknote, Check, ChevronRight, Utensils, Wine, Coffee, Soup } from "lucide-react";

type Screen = "home" | "menu" | "checkout";
type DeliveryOption = "seat" | "reserve" | null;
type PaymentMethod = "cash" | "card" | null;
type Category = "Entradas" | "Principales" | "Bebidas" | "Postres";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

const menuItems = {
  Entradas: [
    { id: 1, name: "Tabla de embutidos", desc: "Jamón serrano, salami, queso manchego", price: 1850, img: "https://images.unsplash.com/photo-1544025162-d76538323b59?w=400&h=300&fit=crop&auto=format" },
    { id: 2, name: "Bruschetta al tomate", desc: "Pan tostado, tomate fresco, albahaca, AOVE", price: 980, img: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop&auto=format" },
    { id: 3, name: "Sopa del día", desc: "Consultá con el servicio de mesa", price: 750, img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&auto=format" },
  ],
  Principales: [
    { id: 4, name: "Lomo a la pimienta", desc: "Lomo de res, salsa criolla, papas rústicas", price: 3200, img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&auto=format" },
    { id: 5, name: "Salmón grillado", desc: "Salmón atlántico, limón, vegetales salteados", price: 2900, img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&auto=format" },
    { id: 6, name: "Risotto de hongos", desc: "Arroz arborio, porcini, parmesano, trufa negra", price: 2400, img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop&auto=format" },
    { id: 7, name: "Pollo al limón", desc: "Pechuga grillada, alcaparras, puré suave", price: 2100, img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&h=300&fit=crop&auto=format" },
  ],
  Bebidas: [
    { id: 8, name: "Vino Malbec", desc: "Mendoza, cosecha 2022, media botella", price: 1600, img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop&auto=format" },
    { id: 9, name: "Agua mineral", desc: "Con o sin gas, 500 ml", price: 350, img: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop&auto=format" },
    { id: 10, name: "Café espresso", desc: "Grano molido en el momento, doble", price: 480, img: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop&auto=format" },
  ],
  Postres: [
    { id: 11, name: "Tiramisú clásico", desc: "Mascarpone, café, bizcochuelo, cacao", price: 920, img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&auto=format" },
    { id: 12, name: "Crème brûlée", desc: "Vainilla de Madagascar, azúcar quemada", price: 850, img: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop&auto=format" },
  ],
};

const categoryIcons: Record<Category, React.ReactNode> = {
  Entradas: <Soup size={14} />,
  Principales: <Utensils size={14} />,
  Bebidas: <Wine size={14} />,
  Postres: <Coffee size={14} />,
};

const timeSlots = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "19:00", "19:30", "20:00", "20:30", "21:00"];

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [category, setCategory] = useState<Category>("Entradas");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [delivery, setDelivery] = useState<DeliveryOption>(null);
  const [payment, setPayment] = useState<PaymentMethod>(null);
  const [seatNumber, setSeatNumber] = useState("");
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  function addToCart(item: { id: number; name: string; price: number }) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function removeFromCart(id: number) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (!existing || existing.qty === 1) return prev.filter((c) => c.id !== id);
      return prev.map((c) => c.id === id ? { ...c, qty: c.qty - 1 } : c);
    });
  }

  function getQty(id: number) {
    return cart.find((c) => c.id === id)?.qty ?? 0;
  }

  function handlePlaceOrder() {
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setScreen("home");
      setCart([]);
      setDelivery(null);
      setPayment(null);
      setSeatNumber("");
      setTimeSlot(null);
    }, 3000);
  }

  const canCheckout =
    payment !== null &&
    (delivery === "seat" ? seatNumber.trim().length > 0 : delivery === "reserve" ? timeSlot !== null : false);

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center gap-6 px-8" style={{ fontFamily: "Outfit, sans-serif" }}>
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
          <Check size={40} className="text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">¡Pedido confirmado!</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            {delivery === "seat"
              ? `Tu pedido llegará al asiento ${seatNumber} en breve.`
              : `Tu reserva está confirmada para las ${timeSlot}.`}
          </p>
        </div>
        <p className="text-white/50 text-xs">Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex justify-center" style={{ fontFamily: "Outfit, sans-serif" }}>
      <div className="w-full max-w-[430px] min-h-screen flex flex-col relative bg-background overflow-hidden">
        {screen === "home" && <HomeScreen onStart={() => setScreen("menu")} onSchedule={() => { setDelivery("reserve"); setScreen("menu"); }} />}
        {screen === "menu" && (
          <MenuScreen
            category={category}
            setCategory={setCategory}
            delivery={delivery}
            setDelivery={setDelivery}
            totalItems={totalItems}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            getQty={getQty}
            onBack={() => setScreen("home")}
            onCheckout={() => setScreen("checkout")}
          />
        )}
        {screen === "checkout" && (
          <CheckoutScreen
            cart={cart}
            delivery={delivery}
            payment={payment}
            setPayment={setPayment}
            seatNumber={seatNumber}
            setSeatNumber={setSeatNumber}
            timeSlot={timeSlot}
            setTimeSlot={setTimeSlot}
            totalPrice={totalPrice}
            canCheckout={canCheckout}
            onBack={() => setScreen("menu")}
            onPlace={handlePlaceOrder}
          />
        )}
      </div>
    </div>
  );
}

function HomeScreen({ onStart, onSchedule }: { onStart: () => void; onSchedule: () => void }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <div className="relative bg-primary overflow-hidden" style={{ minHeight: 420 }}>
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=860&h=840&fit=crop&auto=format"
          alt="Gastronomía de alta cocina"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary" />
        <div className="relative px-7 pt-16 pb-12 flex flex-col gap-2">
          <span className="text-white/50 text-xs font-medium tracking-[0.18em] uppercase">Servicio gastronómico</span>
          <h1
            className="text-white leading-tight mt-1"
            style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: "clamp(2rem, 9vw, 2.6rem)", lineHeight: 1.15 }}
          >
            Coche<br />Comedor
          </h1>
          <p className="text-white/60 text-sm mt-2 leading-relaxed max-w-[240px]">
            Alta cocina en cada trayecto. Pedí desde tu lugar o reservá tu mesa.
          </p>
        </div>
        {/* Decorative line */}
        <div className="absolute bottom-0 left-7 right-7 h-px bg-white/10" />
      </div>

      {/* Stats strip */}
      <div className="bg-[#162d57] grid grid-cols-3 divide-x divide-white/10">
        {[["24", "platos"], ["3", "categorías"], ["≈15 min", "entrega"]].map(([val, label]) => (
          <div key={label} className="flex flex-col items-center py-4 gap-0.5">
            <span className="text-white text-base font-semibold">{val}</span>
            <span className="text-white/40 text-[10px] uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-8 pb-10 flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">¿Qué querés hacer hoy?</p>

        <button
          onClick={onStart}
          className="w-full bg-primary text-primary-foreground rounded-xl py-4 px-6 flex items-center justify-between group transition-all active:scale-[0.98]"
        >
          <div className="text-left">
            <div className="font-semibold text-base">Pedir ahora</div>
            <div className="text-white/60 text-xs mt-0.5">Recibí en tu asiento</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
            <ChevronRight size={18} className="text-white" />
          </div>
        </button>

        <button
          onClick={onSchedule}
          className="w-full bg-card border border-border text-foreground rounded-xl py-4 px-6 flex items-center justify-between group transition-all active:scale-[0.98]"
        >
          <div className="text-left">
            <div className="font-semibold text-base">Programar pedido</div>
            <div className="text-muted-foreground text-xs mt-0.5">Elegí horario o reservá mesa</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center group-hover:bg-secondary/70 transition-colors">
            <Clock size={18} className="text-primary" />
          </div>
        </button>

        {/* Menu preview */}
        <div className="mt-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Lo más pedido</p>
          <div className="flex flex-col gap-2">
            {[
              { name: "Lomo a la pimienta", price: "$3.200" },
              { name: "Tiramisú clásico", price: "$920" },
              { name: "Vino Malbec", price: "$1.600" },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between bg-card rounded-xl px-4 py-3 border border-border">
                <span className="text-sm text-foreground">{item.name}</span>
                <span className="text-sm font-semibold text-primary">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuScreen({
  category, setCategory, delivery, setDelivery,
  totalItems, addToCart, removeFromCart, getQty,
  onBack, onCheckout,
}: {
  category: Category; setCategory: (c: Category) => void;
  delivery: DeliveryOption; setDelivery: (d: DeliveryOption) => void;
  totalItems: number; addToCart: (i: { id: number; name: string; price: number }) => void;
  removeFromCart: (id: number) => void; getQty: (id: number) => number;
  onBack: () => void; onCheckout: () => void;
}) {
  const cats: Category[] = ["Entradas", "Principales", "Bebidas", "Postres"];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center active:bg-white/25 transition-colors">
            <ChevronLeft size={18} className="text-white" />
          </button>
          <h2 className="text-white font-semibold text-lg flex-1">Menú</h2>
          {totalItems > 0 && (
            <div className="flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5">
              <ShoppingCart size={14} className="text-white" />
              <span className="text-white text-sm font-medium">{totalItems}</span>
            </div>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {cats.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                category === cat
                  ? "bg-white text-primary"
                  : "bg-white/15 text-white/70 hover:bg-white/25"
              }`}
            >
              {categoryIcons[cat]}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery selector */}
      <div className="px-5 py-4 bg-card border-b border-border">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Tipo de entrega</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDelivery("seat")}
            className={`rounded-xl py-3 px-4 flex flex-col gap-1 items-start border-2 transition-all active:scale-[0.97] ${
              delivery === "seat" ? "border-accent bg-accent/8" : "border-border bg-background"
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${delivery === "seat" ? "bg-accent" : "bg-secondary"}`}>
              <MapPin size={14} className={delivery === "seat" ? "text-white" : "text-primary"} />
            </div>
            <span className={`text-xs font-semibold leading-tight ${delivery === "seat" ? "text-accent" : "text-foreground"}`}>
              Traer a<br />mi asiento
            </span>
          </button>
          <button
            onClick={() => setDelivery("reserve")}
            className={`rounded-xl py-3 px-4 flex flex-col gap-1 items-start border-2 transition-all active:scale-[0.97] ${
              delivery === "reserve" ? "border-accent bg-accent/8" : "border-border bg-background"
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${delivery === "reserve" ? "bg-accent" : "bg-secondary"}`}>
              <Utensils size={14} className={delivery === "reserve" ? "text-white" : "text-primary"} />
            </div>
            <span className={`text-xs font-semibold leading-tight ${delivery === "reserve" ? "text-accent" : "text-foreground"}`}>
              Reservar asiento<br />Coche Comedor
            </span>
          </button>
        </div>
      </div>

      {/* Product list */}
      <div className="flex-1 px-5 py-4 flex flex-col gap-3 overflow-y-auto">
        {menuItems[category].map((item) => {
          const qty = getQty(item.id);
          return (
            <div key={item.id} className="bg-card rounded-2xl border border-border overflow-hidden flex gap-0">
              <div className="w-24 h-24 flex-shrink-0 bg-muted">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">{item.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-primary">${item.price.toLocaleString()}</span>
                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(item)}
                      className="w-7 h-7 rounded-full bg-primary flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <Plus size={14} className="text-white" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center active:scale-90 transition-transform"
                      >
                        <Minus size={12} className="text-primary" />
                      </button>
                      <span className="text-sm font-semibold text-primary w-4 text-center">{qty}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-7 h-7 rounded-full bg-primary flex items-center justify-center active:scale-90 transition-transform"
                      >
                        <Plus size={12} className="text-white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart CTA */}
      {totalItems > 0 && delivery !== null && (
        <div className="px-5 pb-8 pt-3 bg-background border-t border-border">
          <button
            onClick={onCheckout}
            className="w-full bg-primary text-white rounded-xl py-4 flex items-center justify-between px-5 active:scale-[0.98] transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              {totalItems}
            </div>
            <span className="font-semibold">Ir al checkout</span>
            <ChevronRight size={18} className="text-white/70" />
          </button>
        </div>
      )}
    </div>
  );
}

function CheckoutScreen({
  cart, delivery, payment, setPayment,
  seatNumber, setSeatNumber, timeSlot, setTimeSlot,
  totalPrice, canCheckout, onBack, onPlace,
}: {
  cart: CartItem[]; delivery: DeliveryOption;
  payment: PaymentMethod; setPayment: (p: PaymentMethod) => void;
  seatNumber: string; setSeatNumber: (s: string) => void;
  timeSlot: string | null; setTimeSlot: (t: string | null) => void;
  totalPrice: number; canCheckout: boolean;
  onBack: () => void; onPlace: () => void;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center active:bg-white/25 transition-colors">
            <ChevronLeft size={18} className="text-white" />
          </button>
          <h2 className="text-white font-semibold text-lg">Checkout</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Order summary */}
        <div className="px-5 py-5 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Tu pedido</p>
          <div className="flex flex-col gap-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-sm text-foreground">
                  {item.qty > 1 && <span className="font-semibold text-accent mr-1">{item.qty}×</span>}
                  {item.name}
                </span>
                <span className="text-sm font-medium text-foreground">${(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
              <span className="text-sm font-semibold text-foreground">Total</span>
              <span className="text-base font-bold text-primary">${totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery details */}
        <div className="px-5 py-5 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            {delivery === "seat" ? "Número de asiento" : "Horario de reserva"}
          </p>

          {delivery === "seat" && (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Ej: 14A"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value.toUpperCase())}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                maxLength={5}
              />
              {/* Ticket illustration card */}
              <div className="bg-secondary rounded-2xl p-4 flex gap-4 items-start border border-border/50">
                <div className="flex-shrink-0 w-16 h-20 bg-primary rounded-xl flex flex-col items-center justify-center gap-1 relative overflow-hidden">
                  {/* Ticket visual */}
                  <div className="absolute inset-0 opacity-10">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="absolute w-full h-px bg-white" style={{ top: `${i * 20}%` }} />
                    ))}
                  </div>
                  <div className="w-8 h-5 border-2 border-white/60 rounded-sm relative z-10" />
                  <div className="text-white/80 text-[10px] font-semibold z-10">ASIENTO</div>
                  <div className="text-white text-sm font-bold z-10">{seatNumber || "???"}</div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">¿Dónde está mi número?</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Encontrás el número de asiento impreso en tu boleto, arriba del código QR. También aparece en la aplicación de tu reserva.
                  </p>
                </div>
              </div>
            </div>
          )}

          {delivery === "reserve" && (
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`py-3 rounded-xl text-sm font-medium border-2 transition-all active:scale-95 ${
                    timeSlot === slot
                      ? "bg-accent border-accent text-white"
                      : "bg-card border-border text-foreground hover:border-accent/40"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="px-5 py-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Método de pago</p>
          <p className="text-xs text-muted-foreground mb-4">El pago se procesa de forma presencial con el personal de servicio.</p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setPayment("cash")}
              className={`rounded-xl py-4 px-4 flex items-center gap-4 border-2 transition-all active:scale-[0.97] ${
                payment === "cash" ? "border-accent bg-accent/8" : "border-border bg-card"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${payment === "cash" ? "bg-accent" : "bg-secondary"}`}>
                <Banknote size={20} className={payment === "cash" ? "text-white" : "text-primary"} />
              </div>
              <div className="text-left flex-1">
                <p className={`text-sm font-semibold ${payment === "cash" ? "text-accent" : "text-foreground"}`}>Efectivo</p>
                <p className="text-xs text-muted-foreground mt-0.5">Abonás directamente al mozo</p>
              </div>
              {payment === "cash" && (
                <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>

            <button
              onClick={() => setPayment("card")}
              className={`rounded-xl py-4 px-4 flex items-center gap-4 border-2 transition-all active:scale-[0.97] ${
                payment === "card" ? "border-accent bg-accent/8" : "border-border bg-card"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${payment === "card" ? "bg-accent" : "bg-secondary"}`}>
                <CreditCard size={20} className={payment === "card" ? "text-white" : "text-primary"} />
              </div>
              <div className="text-left flex-1">
                <p className={`text-sm font-semibold ${payment === "card" ? "text-accent" : "text-foreground"}`}>Tarjeta física</p>
                <p className="text-xs text-muted-foreground mt-0.5">Posnet con el personal a bordo</p>
              </div>
              {payment === "card" && (
                <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>

            {/* Physical payment notice */}
            {payment !== null && (
              <div className="bg-secondary rounded-xl px-4 py-3 flex gap-3 items-start border border-border/50">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-[10px] font-bold">i</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  El pago es <strong className="text-foreground">presencial y físico</strong>. Un miembro del personal se acercará para completar la transacción.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Place order */}
      <div className="px-5 pb-8 pt-3 bg-background border-t border-border">
        <button
          onClick={canCheckout ? onPlace : undefined}
          className={`w-full rounded-xl py-4 font-semibold text-sm transition-all ${
            canCheckout
              ? "bg-primary text-white active:scale-[0.98]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {canCheckout ? `Confirmar pedido · $${totalPrice.toLocaleString()}` : "Completá los datos para continuar"}
        </button>
      </div>
    </div>
  );
}
