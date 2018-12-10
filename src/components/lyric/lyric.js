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
			isActive : -1
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
						<ul ref="lyricUl">
							{
								this.state.lyricList.map((item,index)=>{
									return <li id="lyricUlLi" key={index} className={this.state.isActive === index ? 'active' : ''}>{ item.lyric==="" ?"":item.lyric }</li>;
								})
							}
						</ul>
					</div>
				</div>
			</div>
		);
	}
	// 请求数据
	componentDidMount(){
		this.props.handleIsName();
		var mid = this.props.match.params.mid;
		this.props.handleIsIconBack();
		axios.get('https://api.bzqll.com/music/netease/lrc?id='+mid+'&key=579621905').then((res)=>{
			this.setState({
				lyricList: this.formatLyric(res.data),
				mid: mid
			});
			this.playPic();
			this.playLyric();
		});
	}
	// 解决返回时清除定时器
	componentWillUnmount(){
		this.pauseLyric();
	}
	// 这下面是处理歌词的bug一堆
	formatLyric(data){
		var result = [];
		var re = /\[([^\]]+)\]([^[\n]+)/g;
		data.replace(re,($0,$1,$2)=>{
			result.push( { time : this.formatTimeToSec($1) , lyric : $2 } );
		});
		return result;
	}
	formatTimeToSec(time){
		var timeArr = time.split(':');
		return (parseFloat(timeArr[0] * 60) + parseFloat(timeArr[1])).toFixed(2);
	}
	playLyric(){
		this.lyricRunning();
		this.timer = setInterval( this.lyricRunning.bind(this) , 500 );
	}
	pauseLyric(){
		clearInterval(this.timer);
	}
	lyricRunning(){
		var lyricList = this.state.lyricList;
		var lyricUl = this.refs.lyricUl;
		var audioElem = document.getElementById('audioElem');
		for (var i = 0; i < lyricList.length; i++) {
			if (lyricList[i+1]) {
				if (audioElem.currentTime > lyricList[i].time && audioElem.currentTime < lyricList[i+1].time ) {
					if( i > 5 && lyricUl){
						lyricUl.style.top = -(i-5)*36 + "px";
					}else if (i<1 && lyricUl) {
						lyricUl.style.top = 0;
					}
					this.setState({isActive : i});
				}
			}else {
				if (audioElem.currentTime > lyricList[i].time) {
					if( i > 5 && lyricUl){
						lyricUl.style.top = -(i-5)*36 + "px";
					}else if (i<1 && lyricUl) {
						lyricUl.style.top = 0;
					}
					this.setState({isActive : i});
				}
			}
		}
	}
	// 头像转动
	componentDidUpdate(){
		if(this.props.isMusicPlay){
			this.playPic();
		}else{
			this.pausePic();
		}
	}
	playPic(){
		this.refs.picElem.style.animationPlayState = 'running';
	}
	pausePic(){
		this.refs.picElem.style.animationPlayState = 'paused';
	}
}

// 状态管理
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
