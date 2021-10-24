const fetch = require('cross-fetch');

const config = require('../../../config/connection');

const { oAuthUrl, rootUrl } = config.twitchApi;

const options = {
  mode: 'cors', // no-cors, *cors, same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, *same-origin, omit
  headers: {
    'Content-Type': 'application/json',
  },
  redirect: 'follow', // manual, *follow, error
  referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url

};

const twitchRequestHeaders = ({ token, CLIENT_ID }) => ({
  headers: {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Client-Id': CLIENT_ID,
  },
});

class TwitchApi {
  static async appAuth() {
    const { CLIENT_ID, CLIENT_SECRET } = process.env;
    const postPath = `${oAuthUrl}/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;

    const res = await fetch(
      postPath,
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        ...options,
      },
    ).then((resp) => resp.text());

    return JSON.parse(res);
  }

  static async direct(token, url, queryObj) {
    const { CLIENT_ID } = process.env; // might not be necessery
    const query = new URLSearchParams(queryObj).toString();
    const path = `${rootUrl}${url}${query}`;
    console.log('final twitch path', path);

    const res = await fetch(
      path,
      {
        method: 'GET',
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          'Client-Id': CLIENT_ID,
        },
      },
    ).then((resp) => resp.text());

    return JSON.parse(res);
  } 

  static async getStreams({ token, game_id: gameId }) {
    const { CLIENT_ID } = process.env;
    const path = `${rootUrl}/streams?${gameId ? `game_id=${gameId}` : ''}`;

    const res = await fetch(
      path,
      {
        method: 'GET',
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          'Client-Id': CLIENT_ID,
        },
      },
    ).then((resp) => resp.text());

    return JSON.parse(res);
  }

  static async getStreamTags({ id, token }) {
    const { CLIENT_ID } = process.env;
    const path = `${rootUrl}/streams/tags?broadcaster_id=${id}`;

    const res = await fetch(
      path,
      {
        method: 'GET',
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          'Client-Id': CLIENT_ID,
        },
      },
    ).then((resp) => resp.text());

    return JSON.parse(res);
  }

  static async getGames({ token, id, name }) {
    const { CLIENT_ID } = process.env;
    // eslint-disable-next-line no-nested-ternary
    const path = `${rootUrl}/games${id ? `?id=${id}` : name ? `?name=${name}` : '/top'}`; // if no 'id' passed fetch TOP games

    console.log('path', path);
    const res = await fetch(
      path,
      {
        method: 'GET',
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          'Client-Id': CLIENT_ID,
        },
      },
    ).then((resp) => resp.text());

    return JSON.parse(res);
  }

  static async getUsers({ id, login, token }) {
    const { CLIENT_ID } = process.env;
    const path = `${rootUrl}/users?${id ? `id=${id}` : ''}${login ? `&login=${login}` : ''}`;

    const res = await fetch(
      path,
      {
        method: 'GET',
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          'Client-Id': CLIENT_ID,
        },
      },
    ).then((resp) => resp.text());

    return JSON.parse(res);
  }

  static async getChannels({ token, broadcasterId }) {
    const { CLIENT_ID } = process.env;
    const path = `${rootUrl}/channels?broadcaster_id=${broadcasterId}`;

    const res = await fetch(
      path,
      {
        method: 'GET',
        ...options,
        ...twitchRequestHeaders({ token, CLIENT_ID }),
      },
    ).then((resp) => resp.text());

    return JSON.parse(res);
  }

  static async searchChannels({ token, query }) {
    const { CLIENT_ID } = process.env;
    const path = `${rootUrl}/search/channels?query=${query}`;

    console.log('search path:', path);
    const res = await fetch(
      path,
      {
        method: 'GET',
        ...options,
        ...twitchRequestHeaders({ token, CLIENT_ID }),
      },
    ).then((resp) => resp.text());

    return JSON.parse(res);
  }
}

module.exports = TwitchApi;
