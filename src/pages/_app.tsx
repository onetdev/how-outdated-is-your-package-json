import { AppProps } from 'next/app';
import { FunctionComponent } from 'react';
import '@/styles/globals.css';

const AppMain: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
);

export default AppMain;
