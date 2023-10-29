const launchesDatabase = require("./launches.mongo");
const planets = require('./planets.mongo')

const defaultFlightNumber = 100

const launch = {
  flightNumber: 100,
  mission: "Keplar Exploration x",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-296 f",
  customers: ["NASA", "ZTM"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
  return await launchesDatabase.findOne({
    flightNumber: launchId
  });
}

async function getLatestFlightNumber(){
  const latestLaunch = await launchesDatabase
  .findOne()
  .sort('-flightNumber')

  if(!latestLaunch) {
    return defaultFlightNumber
  }

  return latestLaunch.flightNumber
}

async function getAllLaunches() {
  return await launchesDatabase.find(
    {},
    {
      __v: 0,
      _id: 0,
    }
  );
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  })
  if (!planet) {
    throw new Error('No matching planet was found')
  }

  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Zero to Mastery', 'NASA'],
    flightNumber: newFlightNumber
  })

  await saveLaunch(newLaunch)
}

async function abortLaunchById(launchId) {
   const aborted = await launchesDatabase.updateOne({
    flightNumber: launchId,
  }, {
    upcoming: false,
    success: false,
  })

  return aborted.ok === 1 && aborted.nModified === 1
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
