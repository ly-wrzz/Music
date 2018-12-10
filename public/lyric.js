import React, { Component } from 'react';
import './lyric.css';
import {connect} from 'react-redux';
import axios from 'axios';
class LyricUI extends Component {
	constructor(){
		super();
		this.state = {
			lyricList : [],
			mid : '',
			// isActive : -1
		};
	}
	render() {
		return (
			<div id="lyric">
				<div className="mtk">
					<div className="pic" ref="picElem">
						<img src={"https://api.bzqll.com/music/netease/pic?id="+this.props.match.params.mid+"&key=579621905"} alt=""/>
					</div>
					<div className="content">
						<ul id="text">
							{
								this.state.lyricList.map((item,index)=>{
									return <li key={index}>{ item.lyric }</li>;
									// className={this.state.isActive === index ? 'active' : ''}
								})
							}
						</ul>
					</div>
				</div>
			</div>
		);
	}
	componentDidMount(){
		this.props.handleIsName();
		var mid = this.props.match.params.mid;
		axios.get('https://api.bzqll.com/music/netease/lrc?id='+mid+'&key=579621905').then((res)=>{
			this.setState({
				lyricList: this.formatLyric(res.data)
			});
			if(this.props.isMusicPlay){
				this.playPic();
				this.playLyric();
			}
			else{
				this.pausePic();
				this.pauseLyric();
			}
		});
		this.props.handleIsIconBack();
		this.setState({
			mid : this.props.match.params.mid
		});
	}

	componentDidUpdate(){
		if(this.props.isMusicPlay){
			this.playPic();
		}
		else{
			this.pausePic();
		}
	}
	playPic(){
		this.refs.picElem.style.animationPlayState = 'running';
	}
	pausePic(){
		this.refs.picElem.style.animationPlayState = 'paused';
	}
	formatLyric(data){
		var result = [];
		var re = /\[([^\]]+)\]([^[]+)/g;
		data.replace(re,($0,$1,$2)=>{
			result.push( { time : this.formatTimeToSec($1) , lyric : $2 } );
			// this.formatTimeToSec($1)
		});
		return result;	
	}
	formatTimeToSec(time){
		var timeArr = time.split(':');
		return (parseFloat(timeArr[0] * 60) + parseFloat(timeArr[1])).toFixed(2);
	}
	playLyric(){
		this.lyricRunning();
		this.timer = setInterval( this.lyricRunning.bind(this) , 1000 );
	}
	pauseLyric(){
		clearInterval(this.timer);
	}
	// lyricRunning(){
	// 	var lyricList = this.state.lyricList;
	// 	var audioElem = document.getElementById('audioElem');
	// 	for (var i = 0; i < lyricList.length; i++) {
	// 		if (lyricList[i+1]) {
	// 			if (audioElem.currentTime > lyricList[i].time && audioElem.currentTime < lyricList[i+1].time ) {
	// 				this.setState({isActive : i});
	// 			}
	// 		}
	// 	}
	// }
	lyricRunning(){
		
	}
}

function mapStateToprops(state){
	return {
		isMusicPlay : state.isMusicPlay,
		isName: state.isName
	};
}
function mapDispatchToprops(dispatch){
	return {
		handleIsName(){
			dispatch({type: 'IS_NAME',payload: true});
		},
		handleIsIconBack(){
			dispatch({ type : 'IS_ICON_BACK' , payload : true });
		},
		handleMusicId(id){
			dispatch({ type : 'MUSIC_ID' , payload : id });
		},
		handleIsMusicPlay(){
			dispatch({ type : 'IS_MUSIC_PLAY' , payload : true });	
		}
	};
}

var Lyric = connect(mapStateToprops,mapDispatchToprops)(LyricUI);
export default Lyric;
