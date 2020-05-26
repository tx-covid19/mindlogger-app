import GEOLOCATION_CONSTANTS from './geolocation.constants';

export const clearGeolocationData = () => ({
  type: GEOLOCATION_CONSTANTS.CLEAR,
});

export const setGeolocationAllowed = isGeolocationAllowed => ({
  type: GEOLOCATION_CONSTANTS.SET_GEOLOCATION_ALLOWED,
  payload: isGeolocationAllowed,
});

export const setGeolocationData = data => ({
  type: GEOLOCATION_CONSTANTS.SET_DATA,
  payload: data,
});

export const setStatistics = stats => ({
  type: GEOLOCATION_CONSTANTS.SET_STATISTICS,
  payload: stats,
});

export const setStatisticsSentDate = newDate => ({
  type: GEOLOCATION_CONSTANTS.SET_STATISTICS_SENT,
  payload: newDate,
});
