import React, { useState, useEffect } from 'react';
import SearchResults from './SearchResults';
import { IonContent } from '@ionic/react';
const Search = () => {
	const [ query, setQuery ] = useState('');

	const onChange = (e) => {
		setQuery(e.currentTarget.value);
	};

	const onSubmit = (e) => {
		e.preventDefault();
	};

	return (
		<IonContent>
			<form onSubmit={onSubmit}>
				<input type="text" value={query} onChange={onChange} />
				<button>Search</button>
			</form>
			<SearchResults query={query} />
		</IonContent>
	);
};
export default Search;
