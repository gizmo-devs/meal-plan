DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  firstname TEXT NOT NULL,
  surname TEXT NOT NULL,
  access TEXT NOT NULL,
  password TEXT NOT NULL
);

