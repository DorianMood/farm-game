import session from "express-session";
import pgSession from "connect-pg-simple";

const sessionStore =
  process.env.NODE_ENV === "test"
    ? undefined
    : new (pgSession(session))({
        conObject: {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        },
        createTableIfMissing: true,
      });

export default session({
  store: sessionStore,
  secret: "farm-game-rshb",
  saveUninitialized: false,
  resave: false,
  proxy: process.env.NODE_ENV === "production",
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 90 * 24 * 60 * 60 * 1000, // 3 months
  },
});
