import React from 'react';
import {
  ActivityIndicator,
  View,
} from 'react-native';
import {
  Button,
  Text,
  Form,
} from 'native-base';
import {
  reduxForm,
  Field,
  propTypes,
} from 'redux-form';
import styles from './styles';
import { FormInputItem } from '../../components/form/FormItem';
import { colors } from '../../theme';

const TestResultsForm = ({
  error,
  handleSubmit,
  submitting,
  primaryColor,
}) => (
  <Form>
    <Field
      component={FormInputItem}
      placeholder="Test ID"
      placeholderTextColor={colors.secondary_50}
      autoCapitalize="none"
      style={styles.text}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
    <View style={styles.buttonContainer}>
      <Button style={styles.button} block onPress={handleSubmit} disabled={submitting}>
        {submitting
          ? <ActivityIndicator color={primaryColor} />
          : <Text style={[styles.buttonText, { color: primaryColor }]}>Submit</Text>}
      </Button>
    </View>
  </Form>
);

TestResultsForm.propTypes = {
  ...propTypes,
};

const TestResultsFormConnected = reduxForm({
  form: 'test-results-form',
  enableReinitialize: true,
})(TestResultsForm);

export default TestResultsFormConnected;
