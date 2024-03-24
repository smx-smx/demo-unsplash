import type { HeadFC, PageProps } from "gatsby";
import React from 'react';
import ImageViewer from "../components/ImageViewer";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <main>
      <ImageViewer mode='main' />
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>UnsplashJs Demo</title>;
