import { useState, useEffect } from "react";

function Billing() {

const initialBill = {
  patient:"",
  doctor:"",
  treatment:"",
  amount:"",
  paymentMethod:"",
  status:"Pending",
  date:""
};


const [bill,setBill] = useState(initialBill);

const [bills,setBills] = useState([]);

const [editId,setEditId] = useState(null);

const [search,setSearch] = useState("");



useEffect(()=>{

const data = JSON.parse(localStorage.getItem("bills"));

if(data){
 setBills(data);
}

},[]);



useEffect(()=>{

localStorage.setItem(
"bills",
JSON.stringify(bills)
);

},[bills]);



const handleChange=(e)=>{

setBill({
...bill,
[e.target.name]:e.target.value
});

};



const saveBill=(e)=>{

e.preventDefault();


if(!bill.patient || !bill.amount){

alert("Patient and Amount required");

return;

}



if(editId){

setBills(
bills.map(item=>
item.id===editId
?
{...bill,id:editId}
:
item
)
);


setEditId(null);


}
else{

setBills([
...bills,
{
...bill,
id:Date.now()
}
]);

}



setBill(initialBill);


};



const editBill=(id)=>{

const selected=bills.find(
item=>item.id===id
);

setBill(selected);

setEditId(id);

};



const deleteBill=(id)=>{

setBills(
bills.filter(
item=>item.id!==id
)
);

};



const filteredBills=bills.filter(item=>

item.patient
.toLowerCase()
.includes(search.toLowerCase())

);



const revenue=bills.reduce(
(sum,item)=>
sum+Number(item.amount),
0
);



return(

<div className="billing-page">


<h1 className="page-title">
Billing Management
</h1>


<div className="alert alert-info">

Total Bills: {bills.length}

<br/>

Total Revenue:
Rs. {revenue}

</div>



<div className="billing-flex">



<div className="card shadow p-4 billing-form">


<h3>
{editId ? "Update Bill":"Add Bill"}
</h3>



<form onSubmit={saveBill}>


<input
className="form-control mb-3"
name="patient"
placeholder="Patient Name"
value={bill.patient}
onChange={handleChange}
/>



<input
className="form-control mb-3"
name="doctor"
placeholder="Doctor Name"
value={bill.doctor}
onChange={handleChange}
/>



<input
className="form-control mb-3"
name="treatment"
placeholder="Treatment"
value={bill.treatment}
onChange={handleChange}
/>



<input
className="form-control mb-3"
type="number"
name="amount"
placeholder="Amount"
value={bill.amount}
onChange={handleChange}
/>



<select
className="form-control mb-3"
name="paymentMethod"
value={bill.paymentMethod}
onChange={handleChange}
>

<option value="">
Payment Method
</option>

<option>
Cash
</option>

<option>
Card
</option>

<option>
Online
</option>

</select>



<select
className="form-control mb-3"
name="status"
value={bill.status}
onChange={handleChange}
>

<option>
Pending
</option>

<option>
Paid
</option>

</select>



<input
className="form-control mb-3"
type="date"
name="date"
value={bill.date}
onChange={handleChange}
/>



<button className="btn btn-primary">

{
editId
?
"Update Bill"
:
"Add Bill"
}

</button>


</form>

</div>





<div className="card shadow p-4 billing-table">


<h3>
Billing Records
</h3>


<input

className="form-control my-3"

placeholder="Search Patient"

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>



<div className="table-responsive">


<table className="table table-bordered">


<thead className="table-dark">

<tr>

<th>Patient</th>
<th>Doctor</th>
<th>Treatment</th>
<th>Amount</th>
<th>Method</th>
<th>Status</th>
<th>Date</th>
<th>Action</th>

</tr>

</thead>



<tbody>


{
filteredBills.map(item=>(

<tr key={item.id}>


<td>{item.patient}</td>

<td>{item.doctor}</td>

<td>{item.treatment}</td>

<td>
Rs. {item.amount}
</td>


<td>
{item.paymentMethod}
</td>


<td>

<span className={
item.status==="Paid"
?
"badge bg-success"
:
"badge bg-warning"
}>

{item.status}

</span>

</td>


<td>
{item.date}
</td>



<td>

<button

className="btn btn-success btn-sm me-2"

onClick={()=>editBill(item.id)}

>

Edit

</button>



<button

className="btn btn-danger btn-sm"

onClick={()=>deleteBill(item.id)}

>

Delete

</button>


</td>


</tr>

))

}


</tbody>


</table>


</div>


</div>


</div>


</div>

)

}


export default Billing;