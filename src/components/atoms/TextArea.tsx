import { clsx } from 'clsx';
import {
  ComponentProps,
  FunctionComponent,
  PropsWithChildren,
  PropsWithoutRef,
  RefObject,
} from 'react';

import styles from '@/components/atoms/TextArea.module.css';

type TextAreaProps = PropsWithChildren<
  {
    forwardRef?: RefObject<HTMLTextAreaElement>;
  } & PropsWithoutRef<ComponentProps<'textarea'>>
>;
const TextArea: FunctionComponent<TextAreaProps> = ({
  className = '',
  forwardRef = null,
  ...props
}) => {
  const classes = clsx(styles.textarea, className);
  return <textarea ref={forwardRef} className={classes} {...props} />;
};

export default TextArea;
