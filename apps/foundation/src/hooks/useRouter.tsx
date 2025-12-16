import { useNavigate } from 'react-router-dom';
import type { ComponentType, PropsWithChildren, ReactElement } from 'react';

export interface WithNavigateProps {
  navigate: ReturnType<typeof useNavigate>;
}

export default function withNavigate<T extends PropsWithChildren<unknown>>(WrappedComponent: ComponentType<T & WithNavigateProps>) {
  return function (props: T): ReactElement {
    const navigate = useNavigate();

    return <WrappedComponent {...(props as T)} navigate={navigate} />;
  };
}
