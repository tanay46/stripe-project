const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const stripe = require("stripe")('sk_test_q6IknAceBUhEVRXdEKlJpMrK00iHuqoqVE');
const fs = require('fs');

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.get('/pay_intent', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
  	amount: 1500,
    currency: 'usd',
    payment_method_types: ['card'],
    metadata: {integration_check: 'accept_a_payment'},
  });
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    clientSecret: paymentIntent.client_secret
  });
});

app.get('/writetolog', async (req, res) => {
	console.log("Write to log called");
	console.log(req.query);
	fs.appendFile('orders.txt', req.query.name + " " + req.query.email + " \n", function(err, result) {
     if(err) console.log('error', err);
   });
});