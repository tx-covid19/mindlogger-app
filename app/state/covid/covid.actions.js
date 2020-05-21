import COVID_CONSTANTS from './covid.constants';

export const updateCovidZipcode = zipcode => ({
  type: COVID_CONSTANTS.SET_COVID_ZIPCODE,
  payload: { zipcode },
});

export const updateCovidStats = (zipcode, stats) => ({
  type: COVID_CONSTANTS.SET_COVID_STATS,
  payload: { zipcode, stats },
});

export const setFetchingCovidStats = isFetching => ({
  type: COVID_CONSTANTS.SET_FETCHING_COVID_STATS,
  payload: isFetching,
});

export const clearCovidStats = () => ({
  type: COVID_CONSTANTS.CLEAR_COVID_STATS,
});
