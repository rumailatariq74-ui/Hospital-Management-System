function DashboardCard({ title, value, iconClass }) {
  return (
    <div className="dashboard-card">
      <div className={`card-icon ${iconClass || ""}`}>
        🏥
      </div>
      <div>
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
}

export default DashboardCard;