import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { Text, Button, Input, Spinner } from 'native-base';
import TouchBox from './core/TouchBox';
import { BodyText } from './core';
import theme from '../themes/variables';
import { colors } from '../theme';
import { formatTime } from '../services/time';

const icon = require('../../img/covid.png');

const styles = StyleSheet.create({
  box: {
    position: 'relative',
    fontFamily: theme.fontFamily,
  },
  inner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    fontFamily: theme.fontFamily,
    overflow: 'hidden',
  },
  imageBlock: {
    textAlign: 'center',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  image: {
    height: 64,
    width: 64,
    resizeMode: 'contain',
  },
  textBlock: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    flexShrink: 1,
    marginLeft: 16,
    marginRight: 16,
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
      <Text style={{ fontSize: 14, textAlign: 'center' }}>Please, inform your zip code to get the last COVID-19 stats.</Text>
    );
  }
  renderNotFoundText() {
    return (
      <Text style={{ fontSize: 14, textAlign: 'center' }}>The zip code was not found. Please, review it.</Text>
    );
  }

  renderStats(stats) {
    const fmt = (n) => n.toLocaleString('en-US');
    const { country, state, county } = stats;
    return (
      <>
        <BodyText>
          {country.abbr || country.name || 'Country'}: {fmt(country.confirmed)} ({fmt(country.deaths)})
        </BodyText>
        <BodyText>
          {state.abbr || state.name || 'State'}: {fmt(state.confirmed)} ({fmt(state.deaths)})
        </BodyText>
        <BodyText>
          {county.name || 'County'}: {fmt(county.confirmed)} ({fmt(county.deaths)})
        </BodyText>
        <BodyText style={{fontSize: 12, color: colors.grey }}>
          Last updated: {formatTime(stats.latest_update)}
        </BodyText>
      </>
    );
  }

  renderLoading() {
    return (<Spinner color={colors.primary} style={{ marginLeft: -16, height: 60 }} />);
  }

  render() {
    const { stats, zipcode, loading, onPress } = this.props;
    const { editing } = this.state;

    return (
      <View style={styles.box}>
        <TouchBox onPress={onPress}>
          <View style={styles.inner}>
            <View style={styles.imageBlock}>
              <Image style={styles.image} source={icon} />
            </View>
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
                  <BodyText style={{ textAlign: 'center', fontSize: 14, color: colors.grey }}>
                    Zip code
                  </BodyText>
                  <BodyText style={{ textAlign: 'center' }}>
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
