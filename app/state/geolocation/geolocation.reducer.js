import GEOLOCATION_CONSTANTS from './geolocation.constants';

export const initialState = {
  isGeolocationAllowed: true,
  data: [],
  statisticsLastSent: null,
  statistics: {},
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case GEOLOCATION_CONSTANTS.CLEAR:
      return initialState;
    case GEOLOCATION_CONSTANTS.SET_GEOLOCATION_ALLOWED:
      return {
        ...state,
        isGeolocationAllowed: action.payload,
      };
    case GEOLOCATION_CONSTANTS.SET_DATA:
      return {
        ...state,
        data: action.payload,
      };
    case GEOLOCATION_CONSTANTS.SET_STATISTICS:
      return {
        ...state,
        statistics: action.payload,
      };
    case GEOLOCATION_CONSTANTS.SET_STATISTICS_SENT:
      return {
        ...state,
        statisticsLastSent: action.payload,
      };
    default:
      return state;
  }
};
