/* TerraHogar · ficha.js */

var id = Number(getParam("id"));
var p = getPropiedad(id);
var cont = document.getElementById("ficha-container");
var migas = document.getElementById("migas");

if (!p) {
  migas.innerHTML = '<a href="index.html">Inicio</a><span class="sep">›</span><span aria-current="page">No encontrada</span>';
  cont.innerHTML = '' +
    '<div class="vacio" style="grid-column:1/-1;">' +
      '<div class="vacio-icon">' + ICONS.search + '</div>' +
      '<h3>Propiedad no encontrada</h3>' +
      '<p>Puede que haya sido retirada o que el enlace esté roto.</p>' +
      '<a href="listado.html" class="btn btn-primary">Volver al listado</a>' +
    '</div>';
} else {
  registrarVisita(id);

  var fav = esFavorito(id);
  var precio = p.operacion === "arriendo"
    ? formatPrecio(p.precio) + "<small>/mes</small>"
    : formatPrecio(p.precio);

  var tags = [];
  if (p.estado === "nuevo") tags.push('<span class="tag tag-nuevo">Nuevo</span>');
  if (p.estado === "baja") tags.push('<span class="tag tag-baja">Bajó de precio</span>');
  if (p.destacada) tags.push('<span class="tag tag-destacada">Destacada</span>');

  migas.innerHTML = '' +
    '<a href="index.html">Inicio</a><span class="sep">›</span>' +
    '<a href="listado.html?op=' + p.operacion + '">' + capitalizar(p.operacion) + '</a><span class="sep">›</span>' +
    '<a href="listado.html?op=' + p.operacion + '&tipo=' + p.tipo + '">' + ETIQUETAS.tipo[p.tipo] + '</a><span class="sep">›</span>' +
    '<span aria-current="page">' + p.barrio + '</span>';

  var featuresHTML = '' +
    (p.dormitorios > 0 ? '<div class="feature-item"><span class="feat-icon">' + ICONS.bed + '</span><div><strong>' + p.dormitorios + ' dormitorios</strong><small>Habitaciones</small></div></div>' : '') +
    (p.banos > 0 ? '<div class="feature-item"><span class="feat-icon">' + ICONS.bath + '</span><div><strong>' + p.banos + ' baños</strong><small>Baños completos</small></div></div>' : '') +
    '<div class="feature-item"><span class="feat-icon">' + ICONS.ruler + '</span><div><strong>' + p.superficie + ' m²</strong><small>Superficie</small></div></div>' +
    (p.estacionamiento > 0 ? '<div class="feature-item"><span class="feat-icon">' + ICONS.car + '</span><div><strong>' + p.estacionamiento + ' estacionamiento(s)</strong><small>Parqueadero</small></div></div>' : '') +
    '<div class="feature-item"><span class="feat-icon">' + ICONS.paw + '</span><div><strong>' + (p.mascotas ? "Permiten mascotas" : "No permiten") + '</strong><small>Mascotas</small></div></div>' +
    '<div class="feature-item"><span class="feat-icon">' + ICONS.sofa + '</span><div><strong>' + (p.amoblado ? "Amoblado" : "Sin amoblar") + '</strong><small>Amoblamiento</small></div></div>';

  cont.innerHTML = '' +
    '<div>' +
      '<div class="ficha-galeria"><img src="' + p.foto + '" alt="Foto de ' + p.titulo + '" /></div>' +
      '<div class="ficha-detalle">' +
        '<div class="ficha-tags">' + tags.join("") + '</div>' +
        '<h1>' + p.titulo + '</h1>' +
        '<div class="ficha-ubicacion">' + ICONS.pin + ' ' + p.barrio + ', ' + p.localidad + '</div>' +
        '<h2>Descripción</h2>' +
        '<p>' + p.descripcion + '</p>' +
        '<h2>Características</h2>' +
        '<div class="features-list">' + featuresHTML + '</div>' +
        '<h2>Ubicación</h2>' +
        '<p>' + p.localidad + ' · ' + p.barrio + '</p>' +
        '<h2>Contacto</h2>' +
        '<p style="margin-bottom:1rem;">Contacta sin registrarte. Elige el canal que prefieras.</p>' +
        '<div class="contact-actions">' +
          '<a href="https://wa.me/573000000000?text=Hola,%20me%20interesa%20' + encodeURIComponent(p.titulo) + '" target="_blank" rel="noopener" class="btn btn-primary">' + ICONS.whatsapp + ' WhatsApp</a>' +
          '<a href="tel:+573000000000" class="btn btn-outline">' + ICONS.phone + ' Llamar</a>' +
          '<button class="btn btn-outline" id="btn-compartir" type="button">' + ICONS.share + ' Compartir</button>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<aside class="ficha-panel" aria-label="Resumen y contacto">' +
      '<div class="precio-grande">' + precio + '</div>' +
      (p.gastosComunes > 0
        ? '<div class="gastos">+ ' + formatPrecio(p.gastosComunes) + ' gastos comunes</div>' +
          '<div class="total"><span>Total mensual</span><strong>' + formatPrecio(p.precio + p.gastosComunes) + '</strong></div>'
        : '<div class="gastos">Sin gastos comunes</div>') +

      '<div class="ficha-actions">' +
        '<button class="btn btn-accent btn-block" id="btn-fav" aria-pressed="' + fav + '" type="button">' +
          (fav ? ICONS.heartFill + ' Guardado en favoritos' : ICONS.heart + ' Guardar en favoritos') +
        '</button>' +
        '<a href="favoritos.html" class="btn btn-outline btn-block">' + ICONS.chart + ' Ir al comparador</a>' +
      '</div>' +

      '<div class="ficha-meta">' +
        '<div class="meta-row">' + ICONS.user + ' Asesora: Fernanda Soto</div>' +
        '<div class="meta-row">' + ICONS.clock + ' Publicada hace ' + (p.estado === "nuevo" ? "2 días" : "3 semanas") + '</div>' +
        '<div class="meta-row">' + ICONS.shield + ' Sin registro para ver el precio</div>' +
      '</div>' +

      '<h2>Agendar visita</h2>' +
      '<form id="form-visita" class="visita-form">' +
        '<label class="sr-only" for="visita-fecha">Fecha</label>' +
        '<input id="visita-fecha" type="date" required />' +
        '<label class="sr-only" for="visita-horario">Horario</label>' +
        '<select id="visita-horario" required>' +
          '<option value="">Selecciona horario</option>' +
          '<option>Mañana (8–12)</option>' +
          '<option>Tarde (12–17)</option>' +
          '<option>Noche (17–19)</option>' +
        '</select>' +
        '<label class="sr-only" for="visita-nombre">Nombre</label>' +
        '<input id="visita-nombre" type="text" placeholder="Tu nombre" required />' +
        '<label class="sr-only" for="visita-tel">Teléfono</label>' +
        '<input id="visita-tel" type="tel" placeholder="Tu teléfono" required />' +
        '<button type="submit" class="btn btn-primary btn-block">Solicitar visita</button>' +
      '</form>' +
    '</aside>';

  var btnFav = document.getElementById("btn-fav");
  btnFav.addEventListener("click", function() {
    var on = toggleFavorito(id);
    btnFav.innerHTML = on ? ICONS.heartFill + " Guardado en favoritos" : ICONS.heart + " Guardar en favoritos";
    btnFav.setAttribute("aria-pressed", on);
  });

  document.getElementById("btn-compartir").addEventListener("click", function() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(location.href).then(function() {
        toast("Enlace copiado al portapapeles");
      }).catch(function() { toast("No se pudo copiar", "error"); });
    } else {
      toast("Enlace copiado");
    }
  });

  document.getElementById("form-visita").addEventListener("submit", function(e) {
    e.preventDefault();
    toast("¡Visita solicitada! Te contactaremos pronto.");
    e.target.reset();
  });
}