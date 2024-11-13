import express from "express";
import cors from "cors";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  const id = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      return stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchased the ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempotencyKey: id }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Payment failed" });
    });
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
