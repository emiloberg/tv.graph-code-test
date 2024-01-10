import { GetPanelContentOptions, PagePanelLink, PagePanelLinkParameter, PGWPanelUrlParams } from './types';

const ONE_HOUR_IN_MS = 3_600_000;

type ReqHeaders = {
  authorization?: string;
};

type ParamValue = { isPrivate: boolean; value: string };
type ParamType = keyof Pick<PagePanelLink, 'queryParams' | 'headers'>;
type GetParam = (
  name: string,
  isMandatory: boolean,
  requestHeaders: ReqHeaders,
  options: GetPanelContentOptions,
  urlParams: PGWPanelUrlParams
) => Promise<ParamValue | null>;

const replaceBatchParams = (url: URL, params?: Record<string, string>) => {
  if (!params) return url;

  for (const key in params) {
    url.pathname = url.pathname.replace(encodeURI(`{${key}}`), params[key]);
  }

  return url;
};

export const constructUrl = async (
  link: PagePanelLink,
  token?: string
): Promise<{
  headers: Record<string, string>;
  url: URL;
  urlId: string;
} | null> => {
  const params = await getParams(link, { authorization: token }, {}, {});
  const urlStr = link.url;

  if (!urlStr) {
    return null;
  }

  const url = replaceBatchParams(new URL(urlStr), link.batchParameters);

  const urlId = getUrlId(params, url);
  for (const queryParam of params.queryParams) {
    url.searchParams.append(queryParam[0], queryParam[1].value);
  }

  return {
    url,
    headers: Object.fromEntries(params.headers.map(([key, val]) => [key, val.value])),
    urlId,
  };
};

const sortParam = ([a]: [string, ParamValue], [b]: [string, ParamValue]) => a.localeCompare(b);

const getUrlId = (params: Record<ParamType, [string, ParamValue][]>, url: URL): string => {
  const queryParams = params.queryParams
    .filter(([_, valObj]) => !valObj.isPrivate)
    .sort(sortParam)
    .map(([key, valObj]) => `${key}=${valObj.value}`)
    .join('&');
  const headers = params.headers
    .filter(([_, valObj]) => !valObj.isPrivate)
    .sort(sortParam)
    .map(([key, valObj]) => `${key}=${valObj.value}`)
    .join('&');
  const urlString = url.toString();

  return `${urlString}|${queryParams}|${headers}`;
};

const neededKeys: Array<keyof PagePanelLinkParameter> = ['mandatory', 'optional'];
const paramTypes: Array<ParamType> = ['queryParams', 'headers'];

const getParams = async (
  link: PagePanelLink,
  requestHeaders: ReqHeaders,
  options: GetPanelContentOptions,
  urlParams: PGWPanelUrlParams
): Promise<Record<ParamType, [string, ParamValue][]>> => {
  const namePromiseMap: Record<ParamType, [string, Promise<ParamValue | null>][]> = {
    headers: [],
    queryParams: [],
  };

  namePromiseMap.headers.push([
    'tv-client-boot-id',
    Promise.resolve({
      value: 'graphql-code-test',
      isPrivate: true,
    }),
  ]);

  for (const paramType of paramTypes) {
    for (const neededKey of neededKeys) {
      for (const paramName of link[paramType]?.[neededKey] || []) {
        const val = paramGetters[paramType](paramName, neededKey === 'mandatory', requestHeaders, options, urlParams);

        namePromiseMap[paramType].push([paramName, val]);
      }
    }
  }

  const headerPromises = Promise.all(namePromiseMap.headers.map(([_name, promise]) => promise));
  const queryParamPromises = Promise.all(namePromiseMap.queryParams.map(([_name, promise]) => promise));
  const [headers, queryParams] = await Promise.all([headerPromises, queryParamPromises]);

  const out: Record<ParamType, [string, ParamValue][]> = {
    headers: [],
    queryParams: [],
  };

  headers.forEach((val, i) => {
    if (val === null) return;
    out.headers.push([namePromiseMap.headers[i][0], val]);
  });

  queryParams.forEach((val, i) => {
    if (val === null) return;
    out.queryParams.push([namePromiseMap.queryParams[i][0], val]);
  });

  return out;
};

const getHeader: GetParam = async (name, isMandatory, requestHeaders, _options, _urlParams) => {
  const IGNORED_QUERYPARAMS = ['tv-client-boot-id' /* boot id is _always_ added */];
  if (IGNORED_QUERYPARAMS.includes(name)) {
    return null;
  }

  /** */

  if (name === 'authorization') {
    if (requestHeaders.authorization) {
      return { value: requestHeaders.authorization, isPrivate: true };
    } else {
      throw new Error(`Authorization header needed but no found`);
    }
  }

  if (name === 'Client') {
    return { value: 'common-graphql', isPrivate: false };
  }

  if (isMandatory) {
    // TODO log error
    throw new Error(`Could not translate mandatory header '${name}'`);
  } else {
    console.log(`Could not translate optional header '${name}'`);
  }

  return null;
};

const getQueryString: GetParam = async (name, isMandatory, requestHeaders, options, urlParams) => {
  const IGNORED_QUERYPARAMS = ['parentalContent', 'deviceId', 'language'];
  if (IGNORED_QUERYPARAMS.includes(name)) {
    return null;
  }

  if (name === 'deviceTypes') {
    return { value: 'WEB', isPrivate: false };
  }
  if (name === 'protocols') {
    return { value: ['DASH'].join(','), isPrivate: false };
  }
  if (name === 'resolutions') {
    return { value: ['FULLHD', 'HD', 'SD', 'UHD'].join(','), isPrivate: false };
  }
  if (name === 'deviceType') {
    return { value: 'WEB', isPrivate: false };
  }
  if (name === 'deviceTarget') {
    return {
      value: 'web',
      isPrivate: false,
    };
  }

  if (name === 'fromIndex' || name === 'from') {
    return { value: options.offset?.toString() || '0', isPrivate: false };
  }

  if (name === 'toIndex' || name === 'to') {
    if (options.limit !== undefined) {
      return {
        value: ((options.offset || 0) + options.limit).toString(),
        isPrivate: false,
      };
    }
    return null;
  }

  if (name === 'storeIds' || name === 'stores' || name === 'subscriptionStores' || name === 'subscriptionStoresIds') {
    return {
      value:
        '8867,8870,8871,8872,8873,8874,8875,8881,8883,8885,8886,8887,8888,8889,8890,8891,8892,8893,8895,8897,8899,8900,8901,8902,8904,8905,8906,8910,8913,8914,8916,8917,8918,8919,8920,8921,8922,8923,8924,8925,8930,8931,8932,8933,8934,8935,8936,8937,8938,8939,8940,8941,8942,8943,8944,8945,8946,8947,8948,8949,8951,8953,8954,8956,8957,8958,8959,8960,8964,8965,8966,8969,8971,8972,8973,8975,8976,8979,8980,8981,8982,8983,8984,8985,8987,8988,8991,8994,8995,8999,9000,978128188,1115407304,1522497481,1612367136,1728169211,1728910650,1728938087,1728940322,1728942088,1895894284,2415682870,2821052379,2821052931,1348532111983,1348532111995,1348532111984,1348532111993,9900000000005',
      isPrivate: false,
    };
  }

  if (name === 'channels') {
    const filterOnEngagement =
      (urlParams.engagementFilter === 'IN_ENGAGEMENT' && !!requestHeaders.authorization) || false;

    if (!filterOnEngagement) {
      return null;
    }
    const data = [
      '595',
      '596',
      '112',
      '113',
      '597',
      '598',
      '114',
      '599',
      '115',
      '116',
      '90',
      '91',
      '94',
      '96',
      '97',
      '10',
      '98',
      '99',
      '11',
      '43321471',
      '13',
      '14',
      '15',
      '742278402',
      '16',
      '17',
      '18',
      '19',
      '120',
      '241',
      '242',
      '1',
      '122',
      '2',
      '8388606',
      '3',
      '4',
      '126',
      '5',
      '369',
      '7',
      '9',
      '3370992',
      '20',
      '22',
      '23',
      '24',
      '26',
      '27',
      '28',
      '370',
      '777',
      '31',
      '32',
      '33',
      '941',
      '942',
      '943',
      '944',
      '50501',
      '945',
      '50503',
      '50502',
      '948',
      '50505',
      '949',
      '50504',
      '43',
      '50507',
      '50506',
      '50509',
      '46',
      '50508',
      '47',
      '950',
      '50510',
      '50512',
      '50511',
      '50514',
      '50513',
      '50516',
      '50515',
      '50518',
      '55',
      '50517',
      '58',
      '50519',
      '59',
      '3363953',
      '321',
      '960',
      '322',
      '961',
      '323',
      '203',
      '962',
      '324',
      '204',
      '963',
      '325',
      '964',
      '326',
      '965',
      '206',
      '327',
      '50520',
      '966',
      '328',
      '207',
      '449',
      '967',
      '208',
      '329',
      '61',
      '968',
      '209',
      '969',
      '62',
      '63',
      '69',
      '210',
      '970',
      '454',
      '971',
      '972',
      '973',
      '974',
      '975',
      '9217513',
      '71',
      '72',
      '73',
      '74',
      '75',
      '76',
      '3366367',
      '100',
      '108',
      '81',
      '82',
      '84',
      '86',
      '87',
    ].join(',');
    return data ? { value: data, isPrivate: false } : null;
  }

  if (name === 'includeHidden') {
    return null;
  }

  if (name === 'maxAgeDays') {
    return null;
  }

  if (name === 'windowStart') {
    return {
      value: new Date((options.now || Date.now()) - ONE_HOUR_IN_MS * (urlParams.hoursBefore || 0)).toISOString(),
      isPrivate: false,
    };
  }

  if (name === 'windowEnd') {
    return {
      value: new Date((options.now || Date.now()) + ONE_HOUR_IN_MS * (urlParams.hoursAfter || 0)).toISOString(),
      isPrivate: false,
    };
  }

  if (name === 'sort') {
    if (options.sortKey) {
      return { value: options.sortKey, isPrivate: false };
    }
    return null;
  }

  if (name === 'sortOrder') {
    if (options.sortOrder) {
      return { value: options.sortOrder, isPrivate: false };
    }
    return null;
  }

  if (name === 'excludeIds') {
    return null;
  }

  if (isMandatory) {
    throw new Error(`Could not translate mandatory querystring '${name}'`);
  } else {
    console.log(`Could not translate optional querystring '${name}'`);
  }

  return null;
};

const paramGetters: Record<ParamType, GetParam> = {
  headers: getHeader,
  queryParams: getQueryString,
};
