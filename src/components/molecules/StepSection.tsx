import { clsx } from "clsx";
import { FunctionComponent, PropsWithChildren, ReactNode } from "react";

import styles from "@/components/molecules/StepSection.module.css";

type StepSectionProps = PropsWithChildren<{
  title?: ReactNode;
  className?: string;
}>;
const StepSection: FunctionComponent<StepSectionProps> = ({
  title,
  children,
  className,
}) => (
  <section className={clsx(styles.container, className)}>
    {title && <h2 className={styles["container__title"]}>{title}</h2>}
    {children}
  </section>
);

export default StepSection;
