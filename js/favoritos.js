/* TerraHogar · favoritos.js */

function renderFavoritos() {
  var favs = getFavoritos();
  var props = favs.map(function(id) { return getPropiedad(id); }).filter(Boolean);
  document.getElementById("fav-count").textContent =
    props.length + " " + (props.length === 1 ? "propiedad guardada" : "propiedades guardadas");

  var grid = document.getElementById("fav-grid");
  var vacio = document.getElementById("fav-vacio");
  var contCmp = document.getElementById("comparador-container");

  if (props.length === 0) {
    grid.innerHTML = "";
    vacio.classList.remove("hidden");
    contCmp.classList.add("hidden");
    return;
  }
  vacio.classList.add("hidden");

  grid.innerHTML = props.map(function(p) {
    var precio = p.operacion === "arriendo"
      ? formatPrecio(p.precio) + "<small>/mes</small>"
      : formatPrecio(p.precio);
    var feat = [];
    if (p.dormitorios > 0) feat.push("<span>" + ICONS.bed + " " + p.dormitorios + "</span>");
    feat.push("<span>" + ICONS.ruler + " " + p.superficie + " m²</span>");
    if (p.mascotas) feat.push("<span title=\"Mascotas\">" + ICONS.paw + "</span>");

    return '' +
      '<article class="card-propiedad">' +
        '<div class="card-media">' +
          '<a href="ficha.html?id=' + p.id + '" aria-label="Ver detalle de ' + p.titulo + '">' +
            '<img src="' + p.foto + '" alt="Foto de ' + p.titulo + '" />' +
          '</a>' +
          '<button class="fav-btn" data-id="' + p.id + '" aria-label="Quitar de favoritos: ' + p.titulo + '" aria-pressed="true" type="button">' + ICONS.heartFill + '</button>' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-precio">' + precio + '</div>' +
          (p.gastosComunes > 0 ? '<div class="card-gastos">+ ' + formatPrecio(p.gastosComunes) + ' gastos comunes</div>' : '<div class="card-gastos">Sin gastos comunes</div>') +
          '<a href="ficha.html?id=' + p.id + '" class="card-titulo">' + p.titulo + '</a>' +
          '<div class="card-ubicacion">' + ICONS.pin + ' ' + p.barrio + ', ' + p.localidad + '</div>' +
          '<div class="card-features">' + feat.join("") + '</div>' +
          '<div class="card-actions" style="flex-wrap:wrap;">' +
            '<label class="fav-select"><input type="checkbox" class="cmp-check" value="' + p.id + '" /> Comparar</label>' +
            '<a href="ficha.html?id=' + p.id + '" class="btn btn-outline btn-sm">Ver detalle</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }).join("");

  grid.querySelectorAll(".fav-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      toggleFavorito(Number(btn.dataset.id));
      renderFavoritos();
    });
  });

  document.getElementById("btn-comparar").onclick = function() {
    var checks = Array.from(document.querySelectorAll(".cmp-check:checked")).map(function(c) { return Number(c.value); });
    if (checks.length < 2) { toast("Selecciona al menos 2 propiedades para comparar", "error"); return; }
    if (checks.length > 4) { toast("Máximo 4 propiedades", "error"); return; }
    renderComparador(checks);
  };

  document.getElementById("btn-alerta").onclick = function() {
    crearAlerta("Alerta de favoritos (" + props.length + " propiedades)");
  };
}

function renderComparador(ids) {
  var props = ids.map(getPropiedad);
  var campos = [
    ["Imagen", function(p) { return '<img src="' + p.foto + '" alt="Foto de ' + p.titulo + '" />'; }],
    ["Título", function(p) { return '<strong>' + p.titulo + '</strong>'; }],
    ["Precio", function(p) { return '<strong style="color:var(--primary)">' + formatPrecio(p.precio) + (p.operacion === "arriendo" ? "/mes" : "") + '</strong>'; }],
    ["Gastos comunes", function(p) { return p.gastosComunes ? formatPrecio(p.gastosComunes) : "—"; }],
    ["Total mensual", function(p) { return p.operacion === "arriendo" ? '<strong>' + formatPrecio(p.precio + p.gastosComunes) + '</strong>' : "—"; }],
    ["Operación", function(p) { return capitalizar(p.operacion); }],
    ["Tipo", function(p) { return ETIQUETAS.tipo[p.tipo]; }],
    ["Localidad", function(p) { return p.localidad; }],
    ["Barrio", function(p) { return p.barrio; }],
    ["Dormitorios", function(p) { return p.dormitorios || "—"; }],
    ["Baños", function(p) { return p.banos || "—"; }],
    ["Superficie", function(p) { return p.superficie + " m²"; }],
    ["Estacionamiento", function(p) { return p.estacionamiento || "—"; }],
    ["Mascotas", function(p) { return p.mascotas ? "✅ Sí" : "❌ No"; }],
    ["Amoblado", function(p) { return p.amoblado ? "✅ Sí" : "❌ No"; }],
    ["Estado", function(p) { return ETIQUETAS.estado[p.estado] || "—"; }]
  ];

  var html = "<table><thead><tr><th>Comparación</th>";
  props.forEach(function(p) {
    html += '<td>' + p.titulo + '<br/><a href="#" class="remove-col" data-remove="' + p.id + '">Quitar</a></td>';
  });
  html += "</tr></thead><tbody>";
  campos.forEach(function(row) {
    var label = row[0], fn = row[1];
    html += '<tr><th>' + label + '</th>' + props.map(function(p) { return '<td>' + fn(p) + '</td>'; }).join("") + '</tr>';
  });
  html += "</tbody></table>";

  var cont = document.getElementById("comparador");
  cont.innerHTML = html;
  document.getElementById("comparador-container").classList.remove("hidden");
  cont.scrollIntoView({ behavior: "smooth", block: "start" });

  cont.querySelectorAll("[data-remove]").forEach(function(a) {
    a.addEventListener("click", function(e) {
      e.preventDefault();
      var id = Number(a.dataset.remove);
      document.querySelectorAll(".cmp-check").forEach(function(c) {
        if (Number(c.value) === id) c.checked = false;
      });
      cont.closest("#comparador-container").classList.add("hidden");
    });
  });
}

renderFavoritos();