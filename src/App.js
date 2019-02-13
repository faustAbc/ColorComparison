import React, { Component } from 'react';
import SMYK from './components/SMYK';
import RGB from './components/RGB';
import HLS from './components/HLS';
import { Grid, Fab } from '@material-ui/core';
import { types, CMYKtoRGB, RGBtoCMYK, RGBtoHLS, HLStoRGB } from './components/utls';
import { BlockPicker } from 'react-color';
import { Colorize } from '@material-ui/icons';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

class App extends Component {
  constructor() {
    super();
    this.state = {
      R: 0,
      G: 150,
      B: 250,
      isPick: false,
    }
  };

  handleChangeComplete = (color) => {
    const { r, g, b } = color.rgb;
    this.setState({ R: r, G: g, B: b });
  };

  commonReturn = {
    handleChange: this.handleChange,
  }

  toHLS = () => {
    const { R, G, B } = this.state;

    return {
      handleChange: this.handleChange,
      ...RGBtoHLS(R, G, B),
      ...this.state,
    }
  }

  toSMYK = () => {
    const { R, G, B } = this.state;

    return {
      handleChange: this.handleChange,
      ...RGBtoCMYK(R, G, B),
      ...this.state,
    }
  }

  toRGB = () => {
    return {
      handleChange: this.handleChange,
      ...this.state,
    }
  }

  handleChange = ({ type, data }) => sliderType => (e, value) => {
    let R;
    let G;
    let B;
    switch (type) {
      case types.RGB: {
        const { R: _R, G: _G, B: _B } = data;
        const addNewValue = { R: _R, G: _G, B: _B, [sliderType]: value || e.target.value };

        R = addNewValue.R || 0;
        G = addNewValue.G || 0;
        B = addNewValue.B || 0;

        break;
      }
      case types.CMYK: {
        const { C: _C, M: _M, Y: _Y, K: _K } = data;
        const addNewValue = { C: _C, M: _M, Y: _Y, K: _K, [sliderType]: value || e.target.value };
        const { R: _R, G: _G, B: _B } = CMYKtoRGB(addNewValue.C, addNewValue.M, addNewValue.Y, addNewValue.K);

        R = _R || 0;
        G = _G || 0;
        B = _B || 0;

        break;
      }
      case types.HLS: {
        const { H: _H, L: _L, S: _S } = data;
        const addNewValue = { H: _H, L: _L, S: _S, [sliderType]: value || e.target.value };
        const { R: _R, G: _G, B: _B } = HLStoRGB(addNewValue.H, addNewValue.L, addNewValue.S);

        R = _R || 0;
        G = _G || 0;
        B = _B || 0;

        break;
      }
      default:
        throw new Error('No such type');
    }

    this.setState({ R, G, B });
  }

  appearPicker = (isPick = !this.state.isPick) => () => {
    this.setState({ isPick });
  }

  render() {
    const { R, G, B, isPick } = this.state;

    (!R || !G || !B) && console.log(this.state);

    return (
      <Grid container style={{ height: '100vh' }} justify="center" alignItems="center">
        <Grid item>
          <Grid container justify="center">
            <Grid item>
              <Grid container direction="column" justify="flex-start" alignItems="center">
                <Fab onClick={this.appearPicker()} style={{ marginTop: 20, background: `rgb(${R},${G},${B})` }}>
                  <Colorize />
                </Fab>
                {isPick &&
                  <ClickAwayListener onClickAway={this.appearPicker(false)}>

                    <div style={{ position: 'absolute', marginTop: 100 }}>
                      <BlockPicker
                        color={{ r: R, g: G, b: B }}
                        onChangeComplete={this.handleChangeComplete}
                      /> </div>
                  </ClickAwayListener>}
              </Grid>
            </Grid>
            <SMYK {...this.toSMYK()} />
            <RGB {...this.toRGB()} />
            <HLS {...this.toHLS()} />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default App;