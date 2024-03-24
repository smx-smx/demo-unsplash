import { HeadFC, PageProps } from "gatsby";
import React, { useEffect, useState } from "react";
import { imageGetFavourites } from "../store";
import ImageViewer from "../components/ImageViewer";
import { ApiObject, api_create } from "../api";
import { Card } from "flowbite-react";
import * as PhotoApi from "unsplash-js/dist/methods/photos/types";
import Image from "../components/Image";

const ImageDetailPage: React.FC<PageProps> = (props) => {
  const [api, setApi] = useState<ApiObject | null | undefined>(undefined);
  const [detail, setDetail] = useState<PhotoApi.Basic | undefined>(undefined);
  const params = new URLSearchParams(props.location.search);
  const id = params.get("id");

  const createApi = () => {
    const api = api_create();
    setApi(api);
  };

  /** run on startup */
  useEffect(() => {
    createApi();
  }, []);

  const fetchDetail = async (id: string) => {
    const resp = await api!.photos.get({ photoId: id });
    const detail = resp.response;
    setDetail(detail);
  };

  useEffect(() => {
    if (api === null || api === undefined || id === null) return;
    fetchDetail(id);
  }, [api]);

  if (api === null || api === undefined) return <></>;
  if (detail === undefined) return <></>;
  return (
    <div className="m-auto flex w-2/6 flex-col">
      <Image data={detail} fullPage={true} />
    </div>
  );
};

export default ImageDetailPage;
export const Head: HeadFC = () => <title>UnsplashJs Demo</title>;
