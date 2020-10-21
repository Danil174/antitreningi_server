const express = require('express');
const app = express();
const {v4} = require('uuid');
const path = require('path');

const PORT = process.env.PORT || 3000;

let GOODS = [
  {id: v4(), title: 'молоко 1л', category: 'продукты', price: 45, amount: 2, isBought: false},
  {id: v4(), title: 'old spice', category: 'косметика', price: 300, amount: 1, isBought: false}
];

let CATEGORIES = [
  { selected: false, label: 'продукты' },
  { selected: false, label: 'косметика' },
];

let TOKEN;

app.use(express.json());

app.post('/api/login', (req, res) => {
  TOKEN = v4();
  const mailRE = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
  const isValid = mailRE.test(String(req.body.email).toLowerCase());
  if (isValid && req.body.password !== '') {
    res.status(200).json({token: TOKEN});
  } else {
    res.status(401).json({message: 'Unauthorized'});
  }
})

const checkSignIn = (req, res, next) => {
  if (req.headers.authorization === TOKEN) {
    next();
  } else {
    res.status(401).json({message: 'Unauthorized'});
  }
}

app.get('/api/goods', checkSignIn, (req, res) => {
  res.status(200).json(GOODS);
});

app.post('/api/goods', checkSignIn, (req, res) => {
  const good = {...req.body, id: v4(), isBought: false};
  GOODS.push(good);
  res.status(201).json(good);
});

app.delete('/api/goods/:id', checkSignIn, (req, res) => {
  GOODS = GOODS.filter(it => it.id !== req.body.id);
  res.status(200).json({message: 'succes'});
});

app.patch('/api/goods/:id', checkSignIn, (req, res) => {
  const idx = GOODS.findIndex(it => it.id === req.body.id);
  GOODS[idx].isBought = !GOODS[idx].isBought;
  res.status(200).json(GOODS[idx]);
});

app.get('/api/categories', checkSignIn, (req, res) => {
  res.status(200).json(CATEGORIES);
});

app.put('/api/categories', checkSignIn, (req, res) => {
  CATEGORIES = req.body.arr;
  res.status(200).json(CATEGORIES);
});

app.use(express.static(path.resolve(__dirname, 'static')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'static', index.html))
});

app.listen(PORT, () => console.log(`server started at ${PORT}`));
