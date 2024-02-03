import { FunctionComponent, PropsWithChildren, ReactNode } from "react";
import { styled } from "styled-components";

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
  <Container className={className}>
    {title && (
      <TitleWrap>
        <Title>{title}</Title>
        {titleAction}
      </TitleWrap>
    )}
    {children}
  </Container>
);

const Container = styled.section`
  backdrop-filter: blur(5px);
  background: rgba(var(--surface), 0.5);
  margin: var(--space-3xs);
  padding: var(--space-s-m);
  text-align: left;
  border-radius: var(--space-3xs);
`;
const TitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 1rem 0;
`;
const Title = styled.h2`
  font-size: 1.5rem;
  margin: 0;
`;

export default StepSection;
