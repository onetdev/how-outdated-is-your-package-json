import { FunctionComponent } from "react";
import styled from "styled-components";

import Text from "@/components/atoms/Text";

type ProgressBarProps = {
  total: number;
  current: number;
};
const ProgressBar: FunctionComponent<ProgressBarProps> = ({
  total,
  current,
}) => (
  <Container>
    <Bar style={{ width: `${(current / total) * 100}%` }}>
      <Text size="small">
        {current} / {total}
      </Text>
    </Bar>
  </Container>
);

const Container = styled.div`
  background-color: var(--background);
  width: 100%;
`;
const Bar = styled.div`
  padding: var(--space-2xs);
  background-color: var(--success);
  transition: width 100ms ease-in-out;
  color: var(--on-success);
  overflow: hidden;
  white-space: nowrap;
`;

export default ProgressBar;
