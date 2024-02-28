import { FunctionComponent, PropsWithChildren, ReactNode } from 'react';

import styles from './StepSection.module.css';

type StepSectionProps = PropsWithChildren<{
  title?: ReactNode;
  titleAction?: ReactNode;
  className?: string;
}>;
const StepSection: FunctionComponent<StepSectionProps> = ({
  title,
  children,
  className,
  titleAction,
}) => (
  <div className={`${styles.container} ${className}`}>
    {title && (
      <div className={styles.titleWrap}>
        <h2 className={styles.title}>{title}</h2>
        {titleAction}
      </div>
    )}
    {children}
  </div>
);

export default StepSection;
