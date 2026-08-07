function DashboardCard({ title, value }) {

  return (

    <div className="dashboard-card">

      <div className="card-icon">
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