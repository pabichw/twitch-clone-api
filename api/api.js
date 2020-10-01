
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const cors = require('cors');

const config = require('../config/');
const TwitchApi = require('./models/communication/twitchApi');

const environment = process.env.NODE_ENV;
const path = require('path');
const {getToken} = require("./utils/other");


require('dotenv').config({ path: path.resolve(__dirname, `../.env.${environment}`) });

const app = express();
const server = http.Server(app);

app.use(cors());

app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/getAppAccessToken', async (req, res) => {
  const twitchResp = await TwitchApi.appAuth();
  console.log('twitch resposnse:', twitchResp);

  res.send(twitchResp);
});

app.get('/streams', async (req, res) => {
  const { token } = req.query;
  const twitchResp = await TwitchApi.getStreams({ token });

  res.send(twitchResp);
});

app.get('/users', async (req, res) => {
  const token = getToken(req);
  const { id } = req.query;
  console.log('token', token, 'id', id);
  const twitchResp = await TwitchApi.getUsers({ id, token });

  res.send(twitchResp);
});
app.get('/users', async (req, res) => {
  const token = getToken(req);
  const { id } = req.query;
  console.log('token', token, 'id', id);
  const twitchResp = await TwitchApi.getUsers({ id, token });

  res.send(twitchResp);
});

app.get('/test', async (req, res) => {
  res.send({message: 'Hello Test'});
});


app.get('/recomendedChannels', async (req, res) => {
  const { token } = req.query;
  const twitchResp = await TwitchApi.getStreams({ token });

  res.send(twitchResp);
});

server.listen(config.port, () => {
  if (environment !== 'production' &&
    environment !== 'development' &&
    environment !== 'testing'
  ) {
    console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
    process.exit(1);
  }
  console.log(`Started\nEnv: ${environment}\nRunning at port: ${config.port}`);
});
