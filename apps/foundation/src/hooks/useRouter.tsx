import { useNavigate, useLocation } from 'react-router-dom';
import type { ComponentType, PropsWithChildren, ReactElement } from 'react';

export interface WithNavigateProps {
  navigate: ReturnType<typeof useNavigate>;
  location: ReturnType<typeof useLocation>;
}

export default function withNavigate<T extends PropsWithChildren<unknown>>(WrappedComponent: ComponentType<T & WithNavigateProps>) {
  return function (props: T): ReactElement {
    const navigate = useNavigate();
    const location = useLocation();

    return <WrappedComponent {...(props as T)} navigate={navigate} location={location} />;
  };
}
