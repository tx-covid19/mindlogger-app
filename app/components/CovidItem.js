import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { Text, Button, Input, Spinner } from 'native-base';
import TouchBox from './core/TouchBox';
import {
  SubHeading,
  BodyText,
} from './core';
import AppletImage from './AppletImage';
import theme from '../themes/variables';
import { colors } from '../theme';

// TODO return state acronym on endpoint
const tempStateMapping = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY',
}

const icon = require('../../img/covid.png');

const styles = StyleSheet.create({
  box: {
    position: 'relative',
    fontFamily: theme.fontFamily,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    fontFamily: theme.fontFamily,
    overflow: 'hidden',
  },
  image: {
    height: 64,
    width: 64,
    resizeMode: 'contain',
  },
  textBlock: {
    flex: 1,
    flexGrow: 1,
    marginLeft: 16,
    fontFamily: theme.fontFamily,
  },
  zipBlock: {
    fontFamily: theme.fontFamily,
    textAlign: 'center',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  zipInput: {
    fontSize: 12,
    lineHeight: 14,
    height: 12,
    width: 70,
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 2,
    
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.grey,
  },
  zipButton: {
    fontSize: 14,
    margin: 0,
    paddingTop: 2,
    paddingBottom: 2,
    height: 'auto',
    width: 70,
  },
  zipButtonText: {
    fontSize: 16,
    margin: 0,
    padding: 0,
    textAlign: 'center',
  },
  notification: {
    position: 'absolute',
    top: 0,
    right: 10,
  },
});

class CovidItem extends Component {
  constructor(props) {
    super(props);
    const { zipcode } = this.props;
    this.state = {
      editing: !zipcode,
      zipcode
    }
  }

  handlePress = (e) => {
    this.setState({ editing: true })
  }

  handlePressSave = (e) => {
    const { onChangeZipcode } = this.props;
    const { zipcode } = this.state;
    if (zipcode.trim().length > 0) {
      onChangeZipcode && onChangeZipcode(zipcode);
      this.setState({ editing: false });
    }
  }

  renderText() {
    return (
      <Text>Please, inform your zip code to get the last COVID-19 stats.</Text>
    );
  }
  renderNotFoundText() {
    return (
      <Text style={{ paddingRight: 5 }}>The zip code was not found. Please, review it.</Text>
    );
  }

  renderStats(stats) {
    const fmt = (n) => n.toLocaleString('en-US');
    const { country, state, county } = stats;
    return (
      <>
        <BodyText style={{ fontFamily: theme.fontFamily }}>
          US: {fmt(country.confirmed)} ({fmt(country.deaths)})
        </BodyText>
        <BodyText style={{ fontFamily: theme.fontFamily }}>
          {tempStateMapping[state.name] || 'State'}: {fmt(state.confirmed)} ({fmt(state.deaths)})
        </BodyText>
        <BodyText style={{ fontFamily: theme.fontFamily }}>
          {county.name || 'County'}: {fmt(county.confirmed)} ({fmt(county.deaths)})
        </BodyText>
      </>
    );
  }

  renderLoading() {
    return (<Spinner color={colors.primary} style={{ marginLeft: -16, height: 60 }} />);
  }

  render() {
    const { stats, zipcode, loading } = this.props;
    const { editing } = this.state;

    return (
      <View style={styles.box}>
        <TouchBox onPress={() => {}}>
          <View style={styles.inner}>
            <Image style={styles.image} source={icon} />
            <View style={styles.textBlock}>
              { 
                stats ? 
                this.renderStats(stats) :
                (
                  stats === false ?
                  this.renderNotFoundText() :
                  (
                    loading ? (
                      this.renderLoading()
                    ) : (
                      this.renderText()
                    )
                  )
                )
              }
            </View>
            <View style={styles.zipBlock}>
              { stats !== false && (loading || !editing) ? (
                <TouchableOpacity onPress={this.handlePress}>
                  <BodyText style={{ fontFamily: theme.fontFamily, textAlign: 'center', fontSize: 14, color: colors.grey }}>
                    Zip code
                  </BodyText>
                  <BodyText style={{ fontFamily: theme.fontFamily, textAlign: 'center' }}>
                    { zipcode || this.state.zipcode }
                  </BodyText>
                </TouchableOpacity>
              ) : (
                <>
                  <Input
                    placeholder="Zip Code"
                    style={styles.zipInput}
                    value={this.state.zipcode || ''}
                    onChangeText={(zipcode) => this.setState({ zipcode })}
                  />
                  <Button style={styles.zipButton} onPress={this.handlePressSave}>
                    <Text style={styles.zipButtonText}>Save</Text>
                  </Button>
                </>
              ) }
            </View>
          </View>
        </TouchBox>
      </View>
    );
  };
}

CovidItem.propTypes = {
};

export default CovidItem;
