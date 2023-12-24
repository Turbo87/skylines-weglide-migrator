export async function getJson(...args) {
  let response = await fetch(...args);
  ensureResponseOk(response);
  return await response.json();
}

export function ensureResponseOk(response) {
  if (!response.ok) {
    throw errorFromResponse(response);
  }
}

export function errorFromResponse(response) {
  return new Error(
    `HTTP request (${response.url}) failed with status code ${response.status}`,
  );
}
