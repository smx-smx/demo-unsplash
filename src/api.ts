import { createApi } from "unsplash-js";

export function createUnsplashApi(){
	return createApi({
		accessKey: window.localStorage.getItem('unsplash.apikey') ?? ''
	});
}