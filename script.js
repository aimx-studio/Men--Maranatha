// ===== PRECIOS FIJOS =====
const PRECIOS = {
  PizzaPorcionHawaiana:10500, PizzaPorcionCarnes:10500, PizzaPorcionPollo:10500, PizzaPorcionMexicana:10500,
PizzaPersonal:19900, PizzaSmall:58000, PizzaMedium:70000, PizzaExtraGrande:99000,
  PanNapolitano:6000, PataconHogao:6000,
  MazorcadaGrande:38500, MazorcadaMini:27500, MazorcadaMaranatha4:88000,
  PanzHawaiano:22000, PanzCarnes:22000, PanzRanchero:22000, PanzMaranatha:22000,
  SalchipapaSencilla:16500, SalchipapaEspecial:26500, SalchipapaMaranatha:45000, SalchipapaCosteña:55000,
  LasagnaBolognesa:24500, LasagnaPollo:30000, LasagnaPolloJamon:32000,
  LasagnaPolloChampinon:32000, LasagnaMaranatha:33000, LasagnaMarinera:38500,
  EspaBolognesa:29000, EspaMixto:33000, EspaAlfredo:31000, EspaCarbonara:33000, EspaMarinera:44000,
  PatRelleno:37000,
  CarneParrilla:38000, CarneGratinada:40000, CarneRanchera:45000,
  LomoPlancha:36000, LomoNapolitano:40000, LomoMexicano:40000,
  PechugaPlancha:36000, PechugaNapolitana:40000, PechugaRanchera:40000, PechugaChampinon:40000,
  Churrasco:47000, PuntaAnca:47000, Parrillada:60000, CostillasBBQ:36000, Chicharron:33000,
  MenuInfantil:33000,
  TruchaPrep:44000, TruchaMarinera:48500, SalmonPrep:57000, SalmonMarinero:66000,
  Gas250:3000, Gas400:4500, Gas500:5500, Agua:3000, AguaSab:4000,
  Gas15:9000, Gas30:12000, JugoLeche:10000, JugoAgua:7000, Limonada:12000,
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
  const panel = saborCb.closest(".pizza-tab-panel");
  const item = saborCb.closest(".item");
  const cb = item.querySelector(".check-plato");
  const limites = { "PizzaPersonal": 2, "PizzaSmall": 2, "PizzaMedium": 3, "PizzaExtraGrande": 4 };
  const limite = limites[cb?.name] || 2;
  const marcados = [...panel.querySelectorAll('input[type="checkbox"]:checked')];
  if (marcados.length > limite) saborCb.checked = false;
  actualizarContadorSabores(panel, limite);
}
function actualizarContadorSabores(panel, limite) {
  const marcados = [...panel.querySelectorAll('input[type="checkbox"]:checked')].length;
  let contador = panel.querySelector(".contador-sabores");
  if (!contador) {
    contador = document.createElement("p");
    contador.className = "contador-sabores";
    contador.style.cssText = "font-size:12px;margin:0 0 8px 0;padding:5px 10px;border-radius:5px;font-weight:600;";
    panel.querySelector(".sabores-pizza-wrap").before(contador);
  }
  if (marcados >= limite) {
    contador.style.background = "rgba(245,166,35,0.15)";
    contador.style.color = "#f5a623";
    contador.textContent = `✅ ${marcados}/${limite} sabores — máximo alcanzado`;
  } else {
    contador.style.background = "rgba(255,255,255,0.05)";
    contador.style.color = "rgba(242,237,228,0.7)";
    contador.textContent = `🍕 ${marcados}/${limite} sabores — elige ${limite - marcados} más`;
  }
  panel.querySelectorAll('input[type="checkbox"]').forEach(s => {
    const pill = s.closest(".sabor-pill");
    if (!pill) return;
    pill.style.opacity = (!s.checked && marcados >= limite) ? "0.35" : "1";
    pill.style.pointerEvents = (!s.checked && marcados >= limite) ? "none" : "auto";
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

  if (tipoEntrega === "A domicilio") {
    const zonaVal = document.getElementById("zonaSelect");
    const barrioVal = document.getElementById("barrioCliente").value.trim();
    const direccionVal = document.getElementById("direccion").value.trim();
    if (!zonaVal || zonaVal.selectedIndex === 0) {
      alert("Por favor selecciona tu zona de domicilio.");
      return;
    }
    if (!barrioVal) {
      alert("Por favor escribe tu barrio.");
      return;
    }
    if (!direccionVal) {
      alert("Por favor escribe tu dirección.");
      return;
    }
  }

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

    let nombre_plato = cb.value.replace(/\s*\[.*?\]/g, "").trim();

    const sabor = item.querySelector(".sabor");
    if (sabor) nombre_plato += " (" + sabor.value + ")";

    const acompSelects = item.querySelectorAll(".sabor-acomp");
const papaSelect = acompSelects[0] || null;
const ensaladaSelect = acompSelects[1] || null;
    let acomp = "";
if (papaSelect) acomp += "🥔 Papa: " + papaSelect.value;
if (ensaladaSelect) acomp += " | 🥗 Ensalada: " + ensaladaSelect.value;

    const tamano = item.querySelector(".tamano");
    if (tamano) {
      const opt = tamano.options[tamano.selectedIndex];
      nombre_plato += " — " + opt.text.split(" — ")[0];
    }

    // Sabores de pizza (checkboxes)
    if (["PizzaPersonal","PizzaSmall","PizzaMedium","PizzaExtraGrande"].includes(cb.name)) {
      const panels = item.querySelectorAll(".pizza-tab-panel");
      if (panels.length <= 1) {
        const saboresMarcados = [...(panels[0] || item).querySelectorAll('input[type="checkbox"]:checked')].map(s => s.value);
        if (saboresMarcados.length > 0) nombre_plato += " [Sabores: " + saboresMarcados.join(", ") + "]";
      } else {
        panels.forEach((panel, i) => {
          const saboresMarcados = [...panel.querySelectorAll('input[type="checkbox"]:checked')].map(s => s.value);
          nombre_plato += `\n  🍕 Pizza ${i+1}: ${saboresMarcados.length > 0 ? saboresMarcados.join(", ") : "Sin sabores elegidos"}`;
        });
      }
    }

    const span = item.querySelector(".item-linea span");
    const precio = span ? span.textContent : "";
    let linea = `• ${cantidad} × ${nombre_plato} ${precio}`;
    if (acomp) linea += `\n  ${acomp}`;
    platos.push(linea);
  });

  if (platos.length === 0) {
    alert("No has seleccionado ningún producto.");
    return;
  }

  const direccionRaw = document.getElementById("direccion").value.trim();
  const barrio = document.getElementById("barrioCliente")?.value.trim() || "";
  const zonaSelect = document.getElementById("zonaSelect");
  const barrioTexto = zonaSelect && zonaSelect.selectedIndex > 0
    ? zonaSelect.options[zonaSelect.selectedIndex].text.split(" — ")[0]
    : "";
  const direccion = barrioTexto ? `(${barrioTexto}${barrio ? " — " + barrio : ""}) ${direccionRaw}` : direccionRaw;
  const zonaValor = zonaSelect ? Number(zonaSelect.value) || 0 : 0;
  const zonaTexto = zonaSelect && zonaSelect.selectedIndex > 0 ? zonaSelect.options[zonaSelect.selectedIndex].text : "";
  const mesa = document.getElementById("numeroMesa").value.trim();
  const efectivo = document.getElementById("efectivoCliente").value.trim();
  const subtotalProductos = parseInt(total) - zonaValor;

  let msg = `📦 *Nuevo pedido recibido*\n\n`;
  msg += `👤 *Nombre:* ${nombre}\n`;
  msg += `📞 *Número:* ${telefono}\n\n`;
  msg += `🍽️ *Platos:*\n\n${platos.join("\n\n")}\n`;
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
  formData.append('entry.1852319897', parseInt(total) + " COP");

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

// ===== TABS DE PIZZA =====
const SABORES_PIZZA_HTML = `<label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Arequipe"> Arequipe</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Chocolate"> Chocolate</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Nutella"> Nutella</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="M&M"> M&M</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Veleña"> Veleña</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Hawaiana"> Hawaiana</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Durazno"> Durazno</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Tropical"> Tropical</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Aborrajada"> Aborrajada</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Tentación"> Tentación</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Oreo"> Oreo</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Pollo"> Pollo</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Pollo Champiñón"> Pollo Champiñón</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Pollo Durazno"> Pollo Durazno</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Pollo Maíz Tocineta"> Pollo Maíz Tocineta</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Pollo Verduras"> Pollo Verduras</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Pollo Piña"> Pollo Piña</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Pollo BBQ Tocineta"> Pollo BBQ Tocineta</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Pollo Miel Mostaza"> Pollo Miel Mostaza</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Ranchera"> Ranchera</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Mexicana"> Mexicana</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Argentina"> Argentina</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Napolitana"> Napolitana</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Bolognesa"> Bolognesa</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Española"> Española</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Criolla"> Criolla</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Mediterránea"> Mediterránea</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="New York"> New York</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Colombianita"> Colombianita</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Campesina"> Campesina</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Carnes"> Carnes</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="De la Casa"> De la Casa</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Ciruela y Tocineta"> Ciruela y Tocineta</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Pizza Huevo"> Pizza Huevo</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Costillitas BBQ"> Costillitas BBQ</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Maranatha"> Maranatha</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Margarita"> Margarita</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Atún"> Atún</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Vegetariana"> Vegetariana</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Amarilla"> Amarilla</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Bacon"> Bacon</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Cántones"> Cántones</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="TNT"> TNT</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Pollo Chorizo Miel Mostaza"> Pollo Chorizo Miel Mostaza</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Valencia"> Valencia</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Americana"> Americana</label><label class="sabor-pill"><input type="checkbox" onchange="limitarSaboresPizza(this)" value="Típica"> Típica</label>`;

function generarTabs(item, cantidad) {
  const cb = item.querySelector(".check-plato");
  const limites = { "PizzaPersonal": 2, "PizzaSmall": 2, "PizzaMedium": 3, "PizzaExtraGrande": 4 };
  const limite = limites[cb?.name] || 2;
  const desc = item.querySelector(".descripcion");
  if (!desc || desc.style.display === "none") return;

  const saboresGuardados = [];
  desc.querySelectorAll(".pizza-tab-panel").forEach((panel, i) => {
    saboresGuardados[i] = [...panel.querySelectorAll('input[type="checkbox"]:checked')].map(s => s.value);
  });

  if (cantidad <= 1) {
    desc.innerHTML = `<div class="pizza-tab-panel" data-idx="0"><strong style="color:rgba(245,166,35,0.8);font-size:11px;display:block;margin-bottom:7px;">🍕 Elige hasta ${limite} sabores:</strong><div class="sabores-pizza-wrap" style="display:flex;flex-wrap:wrap;gap:5px;">${SABORES_PIZZA_HTML}</div></div>`;
    return;
  }

  let html = `<p style="font-size:11px;color:rgba(245,166,35,0.8);margin:0 0 8px 0;">🍕 Cada pizza puede tener sabores diferentes — elige por pestaña</p><div class="pizza-tabs-nav" style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">`;
  for (let i = 0; i < cantidad; i++) {
    html += `<button type="button" class="pizza-tab-btn" onclick="cambiarTab(this,${i})" style="padding:5px 12px;border-radius:20px;border:1px solid rgba(245,166,35,0.4);background:${i===0?'rgba(245,166,35,0.25)':'rgba(255,255,255,0.05)'};color:rgba(242,237,228,0.9);font-size:12px;cursor:pointer;">🍕 Pizza ${i+1}</button>`;
  }
  html += `</div>`;

  for (let i = 0; i < cantidad; i++) {
    html += `<div class="pizza-tab-panel" data-idx="${i}" style="display:${i===0?'block':'none'};">`;
    if (i > 0) html += `<button type="button" onclick="copiarSaboresAnterior(this,${i})" style="margin-bottom:8px;margin-right:6px;padding:4px 12px;border-radius:15px;border:1px solid rgba(245,166,35,0.3);background:rgba(245,166,35,0.1);color:#f5a623;font-size:11px;cursor:pointer;">📋 Copiar sabores de Pizza ${i}</button>`;
    html += `<strong style="color:rgba(245,166,35,0.8);font-size:11px;display:block;margin-bottom:7px;">🍕 Pizza ${i+1} — elige hasta ${limite} sabores:</strong><div class="sabores-pizza-wrap" style="display:flex;flex-wrap:wrap;gap:5px;">${SABORES_PIZZA_HTML}</div></div>`;
  }

  

desc.innerHTML = html;

  desc.querySelectorAll(".pizza-tab-panel").forEach((panel, i) => {
    if (saboresGuardados[i]) {
      panel.querySelectorAll('input[type="checkbox"]').forEach(s => {
        if (saboresGuardados[i].includes(s.value)) s.checked = true;
      });
      actualizarContadorSabores(panel, limite);
    }
  });

  const todosLosBtns = desc.querySelectorAll(".pizza-tab-btn");
  const todosLosPaneles = desc.querySelectorAll(".pizza-tab-panel");
  let irA = 0;
  todosLosPaneles.forEach((p, i) => {
    if (i > 0 && p.querySelectorAll('input[type="checkbox"]:checked').length === 0 && irA === 0) {
      irA = i;
    }
  });
  todosLosBtns.forEach((b, i) => {
    b.style.background = i === irA ? "rgba(245,166,35,0.25)" : "rgba(255,255,255,0.05)";
  });
  todosLosPaneles.forEach((p, i) => {
    p.style.display = i === irA ? "block" : "none";
  });
}

function cambiarTab(btn, idx) {
  const desc = btn.closest(".descripcion");
  desc.querySelectorAll(".pizza-tab-btn").forEach((b, i) => {
    b.style.background = i === idx ? "rgba(245,166,35,0.25)" : "rgba(255,255,255,0.05)";
  });
  desc.querySelectorAll(".pizza-tab-panel").forEach((p, i) => {
    p.style.display = i === idx ? "block" : "none";
  });
}

function copiarSaboresAnterior(btn, idx) {
  const desc = btn.closest(".descripcion");
  const item = btn.closest(".item");
  const cb = item.querySelector(".check-plato");
  const limites = { "PizzaPersonal": 2, "PizzaSmall": 2, "PizzaMedium": 3, "PizzaExtraGrande": 4 };
  const limite = limites[cb?.name] || 2;
  const panelAnterior = desc.querySelector(`.pizza-tab-panel[data-idx="${idx-1}"]`);
  const panelActual = desc.querySelector(`.pizza-tab-panel[data-idx="${idx}"]`);
  const saboresAnteriores = [...panelAnterior.querySelectorAll('input[type="checkbox"]:checked')].map(s => s.value);
  panelActual.querySelectorAll('input[type="checkbox"]').forEach(s => {
    s.checked = saboresAnteriores.includes(s.value);
  });
  actualizarContadorSabores(panelActual, limite);
}

function copiarSaboresATodas(btn, idxOrigen) {
  const desc = btn.closest(".descripcion");
  const item = btn.closest(".item");
  const cb = item.querySelector(".check-plato");
  const limites = { "PizzaPersonal": 2, "PizzaSmall": 2, "PizzaMedium": 3, "PizzaExtraGrande": 4 };
  const limite = limites[cb?.name] || 2;
  const panelOrigen = desc.querySelector(`.pizza-tab-panel[data-idx="${idxOrigen}"]`);
  const saboresOrigen = [...panelOrigen.querySelectorAll('input[type="checkbox"]:checked')].map(s => s.value);
  desc.querySelectorAll(".pizza-tab-panel").forEach(panel => {
    panel.querySelectorAll('input[type="checkbox"]').forEach(s => {
      s.checked = saboresOrigen.includes(s.value);
    });
    actualizarContadorSabores(panel, limite);
  });
}

function cambiarCantidadPizza(btn, delta) {
  const item = btn.closest(".item");
  const input = item.querySelector(".cantidad");
  if (!input || input.disabled) return;
  const nueva = Math.max(1, Number(input.value) + delta);
  input.value = nueva;
  calcularTotal();
  generarTabs(item, nueva);
}

// ===== PROMOCIONES POR DÍA =====
function aplicarPromociones() {
  const dia = new Date().getDay(); // 0=Dom, 2=Mar, 4=Jue

  const banner = document.getElementById('promoBanner');
  if (!banner) return;

  // MARTES — Promo Hamburguesas
  if (dia === 2) {
    banner.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(212,43,43,0.2),rgba(245,166,35,0.15));border:1px solid rgba(245,166,35,0.5);border-radius:8px;padding:14px 16px;margin-bottom:12px;text-align:center;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:3px;color:#f5a623;">🍔 MARTES DE HAMBURGUESAS</div>
        <div style="font-size:13px;color:rgba(242,237,228,0.85);margin-top:6px;line-height:1.6;">Cualquier combo con papas y Coca-Cola 250ml <strong style="color:#ffd84d;">a solo $25.000</strong><br><span style="font-size:11px;opacity:0.6;">No aplica para Maranatha Doble</span></div>
      </div>`;

    // Bajar precios combo a $25.000
    const promos = {
      HambColombiana: 25000,
      HambMexicana: 25000,
      HambArgentina: 25000,
      HambAmericana: 25000,
      HambMaranatha: 25000,
    };

    document.querySelectorAll('.check-plato').forEach(cb => {
      if (!promos[cb.name]) return;
      const tamano = cb.closest('.item')?.querySelector('.tamano');
      if (!tamano) return;
      [...tamano.options].forEach(opt => {
        if (opt.text.toLowerCase().includes('combo')) {
          opt.value = promos[cb.name];
          opt.text = `Combo Papas+Gaseosa — $25.000 🔥`;
        }
      });
    });
  }

  // JUEVES — Promo Porciones Pizza
  if (dia === 4) {
    banner.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(212,43,43,0.2),rgba(245,166,35,0.15));border:1px solid rgba(245,166,35,0.5);border-radius:8px;padding:14px 16px;margin-bottom:12px;text-align:center;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:3px;color:#f5a623;">🍕 JUEVES DE PIZZA</div>
        <div style="font-size:13px;color:rgba(242,237,228,0.85);margin-top:6px;line-height:1.6;">Todas las porciones de pizza <strong style="color:#ffd84d;">a solo $8.000</strong><br><span style="font-size:11px;opacity:0.6;">Solo aplica para porciones individuales</span></div>
      </div>`;

    // Bajar porciones a $8.000
    const porcioneNames = ['PizzaPorcionHawaiana','PizzaPorcionCarnes','PizzaPorcionPollo','PizzaPorcionMexicana'];
    porcioneNames.forEach(name => {
      const cb = document.querySelector(`input[name="${name}"]`);
      if (!cb) return;
      const span = cb.closest('.item-linea')?.querySelector('span');
      if (span) span.textContent = '$8.000 🔥';
      PRECIOS[name] = 8000;
    });
  }

  // DOMINGO — Aviso Almuerzos
  if (dia === 0) {
    banner.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(212,43,43,0.2),rgba(245,166,35,0.15));border:1px solid rgba(245,166,35,0.5);border-radius:8px;padding:14px 16px;margin-bottom:12px;text-align:center;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:3px;color:#f5a623;">🍽️ DOMINGOS DE ALMUERZO</div>
        <div style="font-size:13px;color:rgba(242,237,228,0.85);margin-top:6px;line-height:1.6;">Los domingos tenemos almuerzos especiales<br><strong style="color:#ffd84d;">Consúltanos el menú del día</strong></div>
        <a href="https://wa.me/573208940361" target="_blank" style="display:inline-block;margin-top:10px;background:#25D366;color:#fff;font-family:'Oswald',sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;padding:8px 20px;border-radius:6px;text-decoration:none;">📲 Ver menú del día</a>
      </div>`;
  }
}

aplicarPromociones();

// Evitar que cantidad quede en 0 cuando el item está seleccionado
document.addEventListener("change", function(e) {
  if (e.target.classList.contains("cantidad")) {
    if (Number(e.target.value) < 1) {
      e.target.value = 1;
      calcularTotal();
    }
  }
});
