
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const cors = require('cors');

const config = require('../config/');
const TwitchApi = require('./models/communication/twitchApi');

const environment = process.env.NODE_ENV;
const path = require('path');
const { getToken } = require('./utils/other');


require('dotenv').config({ path: path.resolve(__dirname, `../.env.${environment}`) });

const app = express();
const server = http.Server(app);

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/getAppAccessToken', async (req, res) => {
  const twitchResp = await TwitchApi.appAuth();
  console.log('token resp:', twitchResp);

  res.send(twitchResp);
});

app.get('/streams', async (req, res) => {
  const token = getToken(req);
  const { query } = req;
  const twitchResp = await TwitchApi.getStreams({ token, ...query });

  res.send(twitchResp);
});

app.get('/users', async (req, res) => {
  const token = getToken(req);
  const { id, login } = req.query;
  const twitchResp = await TwitchApi.getUsers({ id, login, token });

  res.send(twitchResp);
});

app.get('/games', async (req, res) => {
  const token = getToken(req);
  const { query } = req;
  const twitchResp = await TwitchApi.getGames({ token, ...query });

  res.send(twitchResp);
});

app.get('/streams/tags', async (req, res) => {
  const token = getToken(req);
  const { id } = req.query;
  const twitchResp = await TwitchApi.getStreamTags({ id, token });

  res.send(twitchResp);
});

app.get('/channels', async (req, res) => {
  const token = getToken(req);
  const { broadcaster_id: broadcasterId } = req.query;
  const twitchResp = await TwitchApi.getChannels({ broadcasterId, token });

  res.send(twitchResp);
});

app.get('/test', async (req, res) => {
  res.send({ message: 'Hello Test' });
});


app.get('/recomendedChannels', async (req, res) => {
  const token = getToken(req);
  const twitchResp = await TwitchApi.getStreams({ token });

  res.send(twitchResp);
});


app.get('/search/channels', async (req, res) => {
  const { query } = req.query;
  const token = getToken(req);
  const twitchResp = await TwitchApi.searchChannels({ token, query });
  console.log('search channel result', twitchResp);
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
