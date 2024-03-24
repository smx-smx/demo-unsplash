import React from 'react';
import { Card } from 'flowbite-react';
import * as PhotoApi from 'unsplash-js/dist/methods/photos/types';

interface ImageProps {
	data: PhotoApi.Basic;
}

function Image({ data } : ImageProps ){
	return <>
		<Card
			className="max-w-sm"
			imgAlt={data.alt_description ?? ''}
			imgSrc={data.urls.thumb}
		>
			<p className="font-normal text-gray-700 dark:text-gray-400">
				{data.description}
			</p>
		</Card>
	</>;
}

export default Image;