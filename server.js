const express = require('express');
const bodyParser = require('body-parser');
const r = require('rethinkdb');
const { getConnection } = require('./db/rethinkdb');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/items', (req, res) => {
  const newItem = req.body;
  r.table('items').insert(newItem).run(getConnection(), (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

app.get('/api/items', (req, res) => {
  r.table('items').run(getConnection(), (err, cursor) => {
    if (err) res.status(500).send(err);
    else cursor.toArray((err, result) => {
      if (err) res.status(500).send(err);
      else res.send(result);
    });
  });
});

app.put('/api/items/:id', (req, res) => {
  const updatedItem = req.body;
  r.table('items').get(req.params.id).update(updatedItem).run(getConnection(), (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

app.delete('/api/items/:id', (req, res) => {
  r.table('items').get(req.params.id).delete().run(getConnection(), (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

app.listen(3000,'localhost',() => {
  console.log('Server 3000 portunda dinleniyor');
});
