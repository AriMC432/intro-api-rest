// ================================
// Config
// ================================
const API_BASE = "https://698a18b7c04d974bc6a1598e.mockapi.io/api/v1/dispositivos_IoT";

// Map de comandos (1-9)
const COMMANDS = {
  1: "Adelante",
  2: "Detener",
  3: "Atrás",
  4: "Vuelta derecha adelante",
  5: "Vuelta izquierda adelante",
  6: "Vuelta derecha atras",
  7: "Vuelta izquierda atras",
  8: "Giro 90° derecha",
  9: "Giro 90° izquierda",
};

// ================================
// DOM
// ================================
const el = (id) => document.getElementById(id);

const tableBody = el("tableBody");
const emptyState = el("emptyState");
const countTotal = el("countTotal");
const apiUrlText = el("apiUrlText");

const searchInput = el("searchInput");
const btnClearSearch = el("btnClearSearch");
const btnRefresh = el("btnRefresh");
const btnNew = el("btnNew");
const btnNewEmpty = el("btnNewEmpty");
const btnSeed = el("btnSeed");
const btnDeleteAll = el("btnDeleteAll");

const loadingBadge = el("loadingBadge");
const errorBadge = el("errorBadge");

const selectedCommand = el("selectedCommand");

// Modal + form
const deviceModalEl = el("deviceModal");
const deviceModal = new bootstrap.Modal(deviceModalEl);
const modalTitle = el("modalTitle");

const form = el("deviceForm");
const idInput = el("id");
const deviceNameInput = el("deviceName");
const ipclientInput = el("ipclient");
const direccionCodeInput = el("direccionCode");
const direccionTextInput = el("direccionText");
const dateTimeInput = el("DateTime");

// Toast
const toastEl = el("appToast");
const toast = new bootstrap.Toast(toastEl, { delay: 2600 });
const toastTitle = el("toastTitle");
const toastBody = el("toastBody");
const toastTime = el("toastTime");

// ================================
// State
// ================================
let devices = [];
let searchTerm = "";

// ================================
// Helpers
// ================================
function showToast(title, message) {
  toastTitle.textContent = title;
  toastBody.textContent = message;
  toastTime.textContent = "ahora";
  toast.show();
}

function setLoading(isLoading) {
  loadingBadge.classList.toggle("d-none", !isLoading);
  btnRefresh.disabled = isLoading;
  btnNew.disabled = isLoading;
  btnSeed.disabled = isLoading;
  btnDeleteAll.disabled = isLoading;
}

function setError(isError) {
  errorBadge.classList.toggle("d-none", !isError);
}

function toIsoFromDatetimeLocal(value) {
  // value: "YYYY-MM-DDTHH:mm"
  // Convert a ISO string
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function fromIsoToDatetimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function isProbablyIPv4(ip) {
  // check simple (not strict)
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip.trim());
}

function normalize(str) {
  return (str ?? "").toString().toLowerCase();
}

function filteredDevices() {
  if (!searchTerm) return devices;
  const s = normalize(searchTerm);
  return devices.filter((d) => {
    return (
      normalize(d.deviceName).includes(s) ||
      normalize(d.ipclient).includes(s) ||
      normalize(d.direccionText).includes(s) ||
      String(d.direccionCode ?? "").includes(s) ||
      String(d.id ?? "").includes(s)
    );
  });
}

// ================================
// API
// ================================
async function apiGetAll() {
  const res = await fetch(API_BASE, { headers: { "Accept": "application/json" } });
  if (!res.ok) throw new Error(`GET failed (${res.status})`);
  return await res.json();
}

async function apiCreate(payload) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`POST failed (${res.status})`);
  return await res.json();
}

async function apiUpdate(id, payload) {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`PUT failed (${res.status})`);
  return await res.json();
}

async function apiDelete(id) {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "Accept": "application/json" },
  });
  if (!res.ok) throw new Error(`DELETE failed (${res.status})`);
  return await res.json();
}

// ================================
// UI
// ================================
function render() {
  const list = filteredDevices();

  countTotal.textContent = String(list.length);

  tableBody.innerHTML = "";

  if (!list.length) {
    emptyState.classList.remove("d-none");
    return;
  }

  emptyState.classList.add("d-none");

  for (const d of list) {
    const tr = document.createElement("tr");

    const dateShow = d.DateTime ? new Date(d.DateTime).toLocaleString() : "-";

    tr.innerHTML = `
      <td class="text-secondary">${escapeHtml(d.id ?? "")}</td>
      <td>
        <div class="fw-semibold">${escapeHtml(d.deviceName ?? "")}</div>
        <div class="small text-secondary">id: ${escapeHtml(d.id ?? "")}</div>
      </td>
      <td><span class="badge rounded-pill text-bg-light">${escapeHtml(d.ipclient ?? "")}</span></td>
      <td><span class="badge rounded-pill text-bg-dark">${escapeHtml(String(d.direccionCode ?? ""))}</span></td>
      <td>${escapeHtml(d.direccionText ?? "")}</td>
      <td class="text-secondary">${escapeHtml(dateShow)}</td>
      <td class="text-end">
        <div class="btn-group btn-group-sm" role="group">
          <button class="btn btn-outline-light" data-action="edit" data-id="${escapeAttr(d.id)}">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-outline-danger" data-action="delete" data-id="${escapeAttr(d.id)}">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(tr);
  }
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("`", "&#096;");
}

function openNewModal() {
  modalTitle.textContent = "Nuevo dispositivo";
  idInput.value = "";
  deviceNameInput.value = "";
  ipclientInput.value = "";
  direccionCodeInput.value = "";
  direccionTextInput.value = "";
  dateTimeInput.value = "";

  deviceModal.show();
}

function openEditModal(device) {
  modalTitle.textContent = "Editar dispositivo";
  idInput.value = device.id ?? "";
  deviceNameInput.value = device.deviceName ?? "";
  ipclientInput.value = device.ipclient ?? "";
  direccionCodeInput.value = device.direccionCode ?? "";
  direccionTextInput.value = device.direccionText ?? "";
  dateTimeInput.value = fromIsoToDatetimeLocal(device.DateTime);

  deviceModal.show();
}

function applyCommand(code) {
  const text = COMMANDS[code];
  if (!text) return;

  selectedCommand.textContent = `${code} • ${text}`;
  direccionCodeInput.value = String(code);
  direccionTextInput.value = text;
  showToast("Comando aplicado", `Se cargó: ${code} - ${text}`);
}

// ================================
// Flow
// ================================
async function loadDevices() {
  setError(false);
  setLoading(true);
  try {
    devices = await apiGetAll();
    render();
  } catch (err) {
    console.error(err);
    setError(true);
    showToast("Error", "No se pudo cargar la lista. Revisa tu conexión o la API.");
  } finally {
    setLoading(false);
  }
}

async function onSubmitForm(e) {
  e.preventDefault();

  const id = idInput.value.trim();
  const deviceName = deviceNameInput.value.trim();
  const ipclient = ipclientInput.value.trim();
  const direccionCode = Number(direccionCodeInput.value);
  const direccionText = direccionTextInput.value.trim();

  if (!deviceName || !ipclient || !direccionText || !Number.isFinite(direccionCode)) {
    showToast("Faltan datos", "Completa todos los campos requeridos.");
    return;
  }

  if (!isProbablyIPv4(ipclient)) {
    showToast("IP inválida", "Escribe una IP con formato tipo 192.168.0.10");
    return;
  }

  const iso = toIsoFromDatetimeLocal(dateTimeInput.value) ?? new Date().toISOString();

  const payload = {
    deviceName,
    ipclient,
    direccionCode,
    direccionText,
    DateTime: iso,
  };

  setError(false);
  setLoading(true);

  try {
    if (!id) {
      await apiCreate(payload);
      showToast("Creado", "Dispositivo creado correctamente.");
    } else {
      await apiUpdate(id, payload);
      showToast("Actualizado", "Cambios guardados correctamente.");
    }

    deviceModal.hide();
    await loadDevices();
  } catch (err) {
    console.error(err);
    setError(true);
    showToast("Error", "No se pudo guardar. Intenta de nuevo.");
  } finally {
    setLoading(false);
  }
}

async function onClickTable(e) {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  const device = devices.find((d) => String(d.id) === String(id));
  if (!device) return;

  if (action === "edit") {
    openEditModal(device);
    return;
  }

  if (action === "delete") {
    const ok = confirm(`¿Eliminar el dispositivo "${device.deviceName}" (id: ${device.id})?`);
    if (!ok) return;

    setLoading(true);
    try {
      await apiDelete(device.id);
      showToast("Eliminado", "Registro eliminado correctamente.");
      await loadDevices();
    } catch (err) {
      console.error(err);
      setError(true);
      showToast("Error", "No se pudo eliminar.");
    } finally {
      setLoading(false);
    }
  }
}

function wireCommandButtons() {
  document.querySelectorAll(".btn-cmd[data-code]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = Number(btn.dataset.code);
      // si el modal no está abierto, lo abrimos para que veas el efecto
      if (!deviceModalEl.classList.contains("show")) deviceModal.show();
      applyCommand(code);
    });
  });
}

async function seedExample() {
  // ejemplo bonito usando el comando seleccionado si existe
  const currentBadge = selectedCommand.textContent;
  const match = currentBadge.match(/^(\d)/);
  const code = match ? Number(match[1]) : 1;
  const text = COMMANDS[code] ?? "Adelante";

  const payload = {
    deviceName: `Device-${Math.floor(Math.random() * 900 + 100)}`,
    ipclient: `192.168.0.${Math.floor(Math.random() * 200 + 10)}`,
    direccionCode: code,
    direccionText: text,
    DateTime: new Date().toISOString(),
  };

  setLoading(true);
  try {
    await apiCreate(payload);
    showToast("Ejemplo creado", "Se agregó un registro de prueba.");
    await loadDevices();
  } catch (err) {
    console.error(err);
    setError(true);
    showToast("Error", "No se pudo crear el ejemplo.");
  } finally {
    setLoading(false);
  }
}

async function deleteAllOneByOne() {
  const ok = confirm("¿Seguro? Esto eliminará TODOS los registros (uno por uno).");
  if (!ok) return;

  setLoading(true);
  setError(false);

  try {
    // Recarga para tener la lista real
    devices = await apiGetAll();

    for (const d of devices) {
      await apiDelete(d.id);
    }

    showToast("Listo", "Se eliminaron todos los registros.");
    await loadDevices();
  } catch (err) {
    console.error(err);
    setError(true);
    showToast("Error", "Ocurrió un error al borrar todo.");
  } finally {
    setLoading(false);
  }
}

// ================================
// Init
// ================================
apiUrlText.textContent = API_BASE;

btnNew.addEventListener("click", openNewModal);
btnNewEmpty?.addEventListener("click", openNewModal);
btnRefresh.addEventListener("click", loadDevices);
btnClearSearch.addEventListener("click", () => {
  searchTerm = "";
  searchInput.value = "";
  render();
});
btnSeed.addEventListener("click", seedExample);
btnDeleteAll.addEventListener("click", deleteAllOneByOne);

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value;
  render();
});

form.addEventListener("submit", onSubmitForm);
tableBody.addEventListener("click", onClickTable);

wireCommandButtons();
loadDevices();
