import React from "react";
import { ShoppingCart, Plus, Minus, ChevronLeft, MapPin, Clock, ChevronRight, Coffee, Utensils, Wine, Soup } from "lucide-react";
import { menuItems } from "../constants/menu";

const categoryIcons = {
  Cafeteria: <Coffee size={14} />,
  Sandwiches: <Utensils size={14} />,
  Bebidas: <Wine size={14} />,
  Snacks: <Soup size={14} />,
};

export default function MenuScreen({
  category, setCategory, delivery, setDelivery,
  totalItems, addToCart, removeFromCart, getQty,
  onBack, onCheckout
}) {
  const cats = ["Cafeteria", "Sandwiches", "Bebidas", "Snacks"];
  const displayNames = {
    Cafeteria: "Cafetería",
    Sandwiches: "Sándwiches",
    Bebidas: "Bebidas",
    Snacks: "Kiosco / Snacks"
  };

  return (
    <div className="flex flex-col h-full min-h-screen md:min-h-0">
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: "linear-gradient(135deg, #091f41 0%, #1a5a9e 100%)" }}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center active:bg-white/25 transition-colors cursor-pointer">
            <ChevronLeft size={18} className="text-white" />
          </button>
          <h2 className="text-white font-semibold text-lg flex-1">Menú del Tren</h2>
          {totalItems > 0 && (
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5 md:hidden">
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
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                category === cat
                  ? "bg-white text-primary"
                  : "bg-white/15 text-white/70 hover:bg-white/25"
              }`}
            >
              {categoryIcons[cat]}
              {displayNames[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery selector */}
      <div className="px-5 py-4 bg-card border-b border-border">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Forma de entrega</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDelivery("seat")}
            className={`rounded-xl py-3 px-4 flex flex-col gap-1 items-start border-2 transition-all active:scale-[0.97] cursor-pointer ${
              delivery === "seat" ? "border-accent bg-accent/8" : "border-border bg-background"
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${delivery === "seat" ? "bg-accent" : "bg-secondary"}`}>
              <MapPin size={14} className={delivery === "seat" ? "text-white" : "text-primary"} />
            </div>
            <span className={`text-xs font-semibold leading-tight text-left ${delivery === "seat" ? "text-accent" : "text-foreground"}`}>
              Traer a<br />mi asiento
            </span>
          </button>
          <button
            onClick={() => setDelivery("reserve")}
            className={`rounded-xl py-3 px-4 flex flex-col gap-1 items-start border-2 transition-all active:scale-[0.97] cursor-pointer ${
              delivery === "reserve" ? "border-accent bg-accent/8" : "border-border bg-background"
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${delivery === "reserve" ? "bg-accent" : "bg-secondary"}`}>
              <Clock size={14} className={delivery === "reserve" ? "text-white" : "text-primary"} />
            </div>
            <span className={`text-xs font-semibold leading-tight text-left ${delivery === "reserve" ? "text-accent" : "text-foreground"}`}>
              Retirar por<br />la barra
            </span>
          </button>
        </div>
      </div>

      {/* Product list */}
      <div className="flex-1 px-5 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3 overflow-y-auto content-start bg-background/50">
        {menuItems[category]?.map((item) => {
          const qty = getQty(item.id);
          return (
            <div key={item.id} className="bg-card rounded-2xl border border-border overflow-hidden flex gap-0 h-24 shadow-sm hover:border-accent/20 transition-colors">
              <div className="w-24 h-24 flex-shrink-0 bg-muted">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">{item.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-primary">${item.price.toLocaleString()}</span>
                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(item)}
                      className="w-7 h-7 rounded-full bg-primary flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                    >
                      <Plus size={14} className="text-white" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                      >
                        <Minus size={12} className="text-primary" />
                      </button>
                      <span className="text-sm font-semibold text-primary w-4 text-center">{qty}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-7 h-7 rounded-full bg-primary flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
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

      {/* Cart CTA (Only on Mobile) */}
      {totalItems > 0 && delivery !== null && (
        <div className="md:hidden px-5 pb-8 pt-3 bg-background border-t border-border">
          <button
            onClick={onCheckout}
            className="w-full bg-primary text-white rounded-xl py-4 flex items-center justify-between px-5 active:scale-[0.98] transition-all cursor-pointer"
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
