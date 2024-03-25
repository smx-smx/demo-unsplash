import React, { useEffect, useState } from "react";
import { Card, Kbd, Rating } from "flowbite-react";
import * as PhotoApi from "unsplash-js/dist/methods/photos/types";
import { imageIsFavourite, toggleImageFavourite } from "../store";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import ImageComments from "./ImageComments";
import { navigate } from "gatsby";

interface ImageProps {
  data: PhotoApi.Basic;
  fullPage: boolean;
}

function Image({ data, fullPage }: ImageProps) {
  const [isFavourite, setFavourite] = useState<boolean>(false);
  const [commentsExpanded, setCommentsExpanded] = useState<boolean>(false);

  const toggleFavourite = (id: string) => {
    const newState = toggleImageFavourite(id);
    setFavourite(newState);
  };

  useEffect(() => {
    setFavourite(imageIsFavourite(data.id));
  }, []);

  const getIcon = () => {
    return commentsExpanded ? MdKeyboardArrowUp : MdKeyboardArrowDown;
  };

  const toggleComments = () => {
    setCommentsExpanded(!commentsExpanded);
  };

  const getTextClasses = (fullPage: boolean) => {
    let klasses =
      "block h-10 min-w-1 truncate font-normal text-gray-700 dark:text-gray-400";
    if (!fullPage) {
      klasses += " truncate";
    }
    return klasses;
  };

  return (
    <div className={fullPage ? "" : "card_mini"}>
      <Card
        className="w-full"
        imgAlt={data.alt_description ?? ""}
        imgSrc={data.urls.regular}
        onClick={(e) => {
          if (!(e.target instanceof HTMLImageElement)) return;
          if (!fullPage) {
            navigate("/detail?id=" + encodeURIComponent(data.id));
          }
        }}
      >
        <div className="relative w-full text-wrap">
          <div
            className="absolute right-0 top-0 size-auto"
            style={{
              marginTop: "-20px",
              marginRight: "-20px",
            }}
          >
            <Rating size="md">
              <Rating.Star
                onClick={() => toggleFavourite(data.id)}
                filled={isFavourite}
              />
            </Rating>
          </div>
          <div className="">
            <p
              style={{
                width: fullPage ? "inherit" : "calc(min(200px, 30vw) - 30px)",
              }}
              className={getTextClasses(fullPage)}
            >
              {data.description ?? data.alt_description}
            </p>
          </div>
          {fullPage && (
            <div>
              <div>
                <Kbd
                  className="cursor-default"
                  icon={getIcon()}
                  onClick={() => toggleComments()}
                >
                  &nbsp; Comments
                </Kbd>
                {commentsExpanded && <ImageComments id={data.id} />}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Image;
