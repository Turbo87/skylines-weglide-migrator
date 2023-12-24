import { ensureResponseOk } from './http';

// WeGlide only allows steps of `100` for the `skip` parameter.
const PAGE_SIZE = 100;
// We should not iterate indefinitely, so we set a maximum number of pages.
const MAX_SKIP = 50000;

export async function loadAllWeglideFlights(userId) {
  let flights = [];

  for (let skip = 0; skip <= MAX_SKIP; skip += PAGE_SIZE) {
    let response = await fetch(
      `https://api.devs.glidercheck.com/v1/flight?user_id_in=${userId}&limit=${PAGE_SIZE}&skip=${skip}`,
    );
    ensureResponseOk(response);

    let pageFlights = await response.json();
    flights.push(...pageFlights);

    if (pageFlights.length < PAGE_SIZE) {
      break;
    }
  }

  return flights;
}
