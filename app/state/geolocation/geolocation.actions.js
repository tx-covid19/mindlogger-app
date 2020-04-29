import GEOLOCATION_CONSTANTS from './geolocation.constants';

export const setGeolocationData = info => ({
  type: GEOLOCATION_CONSTANTS.SET_DATA,
  payload: info,
});
