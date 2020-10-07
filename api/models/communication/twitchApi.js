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
class TwitchApi {
  static async appAuth() {
    const { CLIENT_ID, CLIENT_SECRET } = process.env;
    const postPath = `${oAuthUrl}/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
    console.log('POSTPATH:', postPath);
    const res = await fetch(
      postPath,
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        ...options,
      },
    ).then((resp) => resp.text());

    return JSON.parse(res);
  }

  static async getStreams({ token }) {
    const { CLIENT_ID } = process.env;
    const path = `${rootUrl}/streams`;

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

  static async getGames({ token, id }) {
    const { CLIENT_ID } = process.env;
    const path = `${rootUrl}/games?id=${id}`;

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

  static async getUsers({ id, token }) {
    const { CLIENT_ID } = process.env;
    const path = `${rootUrl}/users?id=${id}`;

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
}

module.exports = TwitchApi;
