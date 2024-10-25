// firebaseConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'speak-website-439103.appspot.com',
});

const db = admin.firestore();
const storage = admin.storage().bucket();

module.exports = { db, storage };