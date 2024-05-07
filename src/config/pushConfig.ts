// pushConfig.ts
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(
    require("../../new-peekabook-firebase-adminsdk-ke3ck-2c155d0a19.json")
  ),
});

export default admin;
