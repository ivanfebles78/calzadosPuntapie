import React, { useEffect, useMemo, useState } from "react";
import {
  createCliente,
  exportExcel,
  getClientes,
  getStats,
  importExcel,
  login,
} from "./api";

const USERS = [
  { value: "ivan", label: "Ivan" },
  { value: "claudia", label: "Claudia" },
  { value: "tienda", label: "Tienda" },
];

const nationalities = [
  "Alemania", "Argentina", "Belgica", "Brasil", "China", "Dinamarca", "España",
  "Francia", "Holanda", "Irlanda", "Italia", "Japón", "Mexico", "Noruega",
  "Polonia", "Portugal", "Reino Unido", "Rusia", "Suecia", "Suiza", "USA", "OTRO",
];

const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
const months = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const translations = {
  es: {
    welcome: "Accede a la plataforma de clientes",
    password: "Contraseña",
    login: "Entrar",
    loadingLogin: "Entrando…",
    search: "Buscar por nombre, email o teléfono…",
    searchButton: "Buscar",
    clearButton: "Limpiar",
    newClient: "Nuevo cliente",
    statistics: "Estadísticas",
    exportExcel: "Exportar Excel",
    importExcel: "Importar Excel",
    clients: "Clientes",
    allClients: "Listado completo de clientes registrados",
    customer: "Cliente",
    contact: "Contacto",
    nationality: "Nacionalidad",
    registered: "Registro",
    noClients: "No hay clientes registrados.",
    loading: "Cargando…",
    logout: "Salir",
    sessionAs: "Sesión iniciada como",
    role: "rol",
    saveClient: "Guardar cliente",
    cancel: "Cancelar",
    close: "Cerrar",
    clientRegistered: "Cliente registrado correctamente.",
    statsTitle: "Estadísticas",
    statsSubtitle: "Análisis visual de clientes y registros",
    nationalityDistribution: "Distribución por nacionalidad",
    ageDistribution: "Distribución por edad",
    dayLastMonth: "Registros por día del último mes",
    monthLastYear: "Registros por mes del último año",
    topBottomDays: "Días de mayor y menor registro",
    topBottomHours: "Franja horaria de mayor y menor registro",
    highest: "Mayor",
    lowest: "Menor",
    newClientTitle: "Nuevo cliente",
    newClientSubtitle: "Recoge los datos del cliente y evita duplicados automáticamente.",
    name: "Nombre",
    birthday: "Cumpleaños",
    birthdayDay: "Día",
    birthdayMonth: "Mes",
    phone: "Teléfono",
    email: "Email",
    purchase: "Compra / ticket",
  },
};

const flagItems = [
  { code: "es", image: "/images/spain.png", label: "ES" },
  { code: "en", image: "/images/usa.png", label: "EN" },
  { code: "fr", image: "/images/france.png", label: "FR" },
  { code: "de", image: "/images/germany.png", label: "DE" },
  { code: "ru", image: "/images/rusia.png", label: "RU" },
];

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function mapToArray(map) {
  return Object.entries(map || {}).map(([label, value]) => ({ label, value }));
}

function FlagSelector({ language, setLanguage, centered = false }) {
  return (
    <div className={centered ? "flags-top" : "flags-inline"}>
      {flagItems.map((item) => (
        <button
          key={item.code}
          className={`flag-button ${language === item.code ? "active" : ""}`}
          onClick={() => setLanguage(item.code)}
          type="button"
          aria-label={item.label}
        >
          <img src={item.image} alt={item.label} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function StatBars({ title, data }) {
  const items = data ?? [];
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      {!items.length ? (
        <div className="chart-empty">Sin datos</div>
      ) : (
        <div className="chart-list">
          {items.map((item) => (
            <div key={item.label} className="chart-row">
              <div className="chart-row-top">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
              <div className="chart-track">
                <div className="chart-bar" style={{ width: `${Math.max((item.value / max) * 100, 6)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, topLabel, topValue, bottomLabel, bottomValue, t }) {
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <div className="summary-grid">
        <div className="summary-box">
          <span>{t.highest}</span>
          <strong>{topLabel}</strong>
          <small>{topValue}</small>
        </div>
        <div className="summary-box">
          <span>{t.lowest}</span>
          <strong>{bottomLabel}</strong>
          <small>{bottomValue}</small>
        </div>
      </div>
    </div>
  );
}

function LoginPage({ onLogin, error, loading, language, setLanguage, t }) {
  const [username, setUsername] = useState("ivan");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await onLogin(username, password);
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <FlagSelector language={language} setLanguage={setLanguage} centered />
        <img src="/images/logo.png" alt="Puntapié" className="login-logo" />
        <h1>Calzados Puntapié SL</h1>
        <p>{t.welcome}</p>

        <form onSubmit={submit} className="login-form">
          <select value={username} onChange={(e) => setUsername(e.target.value)}>
            {USERS.map((user) => (
              <option key={user.value} value={user.value}>{user.label}</option>
            ))}
          </select>
          <input
            placeholder={t.password}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? <div className="error-box">{error}</div> : null}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? t.loadingLogin : t.login}
          </button>
        </form>
      </div>
    </div>
  );
}

function DesktopCustomerModal({ open, onClose, onSubmit, t }) {
  const [form, setForm] = useState({
    nombre: "",
    cumple_dia: "",
    cumple_mes: "",
    telefono: "",
    email: "",
    nacionalidad: "España",
    compra: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        nombre: "",
        cumple_dia: "",
        cumple_mes: "",
        telefono: "",
        email: "",
        nacionalidad: "España",
        compra: "",
      });
      setError("");
      setSaving(false);
    }
  }, [open]);

  if (!open) return null;

  const payload = {
    ...form,
    fecha_nacimiento: form.cumple_dia && form.cumple_mes ? `${form.cumple_dia}/${form.cumple_mes}` : "",
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header sticky">
          <div>
            <h2>{t.newClientTitle}</h2>
            <p>{t.newClientSubtitle}</p>
          </div>
          <button className="ghost-button" type="button" onClick={onClose}>
            {t.cancel}
          </button>
        </div>

        <div className="modal-content-scroll">
          <form className="modal-grid" onSubmit={submit}>
            <label className="field">
              <span>{t.name}</span>
              <input value={form.nombre} required onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </label>

            <div className="field">
              <span>{t.birthday}</span>
              <div className="birthday-row">
                <select value={form.cumple_dia} onChange={(e) => setForm({ ...form, cumple_dia: e.target.value })}>
                  <option value="">{t.birthdayDay}</option>
                  {days.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <select value={form.cumple_mes} onChange={(e) => setForm({ ...form, cumple_mes: e.target.value })}>
                  <option value="">{t.birthdayMonth}</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <label className="field">
              <span>{t.phone}</span>
              <input value={form.telefono} required onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            </label>
            <label className="field">
              <span>{t.email}</span>
              <input type="email" value={form.email} required onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label className="field">
              <span>{t.nationality}</span>
              <select value={form.nacionalidad} onChange={(e) => setForm({ ...form, nacionalidad: e.target.value })}>
                {nationalities.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="field field-span">
              <span>{t.purchase}</span>
              <input value={form.compra} onChange={(e) => setForm({ ...form, compra: e.target.value })} />
            </label>

            {error ? <div className="error-box field-span">{error}</div> : null}

            <div className="modal-actions field-span">
              <button className="ghost-button" type="button" onClick={onClose}>{t.cancel}</button>
              <button className="primary-button" type="submit" disabled={saving}>
                {saving ? "…" : t.saveClient}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function MobileCustomerScreen({ open, onClose, onSubmit, t }) {
  const [form, setForm] = useState({
    nombre: "",
    cumple_dia: "",
    cumple_mes: "",
    telefono: "",
    email: "",
    nacionalidad: "España",
    compra: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        nombre: "",
        cumple_dia: "",
        cumple_mes: "",
        telefono: "",
        email: "",
        nacionalidad: "España",
        compra: "",
      });
      setError("");
      setSaving(false);
    }
  }, [open]);

  if (!open) return null;

  const payload = {
    ...form,
    fecha_nacimiento: form.cumple_dia && form.cumple_mes ? `${form.cumple_dia}/${form.cumple_mes}` : "",
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="customer-screen">
      <div className="customer-screen__header">
        <div>
          <h2>{t.newClientTitle}</h2>
          <p>{t.newClientSubtitle}</p>
        </div>
        <button className="ghost-button" type="button" onClick={onClose}>{t.cancel}</button>
      </div>

      <form className="customer-screen__body" onSubmit={submit}>
        <label className="field">
          <span>{t.name}</span>
          <input value={form.nombre} required onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        </label>

        <div className="field">
          <span>{t.birthday}</span>
          <div className="birthday-row mobile-birthday-row">
            <select value={form.cumple_dia} onChange={(e) => setForm({ ...form, cumple_dia: e.target.value })}>
              <option value="">{t.birthdayDay}</option>
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select value={form.cumple_mes} onChange={(e) => setForm({ ...form, cumple_mes: e.target.value })}>
              <option value="">{t.birthdayMonth}</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
        </div>

        <label className="field">
          <span>{t.phone}</span>
          <input value={form.telefono} required onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
        </label>

        <label className="field">
          <span>{t.email}</span>
          <input type="email" value={form.email} required onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>

        <label className="field">
          <span>{t.nationality}</span>
          <select value={form.nacionalidad} onChange={(e) => setForm({ ...form, nacionalidad: e.target.value })}>
            {nationalities.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>{t.purchase}</span>
          <input value={form.compra} onChange={(e) => setForm({ ...form, compra: e.target.value })} />
        </label>

        {error ? <div className="error-box">{error}</div> : null}

        <div className="customer-screen__footer">
          <button className="ghost-button" type="button" onClick={onClose}>{t.cancel}</button>
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "…" : t.saveClient}
          </button>
        </div>
      </form>
    </div>
  );
}

function StatsModal({ open, onClose, stats, t }) {
  if (!open || !stats) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="stats-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header sticky">
          <div>
            <h2>{t.statsTitle}</h2>
            <p>{t.statsSubtitle}</p>
          </div>
          <button className="ghost-button" type="button" onClick={onClose}>
            {t.close}
          </button>
        </div>

        <div className="stats-grid modal-content-scroll">
          <StatBars title={t.nationalityDistribution} data={mapToArray(stats.nationality_distribution)} />
          <StatBars title={t.ageDistribution} data={mapToArray(stats.age_distribution)} />
          <StatBars title={t.dayLastMonth} data={mapToArray(stats.daily_last_month)} />
          <StatBars title={t.monthLastYear} data={mapToArray(stats.monthly_last_year)} />
          <SummaryCard
            title={t.topBottomDays}
            topLabel={stats.top_day?.label || "—"}
            topValue={stats.top_day?.value || 0}
            bottomLabel={stats.bottom_day?.label || "—"}
            bottomValue={stats.bottom_day?.value || 0}
            t={t}
          />
          <SummaryCard
            title={t.topBottomHours}
            topLabel={stats.top_hour?.label || "—"}
            topValue={stats.top_hour?.value || 0}
            bottomLabel={stats.bottom_hour?.label || "—"}
            bottomValue={stats.bottom_hour?.value || 0}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState("es");
  const [auth, setAuth] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState("");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const t = translations[language] || translations.es;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("modal-open", showCustomerModal || showStatsModal);
    return () => document.body.classList.remove("modal-open");
  }, [showCustomerModal, showStatsModal]);

  useEffect(() => {
    if (!flash) return;
    const timer = setTimeout(() => setFlash(""), 2500);
    return () => clearTimeout(timer);
  }, [flash]);

  const loadData = async (session) => {
    setLoading(true);
    try {
      const clientesData = await getClientes(session.token);
      setClientes(clientesData);
      if (session.role === "admin") {
        const statsData = await getStats(session.token);
        setStats(statsData);
      } else {
        setStats(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username, password) => {
    setLoginLoading(true);
    setLoginError("");
    try {
      const session = await login(username, password);
      setAuth(session);
      await loadData(session);
    } catch (err) {
      setLoginError(err.message || "Error");
    } finally {
      setLoginLoading(false);
    }
  };

  const filteredClientes = useMemo(() => {
    const q = activeSearch.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter((item) =>
      [item.nombre, item.email, item.telefono]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [clientes, activeSearch]);

  const handleCreate = async (payload) => {
    await createCliente(auth.token, payload);
    await loadData(auth);
    setShowCustomerModal(false);
    setFlash(t.clientRegistered);
  };

  const handleExport = async () => {
    const blob = await exportExcel(auth.token);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clientes.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const result = await importExcel(auth.token, file);
    await loadData(auth);
    setFlash(`${result.insertados} insertados · ${result.omitidos} omitidos`);
    event.target.value = "";
  };

  const clearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
  };

  if (!auth) {
    return (
      <LoginPage
        onLogin={handleLogin}
        error={loginError}
        loading={loginLoading}
        language={language}
        setLanguage={setLanguage}
        t={t}
      />
    );
  }

  return (
    <div className="page-shell">
      <main className="container">
        <section className="hero-card">
          <div className="hero-header-row">
            <div className="hero-brand">
              <div className="logo-tile">
                <img src="/images/logo.png" alt="Puntapié" className="brand-logo" />
              </div>
              <div>
                <FlagSelector language={language} setLanguage={setLanguage} />
                <h1>Clientes Puntapié</h1>
                <p>
                  {t.sessionAs} <strong>{auth.username}</strong> · {t.role} <strong>{auth.role}</strong>
                </p>
              </div>
            </div>
            <button className="ghost-button" onClick={() => setAuth(null)}>{t.logout}</button>
          </div>

          <div className="hero-actions">
            <div className="search-box">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setActiveSearch(searchInput)}
                placeholder={t.search}
              />
              <button className="search-button" onClick={() => setActiveSearch(searchInput)} type="button">
                {t.searchButton}
              </button>
              <button className="search-button secondary-light" onClick={clearSearch} type="button">
                {t.clearButton}
              </button>
            </div>

            <div className="action-buttons">
              <button className="primary-button" onClick={() => setShowCustomerModal(true)}>
                {t.newClient}
              </button>
              {auth.role === "admin" ? (
                <>
                  <button className="secondary-button" onClick={() => setShowStatsModal(true)}>
                    {t.statistics}
                  </button>
                  <button className="secondary-button" onClick={handleExport}>
                    {t.exportExcel}
                  </button>
                  <label className="secondary-button file-button">
                    {t.importExcel}
                    <input type="file" accept=".xlsx" onChange={handleImport} />
                  </label>
                </>
              ) : null}
            </div>
          </div>
        </section>

        {flash ? <div className="flash-success">{flash}</div> : null}

        <section className="list-card">
          <div className="section-head">
            <div>
              <h2>{t.clients}</h2>
              <p>{t.allClients}</p>
            </div>
          </div>

          <div className="table-head">
            <span>{t.customer}</span>
            <span>{t.contact}</span>
            <span>{t.nationality}</span>
            <span>{t.registered}</span>
          </div>

          <div className="table-body">
            {loading ? (
              <div className="empty-state">{t.loading}</div>
            ) : filteredClientes.length === 0 ? (
              <div className="empty-state">{t.noClients}</div>
            ) : (
              filteredClientes.map((cliente) => (
                <article className="table-row" key={cliente.id}>
                  <div className="row-main">
                    <strong>{cliente.nombre}</strong>
                    <span>{cliente.compra || "—"}</span>
                  </div>
                  <div className="row-contact">
                    <span>{cliente.email}</span>
                    <span>{cliente.telefono}</span>
                  </div>
                  <div className="row-nationality">
                    <span className="pill">{cliente.nacionalidad || "—"}</span>
                  </div>
                  <div className="row-date">{formatDate(cliente.created_at)}</div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      {isMobile ? (
        <MobileCustomerScreen
          open={showCustomerModal}
          onClose={() => setShowCustomerModal(false)}
          onSubmit={handleCreate}
          t={t}
        />
      ) : (
        <DesktopCustomerModal
          open={showCustomerModal}
          onClose={() => setShowCustomerModal(false)}
          onSubmit={handleCreate}
          t={t}
        />
      )}

      {auth.role === "admin" ? (
        <StatsModal
          open={showStatsModal}
          onClose={() => setShowStatsModal(false)}
          stats={stats}
          t={t}
        />
      ) : null}
    </div>
  );
}
