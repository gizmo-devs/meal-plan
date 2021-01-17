DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS meals;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  firstname TEXT NOT NULL,
  surname TEXT NOT NULL,
  email TEXT NOT NULL,
  access TEXT NOT NULL DEFAULT user,
  password TEXT NOT NULL
);

INSERT INTO users ('username', 'firstname', 'surname', 'email', 'access', 'password') VALUES (
'Craig, Attwood',
'Craig',
'Attwood',
'Craig.Attwood@hotmail.co.uk',
'admin',
'pbkdf2:sha256:150000$OaeOXiXK$92315b62ef3c1a02294351942a4e65576ccf962490e50f554ea0257ab98aafa2');

CREATE TABLE meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chosen_meal TEXT NOT NULL,
    date DATE NOT NULL,
    chosen_by INTEGER NOT NULL,
    book INTEGER NULL,
    page INTEGER NULL,
    url INTEGER NULL
);

INSERT INTO meals (chosen_meal, date, chosen_by) VALUES ("fisk 'n' chips", '2019-12-30', 1);
INSERT INTO meals (chosen_meal, date, chosen_by) VALUES ("Curry", '2019-12-20', 1);