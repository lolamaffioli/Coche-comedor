import React from "react";
import { ChevronLeft, CreditCard, Banknote, Check, Mail, MapPin, Clock } from "lucide-react";
import { timeSlots } from "../constants/menu";

export default function CheckoutScreen({
  cart, delivery, setDelivery, payment, setPayment,
  seatNumber, setSeatNumber, cocheNumber, setCocheNumber,
  timeSlot, setTimeSlot, totalPrice, canCheckout, onBack, onPlace,
  cashAmount, setCashAmount,
  clientEmail, setClientEmail,
}) {
  return (
    <div className="flex flex-col bg-card md:h-full md:overflow-y-auto pb-0">


      {/* Header */}
      <div className="px-5 pt-12 pb-5 flex-shrink-0" style={{ background: "linear-gradient(135deg, #091f41 0%, #1a5a9e 100%)" }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center active:bg-white/25 transition-colors cursor-pointer flex-shrink-0">
            <ChevronLeft size={18} className="text-white" />
          </button>
          <h2 className="text-white font-semibold text-lg">Confirmar Pedido</h2>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 pb-4">


        {/* Order summary */}
        <div className="px-5 py-5 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Tu compra</p>
          {cart.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">No sumaste productos al carrito todavía.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-4">
                  <div className="text-sm text-foreground flex flex-col min-w-0">
                    <span className="truncate">
                      {item.qty > 1 && <span className="font-semibold text-accent mr-1">{item.qty}×</span>}
                      {item.name}
                    </span>
                    {item.codigo && <span className="text-[10px] font-mono text-muted-foreground">COD {item.codigo}</span>}
                  </div>
                  <span className="text-sm font-medium text-foreground flex-shrink-0">${(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="text-base font-bold text-primary">${totalPrice.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Email del cliente */}
        <div className="px-5 py-5 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Tus Datos</p>
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Correo Electrónico</label>
          <div className="relative">
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full bg-input-background border border-border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm"
            />
            <Mail className="absolute left-3.5 top-3.5 text-muted-foreground" size={16} />
          </div>
          <p className="text-[11px] text-muted-foreground leading-normal mt-2">
            Recibirás el detalle por email. <strong>Deberás confirmarlo desde tu bandeja para validar el pedido.</strong>
          </p>
        </div>

        {/* Forma de entrega y sus opciones específicas */}
        <div className="px-5 py-5 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Forma de entrega</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
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

          {/* Detalles dinámicos según selección */}
          {delivery === "seat" && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Coche N°</label>
                  <input type="text" placeholder="Ej: 3" value={cocheNumber} onChange={(e) => setCocheNumber(e.target.value.replace(/\D/g, ""))} className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm" maxLength={3} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Asiento N°</label>
                  <input type="text" placeholder="Ej: 24" value={seatNumber} onChange={(e) => setSeatNumber(e.target.value.toUpperCase())} className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm" maxLength={2} />
                </div>
              </div>
              <div className="bg-secondary rounded-2xl p-4 flex gap-4 items-start border border-border/50">
                <div className="flex-shrink-0 w-16 h-20 bg-primary rounded-xl flex flex-col items-center justify-center gap-1 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">{[...Array(6)].map((_, i) => <div key={i} className="absolute w-full h-px bg-white" style={{ top: `${i * 20}%` }} />)}</div>
                  <div className="w-8 h-4 border-2 border-white/60 rounded-sm relative z-10" />
                  <div className="text-white/80 text-[8px] font-semibold z-10">COCHE/AS.</div>
                  <div className="text-white text-xs font-bold z-10 truncate max-w-full px-1">{cocheNumber ? `C${cocheNumber}` : "C?"} · {seatNumber || "A?"}</div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground mb-1">¿Dónde está el número?</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">El coche y el asiento están impresos en tu pasaje impreso o digital de Trenes Argentinos.</p>
                </div>
              </div>
            </div>
          )}

          {delivery === "reserve" && (
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button key={slot} onClick={() => setTimeSlot(slot)} className={`py-2 rounded-xl text-xs font-medium border-2 transition-all active:scale-95 cursor-pointer text-center leading-tight ${timeSlot === slot ? "bg-accent border-accent text-white" : "bg-card border-border text-foreground hover:border-accent/40"}`}>
                  {slot}
                </button>
              ))}
            </div>
          )}

          {!delivery && (
            <p className="text-xs text-amber-500 font-semibold mt-2">⚠️ Por favor seleccioná una forma de entrega arriba.</p>
          )}
        </div>

        {/* Payment */}
        <div className="px-5 py-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Forma de pago</p>
          <p className="text-xs text-muted-foreground mb-4">El pago se procesa al momento de recibir o retirar tu compra.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => setPayment("cash")} className={`rounded-xl py-4 px-4 flex items-center gap-4 border-2 transition-all active:scale-[0.97] cursor-pointer ${payment === "cash" ? "border-accent bg-accent/8" : "border-border bg-card"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${payment === "cash" ? "bg-accent" : "bg-secondary"}`}>
                <Banknote size={20} className={payment === "cash" ? "text-white" : "text-primary"} />
              </div>
              <div className="text-left flex-1">
                <p className={`text-sm font-semibold ${payment === "cash" ? "text-accent" : "text-foreground"}`}>Efectivo</p>
                <p className="text-xs text-muted-foreground mt-0.5">Abonás en efectivo al recibir/retirar</p>
              </div>
              {payment === "cash" && <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center"><Check size={12} className="text-white" /></div>}
            </button>

            {payment === "cash" && (
              <div className="bg-background border border-border rounded-2xl p-4 flex flex-col gap-3">
                <p className="text-xs font-semibold text-foreground">¿Con cuánto vas a pagar?</p>
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-bold text-primary">$</span>
                  <input type="text" placeholder={`Ej: ${totalPrice}`} value={cashAmount} onChange={(e) => setCashAmount(e.target.value.replace(/\D/g, ""))} className="flex-1 bg-input-background border border-border rounded-xl px-3 py-2 text-foreground outline-none focus:border-accent text-sm" />
                  <button type="button" onClick={() => setCashAmount(totalPrice.toString())} className="text-xs font-semibold text-accent bg-accent/10 hover:bg-accent/20 px-3 py-2.5 rounded-xl transition-colors cursor-pointer">Pago exacto</button>
                </div>
                {Number(cashAmount) > 0 && (
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-muted-foreground">Tu vuelto:</span>
                    {Number(cashAmount) >= totalPrice
                      ? <span className="font-bold text-emerald-500">${(Number(cashAmount) - totalPrice).toLocaleString()}</span>
                      : <span className="font-semibold text-rose-500">Monto insuficiente (Faltan ${(totalPrice - Number(cashAmount)).toLocaleString()})</span>}
                  </div>
                )}
              </div>
            )}

            <button onClick={() => setPayment("card")} className={`rounded-xl py-4 px-4 flex items-center gap-4 border-2 transition-all active:scale-[0.97] cursor-pointer ${payment === "card" ? "border-accent bg-accent/8" : "border-border bg-card"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${payment === "card" ? "bg-accent" : "bg-secondary"}`}>
                <CreditCard size={20} className={payment === "card" ? "text-white" : "text-primary"} />
              </div>
              <div className="text-left flex-1">
                <p className={`text-sm font-semibold ${payment === "card" ? "text-accent" : "text-foreground"}`}>Tarjeta física de débito o crédito</p>
                <p className="text-xs text-muted-foreground mt-0.5">Llevamos el posnet a tu asiento o pagás en barra</p>
              </div>
              {payment === "card" && <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center"><Check size={12} className="text-white" /></div>}
            </button>

            {payment !== null && (
              <div className="bg-secondary rounded-xl px-4 py-3 flex gap-3 items-start border border-border/50">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-[10px] font-bold">i</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">El pago es <strong className="text-foreground">presencial</strong>. Nuestro personal completará la transacción al entregarte el pedido.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botón de Confirmar Pedido (sticky bottom-0, se acopla arriba del footer al final del scroll) */}
      <div className="sticky bottom-0 left-0 right-0 z-40 px-5 pb-6 pt-3 bg-background/95 backdrop-blur-sm border-t border-border flex-shrink-0">
        <button
          onClick={canCheckout ? onPlace : undefined}
          className={`w-full bg-primary text-white rounded-xl py-4 font-semibold text-sm active:scale-[0.98] transition-all cursor-pointer shadow-2xl ${
            canCheckout ? "" : "opacity-60 cursor-not-allowed"
          }`}
        >
          {canCheckout ? `Confirmar pedido · $${totalPrice.toLocaleString()}` : "Completá tus datos para continuar"}
        </button>
      </div>
    </div>
  );
}
