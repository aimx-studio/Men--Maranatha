// ===== PRECIOS FIJOS =====
const PRECIOS = {
  PizzaPorcion:9500,
  PanNapolitano:6000, PataconHogao:6000,
  MazorcadaGrande:35000, MazorcadaMini:25000, MazorcadaMaranatha4:80000,
  PanzHawaiano:20000, PanzCarnes:20000, PanzRanchero:20000, PanzMaranatha:20000,
  SalchipapaSencilla:15000, SalchipapaEspecial:24000, SalchipapaMaranatha:40000, SalchipapaCosteña:50000,
  LasagnaBolognesa:22000, LasagnaPollo:27000, LasagnaPolloJamon:29000,
  LasagnaPolloChampinon:29000, LasagnaMaranatha:30000, LasagnaMarinera:35000,
  EspaBolognesa:26000, EspaMixto:30000, EspaAlfredo:28000, EspaCarbonara:30000, EspaMarinera:40000,
  PatRelleno:33000,
  CarneParrilla:35000, CarneGratinada:35000, CarneRanchera:42000,
  LomoPlancha:33000, LomoNapolitano:37000, LomoMexicano:37000,
  PechugaPlancha:33000, PechugaNapolitana:35000, PechugaRanchera:39000, PechugaChampinon:37000,
  Churrasco:42000, PuntaAnca:42000, Parrillada:50000, CostillasBBQ:35000, Chicharron:30000,
  MenuInfantil:30000,
  TruchaPrep:40000, TruchaMarinera:46000, SalmonPrep:52000, SalmonMarinero:60000,
  Gas250:3000, Gas400:4500, Gas500:5500, Agua:3000, AguaSab:4000,
  Gas15:9000, Gas30:12000, JugoLeche:9000, JugoAgua:7000, Limonada:12000,
  TeHatsu:7000, CervClub:6000, CervHeineken:6000, CervCorona:9000,
  AdicPapa:8000, AdicHuevo:9000, AdicPan:4000, AdicYuca:6000, AdicEnsalada:6000
};

// ===== FUNCIONES OBLIGATORIAS =====
function toggleMenu(titulo) {
  const seccion = titulo.nextElementSibling;
  if (!seccion) return;
  const isOpen = seccion.style.display === "block";
  seccion.style.display = isOpen ? "none" : "block";
  titulo.classList.toggle("open", !isOpen);
}

function toggleCantidad(checkbox) {
  const item = checkbox.closest(".item");
  if (!item) return;
  const cantidad = item.querySelector(".cantidad");
  if (!cantidad) return;
  if (checkbox.checked) {
    cantidad.disabled = false;
    if (Number(cantidad.value) === 0) cantidad.value = 1;
    item.classList.add("selected");
  } else {
    cantidad.value = 0;
    cantidad.disabled = true;
    item.classList.remove("selected");
  }
  calcularTotal();
}

function toggleDescripcion(checkbox) {
  const item = checkbox.closest(".item");
  if (!item) return;
  const desc = item.querySelector(".descripcion");
  if (!desc) return;
  desc.style.display = checkbox.checked ? "block" : "none";
}

 function limitarSaboresPizza(saborCb) {
  const item = saborCb.closest(".item");
  const tamano = item.querySelector(".tamano");
  const limites = { "18000": 2, "53000": 2, "63000": 3, "90000": 4 };
  const limite = limites[tamano?.value] || 2;
  const marcados = [...item.querySelectorAll('input[name="sabores-pizza[]"]:checked')];
  if (marcados.length > limite) {
    saborCb.checked = false;
  }
  actualizarContadorSabores(item);
}

function actualizarContadorSabores(item) {
  const limites = { "18000": 2, "53000": 2, "63000": 3, "90000": 4 };
  const tamano = item.querySelector(".tamano");
  const limite = limites[tamano?.value] || 2;
  const marcados = [...item.querySelectorAll('input[name="sabores-pizza[]"]:checked')].length;

  let contador = item.querySelector(".contador-sabores");
  if (!contador) {
    contador = document.createElement("p");
    contador.className = "contador-sabores";
    contador.style.cssText = "font-size:12px;margin:0 0 8px 0;padding:5px 10px;border-radius:5px;font-weight:600;";
    item.querySelector(".sabores-pizza-wrap").before(contador);
  }

  if (marcados >= limite) {
    contador.style.background = "rgba(245,166,35,0.15)";
    contador.style.color = "#f5a623";
    contador.textContent = `✅ ${marcados}/${limite} sabores seleccionados — máximo alcanzado`;
  } else {
    contador.style.background = "rgba(255,255,255,0.05)";
    contador.style.color = "rgba(242,237,228,0.7)";
    contador.textContent = `🍕 ${marcados}/${limite} sabores — elige ${limite - marcados} más`;
  }

  item.querySelectorAll('input[name="sabores-pizza[]"]').forEach(cb => {
    const pill = cb.closest(".sabor-pill");
    if (!cb.checked && marcados >= limite) {
      pill.style.opacity = "0.35";
      pill.style.pointerEvents = "none";
    } else {
      pill.style.opacity = "1";
      pill.style.pointerEvents = "auto";
    }
  });
}

function calcularTotal() {
  let subtotal = 0;
  document.querySelectorAll(".check-plato").forEach(cb => {
    if (!cb.checked) return;
    const item = cb.closest(".item");
    if (!item) return;
    const cantidad = Number(item.querySelector(".cantidad")?.value) || 0;
    if (cantidad <= 0) return;

    const tamano = item.querySelector(".tamano");
    let precio = 0;
    if (tamano) {
      precio = Number(tamano.value) || 0;
      const span = item.querySelector(".item-linea span");
      if (span) span.textContent = "$" + precio.toLocaleString("es-CO");
    } else {
      const key = cb.name;
      precio = PRECIOS[key] || 0;
    }
    subtotal += precio * cantidad;
  });

  const zonaSelect = document.getElementById("zonaSelect");
  const costoDomicilio = zonaSelect ? (Number(zonaSelect.value) || 0) : 0;
  const total = subtotal + costoDomicilio;

  document.getElementById("total").innerText = "$" + total.toLocaleString("es-CO");
  document.getElementById("totalPedido").value = total;
  const pizzaItem = document.querySelector('[name="Pizza"]')?.closest(".item");
  if (pizzaItem) actualizarContadorSabores(pizzaItem);
}

// ===== LÓGICA ENTREGA =====
function actualizarEntrega() {
  const tipo = document.getElementById("tipoEntrega").value;
  document.getElementById("direccionField").style.display = tipo === "A domicilio" ? "block" : "none";
  document.getElementById("mesaField").style.display = tipo === "Comer dentro del local" ? "block" : "none";
}

function actualizarPlaceholderDireccion() {
  const zonaSelect = document.getElementById("zonaSelect");
  const tarjeta = document.getElementById("tarjetaDomicilio");
  const seleccionado = zonaSelect.selectedIndex > 0;
  tarjeta.style.display = seleccionado ? "block" : "none";
}

// ===== LÓGICA PAGO =====
function actualizarPago() {
  const tipo = document.getElementById("tipoPago").value;
  document.getElementById("efectivoField").style.display = tipo === "Efectivo" ? "block" : "none";
}

// ===== ENVÍO PEDIDO =====
let ultimoEnvio = 0;

function enviarPedido(e) {
  e.preventDefault();

  const ahora = Date.now();
  if (ahora - ultimoEnvio < 5000) {
    alert("Por favor espera unos segundos antes de volver a enviar.");
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const tipoEntrega = document.getElementById("tipoEntrega").value;
  const tipoPago = document.getElementById("tipoPago").value;
  const especificaciones = document.getElementById("especificaciones").value.trim();
  const total = document.getElementById("totalPedido").value;

  if (!document.getElementById("confirmPedido").checked) {
    alert("Por favor acepta el tratamiento de datos.");
    return;
  }

  let platos = [];
  document.querySelectorAll(".check-plato").forEach(cb => {
    if (!cb.checked) return;
    const item = cb.closest(".item");
    if (!item) return;
    const cantidad = Number(item.querySelector(".cantidad")?.value) || 0;
    if (cantidad <= 0) return;

    let nombre_plato = cb.value;

    const sabor = item.querySelector(".sabor");
    if (sabor) nombre_plato += " (" + sabor.value + ")";

    const tamano = item.querySelector(".tamano");
    if (tamano) {
      const opt = tamano.options[tamano.selectedIndex];
      nombre_plato += " — " + opt.text.split(" — ")[0];
    }

    // Sabores de pizza (checkboxes)
    if (cb.name === "Pizza") {
      const saboresMarcados = [...item.querySelectorAll('input[name="sabores-pizza[]"]:checked')]
        .map(s => s.value);
      if (saboresMarcados.length > 0) {
        nombre_plato += " [Sabores: " + saboresMarcados.join(", ") + "]";
      }
    }

    const span = item.querySelector(".item-linea span");
    const precio = span ? span.textContent : "";
    platos.push(`• ${nombre_plato} x${cantidad} ${precio}`);
  });

  if (platos.length === 0) {
    alert("No has seleccionado ningún producto.");
    return;
  }

  const direccionRaw = document.getElementById("direccion").value.trim();
  const zonaSelect = document.getElementById("zonaSelect");
  const barrioTexto = zonaSelect && zonaSelect.selectedIndex > 0
    ? zonaSelect.options[zonaSelect.selectedIndex].text.split(" — ")[0]
    : "";
  const direccion = barrioTexto ? `(${barrioTexto}) ${direccionRaw}` : direccionRaw;
  const zonaValor = zonaSelect ? Number(zonaSelect.value) || 0 : 0;
  const zonaTexto = zonaSelect && zonaSelect.selectedIndex > 0 ? zonaSelect.options[zonaSelect.selectedIndex].text : "";
  const mesa = document.getElementById("numeroMesa").value.trim();
  const efectivo = document.getElementById("efectivoCliente").value.trim();
  const subtotalProductos = parseInt(total) - zonaValor;

  let msg = `📦 *Nuevo pedido recibido*\n\n`;
  msg += `👤 *Nombre:* ${nombre}\n`;
  msg += `📞 *Número:* ${telefono}\n\n`;
  msg += `🍽️ *Platos:*\n${platos.join("\n")}\n`;
  if (especificaciones) msg += `\n📝 *Extra:*\n${especificaciones}\n`;
  msg += `\n📦 *Método:* ${tipoEntrega}\n`;
  if (tipoEntrega === "A domicilio") {
    msg += `📍 *Dirección:* ${direccion}\n`;
  }
  if (tipoEntrega === "Comer dentro del local" && mesa) msg += `🪑 *Mesa:* ${mesa}\n`;
  msg += `\n💳 *Forma de Pago:* ${tipoPago}\n`;
  if (tipoPago === "Efectivo" && efectivo) msg += `💵 *Paga con:* ${efectivo}\n`;
  if (tipoEntrega === "A domicilio" && zonaValor > 0) {
    msg += `\n🛵 *Domicilio (${barrioTexto}):* $${zonaValor.toLocaleString("es-CO")}\n`;
    msg += `💸 *Subtotal productos:* $${subtotalProductos.toLocaleString("es-CO")}\n`;
  }
  msg += `\n💸 *TOTAL: $${parseInt(total).toLocaleString("es-CO")}*`;

  // ── GUARDAR EN SHEETS ──
  const formData = new FormData();
  formData.append('entry.1654820871', nombre);
  formData.append('entry.1309392042', telefono);
  formData.append('entry.538246735', platos.join(" | "));
  formData.append('entry.884881326', tipoEntrega);
  formData.append('entry.1934801204', direccion);
  formData.append('entry.1463267517', tipoPago);
  formData.append('entry.1898452928', efectivo);
  formData.append('entry.1481578597', especificaciones);
  formData.append('entry.1852319897', "$" + parseInt(total).toLocaleString("es-CO"));

  fetch('https://docs.google.com/forms/d/e/1FAIpQLScBiAzvvNf7r93eqDNaTvRur10Iv5LkdcPWEV0JzckU9Xy0WA/formResponse', {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  });

  ultimoEnvio = ahora;
  const btn = document.querySelector(".btn");
  btn.disabled = true;
  btn.textContent = "⏳ Enviando...";
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = "📲 Enviar Pedido por WhatsApp";
    location.reload();
  }, 2000);

  window.location.href = "https://wa.me/573208940361?text=" + encodeURIComponent(msg);
}

// Asociar clicks en label al checkbox del mismo item-linea
document.querySelectorAll(".item-linea label").forEach(label => {
  label.addEventListener("click", function() {
    const cb = this.previousElementSibling;
    if (cb && cb.type === "checkbox") {
      cb.checked = !cb.checked;
      cb.dispatchEvent(new Event("change"));
    }
  });
});

// Evitar que cantidad quede en 0 cuando el item está seleccionado
document.addEventListener("change", function(e) {
  if (e.target.classList.contains("cantidad")) {
    if (Number(e.target.value) < 1) {
      e.target.value = 1;
      calcularTotal();
    }
  }
});