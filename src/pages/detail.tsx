import { HeadFC, PageProps } from "gatsby";
import React, { useEffect, useState } from "react";
import { imageGetFavourites } from "../store";
import ImageViewer from "../components/ImageViewer";
import { ApiObject, api_create } from "../api";
import { Button, Card } from "flowbite-react";
import * as PhotoApi from "unsplash-js/dist/methods/photos/types";
import Image from "../components/Image";
import { IoArrowBackSharp } from "react-icons/io5";
import { navigate } from "gatsby";

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
    <main className="relative m-2 flex h-screen flex-col items-center">
      <div className="w-fit">
        <div className="place-self-start">
          <Button pill size="md" onClick={() => navigate(-1)}>
            <IoArrowBackSharp />
          </Button>
        </div>
        <div className="mt-2">
          <Image data={detail} fullPage={true} />
        </div>
      </div>
    </main>
  );
};

export default ImageDetailPage;
export const Head: HeadFC = () => <title>UnsplashJs Demo</title>;
