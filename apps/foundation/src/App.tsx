import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import WujieReact from "wujie-react";
import React from "react";
import styled from 'styled-components';

import appConfig from './configs/app-config'
import routeConfig from './configs/route-config'
import SubApp from './views/subApp'
import './App.css'

const { bus } = WujieReact;

const StyledNav = styled.nav`
  border-bottom: 1px solid #999999;
  padding: 2px 0;
  width: 100%;
  display: flex;
  justify-items: center;
  align-items: center;
  height: var(--nav-height);

  .nav-link {
    border: 1px solid #999999;
    background-color: #e3e3e3;
    color: #333;
    border-radius: 5px;
    padding: 0 10px;
    margin-left: 2px;
    height: calc(100% - 4px);
    display: flex;
    align-items: center;

    &:hover {
      border: 1px solid #2f78cb;
      background-color: #4f9bf2;
    }
  }
`
function Nav() {
  bus.$on("sub-router-change", (name: string, path: string) => {
  });
  return (
    <StyledNav>
      <NavLink className="nav-link" to="/">
        Home
      </NavLink>
      <NavLink className="nav-link" to="/chat/">
        chat
      </NavLink>
      <NavLink className="nav-link" to="/chat/about">
        chat/about
      </NavLink>
    </StyledNav>
  )
}

const PageContainer = styled.div`
  --nav-height: 40px;

  .page-header {
    width: 100%;
  }
  .page-body {
    width: 100%;
    height: calc(100% - var(--nav-height) - 1px);
  }
`

class App extends React.PureComponent {

  render() {
    return(<>
      <BrowserRouter>
        <PageContainer>
          <div className='page-header'>
            <Nav></Nav>
          </div>
          <div className='page-body'>
            <Routes>
            {
              routeConfig.map(route => <Route path={route.path} element={route.element}></Route>)
            }
            {
              appConfig.map(app => <Route path={`/${app.name}/:path?`} element={<SubApp {...app} />}></Route>)
            }
            </Routes>
          </div>
        </PageContainer>
      </BrowserRouter>
    </>)
  }
}

export default App
