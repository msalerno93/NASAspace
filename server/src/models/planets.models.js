const { parse } = require("csv-parse");
const fs = require("fs");
const path = require('path')
const planets = require('./planets.mongo');
const { error } = require("console");

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.36
  );
};
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'keplar_data.csv'))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data)
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err)
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length
        console.log(
          `${countPlanetsFound} is the amount of habitable planets found`);
        resolve()
      });
  });
}

async function getAllPlanets() {
  return await planets.find({}, {
    '__v': 0, '_id': 0
  })
}

async function savePlanet(planet){
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name,
    }, {
      keplerName: planet.kepler_name,
    }, {
      upsert: true,
    })
  }catch(err){
    console.error(`Could not save a planet ${err}`)
  }
}

module.exports = {
  getAllPlanets,
  loadPlanetsData
};
