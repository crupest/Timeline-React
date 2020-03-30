import React from 'react';

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
  return (
    <>
      <AppBar />
      <div className="mt-appbar px-2 mb-4">
        <div className="container mt-4 py-3 shadow border border-primary rounded bg-light">
          <h4 id="author-info">网站作者</h4>
          <div>
            <div className="d-flex">
              <img
                src={authorAvatarUrl}
                className="align-self-start avatar large rounded-circle"
              />
              <div>
                <p>
                  <small>姓名：</small>
                  <span className="text-primary">杨宇千</span>
                </p>
                <p>
                  <small>昵称：</small>
                  <span className="text-primary">crupest</span>
                </p>
                <p>
                  <small>简介：</small>一个基于巧合编程的代码爱好者。
                </p>
              </div>
            </div>
            <p>
              <small>链接：</small>
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
          <h4>网站信息</h4>
          <p>
            这个网站的名字叫 <span className="text-primary">Timeline</span>{' '}
            ，是一个以<b>时间线</b>为核心概念的 Web App . 它的前端和后端都是由
            <a href="#author-info">我</a>开发，并且在 GitHub
            上开源。大家可以相对轻松的把它们部署在自己的服务器上，这也是我的目标之一。欢迎大家前往
            GitHub 仓库提出任何意见。
          </p>
          <p>
            <a
              href="https://github.com/crupest/Timeline-React"
              target="_blank"
              rel="noopener noreferrer"
            >
              前端 GitHub 仓库
            </a>
          </p>
          <p>
            <a
              href="https://github.com/crupest/Timeline"
              target="_blank"
              rel="noopener noreferrer"
            >
              后端 GitHub 仓库
            </a>
          </p>
        </div>
        <div className="container mt-4 py-3 shadow border border-primary rounded bg-light">
          <h4>鸣谢</h4>
          <p>
            Timeline
            是站在巨人肩膀上的作品，感谢以下列出的和其他未列出的许多开源项目，相关
            License 请在 GitHub 仓库中查看。
          </p>
          <p>前端：</p>
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
          <p>后端：</p>
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
