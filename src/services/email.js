import emailjs from '@emailjs/browser';

const SERVICE_ID = "service_6vry4fl"; // Reemplazar
const TEMPLATE_CLIENT_ID = "template_eerykyo"; // Reemplazar
const TEMPLATE_STAFF_ID = "template_ew0f77h"; // Reemplazar
const PUBLIC_KEY = "cXazMUEgRujdirhh0"; // Reemplazar (se encuentra en Account > Public Key)

export function sendClientConfirmationEmail({ orderData, confirmUrl }) {
  const { clientEmail, recorridoName, cart, delivery, cocheNumber, seatNumber, timeSlot, payment, totalPrice } = orderData;

  const productsText = cart.map(item => {
    const cod = item.codigo ? `[COD ${item.codigo}]` : `[ID ${item.id}]`;
    const heating = item.caliente !== undefined ? ` (${item.caliente ? "Caliente" : "Frío"})` : "";
    return `${item.qty}x ${item.name}${heating} ${cod} - $${(item.price * item.qty).toLocaleString()}`;
  }).join("\n");

  const templateParams = {
    email: clientEmail,
    confirm_url: confirmUrl,
    recorrido: recorridoName || "No especificado",
    entrega: delivery === "seat" ? `Llevar al Coche ${cocheNumber}, Asiento ${seatNumber}` : `Retiro por barra (Horario: ${timeSlot || "Inmediato"})`,
    pago: payment === "cash" ? "Efectivo" : "Tarjeta Física",
    productos: productsText,
    total: `$${totalPrice.toLocaleString()}`,
  };

  return emailjs.send(SERVICE_ID, TEMPLATE_CLIENT_ID, templateParams, PUBLIC_KEY)
    .then((response) => {
      console.log('✅ Email enviado al cliente!', response.status, response.text);
    })
    .catch((err) => {
      console.error('❌ Error enviando email al cliente:');
      console.error('Status:', err?.status);
      console.error('Text:', err?.text);
      console.error('Detalle completo:', JSON.stringify(err));
    });

}

export function sendStaffOrderEmail(orderData) {
  const { cart, delivery, payment, seatNumber, cocheNumber, totalPrice, cashAmount, clientEmail, recorridoName } = orderData;
  const change = Number(cashAmount) - totalPrice;

  const productsText = cart.map(item => {
    const cod = item.codigo ? `[COD ${item.codigo}]` : `[ID ${item.id}]`;
    const heating = item.caliente !== undefined ? ` (${item.caliente ? "Caliente" : "Frío"})` : "";
    return `${item.qty}x ${item.name}${heating} ${cod} - $${(item.price * item.qty).toLocaleString()}`;
  }).join("\n");

  const templateParams = {
    client_email: clientEmail,
    recorrido: recorridoName || "No especificado",
    entrega: delivery === "seat" ? `Coche ${cocheNumber} - Asiento ${seatNumber}` : `Retirar en barra`,
    entrega_resumen: delivery === "seat" ? `Coche ${cocheNumber} Asiento ${seatNumber}` : "Barra",
    pago: payment === "cash" ? `Efectivo (Paga con: $${Number(cashAmount).toLocaleString()} - Vuelto: $${change >= 0 ? change.toLocaleString() : "0"})` : "Tarjeta Física",
    productos: productsText,
    total: `$${totalPrice.toLocaleString()}`,
  };

  return emailjs.send(SERVICE_ID, TEMPLATE_STAFF_ID, templateParams, PUBLIC_KEY)
    .then((response) => console.log('Pedido enviado al personal!', response.status, response.text))
    .catch((err) => console.error('Error al enviar al personal:', err));
}