// pushConfig.ts
const admin = require("firebase-admin");

let serviceAccount = require("../../new-peekabook-firebase-adminsdk-ke3ck-c1e506468e.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
