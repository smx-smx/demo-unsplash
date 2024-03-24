import React, { useState } from 'react';
import { Button } from 'flowbite-react';

interface Props {
  onSearch: (query: string) => void;
}

function SearchBar({ onSearch }: Props): JSX.Element {
  const [query, setQuery] = useState<string>('');

  const handleSearch = (): void => {
    onSearch(query);
  };

  return (
    <div className='flex flex-row'>
      <input
			type="text"
			placeholder='Search for pictures...'
			value={query}
			onChange={(e) => setQuery(e.target.value)} 
			onKeyDown={(e) => {
				if(e.key == 'Enter') handleSearch();
			}}
		/>
      	<Button onClick={handleSearch}>Search</Button>
    </div>
  );
}

export default SearchBar;
