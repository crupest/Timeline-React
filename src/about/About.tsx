import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

import authorAvatarUrl from './author-avatar.png';

import AppBar from '../common/AppBar';

const frontendCredits: {
  name: string;
  url: string;
  icon?: string;
}[] = [
  {
    name: 'reactjs',
    url: 'https://reactjs.org',
    icon: 'react',
  },
  {
    name: 'typescript',
    url: 'https://www.typescriptlang.org',
  },
  {
    name: 'bootstrap',
    url: 'https://getbootstrap.com',
    icon: 'bootstrap',
  },
  {
    name: 'reactstrap',
    url: 'https://reactstrap.github.io',
  },
  {
    name: 'babeljs',
    url: 'https://babeljs.io',
  },
  {
    name: 'webpack',
    url: 'https://webpack.js.org',
  },
  {
    name: 'sass',
    url: 'https://sass-lang.com',
    icon: 'sass',
  },
  {
    name: 'fontawesome',
    url: 'https://fontawesome.com',
    icon: 'font-awesome-flag',
  },
  {
    name: 'eslint',
    url: 'https://eslint.org',
  },
  {
    name: 'prettier',
    url: 'https://prettier.io',
  },
  {
    name: 'pepjs',
    url: 'https://github.com/jquery/PEP',
  },
  {
    name: 'cross-env',
    url: 'https://github.com/kentcdodds/cross-env',
  },
];

const backendCredits: {
  name: string;
  url: string;
  icon?: string;
}[] = [
  {
    name: 'ASP.Net Core',
    url: 'https://dotnet.microsoft.com/learn/aspnet/what-is-aspnet-core',
  },
  { name: 'sqlite', url: 'https://sqlite.org' },
  {
    name: 'ImageSharp',
    url: 'https://github.com/SixLabors/ImageSharp',
  },
];

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <AppBar />
      <div className="mt-appbar px-2 mb-4">
        <div className="container mt-4 py-3 shadow border border-primary rounded bg-light">
          <h4 id="author-info">{t('about.author.title')}</h4>
          <div>
            <div className="d-flex">
              <img
                src={authorAvatarUrl}
                className="align-self-start avatar large rounded-circle"
              />
              <div>
                <p>
                  <small>{t('about.author.fullname')}</small>
                  <span className="text-primary">杨宇千</span>
                </p>
                <p>
                  <small>{t('about.author.nickname')}</small>
                  <span className="text-primary">crupest</span>
                </p>
                <p>
                  <small>{t('about.author.introduction')}</small>
                  {t('about.author.introductionContent')}
                </p>
              </div>
            </div>
            <p>
              <small>{t('about.author.links')}</small>
              <a
                href="https://github.com/crupest"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-github about-link-icon text-body" />
              </a>
              <a
                href="https://blog.crupest.xyz"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-blog about-link-icon text-body" />
              </a>
            </p>
          </div>
        </div>
        <div className="container mt-4 py-3 shadow border border-primary rounded bg-light">
          <h4>{t('about.site.title')}</h4>
          <p>
            <Trans i18nKey="about.site.content">
              0<span className="text-primary">1</span>2<b>3</b>4
              <a href="#author-info">5</a>6
            </Trans>
          </p>
          <p>
            <a
              href="https://github.com/crupest/Timeline-React"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('about.site.frontendRepo')}
            </a>
          </p>
          <p>
            <a
              href="https://github.com/crupest/Timeline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('about.site.backendRepo')}
            </a>
          </p>
        </div>
        <div className="container mt-4 py-3 shadow border border-primary rounded bg-light">
          <h4>{t('about.credits.title')}</h4>
          <p>{t('about.credits.content')}</p>
          <p>{t('about.credits.frontend')}</p>
          <ul>
            {frontendCredits.map((item, index) => {
              return (
                <li key={index}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.icon != null && (
                      <i className={'fab fa-' + item.icon + ' mx-2'} />
                    )}
                    {item.name}
                  </a>
                </li>
              );
            })}
            <li>...</li>
          </ul>
          <p>{t('about.credits.backend')}</p>
          <ul>
            {backendCredits.map((item, index) => {
              return (
                <li key={index}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.icon != null && (
                      <i className={'fab fa-' + item.icon + ' mx-2'} />
                    )}
                    {item.name}
                  </a>
                </li>
              );
            })}
            <li>...</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default About;
