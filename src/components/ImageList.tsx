import React from 'react';
import * as PhotoApi from 'unsplash-js/dist/methods/photos/types';
import Image from './Image';

interface ImageListProps {
  images: PhotoApi.Basic[];
}

function ImageList({ images }: ImageListProps) {
  return (
    <div className="masonry-with-columns">
      {images.map((image) => (
        <Image key={image.id} data={image} />
      ))}
    </div>
  );
}

export default ImageList;
