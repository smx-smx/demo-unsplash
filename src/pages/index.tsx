import type { HeadFC, PageProps } from "gatsby";
import React, { useEffect, useState } from 'react';
import { createApi } from 'unsplash-js';
import * as PhotoApi from 'unsplash-js/dist/methods/photos/types';
import SearchBar from "../components/SearchBar";
import ImageList from "../components/ImageList";
import { Dropdown, Spinner } from "flowbite-react";
import { Navbar } from "flowbite-react";
import { Link } from "gatsby"

const IndexPage: React.FC<PageProps> = () => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<PhotoApi.Basic[]>([]);

  const api = createApi({
    accessKey: window.localStorage.getItem('unsplash.apikey') ?? ''
  });

  const getRandomKeyword = () => {
    const keywords = [
      'Nature', 'Landscape', 'Animals', 'City', 'Food',
      'Travel', 'Art', 'Architecture', 'Technology', 'Music'
    ];
    const randomIndex = Math.floor(Math.random() * keywords.length);
    return keywords[randomIndex];
  };

  const randomSearch = () => {
    const randomQuery = getRandomKeyword();
    setQuery(randomQuery);
    fetchImages(randomQuery);
  };

  const fetchImages = async (query: string) => {
    setLoading(true);
    const resp = await api.search.getPhotos({
      query: query,
      perPage: 25
    });
    setImages(resp.response?.results ?? []);
    setLoading(false);
  };

  useEffect(() => {
    randomSearch();
  }, []);

  return (
    <main className="dark:bg-gray-800">
      <Navbar fluid rounded>
        <Navbar.Brand>
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Unsplash Demo</span>
        </Navbar.Brand>
        <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <div className="relative size-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
                <svg className="absolute -left-1 size-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
            </div>
          }
        >
          <Dropdown.Header>
            <span className="block text-sm text-gray-400">User Menu</span>
          </Dropdown.Header>
          <Dropdown.Item>
            <Link to="/favourites">Favourites</Link>
          </Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      </Navbar>
      <div>
        <div className="m-3 flex flex-row justify-center">
          <SearchBar initialQuery={query}
            onSearch={query => {
              if (query.length < 1) {
                randomSearch();
              } else {
                setQuery(query);
                fetchImages(query);
              }
            }} />
          {loading && <Spinner size={"xl"} />}
        </div>

        <ImageList images={images} />
      </div>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>UnsplashJs Demo</title>;
