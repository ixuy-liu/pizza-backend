const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Your secret key from Stripe

router.post('/create-checkout-session', async (req, res) => {
  const { cartItems } = req.body;

  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name
      },
      unit_amount: Math.round(item.price * 100) // convert dollars to cents
    },
    quantity: item.quantity
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: 'http://localhost:3000/order?success=true',
      cancel_url: 'http://localhost:3000/order?cancel=true'
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
});

module.exports = router;
