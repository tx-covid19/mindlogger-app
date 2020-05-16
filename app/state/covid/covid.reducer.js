import COVID_CONSTANTS from './covid.constants';

export const initialState = {
  stats: null,
  zipcode: '',
  isFetchingStats: false,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case COVID_CONSTANTS.CLEAR_COVID_STATS:
      return initialState;
    case COVID_CONSTANTS.SET_COVID_ZIPCODE:
      return {
        ...state,
        zipcode: action.payload.zipcode,
      };
    case COVID_CONSTANTS.SET_COVID_STATS:
      return {
        ...state,
        stats: action.payload.stats,
        zipcode: action.payload.zipcode,
      };
    case COVID_CONSTANTS.SET_FETCHING_COVID_STATS:
      return {
        ...state,
        isFetchingStats: action.payload,
      };
    default:
      return state;
  }
};
