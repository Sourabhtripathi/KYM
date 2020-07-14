import React, { useState, Fragment } from 'react';
import SearchResults from './SearchResults';
const Search = () => {
	const [ query, setQuery ] = useState('');

	const onChange = (e) => {
		setQuery(e.currentTarget.value);
	};

	const onSubmit = (e) => {
		e.preventDefault();
	};

	return (
		<Fragment>
			<form onSubmit={onSubmit}>
				<input type="text" value={query} onChange={onChange} />
				<button>Search</button>
			</form>
			<SearchResults query={query} />
		</Fragment>
	);
};
export default Search;
