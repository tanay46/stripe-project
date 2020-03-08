## Running the Program

In a terminal tab, start the server.js file, which runs on port 5000.

`node server.js`

Go to another terminal tab and navigate to the client and start the client which runs on port 3000.

```
cd client
npm start
```
## Information

This program allows for ordering an Amazon Gift Card for $15.

Successful Orders (Names and Emails) are appended to an orders.txt file to fulfill in the future.

React was used for the Frontend and Express for the backend and Stripe to collect the payments.

The app was tested against the use cases provided on Stripe's test cases pages as well as additional ones and passed all of them.