import React, { useState, useEffect } from 'react';
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
		<div>
			<form onSubmit={onSubmit}>
				<label>Search for an open playlist or a user</label>
				<input type="text" value={query} onChange={onChange} />
				<button>Search</button>
			</form>
			<SearchResults query={query} />
		</div>
	);
};
export default Search;
