import type { HeadFC, PageProps } from "gatsby";
import React, { useEffect, useState } from 'react';
import { createApi } from 'unsplash-js';
import * as PhotoApi from 'unsplash-js/dist/methods/photos/types';
import SearchBar from "../components/SearchBar";
import ImageList from "../components/ImageList";
import { Button, Kbd, Label, Spinner, TextInput } from "flowbite-react";
import AppNavbar from "../components/AppNavbar";
import { api_create, api_setToken } from "../api";
import { MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardArrowUp } from "react-icons/md";

interface ImageViewerProps {
  mode: 'main'|'favourites',
  /** properties for favourites mode */
  imageIds ?: string[]
}

function ImageViewer({ mode, imageIds } : ImageViewerProps){
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<PhotoApi.Basic[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [error, setError] = useState<string|null>(null);
  const [hasApi, setHasApi] = useState<boolean>(true);
  const [apiToken, setApiToken] = useState<string>('');
  
  // keep low due to rate limiting
  const FAVS_PER_PAGE = 5;
  const totalPages = imageIds !== undefined
    ? Math.ceil(imageIds.length / FAVS_PER_PAGE)
    : undefined;


  let api = api_create();
  if(api === null){
    setHasApi(false);
  }

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


  const fetchImagesInternal = async (queryInput:string|null = null) => {
    if(api === null) {
      setHasApi(false);
      return;
    }

    setLoading(true);

    const queryToUse = (queryInput !== null)
      ? queryInput
      : query;

    if(mode === 'main'){
      const resp = await api.search.getPhotos({
        query: queryToUse,
        page: pageNumber,
        perPage: 25
      });
      setImages(resp.response?.results ?? []);
    } else if(mode == 'favourites' && imageIds !== undefined){
      const start = (pageNumber - 1) * FAVS_PER_PAGE;
      const end = start + FAVS_PER_PAGE;
      const items = imageIds.slice(start, end);
      const resp = await Promise.all(items.map(id => {
        console.debug(`fetching ${id}...`);
        return api.photos.get({ photoId: id });
      }));
      const respData = resp.filter(r => r.response !== undefined).map(r => r.response) as PhotoApi.Full[];
      setImages(respData ?? []);
    }
    setLoading(false);
  }

  const fetchImages = async (queryInput:string|null = null) => {
    try {
      setError(null);
      await fetchImagesInternal(queryInput);
    } catch(error){
      setLoading(false);
      console.error(error);
      setError('An error occurred, please try again later');
    }
  };

  const paginationOp = async (op:string) => {
    let handled = true;
    switch(op){
      case '+':
        if(totalPages === undefined || pageNumber < totalPages){
          setPageNumber(pageNumber + 1);
        }
        break;
      case '-':
          if(pageNumber > 1) setPageNumber(pageNumber - 1);
          break;
      default:
        handled = false;
        break;
    }
    if(handled){
      await fetchImages();
    }
  }

  if(!hasApi){
    return <main className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
      <div className="flex flex-col">
        <div>
          <Label>Enter api Token</Label>
        </div>
        <div className="flex flex-row gap-1">
          <TextInput onChange={e => setApiToken(e.target.value)}></TextInput>
          <Button onClick={() => {
            api_setToken(apiToken);
            api = api_create();
            setHasApi(true);
          }}>Set</Button>
        </div>
      </div>
    </main>;
  } else {  
    useEffect(() => {
      if(mode === 'main'){
        randomSearch();
      } else {
        fetchImages();
      }
    }, [mode]);
  }

  return (
    <main className="m-4 dark:bg-gray-800">
      <AppNavbar />
      <div>
        <div className="m-3 flex flex-row justify-center">
          {mode === 'main' && <SearchBar initialQuery={query}
            onSearch={query => {
              if (query.length < 1) {
                randomSearch();
              } else {
                setQuery(query);
                fetchImages(query);
              }
            }} />}
          {loading && <Spinner size={"xl"} />}
        </div>

        <div>
          <div className="mr-0 flex w-full flex-wrap place-content-end gap-1 justify-self-end">
            <span>Page {pageNumber}
            {(totalPages !== undefined) && <>/{totalPages} <br />(5 per page)</>}
            </span>
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

export default ImageViewer;

