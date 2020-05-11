import React from 'react';
import { Button, Text } from 'native-base';
import theme from '../../themes/base-theme';

// eslint-disable-next-line
export default ({ children, onPress }) => (
  <Button onPress={onPress} full rounded style={{ marginTop: 20 }}>
    <Text style={{ color: 'white', fontWeight: 'bold', fontFamily: theme.fontFamily }}>
      {children}
    </Text>
  </Button>
);
