import { Panel, PanelSource } from './types';

/**
 * Given a PageGW Panel, returns the best type of link to be used.
 *
 * E.g. if an authenticated user is requesting and there's a secure link, then return
 * 'secureLink'.
 */
export const findLink = ({
  panel,
  token,
}: {
  panel: Panel;
  token?: string;
}): keyof Pick<PanelSource, 'link' | 'secureLink'> | null => {
  if (token && panel.source.secureLink) {
    return 'secureLink';
  }

  if (panel.source.link) {
    return 'link';
  }

  return null;
};
