import { ensureResponseOk } from './http';

// Skylines has a fixed page size of 50 flights per page.
const PAGE_SIZE = 50;
// We should not iterate indefinitely, so we set a maximum number of pages.
const MAX_PAGES = 500;

export async function loadAllSkylinesFlights(userId) {
  let flights = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    let response = await fetch(
      `https://skylines.aero/api/flights/pilot/${userId}?page=${page}`,
    );
    ensureResponseOk(response);

    let json = await response.json();
    flights.push(...json.flights);

    if (json.flights.length < PAGE_SIZE) {
      break;
    }
  }

  return flights;
}
