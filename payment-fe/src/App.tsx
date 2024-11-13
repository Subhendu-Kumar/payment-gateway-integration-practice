import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const App = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="w-full h-screen flex items-center justify-center">
        <CheckoutForm />
      </div>
    </Elements>
  );
};

export default App;
