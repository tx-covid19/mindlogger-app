import GEOLOCATION_CONSTANTS from './geolocation.constants';

export const initialState = {
  data: [],
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case GEOLOCATION_CONSTANTS.CLEAR:
      return initialState;
    case GEOLOCATION_CONSTANTS.SET_DATA:
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};
