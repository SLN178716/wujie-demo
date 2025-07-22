import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WujieReact from "wujie-react";
import React from "react";
import styled from 'styled-components';

import appConfig from './configs/app-config'
import routeConfig from './configs/route-config'
import SubApp from './components/sub-app'
import PageHeader from './views/components/page/header'
import './App.css'


const PageContainer = styled.div`
  height: 100%;
  width: 100%;

  .page-header {
    width: 100%;
  }
  .page-body {
    width: 100%;
    height: calc(100% - var(--nav-height) - 1px);
  }
`

const { bus } = WujieReact;
class App extends React.PureComponent<null> {
  pageBodyRef: React.RefObject<HTMLDivElement | null>
  resizeObserver: ResizeObserver
  state: {
    visiablePageHeader: boolean
  }
  
  setHeight(entry: HTMLElement) {
    entry.setAttribute('style', `--nav-height: ${entry.offsetTop}px;`)
  }
  constructor(props: null) {
    super(props)
    this.pageBodyRef = React.createRef()
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.setHeight(entry.target as HTMLElement)
      }
    })
    this.state = {
      visiablePageHeader: true
    }
  }
  componentDidMount() {
    this.resizeObserver.observe(this.pageBodyRef.current!)
    this.setHeight(this.pageBodyRef.current!)
    bus.$on("visiable-page-header", (visiable: boolean) => {
      this.setState({
        visiablePageHeader: visiable
      })
    });
  }
  componentWillUnmount() {
    this.resizeObserver.disconnect()
  }
  render() {
    return(<>
      <BrowserRouter>
        <PageContainer>
          <div className={`page-header ${this.state.visiablePageHeader ? '' : 'hidden'}`} >
            <PageHeader></PageHeader>
          </div>
          <div ref={this.pageBodyRef} className='page-body'>
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
