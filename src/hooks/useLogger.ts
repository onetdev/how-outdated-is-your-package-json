import { useCallback, useMemo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LoggerRest = any[];
export type LoggerOptions = {
  scope?: string;
};
const useLogger = ({ scope }: LoggerOptions = {}) => {
  const formatMessage = useCallback(
    (message: string) => `[${scope ?? 'GENERIC'}] ${message}`,
    [scope],
  );

  const logger = useMemo(
    () => ({
      log: (message: string, ...rest: LoggerRest) =>
        console.log(formatMessage(message), ...rest),
      error: (message: string, ...rest: LoggerRest) =>
        console.error(formatMessage(message), ...rest),
      info: (message: string, ...rest: LoggerRest) =>
        console.info(formatMessage(message), ...rest),
    }),
    [formatMessage],
  );

  return logger;
};

export default useLogger;
