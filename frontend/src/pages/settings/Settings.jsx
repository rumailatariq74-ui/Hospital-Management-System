import { useState, useEffect } from "react";
import { Save, Trash2 } from "lucide-react";

function Settings() {
  const [hospitalName, setHospitalName] = useState("MediCare Hospital");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("Rs.");
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("hospitalSettings"));
    if (savedSettings) {
      setHospitalName(savedSettings.hospitalName || "MediCare Hospital");
      setAddress(savedSettings.address || "");
      setPhone(savedSettings.phone || "");
      setEmail(savedSettings.email || "");
      setCurrency(savedSettings.currency || "Rs.");
      setTheme(savedSettings.theme || "light");
      setNotifications(savedSettings.notifications !== false);
    }
  }, []);

  const saveSettings = (e) => {
    e.preventDefault();
    const settings = { hospitalName, address, phone, email, currency, theme, notifications };
    localStorage.setItem("hospitalSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearAllData = () => {
    if (window.confirm("WARNING: This will delete ALL patient, doctor, billing, and other records. This action cannot be undone. Are you sure?")) {
      const keys = ["patients", "doctors", "appointments", "bills", "medicines", "rooms", "labTests", "staff", "bloodBank", "ambulances"];
      keys.forEach(k => localStorage.removeItem(k));
      alert("All data has been cleared.");
    }
  };

  return (
    <div className="settings-page management-list-page">
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div>
          <h1 className="page-title">Settings</h1>
          <h4>Hospital Configuration & Preferences</h4>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '20px', maxWidth: 720 }}>
        <div className="data-table-card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 20, letterSpacing: '-0.3px' }}>Hospital Information</h3>
          <form onSubmit={saveSettings} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hospital Name</label>
              <input className="form-control" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} placeholder="Hospital Name" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Address</label>
              <input className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full Address" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</label>
                <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
                <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Currency</label>
                <select className="form-control" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="Rs.">Pakistani Rupee (Rs.)</option>
                  <option value="$">US Dollar ($)</option>
                  <option value="£">British Pound (GBP)</option>
                  <option value="€">Euro (EUR)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Theme</label>
                <select className="form-control" value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
              <input type="checkbox" id="notifications" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
              <label htmlFor="notifications" style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)', cursor: 'pointer' }}>Enable notifications & alerts</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
              <button className="btn btn-primary" type="submit">
                <Save size={16} /> Save Settings
              </button>
              {saved && <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 13 }}>Saved successfully!</span>}
            </div>
          </form>
        </div>

        <div className="data-table-card" style={{ padding: 28, border: '1px solid rgba(196, 91, 91, 0.15)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 12, letterSpacing: '-0.3px' }}>Danger Zone</h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>These actions are destructive and cannot be undone. Proceed with caution.</p>
          <button className="btn" type="button" onClick={clearAllData} style={{ background: 'linear-gradient(135deg, #c45b5b, #a04040)', color: 'white', boxShadow: '0 4px 14px rgba(196, 91, 91, 0.25)' }}>
            <Trash2 size={16} /> Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
