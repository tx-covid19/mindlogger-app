export const distanceBetweenPoints = (lat1, lon1, lat2, lon2) => {
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
};

export const areLocationsNearby = (lat1, lon1, lat2, lon2) => {
  const nearbyDistance = 20; // in meters, anything closer is "nearby"

  // these numbers from https://en.wikipedia.org/wiki/Decimal_degrees
  const notNearbyInLatitude = 0.00017966; // = nearbyDistance / 111320
  const notNearbyInLongitude23Lat = 0.00019518; // = nearbyDistance / 102470
  const notNearbyInLongitude45Lat = 0.0002541; // = nearbyDistance / 78710
  const notNearbyInLongitude67Lat = 0.00045981; // = nearbyDistance / 43496

  const deltaLat = lat2 - lat1;
  const deltaLon = lon2 - lon1;

  // Initial checks we can do quickly.  The idea is to filter out any cases where the
  //   difference in latitude or the difference in longitude must be larger than the
  //   nearby distance, since this can be calculated trivially.
  if (Math.abs(deltaLat) > notNearbyInLatitude) {
    return false;
  }
  if (Math.abs(lat1) < 23) {
    if (Math.abs(deltaLon) > notNearbyInLongitude23Lat) {
      return false;
    }
  } else if (Math.abs(lat1) < 45) {
    if (Math.abs(deltaLon) > notNearbyInLongitude45Lat) {
      return false;
    }
  } else if (Math.abs(lat1) < 67) {
    if (Math.abs(deltaLon) > notNearbyInLongitude67Lat) {
      return false;
    }
  }

  // Close enough to do a detailed calculation.
  const dist = distanceBetweenPoints(lat1, lon1, lat2, lon2);

  // closer than the "nearby" distance?
  if (dist < nearbyDistance) {
    return true;
  }
  return false;
};

export function standardDeviation() {
  // TODO - Calculate measure of dispersion
  return null;
}
