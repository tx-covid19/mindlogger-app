import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Text } from 'native-base';
import SliderComponent from 'react-native-slider';
import { getURL } from '../../services/helper';
import { colors } from '../../themes/colors';

const NUM_STEPS = 200;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 20,
  },
  sliderWrapper: {
    width: '100%',
    justifyContent: 'center',
    paddingLeft: 35,
    paddingRight: 35,
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  thumbUnselected: {
    width: 26,
    height: 26,
    borderRadius: 26 / 2,
    backgroundColor: 'transparent',
    borderColor: '#919191',
    borderWidth: 2,
    elevation: 2,
    borderStyle: 'dotted',
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 26 / 2,
    backgroundColor: colors.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  label: { textAlign: 'center' },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  labelContainer: {
    width: '100%',
    paddingTop: 35,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  labelBox: { width: 100 },
  plusButton: {
    position: 'absolute',
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 7,
    paddingBottom: 0,
    borderRadius: 0,
    borderColor: '#008060',
    backgroundColor: '#eee',
    height: 30,
    bottom: 7,
    right: -15,
  },
  leftLabel: {
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 25,
    color: colors.primary,
  },
  minusButton: {
    position: 'absolute',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 6,
    paddingBottom: 0,
    borderRadius: 0,
    borderColor: '#008060',
    backgroundColor: '#eee',
    height: 30,
    bottom: 5,
    left: -15,
  },
  rightLabel: {
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 25,
    color: colors.primary,
  },
  tickMark: {
    position: 'absolute',
    bottom: -12,
  },
  knobLabel: {
    position: 'absolute',
    bottom: 40,
    minWidth: 50,
  },
  knobLabelText: {
    fontSize: 14,
    textAlign: 'center',
  },
  ticks: {
    position: 'absolute',
    left: 50,
    top: 20,
    flexDirection: 'row',
  },
  tick: {
    position: 'absolute',
    fontSize: 14,
    textAlign: 'center',
  },
  tickLabel: {
    paddingLeft: 5,
    fontSize: 14,
    color: '#a0a0a0',
  },
});

class TemperatureSlider extends Component {
  sliderRef = React.createRef();

  static propTypes = {
    config: PropTypes.shape({
      minValue: PropTypes.string,
      maxValue: PropTypes.string,
      itemList: PropTypes.array,
    }).isRequired,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    onPress: PropTypes.func,
    onRelease: PropTypes.func,
  };

  static defaultProps = {
    value: 100,
    onPress: () => {},
    onRelease: () => {},
  };

  state = {
    minimumValue: 1,
    currentValue: null,
    maximumValue: 7,
    sliderWidth: 0,
    tickMarks: [],
  };

  componentDidMount() {
    const {
      config: { itemList },
    } = this.props;
    const minValue = Math.min(
      ...itemList.map((item) => {
        return item.value;
      }),
    );
    const maxValue = Math.max(
      ...itemList.map((item) => {
        return item.value;
      }),
    );
    this.setState({ minimumValue: minValue, maximumValue: maxValue });
  }

  measureSliderWidth = () => {
    const { minimumValue, maximumValue } = this.state;
    const { value } = this.props;
    this.sliderRef.current.measure((fx, fy, width) => {
      const tickMarks = this.getTickMarks(minimumValue, maximumValue, width);
      this.setState({ sliderWidth: width, currentValue: value, tickMarks });
    });
  };

  getTickMarks = (start, end, width) => {
    const tickMark = {
      value: start,
      left: this.getTickMark(start, width),
    };
    if (start === end) {
      return [tickMark];
    }
    return [tickMark, ...this.getTickMarks(start + 1, end, width)];
  };

  getTickMark = (value, width) => {
    const { minimumValue, maximumValue } = this.state;
    if (value === minimumValue) {
      return 37;
    }
    if (value === maximumValue) {
      return 14 + width;
    }

    return (
      (width - 23) * (value - minimumValue) / (maximumValue - minimumValue) + 37
    );
  };

  handleValue = (value) => {
    const { minimumValue } = this.state;
    if (value <= minimumValue) {
      this.setState({ currentValue: minimumValue });
    } else {
      this.setState({ currentValue: value });
    }
  }

  calculateLabelPosition = () => {
    const {
      minimumValue,
      currentValue,
      maximumValue,
      sliderWidth,
    } = this.state;

    if (currentValue === minimumValue) {
      return 20;
    }
    if (currentValue === maximumValue) {
      return sliderWidth;
    }

    return (
      (sliderWidth * (currentValue - minimumValue))
        / (maximumValue - minimumValue)
      + 20 / (currentValue - minimumValue)
    );
  };

  getStepSize = (minimumValue, maximumValue) => {
    return (maximumValue - minimumValue) / NUM_STEPS;
  }

  getRoundedLabel = (currentValue, minimumValue, maximumValue) => {
    if (!currentValue) {
      return currentValue;
    }
    const stepSize = this.getStepSize(minimumValue, maximumValue);
    if (stepSize >= 1) {
      return currentValue.toFixed(0);
    }
    const numDigits = Math.ceil(
      Math.abs(
        Math.log10(stepSize),
      ),
    );
    return currentValue.toFixed(numDigits);
  }

  render() {
    const {
      currentValue,
      minimumValue,
      maximumValue,
      tickMarks,
    } = this.state;

    const {
      config: { maxValue, minValue, itemList },
      onChange,
      onPress,
      value,
      onRelease,
    } = this.props;

    let currentVal = value;
    if (!value && value !== currentValue) {
      this.setState({ currentValue: value });
    }

    if (currentVal < minimumValue) {
      currentVal = minimumValue;
    } else if (currentVal > maximumValue) {
      currentVal = maximumValue;
    }

    const left = this.calculateLabelPosition();
    const stepSize = this.getStepSize(minimumValue, maximumValue);
    const roundedLabel = this.getRoundedLabel(currentValue, minimumValue, maximumValue);

    return (
      <View style={styles.container}>
        <View style={styles.sliderWrapper}>
          {!!currentValue && (
            <View style={[styles.knobLabel, { left }]}>
              <Text style={styles.knobLabelText}>
                {roundedLabel} F
              </Text>
            </View>
          )}
          {tickMarks.map(tickMark => (
            <View key={tickMark.value} style={[styles.tickMark, { left: tickMark.left }]}>
              <Text style={styles.tickLabel}> | </Text>
            </View>
          ))}
          <TouchableWithoutFeedback onPressIn={this.tapSliderHandler}>
            <View ref={this.sliderRef} onLayout={this.measureSliderWidth}>
              <SliderComponent
                value={currentVal}
                onValueChange={value => this.handleValue(value)}
                minimumValue={minimumValue}
                maximumValue={maximumValue}
                minimumTrackTintColor="#CCC"
                maximumTrackTintColor="#CCC"
                trackStyle={styles.track}
                thumbStyle={currentVal >= minimumValue ? styles.thumb : styles.thumbUnselected}
                step={stepSize}
                onSlidingStart={onPress}
                onSlidingComplete={(val) => {
                  onRelease();
                  onChange(val);
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.labelContainer}>
          <View style={styles.labelBox}>
            {itemList[0].image && (
              <View style={styles.iconWrapper}>
                <Image
                  style={styles.icon}
                  source={{ uri: getURL(itemList[0].image) }}
                />
              </View>
            )}
            <Text style={styles.label}>{minValue}</Text>
          </View>
          <View style={styles.labelBox}>
            {itemList[itemList.length - 1].image && (
              <View style={styles.iconWrapper}>
                <Image
                  style={styles.icon}
                  source={{ uri: getURL(itemList[itemList.length - 1].image) }}
                />
              </View>
            )}
            <Text style={styles.label}>{maxValue}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export { TemperatureSlider };
