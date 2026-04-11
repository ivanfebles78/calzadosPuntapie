import React, { useEffect, useMemo, useState } from "react";
import {
  createCliente,
  deleteCliente,
  exportExcel,
  getClientes,
  getStats,
  importExcel,
  login,
  updateCliente,
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
    password: "Contraseña", login: "Entrar", loadingLogin: "Entrando…",
    search: "Buscar por nombre, email o teléfono…", searchButton: "Buscar", clearButton: "Limpiar",
    newClient: "Nuevo cliente", statistics: "Estadísticas", exportExcel: "Exportar Excel", importExcel: "Importar Excel",
    clients: "Clientes", allClients: "Listado completo de clientes registrados",
    customer: "Cliente", contact: "Contacto", nationality: "Nacionalidad", registered: "Registro",
    noClients: "No hay clientes registrados.", loading: "Cargando…",
    logout: "Salir", sessionAs: "Sesión iniciada como", role: "rol",
    saveClient: "Guardar cliente", cancel: "Cancelar", close: "Cerrar",
    clientRegistered: "Cliente registrado correctamente.",
    clientUpdated: "Cliente actualizado correctamente.",
    clientDeleted: "Cliente eliminado correctamente.",
    editClient: "Editar cliente", deleteClient: "Eliminar",
    confirmDelete: "¿Eliminar este cliente? Esta acción no se puede deshacer.",
    confirm: "Sí, eliminar",
    statsTitle: "Estadísticas", statsSubtitle: "Análisis visual de clientes y registros",
    nationalityDistribution: "Distribución por nacionalidad", ageDistribution: "Distribución por edad",
    dayLastMonth: "Registros por día del último mes", monthLastYear: "Registros por mes del último año",
    topBottomDays: "Días de mayor y menor registro", topBottomHours: "Franja horaria de mayor y menor registro",
    highest: "Mayor", lowest: "Menor",
    newClientTitle: "Nuevo cliente", newClientSubtitle: "Recoge los datos del cliente y evita duplicados automáticamente.",
    editClientTitle: "Editar cliente", editClientSubtitle: "Modifica los datos del cliente.",
    name: "Nombre", birthday: "Cumpleaños", birthdayDay: "Día", birthdayMonth: "Mes",
    phone: "Teléfono", email: "Email", purchase: "Compra / ticket",
    fieldRequired: "Campo requerido",
    months: [
      { value: "01", label: "Enero" }, { value: "02", label: "Febrero" }, { value: "03", label: "Marzo" },
      { value: "04", label: "Abril" }, { value: "05", label: "Mayo" }, { value: "06", label: "Junio" },
      { value: "07", label: "Julio" }, { value: "08", label: "Agosto" }, { value: "09", label: "Septiembre" },
      { value: "10", label: "Octubre" }, { value: "11", label: "Noviembre" }, { value: "12", label: "Diciembre" },
    ],
  },
  en: {
    welcome: "Access the customer platform",
    password: "Password", login: "Log in", loadingLogin: "Signing in…",
    search: "Search by name, email or phone…", searchButton: "Search", clearButton: "Clear",
    newClient: "New customer", statistics: "Statistics", exportExcel: "Export Excel", importExcel: "Import Excel",
    clients: "Customers", allClients: "Full list of registered customers",
    customer: "Customer", contact: "Contact", nationality: "Nationality", registered: "Registered",
    noClients: "No customers registered.", loading: "Loading…",
    logout: "Log out", sessionAs: "Logged in as", role: "role",
    saveClient: "Save customer", cancel: "Cancel", close: "Close",
    clientRegistered: "Customer registered successfully.",
    clientUpdated: "Customer updated successfully.",
    clientDeleted: "Customer deleted successfully.",
    editClient: "Edit customer", deleteClient: "Delete",
    confirmDelete: "Delete this customer? This action cannot be undone.",
    confirm: "Yes, delete",
    statsTitle: "Statistics", statsSubtitle: "Visual analysis of customers and registrations",
    nationalityDistribution: "Distribution by nationality", ageDistribution: "Distribution by age",
    dayLastMonth: "Registrations by day in the last month", monthLastYear: "Registrations by month in the last year",
    topBottomDays: "Highest and lowest registration days", topBottomHours: "Highest and lowest registration time slots",
    highest: "Highest", lowest: "Lowest",
    newClientTitle: "New customer", newClientSubtitle: "Collect customer data and automatically prevent duplicates.",
    editClientTitle: "Edit customer", editClientSubtitle: "Modify customer data.",
    name: "Name", birthday: "Birthday", birthdayDay: "Day", birthdayMonth: "Month",
    phone: "Phone", email: "Email", purchase: "Purchase / ticket",
    fieldRequired: "Required field",
    months: [
      { value: "01", label: "January" }, { value: "02", label: "February" }, { value: "03", label: "March" },
      { value: "04", label: "April" }, { value: "05", label: "May" }, { value: "06", label: "June" },
      { value: "07", label: "July" }, { value: "08", label: "August" }, { value: "09", label: "September" },
      { value: "10", label: "October" }, { value: "11", label: "November" }, { value: "12", label: "December" },
    ],
  },
  fr: {
    welcome: "Accédez à la plateforme clients",
    password: "Mot de passe", login: "Se connecter", loadingLogin: "Connexion…",
    search: "Rechercher par nom, e-mail ou téléphone…", searchButton: "Rechercher", clearButton: "Effacer",
    newClient: "Nouveau client", statistics: "Statistiques", exportExcel: "Exporter Excel", importExcel: "Importer Excel",
    clients: "Clients", allClients: "Liste complète des clients enregistrés",
    customer: "Client", contact: "Contact", nationality: "Nationalité", registered: "Enregistré",
    noClients: "Aucun client enregistré.", loading: "Chargement…",
    logout: "Déconnexion", sessionAs: "Connecté en tant que", role: "rôle",
    saveClient: "Enregistrer le client", cancel: "Annuler", close: "Fermer",
    clientRegistered: "Client enregistré avec succès.",
    clientUpdated: "Client mis à jour avec succès.",
    clientDeleted: "Client supprimé avec succès.",
    editClient: "Modifier le client", deleteClient: "Supprimer",
    confirmDelete: "Supprimer ce client ? Cette action est irréversible.",
    confirm: "Oui, supprimer",
    statsTitle: "Statistiques", statsSubtitle: "Analyse visuelle des clients et des inscriptions",
    nationalityDistribution: "Répartition par nationalité", ageDistribution: "Répartition par âge",
    dayLastMonth: "Inscriptions par jour du dernier mois", monthLastYear: "Inscriptions par mois de la dernière année",
    topBottomDays: "Jours avec le plus et le moins d'inscriptions", topBottomHours: "Plages horaires avec le plus et le moins d'inscriptions",
    highest: "Plus élevé", lowest: "Plus faible",
    newClientTitle: "Nouveau client", newClientSubtitle: "Collectez les données du client et évitez automatiquement les doublons.",
    editClientTitle: "Modifier le client", editClientSubtitle: "Modifiez les données du client.",
    name: "Nom", birthday: "Anniversaire", birthdayDay: "Jour", birthdayMonth: "Mois",
    phone: "Téléphone", email: "E-mail", purchase: "Achat / ticket",
    fieldRequired: "Champ obligatoire",
    months: [
      { value: "01", label: "Janvier" }, { value: "02", label: "Février" }, { value: "03", label: "Mars" },
      { value: "04", label: "Avril" }, { value: "05", label: "Mai" }, { value: "06", label: "Juin" },
      { value: "07", label: "Juillet" }, { value: "08", label: "Août" }, { value: "09", label: "Septembre" },
      { value: "10", label: "Octobre" }, { value: "11", label: "Novembre" }, { value: "12", label: "Décembre" },
    ],
  },
  de: {
    welcome: "Zugriff auf die Kundenplattform",
    password: "Passwort", login: "Anmelden", loadingLogin: "Anmeldung…",
    search: "Nach Name, E-Mail oder Telefon suchen…", searchButton: "Suchen", clearButton: "Zurücksetzen",
    newClient: "Neuer Kunde", statistics: "Statistiken", exportExcel: "Excel exportieren", importExcel: "Excel importieren",
    clients: "Kunden", allClients: "Vollständige Liste der registrierten Kunden",
    customer: "Kunde", contact: "Kontakt", nationality: "Nationalität", registered: "Registriert",
    noClients: "Keine Kunden registriert.", loading: "Laden…",
    logout: "Abmelden", sessionAs: "Angemeldet als", role: "Rolle",
    saveClient: "Kunde speichern", cancel: "Abbrechen", close: "Schließen",
    clientRegistered: "Kunde erfolgreich registriert.",
    clientUpdated: "Kunde erfolgreich aktualisiert.",
    clientDeleted: "Kunde erfolgreich gelöscht.",
    editClient: "Kunde bearbeiten", deleteClient: "Löschen",
    confirmDelete: "Diesen Kunden löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
    confirm: "Ja, löschen",
    statsTitle: "Statistiken", statsSubtitle: "Visuelle Analyse von Kunden und Registrierungen",
    nationalityDistribution: "Verteilung nach Nationalität", ageDistribution: "Verteilung nach Alter",
    dayLastMonth: "Registrierungen pro Tag im letzten Monat", monthLastYear: "Registrierungen pro Monat im letzten Jahr",
    topBottomDays: "Tage mit den meisten und wenigsten Registrierungen", topBottomHours: "Zeitfenster mit den meisten und wenigsten Registrierungen",
    highest: "Höchste", lowest: "Niedrigste",
    newClientTitle: "Neuer Kunde", newClientSubtitle: "Erfassen Sie Kundendaten und vermeiden Sie automatisch Duplikate.",
    editClientTitle: "Kunde bearbeiten", editClientSubtitle: "Kundendaten ändern.",
    name: "Name", birthday: "Geburtstag", birthdayDay: "Tag", birthdayMonth: "Monat",
    phone: "Telefon", email: "E-Mail", purchase: "Kauf / Beleg",
    fieldRequired: "Pflichtfeld",
    months: [
      { value: "01", label: "Januar" }, { value: "02", label: "Februar" }, { value: "03", label: "März" },
      { value: "04", label: "April" }, { value: "05", label: "Mai" }, { value: "06", label: "Juni" },
      { value: "07", label: "Juli" }, { value: "08", label: "August" }, { value: "09", label: "September" },
      { value: "10", label: "Oktober" }, { value: "11", label: "November" }, { value: "12", label: "Dezember" },
    ],
  },
  ru: {
    welcome: "Вход в клиентскую платформу",
    password: "Пароль", login: "Войти", loadingLogin: "Вход…",
    search: "Поиск по имени, email или телефону…", searchButton: "Поиск", clearButton: "Очистить",
    newClient: "Новый клиент", statistics: "Статистика", exportExcel: "Экспорт в Excel", importExcel: "Импорт из Excel",
    clients: "Клиенты", allClients: "Полный список зарегистрированных клиентов",
    customer: "Клиент", contact: "Контакт", nationality: "Национальность", registered: "Дата регистрации",
    noClients: "Нет зарегистрированных клиентов.", loading: "Загрузка…",
    logout: "Выйти", sessionAs: "Вы вошли как", role: "роль",
    saveClient: "Сохранить клиента", cancel: "Отмена", close: "Закрыть",
    clientRegistered: "Клиент успешно зарегистрирован.",
    clientUpdated: "Клиент успешно обновлён.",
    clientDeleted: "Клиент успешно удалён.",
    editClient: "Редактировать клиента", deleteClient: "Удалить",
    confirmDelete: "Удалить этого клиента? Это действие нельзя отменить.",
    confirm: "Да, удалить",
    statsTitle: "Статистика", statsSubtitle: "Визуальный анализ клиентов и регистраций",
    nationalityDistribution: "Распределение по национальности", ageDistribution: "Распределение по возрасту",
    dayLastMonth: "Регистрации по дням за последний месяц", monthLastYear: "Регистрации по месяцам за последний год",
    topBottomDays: "Дни с наибольшим и наименьшим числом регистраций", topBottomHours: "Часы с наибольшим и наименьшим числом регистраций",
    highest: "Максимум", lowest: "Минимум",
    newClientTitle: "Новый клиент", newClientSubtitle: "Соберите данные клиента и автоматически избегайте дубликатов.",
    editClientTitle: "Редактировать клиента", editClientSubtitle: "Измените данные клиента.",
    name: "Имя", birthday: "День рождения", birthdayDay: "День", birthdayMonth: "Месяц",
    phone: "Телефон", email: "Email", purchase: "Покупка / чек",
    fieldRequired: "Обязательное поле",
    months: [
      { value: "01", label: "Январь" }, { value: "02", label: "Февраль" }, { value: "03", label: "Март" },
      { value: "04", label: "Апрель" }, { value: "05", label: "Май" }, { value: "06", label: "Июнь" },
      { value: "07", label: "Июль" }, { value: "08", label: "Август" }, { value: "09", label: "Сентябрь" },
      { value: "10", label: "Октябрь" }, { value: "11", label: "Ноябрь" }, { value: "12", label: "Декабрь" },
    ],
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

function getDaysInMonth(monthValue) {
  const month = Number(monthValue);
  if (!month) return 31;
  return new Date(2025, month, 0).getDate();
}

function getAvailableDays(monthValue) {
  const totalDays = getDaysInMonth(monthValue);
  return Array.from({ length: totalDays }, (_, i) => String(i + 1).padStart(2, "0"));
}

// ── Shared form hook ─────────────────────────────────────────────────────────
function useCustomerForm(open, initialData = null) {
  const empty = { nombre: "", cumple_dia: "", cumple_mes: "", telefono: "", email: "", nacionalidad: "España", compra: "" };

  function dataToForm(d) {
    if (!d) return empty;
    let cumple_dia = "", cumple_mes = "";
    if (d.fecha_nacimiento) {
      const parts = d.fecha_nacimiento.split("/");
      if (parts.length === 2) { cumple_dia = parts[0]; cumple_mes = parts[1]; }
    }
    return { nombre: d.nombre || "", cumple_dia, cumple_mes, telefono: d.telefono || "", email: d.email || "", nacionalidad: d.nacionalidad || "España", compra: d.compra || "" };
  }

  const [form, setForm] = useState(empty);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(dataToForm(initialData));
      setTouched({});
      setError("");
      setSaving(false);
    }
  }, [open]);

  const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }));
  const touchAll = () => setTouched({ nombre: true, telefono: true });

  const availableDays = useMemo(() => getAvailableDays(form.cumple_mes), [form.cumple_mes]);

  useEffect(() => {
    if (!form.cumple_dia) return;
    if (Number(form.cumple_dia) > getDaysInMonth(form.cumple_mes)) {
      setForm((prev) => ({ ...prev, cumple_dia: "" }));
    }
  }, [form.cumple_mes, form.cumple_dia]);

  const handleMonthChange = (value) => {
    setForm((prev) => {
      const maxDay = getDaysInMonth(value);
      return { ...prev, cumple_mes: value, cumple_dia: prev.cumple_dia && Number(prev.cumple_dia) <= maxDay ? prev.cumple_dia : "" };
    });
  };

  const payload = {
    nombre: (form.nombre || "").trim(),
    telefono: (form.telefono || "").trim(),
    email: (form.email || "").trim() || null,
    compra: (form.compra || "").trim() || null,
    nacionalidad: form.nacionalidad,
    fecha_nacimiento: form.cumple_dia && form.cumple_mes ? `${form.cumple_dia}/${form.cumple_mes}` : null,
  };

  const fieldError = (field) => touched[field] && !form[field].trim() ? true : false;

  return { form, setForm, touched, touch, touchAll, error, setError, saving, setSaving, payload, availableDays, handleMonthChange, fieldError };
}

// ── Shared form fields ───────────────────────────────────────────────────────
function CustomerFormFields({ form, setForm, touch, fieldError, availableDays, handleMonthChange, t }) {
  const inp = {
    display: "block", width: "100%", boxSizing: "border-box",
    height: "50px", margin: 0, padding: "0 14px",
    borderRadius: "14px", border: "2px solid #8aa5c7",
    background: "#fff", color: "#09111d", fontSize: "16px", fontFamily: "inherit",
    WebkitAppearance: "none", appearance: "none",
  };
  const inpErr = { ...inp, border: "2px solid #ef4444" };
  const lbl = { display: "block", color: "#f1f6ff", fontWeight: 600, fontSize: "14px", marginBottom: "6px" };
  const req = { color: "#ef4444", marginLeft: "3px" };
  const errMsg = { color: "#fca5a5", fontSize: "12px", marginTop: "4px" };
  const fld = { width: "100%", marginBottom: "14px" };

  return (
    <>
      <div style={fld}>
        <label style={lbl}>{t.name}<span style={req}>*</span></label>
        <input style={fieldError("nombre") ? inpErr : inp} value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          onBlur={() => touch("nombre")} />
        {fieldError("nombre") && <div style={errMsg}>{t.fieldRequired}</div>}
      </div>

      <div style={fld}>
        <label style={lbl}>{t.birthday}</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "10px" }}>
          <select style={inp} value={form.cumple_dia} onChange={(e) => setForm({ ...form, cumple_dia: e.target.value })}>
            <option value="">{t.birthdayDay}</option>
            {availableDays.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select style={inp} value={form.cumple_mes} onChange={(e) => handleMonthChange(e.target.value)}>
            <option value="">{t.birthdayMonth}</option>
            {t.months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
      </div>

      <div style={fld}>
        <label style={lbl}>{t.phone}<span style={req}>*</span></label>
        <input style={fieldError("telefono") ? inpErr : inp} value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          onBlur={() => touch("telefono")} />
        {fieldError("telefono") && <div style={errMsg}>{t.fieldRequired}</div>}
      </div>

      <div style={fld}>
        <label style={lbl}>{t.email}</label>
        <input style={inp} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>

      <div style={fld}>
        <label style={lbl}>{t.nationality}</label>
        <select style={inp} value={form.nacionalidad} onChange={(e) => setForm({ ...form, nacionalidad: e.target.value })}>
          {nationalities.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div style={fld}>
        <label style={lbl}>{t.purchase}</label>
        <input style={inp} value={form.compra} onChange={(e) => setForm({ ...form, compra: e.target.value })} />
      </div>
    </>
  );
}

// ── Delete confirmation modal ────────────────────────────────────────────────
function ConfirmDeleteModal({ open, onCancel, onConfirm, t }) {
  if (!open) return null;
  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, background: "rgba(3,10,20,0.88)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(440px,100%)", background: "linear-gradient(180deg,#10203b,#0b1628)", border: "2px solid rgba(255,255,255,0.15)", borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700 }}>⚠ {t.deleteClient}</div>
        <div style={{ color: "#d4deea", fontSize: "0.95rem", lineHeight: 1.5 }}>{t.confirmDelete}</div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ height: "48px", padding: "0 20px", borderRadius: "14px", border: "2px solid #7aa2d1", background: "#132746", color: "#fff", fontWeight: 700, cursor: "pointer" }}>{t.cancel}</button>
          <button onClick={onConfirm} style={{ height: "48px", padding: "0 20px", borderRadius: "14px", border: "none", background: "#dc2626", color: "#fff", fontWeight: 700, cursor: "pointer" }}>{t.confirm}</button>
        </div>
      </div>
    </div>
  );
}

// ── Mobile full-screen form ──────────────────────────────────────────────────
function MobileCustomerScreen({ open, onClose, onSubmit, t, initialData }) {
  const { form, setForm, touched, touch, touchAll, error, setError, saving, setSaving, payload, availableDays, handleMonthChange, fieldError } = useCustomerForm(open, initialData);
  if (!open) return null;
  const isEdit = !!initialData;

  const submit = async (e) => {
    e.preventDefault();
    touchAll();
    if (!form.nombre.trim() || !form.telefono.trim()) return;
    setSaving(true); setError("");
    try { await onSubmit(payload); }
    catch (err) { setError(err.message || "Error"); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "linear-gradient(180deg,#10203b,#0b1628)", display: "flex", flexDirection: "column" }}>
      <div style={{ flexShrink: 0, padding: "18px 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(16,32,59,0.98)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
        <div>
          <div style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700 }}>{isEdit ? t.editClientTitle : t.newClientTitle}</div>
          <div style={{ color: "#d4deea", fontSize: "0.82rem", marginTop: "4px" }}>{isEdit ? t.editClientSubtitle : t.newClientSubtitle}</div>
        </div>
        <button onClick={onClose} type="button" style={{ flexShrink: 0, height: "44px", padding: "0 16px", borderRadius: "14px", border: "2px solid #7aa2d1", background: "#132746", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>{t.cancel}</button>
      </div>
      <div style={{ flexGrow: 1, minHeight: 0, overflowY: "scroll", WebkitOverflowScrolling: "touch", padding: "18px 18px 4px" }}>
        <form id="mcf" onSubmit={submit}>
          <CustomerFormFields form={form} setForm={setForm} touch={touch} fieldError={fieldError} availableDays={availableDays} handleMonthChange={handleMonthChange} t={t} />
          {error && <div style={{ padding: "12px 14px", borderRadius: "12px", marginBottom: "8px", background: "#4c1116", border: "2px solid #db6a74", color: "#ffe0e3", fontWeight: 600, fontSize: "14px" }}>{error}</div>}
        </form>
      </div>
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: "10px", padding: "12px 18px 20px", borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(11,22,40,0.98)" }}>
        <button type="submit" form="mcf" disabled={saving} style={{ height: "52px", borderRadius: "16px", border: "none", width: "100%", background: "linear-gradient(135deg,#7fd4ff,#2f6cff)", color: "#03101f", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}>{saving ? "…" : t.saveClient}</button>
        <button type="button" onClick={onClose} style={{ height: "52px", borderRadius: "16px", width: "100%", border: "2px solid #7aa2d1", background: "#132746", color: "#fff", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}>{t.cancel}</button>
      </div>
    </div>
  );
}

// ── Desktop modal form ───────────────────────────────────────────────────────
function DesktopCustomerModal({ open, onClose, onSubmit, t, initialData }) {
  const { form, setForm, touched, touch, touchAll, error, setError, saving, setSaving, payload, availableDays, handleMonthChange, fieldError } = useCustomerForm(open, initialData);
  if (!open) return null;
  const isEdit = !!initialData;

  const submit = async (e) => {
    e.preventDefault();
    touchAll();
    if (!form.nombre.trim() || !form.telefono.trim()) return;
    setSaving(true); setError("");
    try { await onSubmit(payload); }
    catch (err) { setError(err.message || "Error"); }
    finally { setSaving(false); }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(3,10,20,0.82)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(700px,100%)", maxHeight: "90vh", background: "linear-gradient(180deg,#10203b,#0b1628)", border: "2px solid rgba(255,255,255,0.15)", borderRadius: "28px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", padding: "22px 24px 18px", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(16,32,59,0.98)" }}>
          <div>
            <div style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700 }}>{isEdit ? t.editClientTitle : t.newClientTitle}</div>
            <div style={{ color: "#d4deea", fontSize: "0.85rem", marginTop: "6px" }}>{isEdit ? t.editClientSubtitle : t.newClientSubtitle}</div>
          </div>
          <button onClick={onClose} type="button" style={{ flexShrink: 0, height: "44px", padding: "0 18px", borderRadius: "14px", border: "2px solid #7aa2d1", background: "#132746", color: "#fff", fontWeight: 700, cursor: "pointer" }}>{t.cancel}</button>
        </div>
        <div style={{ flexGrow: 1, minHeight: 0, overflowY: "auto", padding: "20px 24px 4px" }}>
          <form id="dcf" onSubmit={submit}>
            <CustomerFormFields form={form} setForm={setForm} touch={touch} fieldError={fieldError} availableDays={availableDays} handleMonthChange={handleMonthChange} t={t} />
            {error && <div style={{ padding: "12px 14px", borderRadius: "12px", marginBottom: "8px", background: "#4c1116", border: "2px solid #db6a74", color: "#ffe0e3", fontWeight: 600 }}>{error}</div>}
          </form>
        </div>
        <div style={{ flexShrink: 0, display: "flex", justifyContent: "flex-end", gap: "12px", padding: "14px 24px 20px", borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(11,22,40,0.98)" }}>
          <button type="button" onClick={onClose} style={{ height: "48px", padding: "0 20px", borderRadius: "14px", border: "2px solid #7aa2d1", background: "#132746", color: "#fff", fontWeight: 700, cursor: "pointer" }}>{t.cancel}</button>
          <button type="submit" form="dcf" disabled={saving} style={{ height: "48px", padding: "0 24px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#7fd4ff,#2f6cff)", color: "#03101f", fontWeight: 700, cursor: "pointer" }}>{saving ? "…" : t.saveClient}</button>
        </div>
      </div>
    </div>
  );
}

// ── Stats helpers ────────────────────────────────────────────────────────────
function FlagSelector({ language, setLanguage, centered = false }) {
  return (
    <div className={centered ? "flags-top" : "flags-inline"}>
      {flagItems.map((item) => (
        <button key={item.code} className={`flag-button ${language === item.code ? "active" : ""}`} onClick={() => setLanguage(item.code)} type="button" aria-label={item.label}>
          <img src={item.image} alt={item.label} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function StatBars({ title, data }) {
  const items = data ?? [];
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      {!items.length ? <div className="chart-empty">Sin datos</div> : (
        <div className="chart-list">
          {items.map((item) => (
            <div key={item.label} className="chart-row">
              <div className="chart-row-top"><span>{item.label}</span><strong>{item.value}</strong></div>
              <div className="chart-track"><div className="chart-bar" style={{ width: `${Math.max((item.value / max) * 100, 6)}%` }} /></div>
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
        <div className="summary-box"><span>{t.highest}</span><strong>{topLabel}</strong><small>{topValue}</small></div>
        <div className="summary-box"><span>{t.lowest}</span><strong>{bottomLabel}</strong><small>{bottomValue}</small></div>
      </div>
    </div>
  );
}

function LoginPage({ onLogin, error, loading, language, setLanguage, t }) {
  const [username, setUsername] = useState("ivan");
  const [password, setPassword] = useState("");
  const submit = async (e) => { e.preventDefault(); await onLogin(username, password); };
  return (
    <div className="login-shell">
      <div className="login-card">
        <FlagSelector language={language} setLanguage={setLanguage} centered />
        <img src="/images/logo.png" alt="Puntapié" className="login-logo" />
        <h1>Calzados Puntapié SL</h1>
        <p>{t.welcome}</p>
        <form onSubmit={submit} className="login-form">
          <select value={username} onChange={(e) => setUsername(e.target.value)}>
            {USERS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
          <input placeholder={t.password} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error ? <div className="error-box">{error}</div> : null}
          <button className="primary-button" type="submit" disabled={loading}>{loading ? t.loadingLogin : t.login}</button>
        </form>
      </div>
    </div>
  );
}

function StatsModal({ open, onClose, stats, t }) {
  if (!open || !stats) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="stats-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header sticky">
          <div><h2>{t.statsTitle}</h2><p>{t.statsSubtitle}</p></div>
          <button className="ghost-button" type="button" onClick={onClose}>{t.close}</button>
        </div>
        <div className="stats-grid modal-content-scroll">
          <StatBars title={t.nationalityDistribution} data={mapToArray(stats.nationality_distribution)} />
          <StatBars title={t.ageDistribution} data={mapToArray(stats.age_distribution)} />
          <StatBars title={t.dayLastMonth} data={mapToArray(stats.daily_last_month)} />
          <StatBars title={t.monthLastYear} data={mapToArray(stats.monthly_last_year)} />
          <SummaryCard title={t.topBottomDays} topLabel={stats.top_day?.label || "—"} topValue={stats.top_day?.value || 0} bottomLabel={stats.bottom_day?.label || "—"} bottomValue={stats.bottom_day?.value || 0} t={t} />
          <SummaryCard title={t.topBottomHours} topLabel={stats.top_hour?.label || "—"} topValue={stats.top_hour?.value || 0} bottomLabel={stats.bottom_hour?.label || "—"} bottomValue={stats.bottom_hour?.value || 0} t={t} />
        </div>
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
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
  const [editingCliente, setEditingCliente] = useState(null);
  const [deletingCliente, setDeletingCliente] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const t = translations[language] || translations.es;

  useEffect(() => {
    const saved = localStorage.getItem("puntapie_language");
    if (saved && translations[saved]) setLanguage(saved);
  }, []);
  useEffect(() => { localStorage.setItem("puntapie_language", language); }, [language]);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    document.body.classList.toggle("modal-open", showCustomerModal || showStatsModal || !!editingCliente);
    return () => document.body.classList.remove("modal-open");
  }, [showCustomerModal, showStatsModal, editingCliente]);
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
    } finally { setLoading(false); }
  };

  const handleLogin = async (username, password) => {
    setLoginLoading(true); setLoginError("");
    try { const session = await login(username, password); setAuth(session); await loadData(session); }
    catch (err) { setLoginError(err.message || "Error"); }
    finally { setLoginLoading(false); }
  };

  const filteredClientes = useMemo(() => {
    const q = activeSearch.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter((item) =>
      [item.nombre, item.email, item.telefono].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [clientes, activeSearch]);

  const handleCreate = async (payload) => {
    await createCliente(auth.token, payload);
    await loadData(auth);
    setShowCustomerModal(false);
    setFlash(t.clientRegistered);
  };

  const handleUpdate = async (payload) => {
    await updateCliente(auth.token, editingCliente.id, payload);
    await loadData(auth);
    setEditingCliente(null);
    setFlash(t.clientUpdated);
  };

  const handleDelete = async () => {
    await deleteCliente(auth.token, deletingCliente.id);
    await loadData(auth);
    setDeletingCliente(null);
    setFlash(t.clientDeleted);
  };

  const handleExport = async () => {
    const blob = await exportExcel(auth.token);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "clientes.xlsx"; a.click();
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

  const clearSearch = () => { setSearchInput(""); setActiveSearch(""); };

  const isAdmin = auth?.role === "admin";

  if (!auth) {
    return <LoginPage onLogin={handleLogin} error={loginError} loading={loginLoading} language={language} setLanguage={setLanguage} t={t} />;
  }

  const CustomerForm = isMobile ? MobileCustomerScreen : DesktopCustomerModal;

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
                <p>{t.sessionAs} <strong>{auth.username}</strong> · {t.role} <strong>{auth.role}</strong></p>
              </div>
            </div>
            <button className="ghost-button" onClick={() => setAuth(null)}>{t.logout}</button>
          </div>

          <div className="hero-actions">
            <div className="search-box">
              <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && setActiveSearch(searchInput)} placeholder={t.search} />
              <button className="search-button" onClick={() => setActiveSearch(searchInput)} type="button">{t.searchButton}</button>
              <button className="search-button secondary-light" onClick={clearSearch} type="button">{t.clearButton}</button>
            </div>
            <div className="action-buttons">
              <button className="primary-button" onClick={() => setShowCustomerModal(true)}>{t.newClient}</button>
              {isAdmin && (
                <>
                  <button className="secondary-button" onClick={() => setShowStatsModal(true)}>{t.statistics}</button>
                  <button className="secondary-button" onClick={handleExport}>{t.exportExcel}</button>
                  <label className="secondary-button file-button">{t.importExcel}<input type="file" accept=".xlsx" onChange={handleImport} /></label>
                </>
              )}
            </div>
          </div>
        </section>

        {flash ? <div className="flash-success">{flash}</div> : null}

        <section className="list-card">
          <div className="section-head">
            <div><h2>{t.clients}</h2><p>{t.allClients}</p></div>
          </div>
          <div className="table-head">
            <span>{t.customer}</span><span>{t.contact}</span><span>{t.nationality}</span><span>{t.registered}</span>
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
                    <span>{cliente.email || "—"}</span>
                    <span>{cliente.telefono}</span>
                  </div>
                  <div className="row-nationality">
                    <span className="pill">{cliente.nacionalidad || "—"}</span>
                  </div>
                  <div className="row-date">
                    {formatDate(cliente.created_at)}
                    {isAdmin && (
                      <div style={{ display: "flex", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
                        <button
                          onClick={() => setEditingCliente(cliente)}
                          style={{ height: "32px", padding: "0 12px", borderRadius: "10px", border: "1.5px solid #7aa2d1", background: "#132746", color: "#7fd4ff", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}
                        >
                          ✏ {t.editClient}
                        </button>
                        <button
                          onClick={() => setDeletingCliente(cliente)}
                          style={{ height: "32px", padding: "0 12px", borderRadius: "10px", border: "1.5px solid #ef4444", background: "#3b0f0f", color: "#fca5a5", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}
                        >
                          🗑 {t.deleteClient}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      {/* New customer */}
      <CustomerForm open={showCustomerModal} onClose={() => setShowCustomerModal(false)} onSubmit={handleCreate} t={t} initialData={null} />

      {/* Edit customer */}
      <CustomerForm open={!!editingCliente} onClose={() => setEditingCliente(null)} onSubmit={handleUpdate} t={t} initialData={editingCliente} />

      {/* Delete confirmation */}
      <ConfirmDeleteModal open={!!deletingCliente} onCancel={() => setDeletingCliente(null)} onConfirm={handleDelete} t={t} />

      {isAdmin && <StatsModal open={showStatsModal} onClose={() => setShowStatsModal(false)} stats={stats} t={t} />}
    </div>
  );
}
