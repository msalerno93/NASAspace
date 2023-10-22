const launches = new Map()

const launch = {
    flightNumber: 100,
    mission: "Keplar Exploration x",
    rocket: "Explorer IS1",
    launchDate: new Date('December 27, 2030'),
    destination: "Keplar-442 b",
    customers: ["NASA", "ZTM"],
    upcoming: true,
    success: true
}

launches.set(launch.flightNumber, launch)

module.exports = {
    launches,
}