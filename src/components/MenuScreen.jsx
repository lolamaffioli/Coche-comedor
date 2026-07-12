import React from "react";
import { ShoppingCart, Plus, Minus, ChevronLeft, MapPin, Clock, ChevronRight, Coffee, Utensils, Wine, Cookie, Leaf, BookOpen, Tag } from "lucide-react";

const CATEGORIES = [
  { key: "Bebidas",          label: "Bebidas",                     icon: <Wine size={14} /> },
  { key: "Cafeteria",        label: "Cafetería",                   icon: <Coffee size={14} /> },
  { key: "Sandwicheria",     label: "Sandwichería",                icon: <Utensils size={14} /> },
  { key: "Golosinas",        label: "Golosinas y galletitas",      icon: <Cookie size={14} /> },
  { key: "GolosinasSinTACC", label: "Golosinas y galletitas sin TACC", icon: <Leaf size={14} /> },
  { key: "Menu",             label: "Menú",                        icon: <BookOpen size={14} /> },
  { key: "Promociones",      label: "Promociones",                 icon: <Tag size={14} /> },
];

export default function MenuScreen({
  menuItems,
  delivery, setDelivery,
  totalItems, addToCart, removeFromCart, getQty,
  onBack, onCheckout,
}) {
  const scrollToCategory = (key) => {
    const el = document.getElementById(`cat-${key}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCheckoutClick = () => {
    onCheckout();
  };

  return (
    <div className="flex flex-col md:h-full md:overflow-y-auto bg-background/50 scroll-smooth pb-0">




      {/* ── Header ── */}
      <div className="px-5 pt-12 pb-5 flex-shrink-0" style={{ background: "linear-gradient(135deg, #091f41 0%, #1a5a9e 100%)" }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center active:bg-white/25 transition-colors cursor-pointer flex-shrink-0">
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
      </div>

      {/* ── Delivery selector ── */}
      <div className="px-5 py-4 bg-card border-b border-border flex-shrink-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Forma de entrega</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDelivery("seat")}
            className={`rounded-xl py-3 px-4 flex flex-col gap-1 items-start border-2 transition-all active:scale-[0.97] cursor-pointer ${delivery === "seat" ? "border-accent bg-accent/8" : "border-border bg-background"}`}
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
            className={`rounded-xl py-3 px-4 flex flex-col gap-1 items-start border-2 transition-all active:scale-[0.97] cursor-pointer ${delivery === "reserve" ? "border-accent bg-accent/8" : "border-border bg-background"}`}
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

      {/* ── Barra de categorías ── */}
      <div className="md:sticky md:top-0 md:z-20 px-5 py-3 bg-card border-b border-border flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto md:overflow-x-visible scrollbar-hide flex-shrink-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => scrollToCategory(cat.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-secondary text-primary hover:bg-secondary/80 active:scale-95 transition-all cursor-pointer"
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Lista de productos ── */}
      <div className="flex-1 pb-4">
        {CATEGORIES.map((cat, catIndex) => {
          const items = menuItems?.[cat.key] ?? [];
          return (
            <div key={cat.key} id={`cat-${cat.key}`} className="scroll-mt-4 md:scroll-mt-0">
              {catIndex > 0 && <div className="h-px bg-border mx-5" />}

              <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
                <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-primary flex-shrink-0">{cat.icon}</div>
                <h3 className="text-foreground font-semibold text-sm">{cat.label}</h3>
                {items.length > 0 && <span className="text-xs text-muted-foreground ml-auto">{items.length} items</span>}
              </div>

              {items.length > 0 ? (
                <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
                  {items.map((item) => {
                    const qty = getQty(item.id);
                    return (
                      <div key={item.id} className="bg-card rounded-2xl border border-border overflow-hidden flex h-24 shadow-sm hover:border-accent/20 transition-colors">
                        <div className="w-24 h-24 flex-shrink-0 bg-muted">
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                          <div>
                            <p className="text-sm font-semibold text-foreground leading-tight line-clamp-2">{item.name}</p>
                            {item.desc && <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-1">{item.desc}</p>}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-primary">${item.price.toLocaleString()}</span>
                              {item.codigo && (
                                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md" style={{ background: "rgba(26,90,158,0.15)", color: "rgba(26,90,158,0.9)", border: "1px solid rgba(26,90,158,0.25)" }}>
                                  COD {item.codigo}
                                </span>
                              )}
                            </div>
                            {qty === 0 ? (
                              <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-full bg-primary flex items-center justify-center active:scale-90 transition-transform cursor-pointer">
                                <Plus size={14} className="text-white" />
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center active:scale-90 transition-transform cursor-pointer">
                                  <Minus size={12} className="text-primary" />
                                </button>
                                <span className="text-sm font-semibold text-primary w-4 text-center">{qty}</span>
                                <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-full bg-primary flex items-center justify-center active:scale-90 transition-transform cursor-pointer">
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
              ) : (
                <p className="px-5 pb-5 text-xs text-muted-foreground italic">Sin productos en este recorrido.</p>
              )}
            </div>
          );
        })}
      </div>

      {/* ── CTA: Ir al checkout (sticky bottom-0, se acopla arriba del footer al final del scroll) ── */}
      {totalItems > 0 && delivery !== null && (
        <div className="sticky bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-3 bg-background/95 backdrop-blur-sm border-t border-border flex-shrink-0">
          <button
            onClick={handleCheckoutClick}
            className="w-full bg-primary text-white rounded-xl py-4 flex items-center justify-between px-5 active:scale-[0.98] transition-all cursor-pointer shadow-2xl"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{totalItems}</div>
            <span className="font-semibold">Ir a pagar</span>
            <ChevronRight size={18} className="text-white/70" />
          </button>
        </div>
      )}
    </div>
  );
}
