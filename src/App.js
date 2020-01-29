import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
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
      box: {},
      route: 'signin',
      isSignedin: false,
      userProfile: {}
    }
  }

  componentDidMount() {
    fetch('http://localhost:3001/')
     .then(response => response.json())
     .then(console.log)
  }

  onLoadProfile = (user) => {
    this.setState({userProfile: {
      id: user.id,
      name: user.name,
      email: user.email,
      entries: user.entries,
      date_joined: user.date_joined
    }})
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
    this.setState({box: box});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => {
      if(response)
      {
        fetch('http://localhost:3001/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: this.state.userProfile.id})
      })
       .then(response => response.json())
      //  .then(console.log)
       .then(data => this.setState(Object.assign(this.state.userProfile, {entries: data})));
      }
      this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if(route === 'signout')
    {
      this.setState({isSignedin: false});
    }
    else if (route === 'home')
    {
      this.setState({isSignedin: true});
    }

    this.setState({route: route})
  }

  render() {
    const { isSignedin, route, imageUrl, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" 
                params={paramsOption}
              />
        <Navigation onRouteChange={this.onRouteChange} isSignedin={isSignedin}/>
        {
          route === 'home' ?
          <div>
            <Logo />
            <Rank user={this.state.userProfile}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
          : 
          (
            route === 'signin' ?

            <Signin onLoadProfile={this.onLoadProfile} onRouteChange={this.onRouteChange}/>
            :

            <Register onLoadProfile={this.onLoadProfile} onRouteChange={this.onRouteChange}/>
          )
        }

      </div>
    );
  
  }
}

export default App;
