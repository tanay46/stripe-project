import React, { Component } from 'react';
import { useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import {CardElement, Elements, useElements, useStripe} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_yi5vaBRaG2ZUpMl3NndTsMvy00RxCqiWC8");

const CheckoutForm = props => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage ] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    const cardElement = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(props.clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: name,
          email: email
        },
      }
    });

    if (result.error) {
      setMessage(result.error.message);

    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        setMessage('Payment Succeeded Successfully');
        axios.get('/writetolog', {
          params: {
            name: {name},
            email: {email}
          }
        })
        .then(function (response) {
              console.log(response);
        })
        .catch(function (error) {
          console.log(error);
      });


        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <input
      className="FormRowInput"
      id="name"
      type="text"
      placeholder="Jane Doe"
      required="required"
      onChange={e => setName(e.target.value)}
    />
    <input
      className="FormRowInput"
      id="email"
      type="email"
      placeholder="janedoe@gmail.com"
      required="required"
      autoComplete="email"
      onChange={e => setEmail(e.target.value)}
    />
    <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <button type="submit" className="button" disabled={!stripe}>
        Pay
      </button>
      <p className="App-intro">{message}</p>
    </form>
  );
};

class App extends Component {
state = {
    data: null
  };

  componentDidMount() {
      // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ data: res.clientSecret }))
      .catch(err => console.log(err));
  }
    // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/pay_intent');
    const body = await response.json();
    console.log(body);

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src="amazon.png" className="App-logo" alt="logo" />
          <h1 className="App-title">Buy An Amazon Gift Card for $15</h1>
           <Elements stripe={stripePromise}>
            <CheckoutForm clientSecret={this.state.data}/>
          </Elements>
        </header>
      </div>
    );
  }
}

export default App;