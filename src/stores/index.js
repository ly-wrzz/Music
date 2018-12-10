import {createStore,combineReducers} from 'redux';

function isNameReducer(state = false,action){
	if(action.type === 'IS_NAME'){
		return action.payload;
	}
	else{
		return state;
	}
}
function musicIdReducer( state = '' , action ){
	if( action.type === 'MUSIC_ID' ){
		return action.payload;
	}
	else{
		return state;
	}
}
function musicNameReducer( state = '洋歌' , action ){
	if(action.type === 'MUSIC_NAME'){
		return action.payload;
	}
	else{
		return state;
	}
}
function isMusicPlayReducer( state = false , action ){
	if( action.type === 'IS_MUSIC_PLAY' ){
		return action.payload;
	}
	else{
		return state;
	}
}
var reducer = combineReducers({
	isName: isNameReducer,
	musicId : musicIdReducer,
	musicName : musicNameReducer,
	isMusicPlay : isMusicPlayReducer
});
var store = createStore(reducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;