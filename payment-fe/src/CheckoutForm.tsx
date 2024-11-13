import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [product] = useState({
    name: "T-shirt",
    price: 100,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    if (!stripe || !elements) {
      console.log("Stripe has not loaded yet.");
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.log("Card element not found");
      setIsProcessing(false);
      return;
    }
    const { token, error } = await stripe.createToken(cardElement);
    if (error) {
      console.error("[error]", error);
      setIsProcessing(false);
      return;
    }
    const response = await fetch("http://localhost:5000/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product,
        token,
      }),
    });
    const data = await response.json();
    if (data.error) {
      console.error("Payment error: ", data.error);
    } else {
      console.log("Payment successful: ", data);
    }
    setIsProcessing(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md p-4 shadow-lg rounded-md border border-gray-300"
    >
      <h2 className="text-xl mb-4">
        Get {product.name} at just ${product.price}
      </h2>
      <CardElement className="border p-2 rounded-md mb-4" />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full h-auto px-4 py-2 bg-blue-500 rounded-md text-white font-sans font-semibold"
      >
        {isProcessing ? "Processing..." : `Pay $${product.price}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
