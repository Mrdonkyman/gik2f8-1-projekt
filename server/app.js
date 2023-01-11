const express = require('express');
const app = express();

const fs = require('fs/promises');

const PORT = 5000;
app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
  });

app.get('/comments', async (req, res) => {
  try {
    const comments = await fs.readFile('./comments.json');
    res.send(JSON.parse(comments));
  } catch (error) {
    res.status(500).send({ error });
  }
});
app.post('/comments', async (req, res) => {
  try {
    const comment = req.body;
    const buffer = await fs.readFile('./comments.json');
    const currentComments = JSON.parse(buffer);
    let maxCommentsId = 1;
    if (currentComments && currentComments.length > 0) {
      maxCommentsId = currentComments.reduce(
        (maxId, currentElement) =>
          currentElement.id > maxId ? currentElement.id : maxId,
        maxCommentsId
      );
    }

    const newComment = { id: maxCommentsId + 1, ...comment };
    const newList = currentComments ? [...currentComments, newComment] : [newComment];

    await fs.writeFile('./comments.json', JSON.stringify(newList));
    res.send(newComment);
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});
app.delete('/comments/:id', async (req, res) => {
  console.log(req);
  try {
    const id = req.params.id;
    const buffer = await fs.readFile('./comments.json');
    const currentComments = JSON.parse(buffer);
    if (currentComments.length > 0) {
      await fs.writeFile(
        './comments.json',
        JSON.stringify(currentComments.filter((comment) => comment.id != id))
      );
      res.send({ message: `Uppgift med id ${id} togs bort` });
    } else {
      res.status(404).send({ error: 'Ingen uppgift att ta bort' });
    }
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});


app.listen(PORT, () => console.log('Server running on http://localhost:5000'));