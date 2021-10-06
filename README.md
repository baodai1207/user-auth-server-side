# Skipli Coding Challenge
## Create a simple login application that includes front-end, a back-end, and database (Firebase)

Please Download server side and client side at:
1. server side @ https://github.com/baodai1207/user-auth-server-side
2. client side @ https://github.com/baodai1207/user-auth-client-side.git


## Server side
#### Components:
1. index.js: Deployed express server API
2. keyfile.json: Content firebase json key
3. twilio.js: Generated message from twilio API
4. users.js: route and router setup
5. env_base: basic format to setup your own twilio API key


In the project directory:

You will need to create .env file that include TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to send the access code to user.

There is a file called .env_base which you can setup your own .env file

Then you can run:

### `npm start`

### Open http://localhost:5000

![Capture1](https://user-images.githubusercontent.com/25336029/136139375-22631eed-6199-4f74-8d30-1c6b6f9e7505.PNG)

### Parsed phone number and generated access code in backend

![Capture2](https://user-images.githubusercontent.com/25336029/136139380-cf4c6441-dc7a-472b-84b9-08f97341ece7.PNG)

### Recieved text message of access code from Twilio

![244208221_946574525954885_7171352661172477434_n](https://user-images.githubusercontent.com/25336029/136139432-d5b000c3-020b-4fa7-ae23-a26f0aac783e.jpg)
