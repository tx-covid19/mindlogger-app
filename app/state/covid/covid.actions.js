import COVID_CONSTANTS from './covid.constants';

export const updateCovidZipcode = zipcode => ({
  type: COVID_CONSTANTS.SET_ZIPCODE,
  payload: { zipcode },
});

export const updateCovidStats = (zipcode, stats) => ({
  type: COVID_CONSTANTS.SET_STATS,
  payload: { zipcode, stats },
});

export const setFetchingCovidStats = isFetching => ({
  type: COVID_CONSTANTS.SET_FETCHING_STATS,
  payload: isFetching,
});

export const updateCovidTimeseries = (zipcode, timeseries) => ({
  type: COVID_CONSTANTS.SET_TIMESERIES,
  payload: { zipcode, timeseries },
});

export const setFetchingCovidTimeseries = isFetching => ({
  type: COVID_CONSTANTS.SET_FETCHING_TIMESERIES,
  payload: isFetching,
});

export const clearCovidData = () => ({
  type: COVID_CONSTANTS.CLEAR,
});
