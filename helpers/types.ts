export type SectionReferenceType = 'APPLICATION' | 'STORE';

export type PageGWPage = {
  id: string;
  name?: string;
  country: 'SE' | '%future';
  type: SectionReferenceType;
  attributes: Record<string, any>;
  images: PageGWImage[];
  panels: Panel[];
};

type PageGWImage = {
  url: string;
  ratio?:
    | 'LANDSCAPE'
    | 'PORTRAIT'
    | 'SQUARE'
    | '3_1'
    | '4_3'
    | '16_9'
    | '2_1'
    | '3_4'
    | '2_3'
    | '1_1'
    | '9_5'
    | 'UNKNOWN';
  type:
    | 'POSTER'
    | 'SHOWCARD'
    | 'SCREENSHOT'
    | 'BACKDROP'
    | 'LOGO'
    | 'TITLE_DARK'
    | 'TITLE_NEUTRAL'
    | 'TITLE_LIGHT'
    | 'CAST_GROUP'
    | 'CAST_IN_CHARACTER'
    | 'PERSON'
    | 'UNKNOWN';
};

type PanelContentType = 'GENRE' | 'STORE' | 'CHANNEL' | 'CATEGORY' | 'MEDIA' | 'APPLICATION' | '%future';

export type PageShowFor = 'ALL' | 'GUEST' | 'AUTHENTICATED';

export type pageGWSourceType = 'DISCOVERY_GATEWAY' | 'SHOWCASE' | 'CHANNELS';

type PanelType =
  | 'POPULARITY_STORE'
  | 'POPULARITY_GENRE'
  | 'PEOPLE_ARE_WATCHING'
  | 'EDITORIAL'
  | 'EDITORIAL_STORES'
  | 'EDITORIAL_APPLICATIONS'
  | 'SEARCH_GENRE'
  | 'SEARCH_CATEGORY'
  | 'SEARCH_STORE'
  | 'ADDED'
  | 'TIMELINE'
  | 'POPULAR'
  | 'RECOMMENDED'
  | 'CONTEXT'
  | 'WATCHED'
  | 'CONTINUEWATCHING'
  | 'MYLIST'
  | 'CHANNELS'
  | 'SHOWCASE'
  | 'RENTALS'
  | 'RECORDINGS'
  | 'HOTSPOT'
  | 'NETFLIX'
  | 'EDITORIAL_PANEL'
  | 'LOGGED_OUT_PROMOTION_PANEL'
  | 'SUBSCRIPTION_PANEL'
  | '%future';

export type Panel = {
  id: string;
  title: string;
  displayHint?: string;
  source: PanelSource;
  panelType: PanelType;
  contentType?: PanelContentType;
};

export type PageSourceId =
  | 'NETFLIX'
  | 'POPULARITY_GATEWAY'
  | 'PEOPLE_ARE_WATCHING'
  | 'DISCOVERY_GATEWAY'
  | 'DYNAMIC_SEARCH_GATEWAY'
  | 'TIMELINE_GATEWAY'
  | 'CONTINUEWATCHING'
  | 'MYLIST'
  | 'CHANNELS'
  | 'HOTSPOT'
  | 'RENTALS'
  | 'RECORDINGS'
  | 'SHOWCASE'
  | 'EDITORIAL_PANEL'
  | 'LOGGED_OUT_PROMOTION_PANEL'
  | 'NETFLIX'
  | 'SUBSCRIPTION_PANEL'
  | '%future';

type PageSourceInfo = {
  filtering?: string;
  storeTypes?: string;
  applicationReferenceId?: string;
  storeReferenceId?: string;
  timelineType?: string;
  hoursBefore?: string;
  hoursAfter?: string;
  hotspotListId?: string;
  launchiid?: string;
  sort?: string;
  filter?: 'MOVIE' | 'SERIES' | 'ALL' | '%future';
  audience?: 'ALL' | 'GUEST' | 'AUTHENTICATED';
};

export type PanelSource = {
  link?: PagePanelLink;
  secureLink?: PagePanelLink;
  id: PageSourceId;
  info?: PageSourceInfo;
};

export type PagePanelLink = {
  url?: string;
  showFor?: PageShowFor;
  queryParams?: PagePanelLinkParameter;
  headers?: PagePanelLinkParameter;
  batchParameters?: Record<string, string>;
};

export type PagePanelLinkParameter = {
  mandatory?: string[];
  optional?: string[];
};

export type StoreType = 'SVOD' | 'VOD' | 'PPV' | 'PKG' | 'CVOD' | 'NPVR';

export type EngagementFiltering = 'IN_ENGAGEMENT' | 'OUTSIDE_ENGAGEMENT' | 'OFF';

export type PGWPanelUrlParams = {
  storeTypes?: StoreType[];
  hoursBefore?: number;
  hoursAfter?: number;
  sort?: string;
  sortOrder?: string;
  engagementFilter?: EngagementFiltering;
};

export type GetPanelContentOptions = {
  offset?: number;
  limit?: number;
  now?: number;
  sortKey?: string;
  sortOrder?: string;
};

/**
 * The types below are the ones you're most probably interested in.
 */
export type EditorialPanelResponse = Record<
    string,
    {
      id: string;
      title: string;
      items: EditorialContentGWResponseItem[];
    }
>;

export type EditorialContentGWResponseItem = {
  id: string;
  idType: 'media' | 'series' | 'page' | 'store';
};

export type Page = {
  id: string;
  panelDefinitions: PanelDefinition[];
};

export type PanelDefinition = {
  id: string;
  title: string;
  /**
   * URL as for where to fetch the panel content from
   */
  url: URL;
  /**
   * urlId is a stringified version of the url, including any headers.
   * This makes this id unique for all possible requests.
   */
  urlId: string;
  /**
   * Headers that must be used when making the request
   */
  headers: Record<string, string | undefined>;
  /*
   * A 'public' panel will respond with the same data no matter what user is requesting it.
   * A _non_ public panel (or private if you will) will respond with different data, depending on
   * the authorization token.
   *
   * Some panel services will take the logged in user
   * (from the authorization token) into account and only return media's that's
   * playable for that user. Other services will return the exact same data, no
   * matter who the logged in user is, or if the user is even logged in at all.
   *
   * public is set to true if the panel is indeed "public" and will return the same
   * data for everyone.
   *
   */
  public: boolean;
};

export type MediasResponse = Record<string, Media | undefined>;

export type Media = {
  id: string;
  title: string;
  /**
   * Lots and lots of more fields, but these are the only
   * ones that's of interest to us in this case.
   */
};

export const nonNullable = <T>(value: T): value is NonNullable<T> => value !== null && value !== undefined;
