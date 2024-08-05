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
    partitioned: true,
    secure: process.env.NODE_ENV === "production",
    httpOnly: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain:
      process.env.NODE_ENV === "production" ? "93.93.207.63:444" : undefined,
    maxAge: 90 * 24 * 60 * 60 * 1000, // 3 months
  },
});
