// CAMBIÁ ESTE EMAIL POR EL CORREO DONDE QUERÉS RECIBIR LOS PEDIDOS:
export const DESTINATION_EMAIL = "cochecomedorsarmiento@gmail.com";

export function sendOrderEmail({ cart, delivery, payment, seatNumber, cocheNumber, timeSlot, totalPrice, cashAmount }) {
  // Formatear el pedido para enviarlo por mail
  const change = Number(cashAmount) - totalPrice;
  const orderDetails = {
    _subject: `Nuevo Pedido - ${delivery === "seat" ? `Coche ${cocheNumber} Asiento ${seatNumber}` : "Retiro por Barra"}`,
    "Tipo de Entrega": delivery === "seat" ? "Llevar al asiento" : "Retirar por la barra del Coche Comedor",
    "Detalles de Entrega": delivery === "seat" 
      ? `Coche: ${cocheNumber}, Asiento: ${seatNumber}`
      : `Tiempo de retiro estimado: ${timeSlot || "De inmediato"}`,
    "Método de Pago": payment === "cash" 
      ? `Efectivo (Paga con: $${Number(cashAmount).toLocaleString()} - Vuelto: $${change >= 0 ? change.toLocaleString() : "0"})`
      : "Tarjeta Física",
    "Productos": cart.map(item => `${item.qty}x ${item.name} ($${(item.price * item.qty).toLocaleString()})`).join("\n"),
    "Total a pagar": `$${totalPrice.toLocaleString()}`
  };

  // Enviar el email en segundo plano usando el endpoint gratuito FormSubmit.co
  return fetch(`https://formsubmit.co/ajax/${DESTINATION_EMAIL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(orderDetails)
  })
  .then(res => res.json())
  .then(data => console.log("Email enviado con éxito:", data))
  .catch(err => console.error("Error al enviar el email:", err));
}
