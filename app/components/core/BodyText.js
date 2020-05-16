import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';
import theme from '../../themes/base-theme';

const styles = StyleSheet.create({
  body: {
    fontWeight: 'normal',
    fontFamily: theme.fontFamily,
    fontSize: 16,
    color: colors.tertiary,
  },
});

export const BodyText = ({ children, style }) => (
  <Text style={[styles.body, style]}>
    {children}
  </Text>
);

BodyText.defaultProps = {
  style: {},
};

BodyText.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};
