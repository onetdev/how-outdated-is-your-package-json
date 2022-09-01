import { FunctionComponent } from "react";
import { AppProps } from "next/app";
import "@/styles/globals.css";

const AppMain: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
);

export default AppMain;
