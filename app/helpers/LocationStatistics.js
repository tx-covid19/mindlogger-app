export function distanceBetweenPoints(lat1, lon1, lat2, lon2) {
  // Calculate the distance between (Lat1, Lon1) & (Lat2, Lon2) in meters
  // Using the the Spherical Law of Cosines method.
  //    https://www.movable-type.co.uk/scripts/latlong.html
  //    https://en.wikipedia.org/wiki/Spherical_law_of_cosines
  const deltaLon = lon2 - lon1;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const deltaLambda = (deltaLon * Math.PI) / 180;
  const R = 6371e3; // gives d in metres
  const d = Math.acos(
    Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(deltaLambda),
  ) * R;
  return d;
}

export function standardDeviation() {
  return null;
}
