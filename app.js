const express = require('express');
const app = express();
const {v4} = require('uuid');


let GOODS = [
  {id: v4(), title: 'молоко', category: 'продукты', price: 45, amount: 2, isBought: false}
];

let CATEGORIES = ['продукты', 'косметика'];

app.use(express.json());

app.get('/api/goods', (req, res) => {
  res.status(200).json(GOODS);
});

app.post('/api/goods', (req, res) => {
  const good = {...req.body, id: v4(), isBought: false};
  GOODS.push(good);
  res.status(201).json(good);
});

app.delete('/api/goods/:id', (req, res) => {
  GOODS = GOODS.filter(it => it.id !== req.params.id);
  res.status(200).json({message: 'succes'});
});

app.patch('/api/goods/:id', (req, res) => {
  const idx = GOODS.findIndex(it => it.id === req.params.id);
  GOODS[idx].isBought = !GOODS[idx].isBought;
  res.status(200).json({message: 'succes'});
});

app.get('/api/categories', (req, res) => {
  res.status(200).json(CATEGORIES);
});

app.patch('/api/categories', (req, res) => {
  const idx = GOODS.findIndex(it => it === req.params);
  GOODS.splice(idx, 1);
  res.status(200).json({message: 'succes'});
});

app.listen(3000, () => console.log('server started...'));
