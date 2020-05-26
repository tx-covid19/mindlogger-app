import { Platform } from 'react-native';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

import { setGeolocationData } from '../state/geolocation/geolocation.actions';
import { dataSelector } from '../state/geolocation/geolocation.selectors';
import { areLocationsNearby } from '../helpers/Location';
import { getStore } from '../store';

let isBackgroundGeolocationConfigured = false;

export class LocationData {
  constructor() {
    // The desired location interval, and the minimum acceptable interval
    // Time (in milliseconds) between location information polls.
    this.locationInterval = 60000 * 5;

    // minLocationSaveInterval should be shorter than the locationInterval (to avoid strange skips)
    // Minimum time between location information saves.  60000*4 = 4 minutes
    this.minLocationSaveInterval = Math.floor(this.locationInterval * 0.5);

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

  // Get human-readable timestamp for debugging purposes.
  getFormattedTime(unixTimeUtc) {
    const date = new Date(unixTimeUtc);
    const hours = date.getHours();
    const minutes = `0${date.getMinutes()}`;
    const seconds = `0${date.getSeconds()}`;
    const formattedTime = `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
    return formattedTime;
  }

  saveLocation(location) {
    // Persist this location data in our local storage of time/lat/lon values
    const locationArray = this.getLocationData();
    console.log('[INFO] Found stored location data', locationArray.length);
    // Always work in UTC, not the local time in the locationData
    const unixTimeUtc = Math.floor(location.time);
    const unixTimeUtc28DaysAgo = unixTimeUtc - 60 * 60 * 24 * 1000 * 28;

    const formattedTimeUtc = this.getFormattedTime(unixTimeUtc);

    // Verify that at least the minimum amount of time between saves has passed
    // This ensures that no matter how fast GPS coords are delivered, saving
    // does not happen any faster than the minLocationSaveInterval
    if (locationArray.length >= 1) {
      const lastSaveTime = locationArray[locationArray.length - 1].time;
      if (lastSaveTime + this.minLocationSaveInterval > unixTimeUtc) {
        console.log('[INFO] Discarding point (too soon):', unixTimeUtc);
        return;
      }
    }

    // Curate the list of points, only keep the last 28 days
    const curated = [];
    for (let i = 0; i < locationArray.length; i += 1) {
      if (locationArray[i].time > unixTimeUtc28DaysAgo) {
        curated.push(locationArray[i]);
      }
    }

    // Backfill the stationary points, if available
    // The assumption is that if we see a gap in the data, and the
    // device hasn't moved significantly, then we can fill in the missing data
    // with the current location.  This makes it easier for a health authority
    // person to have a set of locations over time, and they can manually
    // redact the time frames that aren't correct.
    if (curated.length >= 1) {
      const lastLocation = curated[curated.length - 1];

      const areCurrentPreviousNearby = areLocationsNearby(
        lastLocation.latitude,
        lastLocation.longitude,
        location.latitude,
        location.longitude,
      );

      // Actually do the backfill if the current point is nearby the previous
      // point and the time is within the maximum time to backfill.
      const lastRecordedTime = lastLocation.time;
      if (
        areCurrentPreviousNearby
        && unixTimeUtc - lastRecordedTime < this.maxBackfillTime
      ) {
        for (
          let newTS = lastRecordedTime + this.locationInterval;
          newTS < unixTimeUtc - this.locationInterval;
          newTS += this.locationInterval
        ) {
          const formattedBackfillTime = this.getFormattedTime(newTS);
          const geolocationObj = {
            latitude: lastLocation.latitude,
            longitude: lastLocation.longitude,
            formattedTime: formattedBackfillTime,
            time: newTS,
          };
          console.log('[INFO] backfill location:', geolocationObj);
          curated.push(geolocationObj);
        }
      }
    }

    // Save the location using the current lat-lon and the
    // recorded GPS timestamp
    console.log('curated before push', curated);
    const latLonTime = {
      latitude: location.latitude,
      longitude: location.longitude,
      time: unixTimeUtc,
      formattedTimeUtc,
    };
    curated.push(latLonTime);
    console.log('curated after push', curated);
    console.log('[INFO] saved location:', latLonTime);

    // SetStoreData(LOCATION_DATA, curated);
    const store = getStore();
    store.dispatch(setGeolocationData(curated));
  }

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

  // Returns the most recent point of location data for a user.
  // This is the last item in the location data array.
  getMostRecentUserLoc() {
    const locData = this.getLocationData();
    return locData[locData.length - 1];
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
      stationaryRadius: 1,
      distanceFilter: 1,
      notificationTitle: 'Location Enabled',
      notificationText: 'HornSense is monitoring your location.',
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

    BackgroundGeolocation.on('stationary', (location) => {
      console.log('[INFO] stationary');
      BackgroundGeolocation.startTask((taskKey) => {
        locationData.saveLocation(location);
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.checkStatus((status) => {
      console.log(
        '[INFO] BackgroundGeolocation service is running',
        status.isRunning,
      );
      console.log(
        '[INFO] BackgroundGeolocation services enabled',
        status.locationServicesEnabled,
      );
      console.log(
        `[INFO] BackgroundGeolocation auth status: ${status.authorization}`,
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
