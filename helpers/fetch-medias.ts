import got from 'got/dist/source';
import { MediasResponse } from './types';

export const fetchMedias = async ({ ids: ids }: { ids: string[] }): Promise<MediasResponse | null> => {
  try {
    const response = await got<MediasResponse>(
      `https://ottapi.pilot.telia.net/stb/se/exploregateway/rest/v4/explore/media/${ids.join(',')}`,
      {
        responseType: 'json',
      }
    );

    return response.body;
  } catch (e) {
    console.error(e);
    return null;
  }
};
