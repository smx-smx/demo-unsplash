import type { HeadFC, PageProps } from "gatsby";
import React, { useEffect, useState } from 'react';
import { createApi } from 'unsplash-js';
import * as PhotoApi from 'unsplash-js/dist/methods/photos/types';
import SearchBar from "../components/SearchBar";
import ImageList from "../components/ImageList";
import { Kbd, Spinner } from "flowbite-react";
import AppNavbar from "../components/AppNavbar";
import { createUnsplashApi } from "../api";
import { MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardArrowUp } from "react-icons/md";

const IndexPage: React.FC<PageProps> = () => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<PhotoApi.Basic[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [error, setError] = useState<string|null>(null);

  const api = createUnsplashApi();
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

  const fetchImagesInternal = async (query: string) => {
    setLoading(true);
    const resp = await api.search.getPhotos({
      query: query,
      page: pageNumber,
      perPage: 25
    });

    setImages(resp.response?.results ?? []);
    setLoading(false);
  }

  const fetchImages = async (query: string) => {
    try {
      setError(null);
      await fetchImagesInternal(query);
    } catch(error){
      setLoading(false);
      console.error(error);
      setError('An error occurred, please try again later');
    }
  };

  useEffect(() => {
    randomSearch();
  }, []);

  const paginationOp = async (op:string) => {
    let handled = true;
    switch(op){
      case '+':
        setPageNumber(pageNumber + 1);
        break;
      case '-':
          if(pageNumber > 1) setPageNumber(pageNumber - 1);
          break;
      default:
        handled = false;
        break;
    }
    if(handled){
      await fetchImages(query);
    }
  }

  return (
    <main className="m-4 dark:bg-gray-800">
      <AppNavbar />
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

        <div>
          <div className="mr-0 flex w-full flex-wrap place-content-end gap-1 justify-self-end">
            <span>Page {pageNumber}</span>
          </div>
          <div className="mr-0 flex w-full flex-wrap place-content-end gap-1 justify-self-end">
            <Kbd onClick={() => paginationOp('-')} icon={MdKeyboardArrowLeft} />
            <Kbd onClick={() => paginationOp('+')} icon={MdKeyboardArrowRight} />
          </div>
          {error && <div className="w-full text-center">
            <span className="text-2xl text-red-500">{error}</span>
            </div>}
          <ImageList images={images} />
        </div>
      </div>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>UnsplashJs Demo</title>;
