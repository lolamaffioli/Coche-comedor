// ──────────────────────────────────────────────────────────────────────────────
// Recorridos del Coche Comedor
// ──────────────────────────────────────────────────────────────────────────────
// Campos editables por recorrido:
//   nombre      → nombre que aparece en el selector
//   descripcion → texto chico debajo del nombre
//   imagen      → ruta a la imagen del recorrido.
//                 • Podés usar una URL externa: "https://..."
//                 • O podés poner tus propias fotos en la carpeta
//                   public/recorridos/ y referenciarlas así: "/recorridos/mi-foto.jpg"
// ──────────────────────────────────────────────────────────────────────────────

const LOGO_TREN = "/recorridos/logo-tren-recorridos.png";

export const recorridos = [
  {
    id: 1,
    nombre: "Buenos Aires - Mar del Plata",
    imagen: "/recorridos/mardel.jpg",
  },
  {
    id: 2,
    nombre: "Buenos Aires - Bragado",
    imagen: "/recorridos/bragado.jpg",
  },
  {
    id: 3,
    nombre: "Buenos Aires - Junín",
    imagen: "/recorridos/junin.jpg",
  },
  {
    id: 4,
    nombre: "Buenos Aires - Rosario",
    imagen: "/recorridos/Rosario.jpg",
  },
];
