import geolocationReducer, { initialState } from './geolocation.reducer';
import { setGeolocationData } from './geolocation.actions';

test('it has an initial state', () => {
  expect(geolocationReducer(undefined, { type: 'foo' })).toEqual(initialState);
});

test('it sets geolocation data', () => {
  expect(geolocationReducer(initialState, setGeolocationData('777'))).toEqual({
    ...initialState,
    data: '777',
  });
});
