import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

type Props = {
  width: number;
  height: number;
  borderColor: string;
  borderWidth: number;
};

export class ScannerQRFinder extends Component<Props> {

  render() {
    return (
      <View style={[styles.container]}>
        <View
          style={[
            styles.finder,
            {width: this.props.width, height: this.props.height},
          ]}>
          <View
            style={[
              {borderColor: this.props.borderColor},
              styles.topLeftEdge,
              {
                borderLeftWidth: this.props.borderWidth,
                borderTopWidth: this.props.borderWidth,
              },
            ]}
          />
          <View
            style={[
              {borderColor: this.props.borderColor},
              styles.topRightEdge,
              {
                borderRightWidth: this.props.borderWidth,
                borderTopWidth: this.props.borderWidth,
              },
            ]}
          />
          <View
            style={[
              {borderColor: this.props.borderColor},
              styles.bottomLeftEdge,
              {
                borderLeftWidth: this.props.borderWidth,
                borderBottomWidth: this.props.borderWidth,
              },
            ]}
          />
          <View
            style={[
              {borderColor: this.props.borderColor},
              styles.bottomRightEdge,
              {
                borderRightWidth: this.props.borderWidth,
                borderBottomWidth: this.props.borderWidth,
              },
            ]}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  finder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLeftEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 20,
  },
  topRightEdge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 20,
  },
  bottomLeftEdge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 20,
  },
  bottomRightEdge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 20,
  },
});
