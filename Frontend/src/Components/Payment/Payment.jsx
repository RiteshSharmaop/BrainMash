import React from "react";
import { useNavigate } from "react-router-dom";

const Payment = ({ setPaymentDone }) => {
    const navigate = useNavigate();

    const handlePayment = async () => {
        try {
            // simulate payment success
            setPaymentDone(true);
            navigate("/chat");
        } catch (error) {
            console.error("Payment failed:", error);
        }
    };

    return <button onClick={handlePayment}>Pay</button>;
};

export default Payment;
