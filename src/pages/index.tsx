import type { HeadFC, PageProps } from "gatsby";
import React, { useEffect, useState } from 'react';
import { createApi } from 'unsplash-js';
import * as PhotoApi from 'unsplash-js/dist/methods/photos/types';
import SearchBar from "../components/SearchBar";
import ImageList from "../components/ImageList";
import { Spinner } from "flowbite-react";

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
