import React, { Component } from 'react';
import './hotSong.css';
import {connect} from 'react-redux';
import axios from 'axios';
import Loading from '../loading/loading.js';
import { setSessionStorage , getSessionStorage } from '../../tools/index.js';
class HotSongUI extends Component {
	constructor(){
		super();
		this.state = {
			songs : [],
			isLoading : false
		};
		this.isMove = false;
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
	}
	render() {
		return (
			<div id="hotSong">
				{
					this.state.isLoading ?<ul>
						{
							this.state.songs.map((item,index)=>{
								return (
									<li className={this.props.musicId === item.id ? 'active' : ''} key={ item.id } onTouchMove={this.handleTouchMove} onTouchEnd={()=>this.handleTouchEnd(index)}>
										<div className="hotSongOrder">{ index + 1 }</div>
										<div className="hotSongName">
											<h3>{ item.name }</h3>
											<p>{ item.singer }</p>
										</div>
									</li>
								);
							})
						}
					</ul>:<Loading />
				}
			</div>
		);
	}
	componentDidMount(){
		this.props.handleIsName();
		var data = getSessionStorage('songList');
		if(data){
			this.setState({
				songs : JSON.parse(data),
				isLoading : true
			});
		}else {
			axios.post('https://api.bzqll.com/music/netease/songList?key=579621905&id=3778678&limit=101&offset=0').then((res)=>{
				var result = res.data.result;
				if( result === 'SUCCESS' ){
					this.setState({
						songs: res.data.data.songs,
						isLoading : true
					});
					setSessionStorage('songList' , JSON.stringify(res.data.data.songs));
				}
			})
		}
	}
	handleTouchMove(){
		this.isMove = true;
	}
	handleTouchEnd(j){
		if(this.isMove){
			this.isMove = false;
		}else{
			var audioElem = document.getElementById('audioElem');
			var _this = this
			for (var i = 0,idArr = [],nameArr = []; i < this.state.songs.length; i++) {
				idArr.push(this.state.songs[i].id);
				nameArr.push(this.state.songs[i].name);
			}
			var id = idArr[j];
			var musicName = nameArr[j];
			this.props.handleMusicId(id);
			this.props.handleMusicName(musicName);
			this.props.handleIsMusicPlay();
			this.props.history.push('/lyric/'+id);
			
			audioElem.addEventListener('ended', function () {
				if(j === _this.state.songs.length-1){
					console.log(11)
					j = 0;
				}else {
					j++;
				}
				var id = idArr[j];
				var musicName = nameArr[j];
				_this.props.handleMusicId(id);
				_this.props.handleMusicName(musicName);
				_this.props.handleIsMusicPlay();
				_this.props.history.push('/lyric/'+id);
			}, false);
		}
	}
}
function mapStateToprops(state){
	return {
		musicId : state.musicId,
		isName: state.isName
	};
}
function mapDispatchToprops(dispatch){
	return {
		handleIsName(){
			dispatch({type: 'IS_NAME',payload: false});
		},
		handleMusicId(id){
			dispatch({ type : 'MUSIC_ID' , payload : id });
		},
		handleMusicName(musicName){
			dispatch({ type : 'MUSIC_NAME' , payload : musicName });	
		},
		handleIsMusicPlay(){
			dispatch({ type : 'IS_MUSIC_PLAY' , payload : true });	
		},
	};
}

var HotSong = connect(mapStateToprops,mapDispatchToprops)(HotSongUI);
export default HotSong;
