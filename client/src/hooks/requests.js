const API_URL = "http://localhost:8000/v1";

async function httpGetPlanets() {
  const resp = await fetch(`${API_URL}/planets`);
  return await resp.json();
  // Load planets and return as JSON.
}

async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "POST",
      body: JSON.stringify(launch),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {

  try{
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    })
  }catch(err){
    console.log(err);
    return {
      ok: false
    }
  }

}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
