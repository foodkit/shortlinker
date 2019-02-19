// Depedencies
const functions = require('firebase-functions');
const crypto = require('crypto');
const base64url = require('base64url');

// Constants and configuration
const TOKEN_LENGTH = 9;
const KEYS = process.env.KEYS ? process.env.KEYS.split(',') : [];

const randomToken = () => {
  return base64url(crypto.randomBytes(TOKEN_LENGTH));
};

const hash = {
  abcdefg: 'https://google.com',
  bbcdefg: 'https://amazon.com',
};
const get = (url) => {
  return hash[`${key}`] || false; // @todo
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
  const url = fetchByToken();
  if (url) {
    res.redirect(url, 301);
  } else {
    res.status(404);
    res.write("Sorry, could not find that link.");
  }
});

exports.post = functions.https.onRequest((req, res) => {
  const key = req.headers["access-token"] || '';
  const body = JSON.parse(req.body);

  if (KEYS.indexOf(key) < 0) {
    res.status(401);
    res.write(JSON.stringify({message: "Unauthorized."}));
  } else if (!body || !body.long_url) {
    res.status(400);
    res.write(JSON.stringify({message: "Invalid request format."}));
  } else {
    const token = storeAsToken(body.long_url);
    res.status(200);
    res.write(JSON.stringify({link: `https://fkit.io/${token}`}));
  }
});

exports.handle = functions.https.onRequest((req, res) => {
  switch (req.method) {
    case 'GET':
      return this.get(req, res);
    case 'POST':
      return this.post(req, res);
    default:
      res.status(404);
      res.write("Sorry, could not find that link.");
  }
});