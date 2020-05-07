import GEOLOCATION_CONSTANTS from './geolocation.constants';

export const clearGeolocationData = () => ({
  type: GEOLOCATION_CONSTANTS.CLEAR,
});

export const setGeolocationData = info => ({
  type: GEOLOCATION_CONSTANTS.SET_DATA,
  payload: info,
});
