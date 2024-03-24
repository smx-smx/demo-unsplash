import React, { useEffect, useState } from 'react';
import { Card, Rating } from 'flowbite-react';
import * as PhotoApi from 'unsplash-js/dist/methods/photos/types';

interface ImageProps {
  data: PhotoApi.Basic;
}

function Image({ data }: ImageProps) {
  const KEY_FAVOURITES = 'unsplash.favourites';

  const getFavourites = () => {
    try {
      return JSON.parse(window.localStorage.getItem(KEY_FAVOURITES) ?? '{}');
    } catch(e){
      return {};
    }
  }

  const isImageFavourite = (id:string) => {
    return getFavourites()[id] !== undefined;
  }

  const [isFavourite, setFavourite] = useState<boolean>(false);

  const toggleFavourite = (id:string) => {
    const favourites = getFavourites();
    if(id in favourites){
      delete favourites[id];
      setFavourite(false);
    } else {
      favourites[id] = true;
      setFavourite(true);
    }
    window.localStorage.setItem(KEY_FAVOURITES, JSON.stringify(favourites));
  };

  useEffect(() => {
    setFavourite(isImageFavourite(data.id));
  }, []);

  return <>
    <Card
      className="max-w-sm"
      imgAlt={data.alt_description ?? ''}
      imgSrc={data.urls.thumb}
    >
      <div className='relative'>
        <div className='absolute right-0 top-0' style={{
          marginTop: '-20px',
          marginRight: '-20px'
        }}>
        <Rating size="md">
          <Rating.Star onClick={() => toggleFavourite(data.id)} filled={isFavourite} />
        </Rating>
        </div>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {data.description}
        </p>
      </div>
    </Card>
  </>;
}

export default Image;