import React from 'react';
import * as PhotoApi from 'unsplash-js/dist/methods/photos/types';

interface ImageListProps {
	images: PhotoApi.Basic[];
}

function ImageList({ images }: ImageListProps) {
  return (
    <div>
      {images.map((image) => (
        <div key={image.id}>
          <img src={image.urls.thumb} alt={image.alt_description ?? ''} />
        </div>
      ))}
    </div>
  );
}

export default ImageList;
