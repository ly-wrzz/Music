import React , { Component } from 'react';
import './loading.css';

class Loading extends Component {
	render(){
		return (
			<div className="lds-css ng-scope">
				<div className="lds-heart">
					<div></div>
				</div>
			</div>
		);
	}
}

export default Loading;