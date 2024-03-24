const KEY_FAVOURITES = "unsplash.favourites";
const KEY_COMMENTS = "unsplash.comments";
const KEY_QUERY = "unsplash.query";

export type ImageComment = {
  date: string;
  text: string;
};

export function imageIsFavourite(id: string): boolean {
  return imageGetFavourites()[id] !== undefined;
}

export function toggleImageFavourite(id: string): boolean {
  const favourites = imageGetFavourites();
  let result = false;
  if (id in favourites) {
    delete favourites[id];
    result = false;
  } else {
    favourites[id] = true;
    result = true;
  }
  window.localStorage.setItem(KEY_FAVOURITES, JSON.stringify(favourites));
  return result;
}

export function imageAddComment(id: string, comment: string) {
  const payload: ImageComment = {
    date: new Date().toISOString(),
    text: comment,
  };
  imageSetComments(id, [payload, ...imageGetComments(id)]);
}

function imageSetComments(id: string, comments: ImageComment[]) {
  window.localStorage.setItem(
    `${KEY_COMMENTS}.${id}`,
    JSON.stringify(comments),
  );
}

export function imageGetComments(id: string): ImageComment[] {
  try {
    return JSON.parse(
      window.localStorage.getItem(`${KEY_COMMENTS}.${id}`) ?? "[]",
    );
  } catch (e) {
    return [];
  }
}

export function imageGetFavourites(): { [key: string]: boolean } {
  try {
    return JSON.parse(window.localStorage.getItem(KEY_FAVOURITES) ?? "{}");
  } catch (e) {
    return {};
  }
}

export function saveLastQuery(query: string) {
  window.localStorage.setItem(KEY_QUERY, query);
}

export function getLastQuery() {
  return window.localStorage.getItem(KEY_QUERY);
}
