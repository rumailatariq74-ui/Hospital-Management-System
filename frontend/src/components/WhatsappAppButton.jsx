import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css";

function WhatsAppButton(){

const phoneNumber = "923001234567"; // yahan apna WhatsApp number likhna

const message = "Hello, I want online consultation.";

const link = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;


return (

<a 
href={link}
target="_blank"
rel="noopener noreferrer"
className="whatsapp-btn"
>

<FaWhatsapp />

<span>
Online Consultation
</span>

</a>

);

}

export default WhatsAppButton;