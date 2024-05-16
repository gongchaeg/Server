// pushConfig.ts
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(
    require("../../service-account-file.json")
  ),
});

export default admin;
