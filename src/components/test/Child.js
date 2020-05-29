import React, { Component } from 'react';
import { authorize } from '../../helpers';

class Child extends Component {
	componentDidMount() {
		console.log('child mounted');
	}

	componentDidUpdate() {
		console.log('child updated');
	}

	onClick = () => {
		authorize()
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	render() {
		console.log('re rendering');

		return (
			<div>
				<h1>Child</h1>
				<button onClick={this.onClick}>Login Native</button>
			</div>
		);
	}
}

export default Child;
