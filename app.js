
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const cors = require('cors');

const TwitchApi = require('./api/models/communication/twitchApi');

const environment = process.env.NODE_ENV;
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, `.env.${environment}`) });

const app = express();
const server = http.Server(app);

app.use(cors());

app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

app.get('/getAppAccessToken', async (req, res) => {
  const twitchResp = await TwitchApi.appAuth();
  console.log('token resp:', twitchResp);

  res.send(twitchResp);
});

app.get('/marco', async (req, res) => {
  res.send({ data: { msg: 'polo' }});
})

const listener = server.listen(process.env.PORT || '2017', () => {
  if (environment !== 'production' &&
    environment !== 'development' &&
    environment !== 'testing'
  ) {
    console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
    process.exit(1);
  }
  console.log(`Started\nEnv: ${environment}\nRunning at port: ${listener.address().port}`);
});
