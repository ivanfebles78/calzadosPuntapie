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

const translations = {
  es: {
    welcome: "Accede a la plataforma de clientes",
    user: "Usuario",
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
    noData: "Sin datos",
    newClientTitle: "Nuevo cliente",
    newClientSubtitle: "Recoge los datos del cliente y evita duplicados automáticamente.",
    name: "Nombre",
    birthDate: "Fecha de nacimiento",
    phone: "Teléfono",
    email: "Email",
    purchase: "Compra / ticket",
  },
  en: {
    welcome: "Access the customer platform",
    user: "User",
    password: "Password",
    login: "Sign in",
    loadingLogin: "Signing in…",
    search: "Search by name, email or phone…",
    searchButton: "Search",
    clearButton: "Clear",
    newClient: "New customer",
    statistics: "Statistics",
    exportExcel: "Export Excel",
    importExcel: "Import Excel",
    clients: "Customers",
    allClients: "Full list of registered customers",
    customer: "Customer",
    contact: "Contact",
    nationality: "Nationality",
    registered: "Registered",
    noClients: "No customers registered.",
    loading: "Loading…",
    logout: "Logout",
    sessionAs: "Logged in as",
    role: "role",
    saveClient: "Save customer",
    cancel: "Cancel",
    close: "Close",
    clientRegistered: "Customer registered successfully.",
    statsTitle: "Statistics",
    statsSubtitle: "Visual analysis of customers and registrations",
    nationalityDistribution: "Nationality distribution",
    ageDistribution: "Age distribution",
    dayLastMonth: "Registrations by day for the last month",
    monthLastYear: "Registrations by month for the last year",
    topBottomDays: "Highest and lowest registration days",
    topBottomHours: "Highest and lowest registration time slots",
    highest: "Highest",
    lowest: "Lowest",
    noData: "No data",
    newClientTitle: "New customer",
    newClientSubtitle: "Collect customer details and avoid duplicates automatically.",
    name: "Name",
    birthDate: "Birth date",
    phone: "Phone",
    email: "Email",
    purchase: "Purchase / receipt",
  },
  fr: {
    welcome: "Accédez à la plateforme clients",
    user: "Utilisateur",
    password: "Mot de passe",
    login: "Entrer",
    loadingLogin: "Connexion…",
    search: "Rechercher par nom, email ou téléphone…",
    searchButton: "Rechercher",
    clearButton: "Effacer",
    newClient: "Nouveau client",
    statistics: "Statistiques",
    exportExcel: "Exporter Excel",
    importExcel: "Importer Excel",
    clients: "Clients",
    allClients: "Liste complète des clients enregistrés",
    customer: "Client",
    contact: "Contact",
    nationality: "Nationalité",
    registered: "Enregistrement",
    noClients: "Aucun client enregistré.",
    loading: "Chargement…",
    logout: "Quitter",
    sessionAs: "Session ouverte comme",
    role: "rôle",
    saveClient: "Enregistrer le client",
    cancel: "Annuler",
    close: "Fermer",
    clientRegistered: "Client enregistré avec succès.",
    statsTitle: "Statistiques",
    statsSubtitle: "Analyse visuelle des clients et des inscriptions",
    nationalityDistribution: "Répartition par nationalité",
    ageDistribution: "Répartition par âge",
    dayLastMonth: "Inscriptions par jour du dernier mois",
    monthLastYear: "Inscriptions par mois de la dernière année",
    topBottomDays: "Jours de plus et moins d’inscriptions",
    topBottomHours: "Tranches horaires de plus et moins d’inscriptions",
    highest: "Plus élevé",
    lowest: "Plus faible",
    noData: "Pas de données",
    newClientTitle: "Nouveau client",
    newClientSubtitle: "Collectez les données du client et évitez automatiquement les doublons.",
    name: "Nom",
    birthDate: "Date de naissance",
    phone: "Téléphone",
    email: "Email",
    purchase: "Achat / ticket",
  },
  de: {
    welcome: "Zugriff auf die Kundenplattform",
    user: "Benutzer",
    password: "Passwort",
    login: "Anmelden",
    loadingLogin: "Anmeldung…",
    search: "Nach Name, E-Mail oder Telefon suchen…",
    searchButton: "Suchen",
    clearButton: "Zurücksetzen",
    newClient: "Neuer Kunde",
    statistics: "Statistiken",
    exportExcel: "Excel exportieren",
    importExcel: "Excel importieren",
    clients: "Kunden",
    allClients: "Vollständige Liste registrierter Kunden",
    customer: "Kunde",
    contact: "Kontakt",
    nationality: "Nationalität",
    registered: "Registriert",
    noClients: "Keine Kunden registriert.",
    loading: "Laden…",
    logout: "Abmelden",
    sessionAs: "Angemeldet als",
    role: "Rolle",
    saveClient: "Kunde speichern",
    cancel: "Abbrechen",
    close: "Schließen",
    clientRegistered: "Kunde erfolgreich registriert.",
    statsTitle: "Statistiken",
    statsSubtitle: "Visuelle Analyse von Kunden und Registrierungen",
    nationalityDistribution: "Verteilung nach Nationalität",
    ageDistribution: "Verteilung nach Alter",
    dayLastMonth: "Registrierungen pro Tag im letzten Monat",
    monthLastYear: "Registrierungen pro Monat im letzten Jahr",
    topBottomDays: "Tage mit den meisten und wenigsten Registrierungen",
    topBottomHours: "Zeitfenster mit den meisten und wenigsten Registrierungen",
    highest: "Höchste",
    lowest: "Niedrigste",
    noData: "Keine Daten",
    newClientTitle: "Neuer Kunde",
    newClientSubtitle: "Erfassen Sie Kundendaten und vermeiden Sie automatisch Duplikate.",
    name: "Name",
    birthDate: "Geburtsdatum",
    phone: "Telefon",
    email: "E-Mail",
    purchase: "Kauf / Beleg",
  },
  ru: {
    welcome: "Вход в платформу клиентов",
    user: "Пользователь",
    password: "Пароль",
    login: "Войти",
    loadingLogin: "Вход…",
    search: "Поиск по имени, email или телефону…",
    searchButton: "Поиск",
    clearButton: "Очистить",
    newClient: "Новый клиент",
    statistics: "Статистика",
    exportExcel: "Экспорт Excel",
    importExcel: "Импорт Excel",
    clients: "Клиенты",
    allClients: "Полный список зарегистрированных клиентов",
    customer: "Клиент",
    contact: "Контакт",
    nationality: "Национальность",
    registered: "Регистрация",
    noClients: "Клиентов нет.",
    loading: "Загрузка…",
    logout: "Выход",
    sessionAs: "Вы вошли как",
    role: "роль",
    saveClient: "Сохранить клиента",
    cancel: "Отмена",
    close: "Закрыть",
    clientRegistered: "Клиент успешно зарегистрирован.",
    statsTitle: "Статистика",
    statsSubtitle: "Визуальный анализ клиентов и регистраций",
    nationalityDistribution: "Распределение по национальности",
    ageDistribution: "Распределение по возрасту",
    dayLastMonth: "Регистрации по дням за последний месяц",
    monthLastYear: "Регистрации по месяцам за последний год",
    topBottomDays: "Дни с максимальной и минимальной регистрацией",
    topBottomHours: "Часы с максимальной и минимальной регистрацией",
    highest: "Максимум",
    lowest: "Минимум",
    noData: "Нет данных",
    newClientTitle: "Новый клиент",
    newClientSubtitle: "Соберите данные клиента и автоматически избегайте дублей.",
    name: "Имя",
    birthDate: "Дата рождения",
    phone: "Телефон",
    email: "Email",
    purchase: "Покупка / чек",
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
                <div
                  className="chart-bar"
                  style={{ width: `${Math.max((item.value / max) * 100, 6)}%` }}
                />
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
        <h1>Calzados Puntapié</h1>
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

function CustomerModal({ open, onClose, onSubmit, t }) {
  const [form, setForm] = useState({
    nombre: "",
    fecha_nacimiento: "",
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
        fecha_nacimiento: "",
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

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{t.newClientTitle}</h2>
            <p>{t.newClientSubtitle}</p>
          </div>
          <button className="ghost-button" type="button" onClick={onClose}>
            {t.cancel}
          </button>
        </div>

        <form className="modal-grid" onSubmit={submit}>
          <label className="field">
            <span>{t.name}</span>
            <input value={form.nombre} required onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </label>
          <label className="field">
            <span>{t.birthDate}</span>
            <input type="date" value={form.fecha_nacimiento} onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })} />
          </label>
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

          {error ? <div className="error-box">{error}</div> : null}

          <div className="modal-actions">
            <button className="ghost-button" type="button" onClick={onClose}>{t.cancel}</button>
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? "…" : t.saveClient}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatsModal({ open, onClose, stats, t }) {
  if (!open || !stats) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="stats-modal-card scrollable" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header sticky">
          <div>
            <h2>{t.statsTitle}</h2>
            <p>{t.statsSubtitle}</p>
          </div>
          <button className="ghost-button" type="button" onClick={onClose}>
            {t.close}
          </button>
        </div>

        <div className="stats-grid">
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

  const t = translations[language] || translations.es;

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

      <CustomerModal
        open={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSubmit={handleCreate}
        t={t}
      />

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
