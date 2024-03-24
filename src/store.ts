const KEY_FAVOURITES = 'unsplash.favourites';

export function imageIsFavourite(id:string) : boolean {
  return imageGetFavourites()[id] !== undefined;
}

export function toggleImageFavourite(id:string) : boolean {
  const favourites = imageGetFavourites();
  let result = false;
  if(id in favourites){
    delete favourites[id];
    result = false;
  } else {
    favourites[id] = true;
    result = true;
  }
  window.localStorage.setItem(KEY_FAVOURITES, JSON.stringify(favourites));
  return result;
}

export function imageGetFavourites() : {[key: string] : boolean} {
  try {
    return JSON.parse(window.localStorage.getItem(KEY_FAVOURITES) ?? '{}');
  } catch(e){
    return {};
  }
}