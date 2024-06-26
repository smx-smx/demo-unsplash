import React, { useEffect, useState } from "react";
import * as PhotoApi from "unsplash-js/dist/methods/photos/types";
import SearchBar from "../components/SearchBar";
import ImageList from "../components/ImageList";
import { Button, Kbd, Label, Spinner, TextInput } from "flowbite-react";
import AppNavbar from "../components/AppNavbar";
import { ApiObject, api_create, api_setToken } from "../api";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { getLastQuery, saveLastQuery } from "../store";

interface ImageViewerProps {
  mode: "main" | "favourites";
  /** properties for favourites mode */
  imageIds?: string[];
}

function ImageViewer({ mode, imageIds }: ImageViewerProps) {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<PhotoApi.Basic[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [apiToken, setApiToken] = useState<string>("");
  const [api, setApi] = useState<ApiObject | null | undefined>(undefined);

  // keep low due to rate limiting
  const FAVS_PER_PAGE = 5;
  const totalPages =
    imageIds !== undefined
      ? Math.ceil(imageIds.length / FAVS_PER_PAGE)
      : undefined;

  const isApiAvailable = () => {
    return (
      api !== undefined && // api status: unknown
      api !== null // api status: key not present
    );
  };

  const createApi = () => {
    const api = api_create();
    setApi(api);
  };

  /** run on startup */
  useEffect(() => {
    const lastQuery = getLastQuery();
    if (lastQuery !== null) {
      setQuery(lastQuery);
    }
    createApi();
  }, []);

  /** run when API state changes */
  useEffect(() => {
    if (isApiAvailable()) {
      if (mode === "main" && query.length < 1) {
        randomSearch();
      } else {
        fetchImages();
      }
    }
  }, [api]);

  /** save last query */
  useEffect(() => {
    saveLastQuery(query);
  }, [query]);

  /**
   * run when the page number changes,
   * or the query changes
   **/
  useEffect(() => {
    fetchImages();
  }, [pageNumber, query]);

  const getRandomKeyword = () => {
    const keywords = [
      "Nature",
      "Landscape",
      "Animals",
      "City",
      "Food",
      "Travel",
      "Art",
      "Architecture",
      "Technology",
      "Music",
    ];
    const randomIndex = Math.floor(Math.random() * keywords.length);
    return keywords[randomIndex];
  };

  const randomSearch = () => {
    const randomQuery = getRandomKeyword();
    setQuery(randomQuery);
  };

  const fetchImagesInternal = async () => {
    if (!isApiAvailable()) {
      return;
    }
    const theApi = api as ApiObject;

    setLoading(true);

    if (mode === "main") {
      const resp = await theApi.search.getPhotos({
        query: query,
        page: pageNumber,
        perPage: 25,
      });
      setImages(resp.response?.results ?? []);
    } else if (mode == "favourites" && imageIds !== undefined) {
      const start = (pageNumber - 1) * FAVS_PER_PAGE;
      const end = start + FAVS_PER_PAGE;
      const items = imageIds.slice(start, end);
      const resp = await Promise.all(
        items.map((id) => {
          console.debug(`fetching ${id}...`);
          return theApi.photos.get({ photoId: id });
        }),
      );
      const respData = resp
        .filter((r) => r.response !== undefined)
        .map((r) => r.response) as PhotoApi.Full[];
      setImages(respData ?? []);
    }
    setLoading(false);
  };

  const fetchImages = async () => {
    try {
      setError(null);
      await fetchImagesInternal();
    } catch (error) {
      setLoading(false);
      console.error(error);
      setError("An error occurred, please try again later");
    }
  };

  const paginationOp = async (op: string) => {
    let handled = true;
    let nextPageNumber = pageNumber;
    switch (op) {
      case "+":
        if (totalPages === undefined || pageNumber < totalPages) {
          nextPageNumber = pageNumber + 1;
        }
        break;
      case "-":
        if (pageNumber > 1) {
          nextPageNumber = pageNumber - 1;
        }
        break;
      default:
        handled = false;
        break;
    }
    if (handled) {
      setPageNumber(nextPageNumber);
    }
  };

  if (!isApiAvailable()) {
    return (
      <main className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
        <div className="flex flex-col">
          <div>
            <Label>Enter api Token</Label>
          </div>
          <div className="flex flex-row gap-1">
            <TextInput
              onChange={(e) => setApiToken(e.target.value)}
            ></TextInput>
            <Button
              onClick={() => {
                api_setToken(apiToken);
                createApi();
              }}
            >
              Set
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="m-4 dark:bg-gray-800">
      <AppNavbar />
      <div>
        <div className="m-3 flex flex-row justify-center">
          {mode === "main" && (
            <SearchBar
              initialQuery={query}
              onSearch={(query) => {
                if (query.length < 1) {
                  randomSearch();
                } else {
                  setQuery(query);
                }
              }}
            />
          )}
          {loading && <Spinner size={"xl"} />}
        </div>

        <div>
          <div className="mr-0 flex w-full flex-wrap place-content-end gap-1 justify-self-end">
            <span>
              Page {pageNumber}
              {totalPages !== undefined && (
                <>
                  /{totalPages} <br />
                  (5 per page)
                </>
              )}
            </span>
          </div>
          <div className="mr-0 flex w-full flex-wrap place-content-end gap-1 justify-self-end">
            <Kbd onClick={() => paginationOp("-")} icon={MdKeyboardArrowLeft} />
            <Kbd
              onClick={() => paginationOp("+")}
              icon={MdKeyboardArrowRight}
            />
          </div>
          {error && (
            <div className="w-full text-center">
              <span className="text-2xl text-red-500">{error}</span>
            </div>
          )}
          <ImageList images={images} />
        </div>
      </div>
    </main>
  );
}

export default ImageViewer;
