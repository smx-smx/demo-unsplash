import { HeadFC, PageProps } from 'gatsby';
import React, { useEffect, useState } from 'react';
import { imageGetFavourites } from '../store';
import ImageViewer from '../components/ImageViewer';

const FavouritesPage: React.FC<PageProps> = () => {
  const favourites = Object.keys(imageGetFavourites()).slice(0, 2);

  return (
    <main>
      <ImageViewer mode='favourites' imageIds={favourites} />
    </main>
  )
};

export default FavouritesPage;
export const Head: HeadFC = () => <title>UnsplashJs Demo</title>;
