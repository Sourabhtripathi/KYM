import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addRating } from '../../helpers';
import { addToRatedBy } from '../../actions';

class Child extends Component {
	state = {
		val: 0
	};
	componentDidMount() {
		console.log('child mounted');
	}

	componentDidUpdate() {
		console.log('child updated');
	}

	onRatingSubmit = async (pid, index, e) => {
		e.preventDefault();
		const res = await addRating(pid, this.props.auth.user.id, e.currentTarget.rating.value);

		console.log(res);

		let data = {
			index: index,
			data: res.data
		};

		this.props.addToRatedBy(data);
	};

	isRated = (ratedBy) => {
		console.log('is rated called');
		console.log('ratedBy : ' + ratedBy);
		let retVal = false;
		for (const i in ratedBy) {
			console.log(ratedBy[i]);
			console.log(this.props.auth.user.id);
			if (ratedBy[i] === this.props.auth.user.id) {
				retVal = true;
			}
		}
		console.log(retVal);
		return retVal;
	};

	renderRatingOption = (pid, uid, ratedBy, index) => {
		if (this.props.auth.user.id !== uid) {
			return (
				<form onSubmit={(e) => this.onRatingSubmit(pid, index, e)}>
					<label>
						Give your rating : <input name="rating" type="number" />
					</label>
					<button>Submit</button>
				</form>
			);
		} else {
			return null;
		}
	};

	renderOpenPlaylists = () => {
		console.log('rendering open playlists');
		console.log(this.props);
		return this.props.user.openPlaylists.map((playlist, index) => {
			return (
				<li key={index}>
					{playlist.playlistName}
					<span>Rating : {playlist.overallRating}</span>
					{!this.isRated(playlist.ratedBy) ? (
						this.renderRatingOption(playlist.playlistId, playlist.userId, playlist.ratedBy, index)
					) : null}
				</li>
			);
		});
	};

	render() {
		console.log('re rendering');
		return <div>{this.renderOpenPlaylists()}</div>;
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		auth: state.auth
	};
};
export default connect(mapStateToProps, { addToRatedBy })(Child);
