// CORREO DEL COCHE COMEDOR DONDE LLEGAN LOS PEDIDOS CONFIRMADOS:
export const DESTINATION_EMAIL = "cochecomedorsarmiento@gmail.com";

/**
 * PASO 1 — Envía un email al CLIENTE con un link para validar su pedido.
 * El link apunta a /confirmar?d=BASE64 con los datos codificados del pedido.
 */
export function sendClientConfirmationEmail({ orderData, confirmUrl }) {
  const { clientEmail, recorridoName, cart, delivery, cocheNumber, seatNumber, timeSlot, payment, totalPrice } = orderData;

  const body = {
    _subject: `[NO ES COMPROBANTE DE PAGO] Validá tu pedido - Coche Comedor`,
    _replyto: clientEmail,
    _template: "box",

    "⚠️ AVISO IMPORTANTE": "ESTE EMAIL NO SIRVE COMO COMPROBANTE DE PAGO. El pago se realiza de forma presencial al recibir o retirar el pedido.",

    "LINK DE CONFIRMACIÓN (Vence en 15 minutos)": confirmUrl,

    "Recorrido": recorridoName || "No especificado",
    "Tipo de Entrega": delivery === "seat" ? "Llevar al asiento" : "Retirar por la barra",
    "Detalles": delivery === "seat"
      ? `Coche: ${cocheNumber}, Asiento: ${seatNumber}`
      : `Horario estimado: ${timeSlot || "De inmediato"}`,
    "Método de Pago": payment === "cash" ? "Efectivo" : "Tarjeta Física",

    "Detalle de Productos": cart.map(item => {
      const cod = item.codigo ? `[COD ${item.codigo}]` : `[ID ${item.id}]`;
      return `${item.qty}x ${item.name} ${cod} - $${(item.price * item.qty).toLocaleString()}`;
    }).join("\n"),

    "Total": `$${totalPrice.toLocaleString()}`,
  };



  return fetch(`https://formsubmit.co/ajax/${clientEmail}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(data => console.log("Email de confirmación enviado al cliente:", data))
    .catch(err => console.error("Error enviando email al cliente:", err));
}

/**
 * PASO 2 — Envía el pedido confirmado al PERSONAL del Coche Comedor.
 * Se llama desde la página /confirmar cuando el cliente hace click en el link.
 */
export function sendStaffOrderEmail({ cart, delivery, payment, seatNumber, cocheNumber, timeSlot, totalPrice, cashAmount, clientEmail, recorridoName }) {
  const change = Number(cashAmount) - totalPrice;

  const body = {
    _subject: `✅ Pedido Confirmado - ${recorridoName || "Recorrido"} | ${delivery === "seat" ? `Coche ${cocheNumber} Asiento ${seatNumber}` : "Retiro por Barra"}`,
    _replyto: clientEmail,
    _template: "box",

    "Estado": "PEDIDO CONFIRMADO POR EL CLIENTE",
    "Email del Cliente": clientEmail,
    "Recorrido": recorridoName || "No especificado",
    "Tipo de Entrega": delivery === "seat" ? "Llevar al asiento" : "Retirar por la barra del Coche Comedor",
    "Detalles de Entrega": delivery === "seat"
      ? `Coche: ${cocheNumber}, Asiento: ${seatNumber}`
      : `Horario estimado: ${timeSlot || "De inmediato"}`,
    "Método de Pago": payment === "cash"
      ? `Efectivo (Paga con: $${Number(cashAmount).toLocaleString()} — Vuelto: $${change >= 0 ? change.toLocaleString() : "0"})`
      : "Tarjeta Física (Débito/Crédito)",
    "Detalle de Productos": cart.map(item => {
      const cod = item.codigo ? `[COD ${item.codigo}]` : `[ID ${item.id}]`;
      return `${item.qty}x ${item.name} ${cod} - $${(item.price * item.qty).toLocaleString()}`;
    }).join("\n"),
    "Total a Pagar": `$${totalPrice.toLocaleString()}`,
  };

  return fetch(`https://formsubmit.co/ajax/${DESTINATION_EMAIL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(data => console.log("Pedido enviado al personal:", data))
    .catch(err => console.error("Error enviando pedido al personal:", err));
}
