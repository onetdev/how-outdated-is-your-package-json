import { clsx } from 'clsx';
import Image from 'next/image';
import { ComponentProps, FunctionComponent, PropsWithChildren } from 'react';

import styles from '@/components/templates/MainLayout.module.css';

type MainLayoutProps = PropsWithChildren<{
  className?: ComponentProps<'div'>['className'];
}>;
const MainLayout: FunctionComponent<MainLayoutProps> = ({
  children,
  className,
}) => {
  const links = [
    { href: 'https://onet.dev', children: 'Konrad Koller' },
    {
      href: 'https://buymeacoffee.com/onetdev',
      children: 'Sponsor my addiction',
    },
    {
      href: 'https://github.com/onetdev/how-outdated-is-your-package-json',
      children: 'GitHub source',
    },
    {
      href: 'https://riltech.co',
      children: (
        <Image
          src="/riltech.svg"
          alt="Riltech"
          title="Riltech"
          height="16"
          width="16"
        />
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <main className={className}>{children}</main>
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
