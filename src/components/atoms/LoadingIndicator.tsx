import { FunctionComponent } from 'react';

import styles from './LoadingIndicator.module.css';

type LoadingIndacatorProps = {
  dotCount?: number;
};

const LoadingIndacator: FunctionComponent<LoadingIndacatorProps> = ({
  dotCount = 3,
}) => (
  <span className={styles.container}>
    {Array.from({ length: dotCount }).map((_, index) => (
      <span className={styles.dot} key={index} />
    ))}
  </span>
);

export default LoadingIndacator;
