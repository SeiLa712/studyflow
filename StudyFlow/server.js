const app = require("./server/server.js");

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`StudyFlow funcionando na porta ${port}`);
});

module.exports = app;