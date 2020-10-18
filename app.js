const express = require('express');
const app = express();
const {v4} = require('uuid');

const PORT = process.env.POTR;

let GOODS = [
  {id: v4(), title: 'молоко 1л', category: 'продукты', price: 45, amount: 2, isBought: false},
  {id: v4(), title: 'old spice', category: 'косметика', price: 300, amount: 1, isBought: false}
];

let CATEGORIES = ['продукты', 'косметика'];

let TOKEN = v4();

app.use(express.json());

app.get('/api', (req, res)=>{
  res.status(200).json({message: `ok`});
})

app.post('/api/login', (req, res)=>{
  if (req.body.email === `test`) {
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
  GOODS = GOODS.filter(it => it.id !== req.params.id);
  res.status(200).json({message: 'succes'});
});

app.patch('/api/goods/:id', checkSignIn, (req, res) => {
  const idx = GOODS.findIndex(it => it.id === req.params.id);
  GOODS[idx].isBought = !GOODS[idx].isBought;
  res.status(200).json({message: 'succes'});
});

app.get('/api/categories', checkSignIn, (req, res) => {
  res.status(200).json(CATEGORIES);
});

app.patch('/api/categories', checkSignIn, (req, res) => {
  const idx = GOODS.findIndex(it => it === req.params);
  GOODS.splice(idx, 1);
  res.status(200).json({message: 'succes'});
});

app.listen(PORT, () => console.log('server started...'));
