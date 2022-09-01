import { FunctionComponent, ReactNode } from "react";

import styles from "@/styles/Layout.module.css";

type MainLayoutProps = { children?: ReactNode | undefined };
const MainLayout: FunctionComponent<MainLayoutProps> = ({ children }) => (
  <div className={styles.container}>
    <main className={styles.main}>{children}</main>

    <footer className={styles.footer}>
      <a href="https://onet.dev" target="_blank" rel="noopener noreferrer">
        Jozsef Koller
      </a>
      <a
        href="https://buymeacoffee.com/onetdev"
        target="_blank"
        rel="noopener noreferrer"
      >
        Sponsor my addiction
      </a>
      <a
        href="https://github.com/orosznyet/how-old-is-my-package"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub source
      </a>
    </footer>
  </div>
);

export default MainLayout;
