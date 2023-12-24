import { getJson } from './http';

// Skylines has a fixed page size of 50 flights per page.
const PAGE_SIZE = 50;
// We should not iterate indefinitely, so we set a maximum number of pages.
const MAX_PAGES = 500;

export async function loadUserDetails(userId) {
  let { json } = await getJson(`https://skylines.aero/api/users/${userId}`);
  return json;
}

export async function loadAllSkylinesFlights(userId) {
  let flights = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    let { json } = await getJson(
      `https://skylines.aero/api/flights/pilot/${userId}?page=${page}`,
    );

    flights.push(...json.flights);

    if (json.flights.length < PAGE_SIZE) {
      break;
    }
  }

  return flights;
}
