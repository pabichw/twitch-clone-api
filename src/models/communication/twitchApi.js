const fetch = require('cross-fetch');

const config = require('../../../config/connection');

const { oAuthUrl } = config.twitchApi;

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
    console.log('client id', CLIENT_ID, 'client secret', CLIENT_SECRET);
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
}

module.exports = TwitchApi;
