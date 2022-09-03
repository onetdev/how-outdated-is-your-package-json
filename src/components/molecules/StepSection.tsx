import { FunctionComponent, PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";

type StepSectionProps = PropsWithChildren<{
  title?: ReactNode;
  className?: string;
}>;
const StepSection: FunctionComponent<StepSectionProps> = ({
  title,
  children,
  className,
}) => (
  <Container className={className}>
    {title && <Title>{title}</Title>}
    {children}
  </Container>
);

const Container = styled.section`
  padding: var(--space-s-m);
  margin: var(--space-3xs);
  text-align: left;
  background: var(--surface);
`;
const Title = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
`;

export default StepSection;
