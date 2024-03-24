import React, { useEffect, useState } from 'react';
import { Card, Rating } from 'flowbite-react';
import * as PhotoApi from 'unsplash-js/dist/methods/photos/types';
import { imageIsFavourite, toggleImageFavourite } from '../store';

interface ImageProps {
  data: PhotoApi.Basic;
}

function Image({ data }: ImageProps) {
  const [isFavourite, setFavourite] = useState<boolean>(false);

  const toggleFavourite = (id:string) => {
    const newState = toggleImageFavourite(id);
    setFavourite(newState);
  };

  useEffect(() => {
    setFavourite(imageIsFavourite(data.id));
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