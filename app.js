const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET =
  'b9d2fa5029eb406e94946637e50daef4c6572d6863c89d139d57dc3a5471633d19b887c304021872a3010c1852e139c63437ef13e2594c45195671686f404875';

const users = [
  {
    username: 'abcd',
    password: '1234abcddcba4321',
  },
  {
    username: 'admin',
    password: 'admin@123',
  },
];

// Authentication Middleware
const authMW = (req, res, next) => {
  const authorization = req.headers['authorization'];
  const token = authorization && authorization.split(' ')[1];
  if (!token) {
    res.sendStatus(401).json({ message: "Token not vallid!" });
    return;
  }
  const usr = jwt.verify(token, JWT_SECRET);
  if (users.filter(user => user == usr).length == 0) {
    next();
  } else {
    res.sendStatus(403);
  }
};

app.use(express.json());

// Retrieve token
app.post('/token', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username == undefined || password == undefined) {
    res.sendStatus(401);
    return;
  }

  for (let i in users) {
    if (users[i].username === username && users[i].password === password) {
      const token = await jwt.sign(users[i], JWT_SECRET);
      console.log(username, password, "Authenticated!");
      res.send({ token });
      return;
    }
  }
  res.sendStatus(401);
});

// Protected Api Request
app.get('/protected', authMW, (req, res) => {
  res.send('You are authenticated!');
});

app.listen(8000, () => {
  console.log('Server is listening on port 8000.');
});
