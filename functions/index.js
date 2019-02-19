// Depedencies
const functions = require('firebase-functions');
const crypto = require('crypto');
const base64url = require('base64url');

// Constants and configuration
const TOKEN_LENGTH = 9;
const KEYS = process.env.KEYS ? process.env.KEYS.split(',') : [
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // @todo: remove
];

const randomToken = () => {
  return base64url(crypto.randomBytes(TOKEN_LENGTH));
};

const hash = {
  abcdefg: 'https://google.com',
  bbcdefg: 'https://amazon.com',
};
const get = (token) => {
  return hash[`${token}`] || false; // @todo
};
const set = (url) => {
  const token = randomToken();
  hash[token] = url; // @todo
  return token;
};

const storeAsToken = (url) => {
  return get(url) || set(url);
};

const fetchByToken = (token) => {
  return get(token);
};

exports.get = functions.https.onRequest((req, res) => {
  const url = fetchByToken(req.url.substring(1));
  if (url) {
    res.redirect(url, 301);
  } else {
    res.status(404)
      .send("Sorry, could not find that link.");
  }
});

exports.post = functions.https.onRequest((req, res) => {
  const key = (req.headers["authorization"] || '').replace('Bearer ', '');
  const body = req.body;

  if (KEYS.indexOf(key) < 0) {
    res.status(401)
      .send(JSON.stringify({message: "Unauthorized."}));
  } else if (!body || !body.long_url) {
    res.status(400)
      .send(JSON.stringify({message: "Invalid request format."}));
  } else {
    const token = storeAsToken(body.long_url);
    res.status(200)
      .header('content-type', 'application/json')
      .send(JSON.stringify({link: `https://fkit.io/${token}`}));
  }
});

exports.handle = functions.https.onRequest((req, res) => {
  switch (req.method) {
    case 'GET':
      return this.get(req, res);
    case 'POST':
      return this.post(req, res);
    default:
      res.status(404)
        .send("Sorry, could not find that link.");
  }
});