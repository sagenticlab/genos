/**
 * GenOS Function: formatGeoResult
 */

export async function formatGeoResult(...args) {
  console.log("Function formatGeoResult called with:", args);

  // TODO: Implement your logic

  const json = JSON.parse(args[0]);
  console.log("Parsed JSON results:", json.results);

  return json.results[0]; // Example: returning the first element of the result array as is
}
