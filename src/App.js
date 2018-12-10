import React, { Component } from 'react';
import './App.css';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from 'react-router-dom';
import HotSong from './components/hotSong/hotSong.js';
import Lyric from './components/lyric/lyric.js';

import Header from './components/header/header.js';
import Audio from './components/audio/audio.js';
class App extends Component {
	render() {
		return (
			<Router>
				<div id="App">
					<Header />
					<Switch>
						<Route path="/hotSong" component={ HotSong } />
						<Route path="/lyric/:mid" component={ Lyric } />
						<Redirect from="/*" to="/hotSong" /> 
					</Switch>
					<Audio />
				</div>
			</Router>
		);
	}
}
export default App;
