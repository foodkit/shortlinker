// Depedencies
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const crypto = require('crypto');
const base64url = require('base64url');
const validUrl = require('valid-url');

// Constants and configuration
const env = functions.config().shortlinks || {};
const TOKEN_LENGTH = 9; // bytes
const KEYS = env.keys ? env.keys.split(',') : [];
const HOSTNAME = env.hostname || 'https://fkit.io';
const COLLECTION = env.collection || 'shortlinks';

// Prepare Cloud Firestore
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const randomToken = () => {
  return base64url(crypto.randomBytes(TOKEN_LENGTH));
};

const validate = (url) => {
  if (validUrl.isUri(url)) {
    const currentHost = HOSTNAME.replace('http', '').replace('https', '');
    const urlHost = url.replace('http', '').replace('https', '');
    return !urlHost.startsWith(currentHost);
  }
  return false;
};

/**
 * Attempts to retrieve a shortlink from Firebase.
 */
const getShortlink = (token) => {
  return db.collection(COLLECTION)
    .doc(token || '')
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data().long_url;
      }
      return false;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
};

/**
 * Creates a shortlink document for the provided "long" URL.
 */
const setShortlink = (url) => {
  const token = randomToken();
  return db.collection(COLLECTION)
    .doc(token)
    .set({long_url: url})
    .then(() => {
      return token;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
};

/**
 * GET /*
 * Looks up a shortlink and redirects the request if the link was found.
 */
const getHandler = functions.https.onRequest((req, res) => {
  const token = req.url.substring(1);
  getShortlink(token)
    .then((longUrl) => {
      if (longUrl) {
        res.redirect(301, longUrl);
      } else {
        res.status(404)
          .send('Sorry, could not find that link.');
      }
    }).catch((err) => {
      console.error(err);
      res.status(404)
        .send('Sorry, could not find that link.');
    });
});

/**
 * POST /
 * Creates a shortlink.
 */
const postHandler = functions.https.onRequest((req, res) => {
  const key = (req.headers['authorization'] || '').replace('Bearer ', '');
  const body = req.body;

  if (KEYS.indexOf(key) < 0) {
    // Authorization failed, invalid access token
    res.status(401)
      .header('content-type', 'application/json')
      .send(JSON.stringify({message: 'Unauthorized.'}));
  } else if (!body || !body.long_url || !validate(body.long_url)) {
    // Request format is invalid
    res.status(400)
      .header('content-type', 'application/json')
      .send(JSON.stringify({message: 'Invalid request format.'}));
  } else {
    // Create the shortlink:
    setShortlink(body.long_url)
      .then((token) => {
        res.status(200)
          .header('content-type', 'application/json')
          .send(JSON.stringify({link: `${HOSTNAME}/${token}`}));
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

/**
 * Default request handler. Detects the HTTP method and sends the request to either
 * GET or POST hanlder.
 */
exports.handle = functions.https.onRequest((req, res) => {
  switch (req.method) {
    case 'GET':
      return getHandler(req, res);
    case 'POST':
      return postHandler(req, res);
  }

  res.status(404)
    .send('Sorry, that method or path is not supported.');
});