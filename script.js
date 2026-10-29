// EDITAR: número de WhatsApp con prefijo de país, sin "+" ni espacios (ej. "34600123456").
// Mientras esté vacío, los botones de WhatsApp llevan a la sección de contacto.
const WHATSAPP_NUMBER = "";
const WHATSAPP_TEXT = "Hola, quiero pedir cita para mi moto";

document.querySelectorAll("[data-whatsapp]").forEach((a) => {
  if (WHATSAPP_NUMBER) {
    a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;
  } else {
    a.href = "#contacto";
    a.removeAttribute("target");
  }
});

// Año del footer
document.querySelector("[data-year]").textContent = new Date().getFullYear();

// Fondo de la barra al hacer scroll
const nav = document.querySelector("[data-nav]");
const onScroll = () => { nav.dataset.scrolled = window.scrollY > 24; };
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Menú móvil (drawer)
const drawer = document.querySelector("[data-drawer]");
const backdrop = document.querySelector("[data-drawer-backdrop]");
const openBtn = document.querySelector("[data-menu-open]");

function openDrawer() {
  drawer.hidden = false;
  backdrop.hidden = false;
  // Forzar un frame para que la transición arranque desde translateY(100%)
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("drawer-open")));
  openBtn.setAttribute("aria-expanded", "true");
}
function closeDrawer() {
  document.body.classList.remove("drawer-open");
  openBtn.setAttribute("aria-expanded", "false");
  drawer.addEventListener("transitionend", () => {
    if (!document.body.classList.contains("drawer-open")) { drawer.hidden = true; backdrop.hidden = true; }
  }, { once: true });
}
openBtn.addEventListener("click", openDrawer);
backdrop.addEventListener("click", closeDrawer);
drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeDrawer));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

// Revelado al entrar en pantalla (una sola vez), con escalonado corto por grupo
const revealables = document.querySelectorAll(".reveal, .photo-reveal");
const groups = new Map();
revealables.forEach((el) => {
  const parent = el.parentElement;
  const i = groups.get(parent) ?? 0;
  el.style.setProperty("--delay", `${i * 60}ms`);
  groups.set(parent, i + 1);
});

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { rootMargin: "0px 0px -80px 0px" });
revealables.forEach((el) => io.observe(el));
