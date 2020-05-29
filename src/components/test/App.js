import React, { Component } from 'react';
import Child from './Child';

class App extends Component {
	state = {
		val: 0
	};

	componentDidMount() {
		console.log('app mounted');
		setTimeout(() => {
			this.setState({
				val: this.state.val + 1
			});
		}, 1000);
	}

	componentDidUpdate() {
		console.log('app updated');
	}

	render() {
		return (
			<div>
				<Child />
			</div>
		);
	}
}

export default App;
