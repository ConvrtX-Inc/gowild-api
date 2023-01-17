var admin = require("firebase-admin");
import { registerAs } from '@nestjs/config';

export default registerAs('firebase', () => (
    admin.initializeApp({
        credential: admin.credential.cert(process.env.FIREBASE_CREDENTIALS)
    })
));
