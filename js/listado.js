/* TerraHogar · listado.js — Filtros facetados */

const state = {
  op: getParam("op") || "",
  tipo: [], localidad: [], dorm: [],
  precioMin: null, precioMax: null,
  mascotas: false, amoblado: false, estacionamiento: false, baja: false,
  q: getParam("q") || "",
  orden: "relevancia"
};

const TIPOS = ["departamento", "casa", "estudio", "local", "terreno"];
const LOCALIDADES = Array.from(new Set(PROPIEDADES.map(p => p.localidad))).sort();

function renderControles() {
  document.getElementById("f-op").innerHTML =
    '<label><input type="radio" name="op" value="" ' + (!state.op ? "checked" : "") + '/> Todas</label>' +
    '<label><input type="radio" name="op" value="arriendo" ' + (state.op === "arriendo" ? "checked" : "") + '/> Arriendo</label>' +
    '<label><input type="radio" name="op" value="venta" ' + (state.op === "venta" ? "checked" : "") + '/> Venta</label>';
  document.querySelectorAll('input[name="op"]').forEach(function(r) {
    r.addEventListener("change", function() { state.op = r.value; updateURL(); render(); });
  });

  document.getElementById("f-tipo").innerHTML = TIPOS.map(function(t) {
    return '<label><input type="checkbox" value="' + t + '" ' + (state.tipo.indexOf(t) !== -1 ? "checked" : "") + '/> ' + ETIQUETAS.tipo[t] + '</label>';
  }).join("");
  document.querySelectorAll("#f-tipo input").forEach(function(cb) {
    cb.addEventListener("change", function() {
      state.tipo = cb.checked ? state.tipo.concat(cb.value) : state.tipo.filter(function(v) { return v !== cb.value; });
      render();
    });
  });

  document.getElementById("f-localidad").innerHTML = LOCALIDADES.map(function(l) {
    return '<label><input type="checkbox" value="' + l + '" ' + (state.localidad.indexOf(l) !== -1 ? "checked" : "") + '/> ' + l + '</label>';
  }).join("");
  document.querySelectorAll("#f-localidad input").forEach(function(cb) {
    cb.addEventListener("change", function() {
      state.localidad = cb.checked ? state.localidad.concat(cb.value) : state.localidad.filter(function(v) { return v !== cb.value; });
      render();
    });
  });

  document.getElementById("f-dorm").innerHTML = ["1","2","3","4+"].map(function(d) {
    return '<label><input type="checkbox" value="' + d + '" ' + (state.dorm.indexOf(d) !== -1 ? "checked" : "") + '/> ' + d + ' dormitorios</label>';
  }).join("");
  document.querySelectorAll("#f-dorm input").forEach(function(cb) {
    cb.addEventListener("change", function() {
      state.dorm = cb.checked ? state.dorm.concat(cb.value) : state.dorm.filter(function(v) { return v !== cb.value; });
      render();
    });
  });

  document.getElementById("f-precio-min").value = state.precioMin != null ? state.precioMin : "";
  document.getElementById("f-precio-max").value = state.precioMax != null ? state.precioMax : "";
  document.getElementById("f-precio-min").addEventListener("input", function(e) { state.precioMin = Number(e.target.value) || null; render(); });
  document.getElementById("f-precio-max").addEventListener("input", function(e) { state.precioMax = Number(e.target.value) || null; render(); });

  ["mascotas", "amoblado", "estacionamiento", "baja"].forEach(function(k) {
    var cb = document.getElementById("f-" + k);
    cb.checked = state[k];
    cb.addEventListener("change", function() { state[k] = cb.checked; render(); });
  });

  document.getElementById("orden").addEventListener("change", function(e) { state.orden = e.target.value; render(); });
  document.getElementById("btn-limpiar").addEventListener("click", limpiar);

  var btnMobile = document.getElementById("btn-filtros-mobile");
  var filtros = document.getElementById("filtros");
  var backdrop = document.getElementById("filtros-backdrop");
  if (btnMobile) {
    btnMobile.addEventListener("click", function() {
      filtros.classList.toggle("open");
      backdrop.classList.toggle("show");
    });
    backdrop.addEventListener("click", function() {
      filtros.classList.remove("open");
      backdrop.classList.remove("show");
    });
  }
  var btnClose = document.getElementById("filtros-close");
  if (btnClose) btnClose.addEventListener("click", function() {
    filtros.classList.remove("open");
    backdrop.classList.remove("show");
  });

  var btnAlerta = document.getElementById("btn-alerta-vacio");
  if (btnAlerta) btnAlerta.addEventListener("click", function() { crearAlerta(descripcionBusqueda()); });
}

function limpiar() {
  state.op = ""; state.tipo = []; state.localidad = []; state.dorm = [];
  state.precioMin = null; state.precioMax = null;
  state.mascotas = false; state.amoblado = false; state.estacionamiento = false; state.baja = false;
  state.q = ""; state.orden = "relevancia";
  updateURL(); renderControles(); render();
}

function filtrar() {
  return PROPIEDADES.filter(function(p) {
    if (state.op && p.operacion !== state.op) return false;
    if (state.tipo.length && state.tipo.indexOf(p.tipo) === -1) return false;
    if (state.localidad.length && state.localidad.indexOf(p.localidad) === -1) return false;
    if (state.dorm.length) {
      var cumple = state.dorm.some(function(d) {
        return d === "4+" ? p.dormitorios >= 4 : p.dormitorios === Number(d);
      });
      if (!cumple) return false;
    }
    if (state.precioMin && p.precio < state.precioMin) return false;
    if (state.precioMax && p.precio > state.precioMax) return false;
    if (state.mascotas && !p.mascotas) return false;
    if (state.amoblado && !p.amoblado) return false;
    if (state.estacionamiento && p.estacionamiento === 0) return false;
    if (state.baja && p.estado !== "baja") return false;
    if (state.q) {
      var t = (p.titulo + " " + p.localidad + " " + p.barrio + " " + p.descripcion).toLowerCase();
      if (t.indexOf(state.q.toLowerCase()) === -1) return false;
    }
    return true;
  });
}

function ordenar(arr) {
  var a = arr.slice();
  switch (state.orden) {
    case "recientes": return a.sort(function(x, y) { return y.id - x.id; });
    case "precio-asc": return a.sort(function(x, y) { return x.precio - y.precio; });
    case "precio-desc": return a.sort(function(x, y) { return y.precio - x.precio; });
    case "baja": return a.filter(function(p) { return p.estado === "baja"; }).concat(a.filter(function(p) { return p.estado !== "baja"; }));
    default: return a.sort(function(x, y) { return (y.destacada ? 1 : 0) - (x.destacada ? 1 : 0); });
  }
}

function cardHTML(p) {
  var fav = esFavorito(p.id);
  var tags = [];
  if (p.estado === "nuevo") tags.push('<span class="tag tag-nuevo">Nuevo</span>');
  if (p.estado === "baja") tags.push('<span class="tag tag-baja">Bajó de precio</span>');
  if (p.destacada) tags.push('<span class="tag tag-destacada">Destacada</span>');

  var precio = p.operacion === "arriendo"
    ? formatPrecio(p.precio) + "<small>/mes</small>"
    : formatPrecio(p.precio);

  var feat = [];
  if (p.dormitorios > 0) feat.push("<span>" + ICONS.bed + " " + p.dormitorios + "</span>");
  if (p.banos > 0) feat.push("<span>" + ICONS.bath + " " + p.banos + "</span>");
  feat.push("<span>" + ICONS.ruler + " " + p.superficie + " m²</span>");
  if (p.estacionamiento > 0) feat.push("<span>" + ICONS.car + " " + p.estacionamiento + "</span>");
  if (p.mascotas) feat.push("<span title=\"Mascotas permitidas\">" + ICONS.paw + "</span>");

  return '' +
    '<article class="card-propiedad">' +
      '<div class="card-media">' +
        '<a href="ficha.html?id=' + p.id + '" aria-label="Ver detalle de ' + p.titulo + '">' +
          '<img src="' + p.foto + '" alt="Foto de ' + p.titulo + '" loading="lazy" />' +
        '</a>' +
        '<div class="card-tags">' + tags.join("") + '</div>' +
        '<button class="fav-btn" data-id="' + p.id + '" aria-label="' + (fav ? "Quitar de favoritos" : "Guardar en favoritos") + ': ' + p.titulo + '" aria-pressed="' + fav + '" type="button">' + (fav ? ICONS.heartFill : ICONS.heart) + '</button>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-precio">' + precio + '</div>' +
        (p.gastosComunes > 0 ? '<div class="card-gastos">+ ' + formatPrecio(p.gastosComunes) + ' gastos comunes</div>' : '<div class="card-gastos">Sin gastos comunes</div>') +
        '<a href="ficha.html?id=' + p.id + '" class="card-titulo">' + p.titulo + '</a>' +
        '<div class="card-ubicacion">' + ICONS.pin + ' ' + p.barrio + ', ' + p.localidad + '</div>' +
        '<div class="card-features">' + feat.join("") + '</div>' +
        '<div class="card-actions"><a href="ficha.html?id=' + p.id + '" class="btn btn-outline btn-sm btn-block">Ver detalle</a></div>' +
      '</div>' +
    '</article>';
}

function renderFacetas() {
  var chips = [];
  if (state.q) chips.push(chip('"' + state.q + '"', function() { state.q = ""; updateURL(); render(); }));
  if (state.op) chips.push(chip(capitalizar(state.op), function() { state.op = ""; renderControles(); render(); }));
  state.tipo.forEach(function(t) { chips.push(chip(ETIQUETAS.tipo[t], function() { state.tipo = state.tipo.filter(function(x) { return x !== t; }); renderControles(); render(); })); });
  state.localidad.forEach(function(l) { chips.push(chip(l, function() { state.localidad = state.localidad.filter(function(x) { return x !== l; }); renderControles(); render(); })); });
  state.dorm.forEach(function(d) { chips.push(chip(d + " dorm.", function() { state.dorm = state.dorm.filter(function(x) { return x !== d; }); renderControles(); render(); })); });
  if (state.mascotas) chips.push(chip("Mascotas", function() { state.mascotas = false; renderControles(); render(); }));
  if (state.amoblado) chips.push(chip("Amoblado", function() { state.amoblado = false; renderControles(); render(); }));
  if (state.estacionamiento) chips.push(chip("Estacionamiento", function() { state.estacionamiento = false; renderControles(); render(); }));
  if (state.baja) chips.push(chip("Bajó de precio", function() { state.baja = false; renderControles(); render(); }));

  var cont = document.getElementById("facetas-activas");
  cont.innerHTML = chips.length
    ? '<span class="sr-only">Filtros activos:</span>' + chips.join("") + '<button class="btn btn-outline btn-sm" id="btn-limpiar-chips" type="button">Limpiar todo</button>'
    : "";
  cont.querySelectorAll("[data-chip]").forEach(function(btn) {
    btn.addEventListener("click", function() {
      if (btn._fn) btn._fn();
    });
  });
  var limpiarTodo = document.getElementById("btn-limpiar-chips");
  if (limpiarTodo) limpiarTodo.addEventListener("click", limpiar);
}

function chip(texto, onRemove) {
  var id = "chip-" + Math.random().toString(36).slice(2);
  setTimeout(function() {
    var b = document.querySelector('[data-chip="' + id + '"]');
    if (b) b._fn = onRemove;
  }, 0);
  return '<span class="faceta-chip">' + texto + '<button data-chip="' + id + '" aria-label="Quitar filtro ' + texto + '" type="button">' + ICONS.x + '</button></span>';
}

function render() {
  var res = ordenar(filtrar());
  var grid = document.getElementById("grid");
  var vacio = document.getElementById("vacio");
  var count = document.getElementById("count");

  document.getElementById("titulo-listado").textContent =
    state.op === "arriendo" ? "Propiedades en arriendo" :
    state.op === "venta" ? "Propiedades en venta" : "Todas las propiedades";

  count.textContent = res.length + " " + (res.length === 1 ? "resultado" : "resultados");
  document.getElementById("migas").innerHTML =
    '<a href="index.html">Inicio</a><span class="sep">›</span><span aria-current="page">' + (state.op ? capitalizar(state.op) : "Propiedades") + '</span>';

  if (res.length === 0) {
    grid.innerHTML = "";
    vacio.classList.remove("hidden");
  } else {
    vacio.classList.add("hidden");
    grid.innerHTML = res.map(cardHTML).join("");
    grid.querySelectorAll(".fav-btn").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var id = Number(btn.dataset.id);
        var on = toggleFavorito(id);
        btn.setAttribute("aria-pressed", on);
        btn.innerHTML = on ? ICONS.heartFill : ICONS.heart;
        var prop = getPropiedad(id);
        btn.setAttribute("aria-label", (on ? "Quitar de favoritos" : "Guardar en favoritos") + ": " + (prop ? prop.titulo : ""));
      });
    });
  }
  renderFacetas();
}

function updateURL() {
  var params = new URLSearchParams();
  if (state.op) params.set("op", state.op);
  if (state.q) params.set("q", state.q);
  history.replaceState(null, "", "listado.html" + (params.toString() ? "?" + params.toString() : ""));
}

function descripcionBusqueda() {
  var partes = [];
  if (state.op) partes.push(state.op);
  if (state.tipo.length) partes.push(state.tipo.join(", "));
  if (state.localidad.length) partes.push(state.localidad.join(", "));
  if (state.dorm.length) partes.push(state.dorm.join(", ") + " dormitorios");
  return partes.length ? "Alerta: " + partes.join(" · ") : "Alerta de nuevas propiedades";
}

renderControles();
render();