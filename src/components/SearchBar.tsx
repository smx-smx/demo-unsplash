import React, { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';

interface Props {
  initialQuery: string;
  onSearch: (query: string) => void;
}

function SearchBar({ initialQuery, onSearch }: Props): JSX.Element {
  const [query, setQuery] = useState<string>('');
  const [dirty, setDirty] = useState<boolean>(false);

  const handleSearch = (): void => {
    onSearch(query);
  };

  const getQuery = () => {
    // use user query, if modified
    if (query.length > 0 || dirty) return query;
    return initialQuery;
  };

  // reset keyword if prop changed
  useEffect(() => {
    setDirty(false);
  }, [initialQuery]);

  return (
    <div className='flex flex-row'>
      <input
        type="text"
        placeholder='Search for pictures...'
        value={getQuery()}
        onChange={(e) => {
          setDirty(true);
          setQuery(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key == 'Enter') handleSearch();
        }}
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}

export default SearchBar;
