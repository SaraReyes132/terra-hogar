/* TerraHogar · app.js — Utilidades centrales */

const ETIQUETAS = {
  operacion: { arriendo: "Arriendo", venta: "Venta" },
  tipo: { departamento: "Departamento", casa: "Casa", estudio: "Estudio", local: "Local comercial", terreno: "Terreno" },
  estado: { nuevo: "Nuevo", baja: "Bajó de precio", destacada: "Destacada", retirada: "Retirada" },
  campo: { precio: "Precio", gastos: "Gastos comunes", dormitorios: "Dormitorios", banos: "Baños", superficie: "Superficie", estacionamiento: "Estacionamiento", mascotas: "Mascotas permitidas", amoblado: "Amoblado" }
};

const KEYS = { FAV: "terra:favoritos", HIST: "terra:historial", ALERT: "terra:alertas", SEARCH_HIST: "terra:busquedas" };

/* Iconos SVG reutilizables */
const ICONS = {
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  heartFill: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 4v16"/><path d="M22 20v-9a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2v3"/><path d="M2 11h18"/><path d="M22 20H2"/></svg>',
  bath: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="7" y1="19" x2="7" y2="21"/><line x1="17" y1="19" x2="17" y2="21"/></svg>',
  ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.3 8.7 8.7 21.3c-1 1-2.6 1-3.5 0L2.7 18.8c-1-1-1-2.6 0-3.5L15.3 2.7c1-1 2.6-1 3.5 0l2.5 2.5c1 1 1 2.6 0 3.5Z"/><path d="m7.5 10.5 2 2"/><path d="m10.5 7.5 2 2"/><path d="m13.5 4.5 2 2"/><path d="m4.5 13.5 2 2"/></svg>',
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>',
  paw: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><circle cx="4" cy="8" r="2"/><circle cx="2" cy="16" r="2"/><path d="M11 8c-2.5 0-4.5 2-4.5 4.5 0 2.5 2 4.5 4.5 4.5h2c2.5 0 4.5-2 4.5-4.5 0-2.5-2-4.5-4.5-4.5h-2z"/></svg>',
  sofa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z"/><path d="M4 18v2"/><path d="M20 18v2"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>'
};

/* ---------- Favoritos ---------- */
function getFavoritos() {
  try { return JSON.parse(localStorage.getItem(KEYS.FAV)) || []; } catch { return []; }
}

function setFavoritos(ids) {
  localStorage.setItem(KEYS.FAV, JSON.stringify(ids));
  updateBadges();
}

function toggleFavorito(id) {
  const favs = getFavoritos();
  const idx = favs.indexOf(id);
  const agregar = idx === -1;
  if (agregar) favs.push(id);
  else favs.splice(idx, 1);
  setFavoritos(favs);
  toast(agregar ? "Guardado en favoritos" : "Eliminado de favoritos");
  return agregar;
}

function esFavorito(id) {
  return getFavoritos().includes(id);
}

function updateBadges() {
  const n = getFavoritos().length;
  document.querySelectorAll(".badge-fav").forEach(el => {
    el.textContent = n;
    el.style.display = n > 0 ? "inline-flex" : "none";
  });
}

/* ---------- Historial ---------- */
function registrarVisita(id) {
  let hist = [];
  try { hist = JSON.parse(localStorage.getItem(KEYS.HIST)) || []; } catch (e) {}
  hist = [id, ...hist.filter(x => x !== id)].slice(0, 20);
  localStorage.setItem(KEYS.HIST, JSON.stringify(hist));
}

function getHistorial() {
  try { return JSON.parse(localStorage.getItem(KEYS.HIST)) || []; } catch { return []; }
}

/* ---------- Alertas ---------- */
function getAlertas() {
  try { return JSON.parse(localStorage.getItem(KEYS.ALERT)) || []; } catch { return []; }
}

function crearAlerta(texto) {
  const al = getAlertas();
  al.unshift({ texto, fecha: new Date().toISOString() });
  localStorage.setItem(KEYS.ALERT, JSON.stringify(al.slice(0, 15)));
  toast("Alerta creada · te avisaremos por correo", "success");
}

function eliminarAlerta(idx) {
  const al = getAlertas();
  al.splice(idx, 1);
  localStorage.setItem(KEYS.ALERT, JSON.stringify(al));
}

/* ---------- Búsquedas recientes ---------- */
function getBusquedasRecientes() {
  try { return JSON.parse(localStorage.getItem(KEYS.SEARCH_HIST)) || []; } catch { return []; }
}

function guardarBusqueda(q) {
  if (!q || q.trim().length < 2) return;
  let list = getBusquedasRecientes().filter(x => x.toLowerCase() !== q.toLowerCase());
  list.unshift(q.trim());
  localStorage.setItem(KEYS.SEARCH_HIST, JSON.stringify(list.slice(0, 6)));
}

/* ---------- Utilidades ---------- */
function formatPrecio(n) {
  return "$" + n.toLocaleString("es-CO");
}

function getPropiedad(id) {
  return (window.PROPIEDADES || []).find(p => p.id === Number(id));
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function capitalizar(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

/* ---------- Escapes (XSS safe) ---------- */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function(c) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]);
  });
}

function escapeAttr(s) {
  return escapeHtml(s);
}

/* ---------- Toast ---------- */
function toast(msg, tipo) {
  tipo = tipo || "success";
  let box = document.getElementById("toast-box");
  if (!box) {
    box = document.createElement("div");
    box.id = "toast-box";
    box.setAttribute("role", "status");
    box.setAttribute("aria-live", "polite");
    document.body.appendChild(box);
  }
  const t = document.createElement("div");
  t.className = "toast " + tipo;
  t.textContent = msg;
  box.appendChild(t);
  setTimeout(function() { t.style.opacity = "0"; }, 2400);
  setTimeout(function() { t.remove(); }, 2900);
}

/* ---------- Skip link ---------- */
function addSkipLink() {
  if (document.querySelector(".skip-link")) return;
  const a = document.createElement("a");
  a.href = "#main-content";
  a.className = "skip-link";
  a.textContent = "Saltar al contenido principal";
  document.body.insertBefore(a, document.body.firstChild);
}

/* ---------- Nav activo ---------- */
function markActiveNav() {
  const currentPath = (location.pathname.split("/").pop() || "index.html").split("?")[0];
  const currentSearch = location.search;

  document.querySelectorAll(".nav-main a, .bottom-nav a").forEach(function(a) {
    const href = a.getAttribute("href") || "";
    const hrefPath = href.split("?")[0];
    const hrefQuery = href.includes("?") ? href.split("?")[1] : "";

    if (hrefPath === currentPath) {
      if (currentPath === "listado.html") {
        if (hrefQuery) {
          if (currentSearch.includes(hrefQuery)) {
            a.setAttribute("aria-current", "page");
          }
        } else if (!currentSearch.includes("op=")) {
          a.setAttribute("aria-current", "page");
        }
      } else {
        a.setAttribute("aria-current", "page");
      }
    }
  });
}

/* ---------- Menú móvil ---------- */
function initMenu() {
  const btn = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-main");
  if (!btn || !nav) return;
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "nav-main");
  nav.id = "nav-main";
  btn.addEventListener("click", function() {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      btn.focus();
    }
  });
}

/* ---------- Buscador con autocompletado ---------- */
function initBuscador() {
  document.querySelectorAll(".buscador-input").forEach(function(input) {
    const form = input.closest(".search-bar") || input.closest(".buscador");
    if (!form) return;
    let sug = form.querySelector(".autocomplete");
    if (!sug) {
      sug = document.createElement("div");
      sug.className = "autocomplete";
      sug.setAttribute("role", "listbox");
      form.appendChild(sug);
    }
    const opciones = Array.from(new Set(
      [].concat(
        (window.PROPIEDADES || []).map(function(p) { return p.localidad; }),
        (window.PROPIEDADES || []).map(function(p) { return p.barrio; }),
        ["Departamento amoblado", "Casa con jardín", "Mascotas permitidas", "Baja de precio"]
      )
    ));

    function render(q) {
      const recientes = getBusquedasRecientes();
      let html = "";
      if (!q || q.length < 2) {
        if (recientes.length) {
          html += '<div class="ac-header">Búsquedas recientes</div>';
          html += recientes.map(function(r) {
            return '<button type="button" data-val="' + escapeAttr(r) + '">' + ICONS.clock + ' ' + escapeHtml(r) + '</button>';
          }).join("");
        }
        sug.innerHTML = html;
        sug.classList.toggle("show", html.length > 0);
        return;
      }
      const matches = opciones.filter(function(o) {
        return o.toLowerCase().indexOf(q.toLowerCase()) !== -1;
      }).slice(0, 6);
      if (!matches.length) { sug.classList.remove("show"); return; }
      html = '<div class="ac-header">Sugerencias</div>';
      html += matches.map(function(m) {
        return '<button type="button" data-val="' + escapeAttr(m) + '">' + ICONS.search + ' ' + escapeHtml(m) + '</button>';
      }).join("");
      sug.innerHTML = html;
      sug.classList.add("show");
    }

    input.addEventListener("focus", function() { render(input.value); });
    input.addEventListener("input", function() { render(input.value.trim()); });
    input.addEventListener("keydown", function(e) {
      if (e.key === "Escape") sug.classList.remove("show");
    });

    sug.addEventListener("click", function(e) {
      const btn = e.target.closest("button[data-val]");
      if (!btn) return;
      input.value = btn.dataset.val;
      sug.classList.remove("show");
      guardarBusqueda(input.value);
      form.requestSubmit();
    });

    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const q = input.value.trim();
      if (q) guardarBusqueda(q);
      const op = form.dataset.op || "";
      const url = new URL("listado.html", location.href);
      if (q) url.searchParams.set("q", q);
      if (op) url.searchParams.set("op", op);
      location.href = url.toString();
    });
  });
}

/* ---------- Init global ---------- */
document.addEventListener("DOMContentLoaded", function() {
  addSkipLink();
  updateBadges();
  initMenu();
  initBuscador();
  markActiveNav();
});