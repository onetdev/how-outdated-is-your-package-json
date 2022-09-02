import { clsx } from "clsx";
import Image from "next/image";
import { ComponentProps, FunctionComponent, PropsWithChildren } from "react";

import styles from "@/styles/Layout.module.css";

type MainLayoutProps = PropsWithChildren<{
  className?: ComponentProps<"div">["className"];
}>;
const MainLayout: FunctionComponent<MainLayoutProps> = ({
  children,
  className,
}) => {
  const style = clsx([styles.container, className]);

  const links = [
    { href: "https://onet.dev", children: "Jozsef Koller" },
    {
      href: "https://buymeacoffee.com/onetdev",
      children: "Sponsor my addiction",
    },
    {
      href: "https://github.com/orosznyet/how-old-is-my-package",
      children: "GitHub source",
    },
    {
      href: "https://riltech.co",
      children: (
        <Image
          src="/riltech.svg"
          alt="Riltech"
          title="Riltech"
          height="16px"
          width="16px"
        />
      ),
    },
  ];

  return (
    <div className={style}>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        {links.map(({ href, children: linkChildren }) => (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer">
            {linkChildren}
          </a>
        ))}
      </footer>
    </div>
  );
};

export default MainLayout;
