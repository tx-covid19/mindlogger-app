import COVID_CONSTANTS from './covid.constants';

export const initialState = {
  stats: null,
  timeseries: {},
  zipcode: '',
  isFetchingStats: false,
  isFetchingTimeseries: false,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case COVID_CONSTANTS.CLEAR:
      return initialState;
    case COVID_CONSTANTS.SET_ZIPCODE:
      return {
        ...state,
        zipcode: action.payload.zipcode,
      };
    case COVID_CONSTANTS.SET_STATS:
      return {
        ...state,
        stats: action.payload.stats,
        zipcode: action.payload.zipcode,
      };
    case COVID_CONSTANTS.SET_FETCHING_STATS:
      return {
        ...state,
        isFetchingStats: action.payload,
      };
    case COVID_CONSTANTS.SET_TIMESERIES:
      return {
        ...state,
        timeseries: action.payload.timeseries,
        zipcode: action.payload.zipcode,
      };
    case COVID_CONSTANTS.SET_FETCHING_TIMESERIES:
      return {
        ...state,
        isFetchingTimeseries: action.payload,
      };
    default:
      return state;
  }
};
