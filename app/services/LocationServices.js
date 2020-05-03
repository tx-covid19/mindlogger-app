import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

import { setGeolocationData } from '../state/geolocation/geolocation.actions';
import { dataSelector } from '../state/geolocation/geolocation.selectors';
import { getStore } from '../store';

let isBackgroundGeolocationConfigured = false;

export class LocationData {
  constructor() {
    // The desired location interval, and the minimum acceptable interval
    this.locationInterval = 60000 * 0.1; // Time (in milliseconds) between location information polls.  E.g. 60000*5 = 5 minutes

    // minLocationSaveInterval should be shorter than the locationInterval (to avoid strange skips)
    // Minimum time between location information saves.  60000*4 = 4 minutes
    this.minLocationSaveInterval = Math.floor(this.locationInterval * 0.8);

    // Maximum time that we will backfill for missing data
    this.maxBackfillTime = 60000 * 60 * 24; // Time (in milliseconds).  60000 * 60 * 8 = 24 hours
  }

  getLocationData() {
    const state = getStore().getState();
    const locationArray = dataSelector(state);
    return locationArray;
  }

  getPointStats() {
    const locationData = this.getLocationData();

    let lastPoint = null;
    let firstPoint = null;
    let pointCount = 0;

    if (locationData.length) {
      lastPoint = locationData.slice(-1)[0];
      firstPoint = locationData[0];
      pointCount = locationData.length;
    }

    return {
      lastPoint,
      firstPoint,
      pointCount,
    };
  }

  saveLocation(location) {
    // Persist this location data in our local storage of time/lat/lon values
    const locationArray = this.getLocationData();
    // Always work in UTC, not the local time in the locationData
    let unixtimeUTC = Math.floor(location['time']);
    let unixtimeUTC_28daysAgo = unixtimeUTC - 60 * 60 * 24 * 1000 * 28;

    // Verify that at least the minimum amount of time between saves has passed
    // This ensures that no matter how fast GPS coords are delivered, saving
    // does not happen any faster than the minLocationSaveInterval
    if (locationArray.length >= 1) {
      const lastSaveTime = locationArray[locationArray.length - 1]['time'];
      if (lastSaveTime + this.minLocationSaveInterval > unixtimeUTC) {
        console.log('[INFO] Discarding point (too soon):', unixtimeUTC);
        return;
      }
    }

    // Curate the list of points, only keep the last 28 days
    const curated = [];
    for (let i = 0; i < locationArray.length; i++) {
      if (locationArray[i]['time'] > unixtimeUTC_28daysAgo) {
        curated.push(locationArray[i]);
      }
    }

    // Save the location using the current lat-lon and the
    // recorded GPS timestamp
    const lat_lon_time = {
      latitude: location['latitude'],
      longitude: location['longitude'],
      time: unixtimeUTC,
    };
    curated.push(lat_lon_time);
    console.log('[INFO] saved location:', lat_lon_time);

    // SetStoreData(LOCATION_DATA, curated);
    const store = getStore();
    store.dispatch(setGeolocationData(curated));
  }

  /**
   * Validates that `point` has both a latitude and longitude field
   * @param {*} point - Object to validate
   */
  isValidPoint(point) {
    if (!point.latitude && !point.latitude === 0) {
      console.error('`point` param must have a latitude field');
      return false;
    }

    if (!point.longitude && !point.longitude === 0) {
      console.error('`point` param must have a longitude field');
      return false;
    }

    return true;
  }

  /**
   * Validates that an object is a valid geographic bounding box.
   * A valid box has a `ne` and `sw` field that each contain a valid GPS point
   * @param {*} region - Object to validate
   */
  isValidBoundingBox(region) {
    if (!region.ne || !this.isValidPoint(region.ne)) {
      console.error(`invalid 'ne' field for bounding box: ${region.ne}`);
      return false;
    }

    if (!region.sw || !this.isValidPoint(region.sw)) {
      console.error(`invalid 'ne' field for bounding box: ${region.sw}`);
      return false;
    }

    return true;
  }

  /**
   * Returns the most recent point of location data for a user.
   * This is the last item in the location data array.
   */
  async getMostRecentUserLoc() {
    const locData = this.getLocationData();
    return locData[locData.length - 1];
  }

  /**
   * Given a GPS coordinate, check if it is within the bounding
   * box of a region.
   * @param {*} point - Object with a `latitude` and `longitude` field
   * @param {*} region - Object with a `ne` and `sw` field that each contain a GPS point
   */
  isPointInBoundingBox(point, region) {
    if (!this.isValidPoint(point) || !this.isValidBoundingBox(region)) {
      return false;
    }
    const { latitude: pointLat, longitude: pointLon } = point;
    const { latitude: neLat, longitude: neLon } = region.ne;
    const { latitude: swLat, longitude: swLon } = region.sw;

    const [latMax, latMin] = neLat > swLat ? [neLat, swLat] : [swLat, neLat];
    const [lonMax, lonMin] = neLon > swLon ? [neLon, swLon] : [swLon, neLon];

    return pointLat < latMax && pointLat > latMin && pointLon < lonMax && pointLon > lonMin;
  }
}

export default class LocationServices {
  static start() {
    const locationData = new LocationData();
    // handles edge cases around Android where start might get called again even though
    // the service is already created.  Make sure the listeners are still bound and exit
    if (isBackgroundGeolocationConfigured) {
      BackgroundGeolocation.start();
      return;
    }

    // PushNotificationIOS.requestPermissions();
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 5,
      distanceFilter: 5,
      notificationTitle: 'Location Enabled',
      notificationText: 'Location is now enabled.',
      debug: false, // when true, it beeps every time a loc is read
      startOnBoot: true,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,

      interval: locationData.locationInterval,
      fastestInterval: locationData.locationInterval,
      activitiesInterval: locationData.locationInterval,

      activityType: 'AutomotiveNavigation',
      pauseLocationUpdates: false,
      saveBatteryOnBackground: true,
      stopOnStillActivity: false,
    });

    BackgroundGeolocation.on('location', (location) => {
      // handle your locations here
      /* SAMPLE OF LOCATION DATA OBJECT
                {
                  "accuracy": 20, "altitude": 5, "id": 114, "isFromMockProvider": false,
                  "latitude": 37.4219983, "locationProvider": 1, "longitude": -122.084,
                  "mockLocationsEnabled": false, "provider": "fused", "speed": 0,
                  "time": 1583696413000
                }
            */
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask((taskKey) => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        locationData.saveLocation(location);
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    if (Platform.OS === 'android') {
      // This feature only is present on Android.
      BackgroundGeolocation.headlessTask(async (event) => {
        // Application was shutdown, but the headless mechanism allows us
        // to capture events in the background.  (On Android, at least)
        if (event.name === 'location' || event.name === 'stationary') {
          locationData.saveLocation(event.params);
        }
      });
    }

    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log('[INFO] BackgroundGeolocation authorization status: ', status);

      if (status !== BackgroundGeolocation.AUTHORIZED) {
        console.log('unauthorized');
      } else {
        BackgroundGeolocation.start(); // triggers start on start event
      }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.on('abort_requested', () => {
      console.log('[INFO] Server responded with 285 Updates Not Required');
    });

    BackgroundGeolocation.on('http_authorization', () => {
      console.log('[INFO] App needs to authorize the http requests');
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] stop');
    });

    BackgroundGeolocation.on('stationary', () => {
      console.log('[INFO] stationary');
    });

    BackgroundGeolocation.checkStatus(status => {
      console.log(
        '[INFO] BackgroundGeolocation service is running',
        status.isRunning,
      );
      console.log(
        '[INFO] BackgroundGeolocation services enabled',
        status.locationServicesEnabled,
      );
      console.log(
        '[INFO] BackgroundGeolocation auth status: ' + status.authorization,
      );

      BackgroundGeolocation.start(); // triggers start on start event
      isBackgroundGeolocationConfigured = true;
    });
  }

  static stop() {
    // unregister all event listeners
    BackgroundGeolocation.removeAllListeners();
    BackgroundGeolocation.stop();

    isBackgroundGeolocationConfigured = false;
  }
}
