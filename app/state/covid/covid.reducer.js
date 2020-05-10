import COVID_CONSTANTS from './covid.constants';

export const initialState = {
  data: {},
  isFetchingData: false,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case COVID_CONSTANTS.CLEAR:
      return initialState;
    case COVID_CONSTANTS.SET_COVID_DATA:
      return {
        ...state,
        data: action.payload,
      };
    case COVID_CONSTANTS.SET_FETCHING_COVID_DATA:
      return {
        ...state,
        isFetchingData: action.payload,
      };
    default:
      return state;
  }
};
