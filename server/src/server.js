const http = require("http");
const mongoose = require('mongoose')

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.models");

const PORT = process.env.PORT || 8000;

const MONGO_URL = "mongodb+srv://msalerno1993:ApexLegends93@cluster0.lpfzz5l.mongodb.net/nasa?retryWrites=true&w=majority"

const server = http.createServer(app);

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready');
})

async function startServer() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: false
  })
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer()