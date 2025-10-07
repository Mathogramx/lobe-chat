import { isString } from 'lodash-es';
import qs from 'query-string';
import urlJoin from 'url-join';

import { BRANDING_EMAIL, BRANDING_NAME, SOCIAL_URL } from '@/const/branding';
import { DEFAULT_LANG } from '@/const/locale';
import { OFFICIAL_SITE, OFFICIAL_URL } from '@/const/url';
import { Locales } from '@/locales/resources';
import { getCanonicalUrl } from '@/server/utils/url';

import pkg from '../../package.json';

const LAST_MODIFIED = new Date().toISOString();
export const AUTHOR_LIST = {
  imoogle: {
    avatar: '/icon-512x512.png',
    desc: 'Official Account',
    name: 'Imoogle',
    url: 'https://imoogleai.xyz',
  },
};

export class Ld {
  generate({
    image = '/og/cover.png',
    article,
    url,
    title,
    description,
    date,
    locale = DEFAULT_LANG,
    webpage = {
      enable: true,
    },
  }: {
    article?: {
      author: string[];
      enable?: boolean;
      identifier: string;
      tags?: string[];
    };
    date?: string;
    description: string;
    image?: string;
    locale?: Locales;
    title: string;
    url: string;
    webpage?: {
      enable?: boolean;
      search?: boolean | string;
    };
  }) {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        this.genWebSite(),
        article?.enable && this.genArticle({ ...article, date, description, locale, title, url }),
        webpage?.enable &&
          this.genWebPage({
            ...webpage,
            date,
            description,
            image,
            locale,
            title,
            url,
          }),
        image && this.genImageObject({ image, url }),
        this.genOrganization(),
      ].filter(Boolean),
    };
  }

  genOrganization() {
    return {
      '@id': this.getId(OFFICIAL_URL, '#organization'),
      '@type': 'Organization',
      'alternateName': 'ImoogleAI',
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'customer support',
        'email': BRANDING_EMAIL.support,
      },
      'description':
        'ImoogleAI provides modern AI-powered chat solutions and tools, creating an innovative platform for intelligent conversations and collaborative AI interactions.',
      'email': BRANDING_EMAIL.business,
      'founders': [this.getAuthors(['imoogle'])],
      'image': urlJoin(OFFICIAL_SITE, '/icon-512x512.png'),
      'logo': {
        '@type': 'ImageObject',
        'height': 512,
        'url': urlJoin(OFFICIAL_SITE, '/icon-512x512.png'),
        'width': 512,
      },
      'name': 'Imoogle',
      'sameAs': [],
      'url': OFFICIAL_SITE,
    };
  }

  getAuthors(ids: string[] = []) {
    const defaultAuthor = {
      '@id': this.getId(OFFICIAL_URL, '#organization'),
      '@type': 'Organization',
    };
    if (!ids || ids.length === 0) return defaultAuthor;
    if (ids.length === 1 && ids[0] === 'imoogle') return defaultAuthor;
    const personId = ids.find((id) => id !== 'imoogle');
    if (!personId) return defaultAuthor;
    const person = (AUTHOR_LIST as any)?.[personId];
    if (!person) return defaultAuthor;
    return {
      '@type': 'Person',
      'name': person.name,
      'url': person.url,
    };
  }

  genWebPage({
    date,
    image,
    search,
    description,
    title,
    locale = DEFAULT_LANG,
    url,
  }: {
    breadcrumbs?: { title: string; url: string }[];
    date?: string;
    description: string;
    image?: string;
    locale?: Locales;
    search?: boolean | string;
    title: string;
    url: string;
  }) {
    const fixedUrl = getCanonicalUrl(url);
    const dateCreated = date ? new Date(date).toISOString() : LAST_MODIFIED;
    const dateModified = date ? new Date(date).toISOString() : LAST_MODIFIED;

    const baseInfo: any = {
      '@id': fixedUrl,
      '@type': 'WebPage',
      'about': {
        '@id': this.getId(OFFICIAL_URL, '#organization'),
      },
      'breadcrumbs': {
        '@id': this.getId(fixedUrl, '#breadcrumb'),
      },
      'dateModified': dateModified,
      'datePublished': dateCreated,
      'description': description,
      'image': {
        '@id': this.getId(fixedUrl, '#primaryimage'),
      },
      'inLanguage': locale,
      'isPartOf': {
        '@id': this.getId(OFFICIAL_URL, '#website'),
      },
      'name': this.fixTitle(title),
      'primaryImageOfPage': {
        '@id': this.getId(fixedUrl, '#primaryimage'),
      },
      'thumbnailUrl': image,
    };

    if (search)
      baseInfo.potentialAction = {
        '@type': 'SearchAction',
        'query-input': 'required name=search_term_string',
        'target': qs.stringifyUrl({
          query: { q: '{search_term_string}' },
          url: isString(search) ? getCanonicalUrl(search) : fixedUrl,
        }),
      };

    return baseInfo;
  }

  genImageObject({ image, url }: { image: string; url: string }) {
    const fixedUrl = getCanonicalUrl(url);

    return {
      '@id': this.getId(fixedUrl, '#primaryimage'),
      '@type': 'ImageObject',
      'contentUrl': image,
      'inLanguage': DEFAULT_LANG,
      'url': image,
    };
  }

  genWebSite() {
    const baseInfo: any = {
      '@id': this.getId(OFFICIAL_URL, '#website'),
      '@type': 'WebSite',
      'description': pkg.description,
      'inLanguage': DEFAULT_LANG,
      'name': BRANDING_NAME,
      'publisher': {
        '@id': this.getId(OFFICIAL_URL, '#organization'),
      },
      'url': OFFICIAL_URL,
    };

    return baseInfo;
  }

  genArticle({
    description,
    title,
    url,
    author,
    date,
    locale = DEFAULT_LANG,
    tags,
    identifier,
  }: {
    author: string[];
    date?: string;
    description: string;
    identifier: string;
    locale: Locales;
    tags?: string[];
    title: string;
    url: string;
  }) {
    const fixedUrl = getCanonicalUrl(url);

    const dateCreated = date ? new Date(date).toISOString() : LAST_MODIFIED;

    const dateModified = date ? new Date(date).toISOString() : LAST_MODIFIED;
    const baseInfo: any = {
      '@type': 'Article',
      'author': this.getAuthors(author),
      'creator': author,
      'dateCreated': dateCreated,
      'dateModified': dateModified,
      'datePublished': dateCreated,
      'description': description,
      'headline': this.fixTitle(title),
      'identifier': identifier,
      'image': {
        '@id': this.getId(fixedUrl, '#primaryimage'),
      },
      'inLanguage': locale,
      'keywords': tags?.join(' ') || 'Imoogle ImoogleAI',
      'mainEntityOfPage': fixedUrl,
      'name': title,
      'publisher': {
        '@id': this.getId(OFFICIAL_URL, '#organization'),
      },
      'url': fixedUrl,
    };

    return {
      ...baseInfo,
    };
  }

  private getId(url: string, id: string) {
    return [url, id].join('/');
  }

  private fixTitle(title: string) {
    return title.includes(BRANDING_NAME) ? title : `${title} · ${BRANDING_NAME}`;
  }
}

export const ldModule = new Ld();
