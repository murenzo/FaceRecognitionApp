import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import './App.css'

const paramsOption = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const app = new Clarifai.App({
  apiKey: '871b60142e194c70bda3acfd43322b56'
 });


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {}
    }
  }

onInputChange = (event) => {
  this.setState({input: event.target.value});
}

calculateFaceLocation = (data) => {
  const clarifaiFaceRegion = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFaceRegion.left_col * width,
    topRow: clarifaiFaceRegion.top_row * height,
    rightCol: width - (clarifaiFaceRegion.right_col * width),
    bottomRow: height - (clarifaiFaceRegion.bottom_row * height)
  }
}

displayFaceBox = (box) => {
  console.log(box);
  this.setState({box: box});
}

onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input})
  app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
  .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
  .catch(err => console.log(err))
}

  render() {
    return (
      <div className="App">
        <Particles className="particles" 
                params={paramsOption}
              />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
      </div>
    );
  
  }
}

export default App;
