import React, {Component} from 'react';
import './header.css';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';

class HeaderUI extends Component {
	render() {
		return (
			<div id="header">
				{this.props.isName?<div className='name'><NavLink to="/hotSong">✖</NavLink>{this.props.musicName}</div>:<div className='logo'>洋歌音乐</div>}
			</div>
		);
	}
}
function mapStateToprops(state){
	return {
		isName: state.isName,
		musicName : state.musicName
	};
}
function mapDispatchToprops(dispatch){
	return {};
}

var Header = connect(mapStateToprops,mapDispatchToprops)(HeaderUI);
export default Header;
