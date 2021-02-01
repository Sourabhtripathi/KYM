import React from 'react';
import '../assets/stylesheets/Wrapper.css';
const Wrapper = (Component, ...props) => {
	console.log(props[0]);
	const { title } = props[0];
	class Wrap extends React.Component {
		render() {
			return (
				<div className="wrapper">
					<h1 className="section-header">{title}</h1>
					<div className="content">
						<Component />
					</div>
				</div>
			);
		}
	}
	return Wrap;
};
export default Wrapper;
