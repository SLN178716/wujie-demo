import { NavLink } from 'react-router-dom'
import WujieReact from "wujie-react";
import styled from 'styled-components';

const StyledNav = styled.nav`
  border-bottom: 1px solid #999999;
  padding: 2px 0;
  width: 100%;
  display: flex;
  justify-items: center;
  align-items: center;
  height: 40px;

  
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

const { bus } = WujieReact;
export function Nav() {
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