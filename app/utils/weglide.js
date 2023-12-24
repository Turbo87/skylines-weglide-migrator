import { getJson } from './http';

// WeGlide only allows steps of `100` for the `skip` parameter.
const PAGE_SIZE = 100;
// We should not iterate indefinitely, so we set a maximum number of pages.
const MAX_SKIP = 50000;

export async function loadUserDetails(userId) {
  let { json } = await getJson(
    `https://api.devs.glidercheck.com/v1/user/${userId}`,
  );
  return json;
}

export async function loadAllWeglideFlights(userId) {
  let flights = [];

  for (let skip = 0; skip <= MAX_SKIP; skip += PAGE_SIZE) {
    let { json } = await getJson(
      `https://api.devs.glidercheck.com/v1/flight?user_id_in=${userId}&limit=${PAGE_SIZE}&skip=${skip}`,
    );

    flights.push(...json);

    if (json.length < PAGE_SIZE) {
      break;
    }
  }

  return flights;
}
