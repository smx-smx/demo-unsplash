import type { HeadFC, PageProps } from "gatsby";
import React, { useState } from 'react';
import { createApi } from 'unsplash-js';
import * as PhotoApi from 'unsplash-js/dist/methods/photos/types';
import SearchBar from "../components/SearchBar";
import ImageList from "../components/ImageList";
import { Spinner } from "flowbite-react";

const IndexPage: React.FC<PageProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<PhotoApi.Basic[]>([]);
  
  const api = createApi({
    accessKey: window.localStorage.getItem('unsplash.apikey') ?? ''
  });
  
  const fetchImages = async (query: string) => {
    setLoading(true);
    const resp = await api.search.getPhotos({
      query: query,
      perPage: 25
    });
    setImages(resp.response?.results ?? []);
    setLoading(false);
  };

  return (
    <main className="dark:bg-gray-800">
      <div>
        <div className="flex flex-row">
          <SearchBar onSearch={fetchImages} />
          {loading && <Spinner size={"xl"} />}
        </div>
        <ImageList images={images} />
      </div>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>UnsplashJs Demo</title>;
