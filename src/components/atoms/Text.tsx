import { clsx } from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';

import styles from '@/components/atoms/Text.module.css';

type TextProps = PropsWithChildren<{
  className?: string;
  size?: 'normal' | 'small';
}>;
const Text: FunctionComponent<TextProps> = ({ className, children, size }) => {
  const classes = clsx(styles.text, styles[`text--${size}`], className);
  return <span className={classes}>{children}</span>;
};

export default Text;
