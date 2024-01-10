import got from 'got/dist/source';

import { findLink } from './find-link';
import { nonNullable, Page, PageGWPage, PanelDefinition } from './types';
import { constructUrl } from './url-builder';

export const fetchPage = async ({ pageId }: { pageId: string; }): Promise<Promise<Page>> => {
  const response = await got<PageGWPage>(
    `https://pagegateway.clientapi-pilot.live.tv.telia.net/rest/v1/pages/TELIA/SE/web/GUEST/${encodeURIComponent(
      pageId
    )}`,
    {
      responseType: 'json',
    }
  );

  const panelDefinitions = await transformPanels({ pageDefinition: response.body });
  return {
    id: pageId,
    panelDefinitions,
  };
};

const transformPanels = async ({
  pageDefinition,
  token,
}: {
  pageDefinition: PageGWPage;
  token?: string;
}): Promise<PanelDefinition[]> => {
  const supportedPanels = pageDefinition.panels.filter((panel) => panel.source.id === 'EDITORIAL_PANEL');

  const urlPromises = supportedPanels.map(async (panel) => {
    const linkType = findLink({ panel, token });

    if (!linkType) {
      return null;
    }

    const link = panel.source[linkType];

    if (!link) {
      throw new Error(`No link in panel ${panel.id}`);
    }

    const urlInfo = await constructUrl(link, token);
    if (!urlInfo) {
      return null;
    }

    return {
      id: panel.id,
      title: panel.title,
      url: urlInfo.url,
      urlId: urlInfo.urlId,
      headers: urlInfo.headers,
      public: linkType === 'link',
    };
  });

  return (await Promise.all(urlPromises)).filter(nonNullable);
};
