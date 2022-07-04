import { apps } from "firebase-admin";
import { cert, initializeApp, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const isDevEnvironment = process && process.env.NODE_ENV === "development";

const prodConfig = {
  credential: cert({
    project_id: process.env.PROD_PROJECT_ID,
    private_key: process.env.PROD_PRIVATE_KEY
      ? JSON.parse(process.env.PROD_PRIVATE_KEY)
      : undefined,
    client_email: process.env.PROD_CLIENT_EMAIL,
  } as ServiceAccount),
  databaseURL: "https://rankio-1bbf9.firebaseio.com",
};

const devConfig = {
  credential: cert({
    project_id: process.env.DEV_PROJECT_ID,
    private_key: process.env.DEV_PRIVATE_KEY
      ? JSON.parse(process.env.DEV_PRIVATE_KEY)
      : undefined,
    client_email: process.env.DEV_CLIENT_EMAIL,
  } as ServiceAccount),
  databaseURL: "https://rankio-dev.firebaseio.com",
};

// Initialize Firebase
const app = isDevEnvironment
  ? apps.find((_app) => _app?.name === "dev") || initializeApp(devConfig, "dev")
  : apps.find((_app) => _app?.name === "prod") ||
    initializeApp(prodConfig, "prod");

export const auth = getAuth(app);
