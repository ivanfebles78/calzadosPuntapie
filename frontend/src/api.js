const API_URL = "https://calzadospuntapie-production.up.railway.app";

function getHeaders(token, extra = {}) {
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function handleResponse(response) {
  if (!response.ok) {
    let message = "Ha ocurrido un error";
    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  return response;
}

export async function login(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
}

export async function getClientes(token) {
  const response = await fetch(`${API_URL}/clientes`, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
}

export async function createCliente(token, cliente) {
  const response = await fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: getHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(cliente),
  });
  return handleResponse(response);
}

export async function getStats(token) {
  const response = await fetch(`${API_URL}/estadisticas`, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
}

export async function exportExcel(token) {
  const response = await fetch(`${API_URL}/exportar-excel`, {
    headers: getHeaders(token),
  });
  if (!response.ok) {
    let message = "No se pudo exportar";
    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return response.blob();
}

export async function importExcel(token, file) {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(`${API_URL}/importar-excel`, {
    method: "POST",
    headers: getHeaders(token),
    body: form,
  });
  return handleResponse(response);
}
