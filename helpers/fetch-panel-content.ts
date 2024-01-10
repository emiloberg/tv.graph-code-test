import got from 'got/dist/source';

/**
 * Super simple implementation
 */
export const fetchPanelContent = async <T>({
  url,
}: {
  url: string;
}): Promise<T | null> => {
  try {
    const response = await got<T>(url, {
      responseType: 'json',
    });

    return response.body;
  } catch (e) {
    console.error(e);
    return null;
  }
};
