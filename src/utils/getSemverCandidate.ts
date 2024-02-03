import dayjs from "dayjs";
import { maxSatisfying } from "semver";

import { LookupVersionCandidate } from "@/types";

const getSemverCandidate = (
  targetVersion: string,
  history: Record<string, string>,
): LookupVersionCandidate | null => {
  const matchVersion = maxSatisfying(Object.keys(history), targetVersion);
  if (!history[matchVersion]) {
    return null;
  }
  const date = dayjs(history[matchVersion]);
  return {
    version: matchVersion,
    date,
    age: dayjs().diff(date, "seconds"),
  };
};

export default getSemverCandidate;
