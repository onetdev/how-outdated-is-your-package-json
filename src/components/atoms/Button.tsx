import { clsx } from 'clsx';
import {
  ComponentProps,
  FunctionComponent,
  PropsWithChildren,
  PropsWithoutRef,
} from 'react';

import styles from '@/components/atoms/Button.module.css';

type ButtonProps = PropsWithChildren<
  {
    variant?: 'rainbow' | 'primary' | 'secondary';
    size?: 'normal' | 'small';
  } & PropsWithoutRef<ComponentProps<'button'>>
>;
const Button: FunctionComponent<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'normal',
  className = '',
  ...props
}) => {
  const classes = clsx(
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    className,
  );

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
