import { clsx } from "clsx";
import { FunctionComponent } from "react";
import DataTable, {
  ConditionalStyles,
  TableColumn,
} from "react-data-table-component";
import { DownloadIcon, ExternalLink } from "lucide-react";

import Text from "@/components/atoms/Text";
import StepSection from "@/components/molecules/StepSection";
import styles from "@/components/organisms/StepResults.module.css";
import { AgeInSeconds, PackageStatData } from "@/types";
import dayjs from "@/utils/date";
import Button from "@/components/atoms/Button";

const YEAR_SECONDS = 365 * 24 * 60 * 60;
const humanizeAge = (age: AgeInSeconds) =>
  dayjs.duration(age, "seconds").humanize(false);
const isAgeAlert = (age: AgeInSeconds) => age > YEAR_SECONDS * 3;
const isAgeWarning = (age: AgeInSeconds) => age > YEAR_SECONDS * 1.5;
const ageColorStyle = (
  selector: (row: PackageStatData) => AgeInSeconds,
): ConditionalStyles<PackageStatData>[] => [
  {
    when: (row) => isAgeAlert(selector(row)),
    classNames: [styles.rowAlert],
  },
  {
    when: (row) => !isAgeAlert(selector(row)) && isAgeWarning(selector(row)),
    classNames: [styles.rowWarning],
  },
];
const statColumns: TableColumn<PackageStatData>[] = [
  {
    name: "Package",
    selector: (a) => a.package,
    sortable: true,
    grow: 2,
    format: (a) => (
      <a
        href={`https://www.npmjs.com/package/${a.package}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ExternalLink size={12} />
        &nbsp;
        {a.package}
      </a>
    ),
  },
  {
    name: "Dev?",
    selector: (a) => a.isDev,
    sortable: true,
    compact: true,
    center: true,
    format: (a) => (a.isDev ? "yes" : ""),
  },
  { name: "Target version", selector: (a) => a.targetVersion, compact: true },
  {
    name: "Satisfying maxium",
    selector: (a) => a.maxSatisfiedDate.format(),
    format: (a) => (
      <>
        {a.maxSatisfiedVersion}
        <br />
        {a.maxSatisfiedDate.format("l")}
      </>
    ),
  },
  {
    name: "Latest available",
    selector: (a) => a.latestDate.format(),
    format: (a) => (
      <>
        {a.latestVersion}
        <br />
        {a.latestDate.format("l")}
      </>
    ),
  },
  {
    name: "Satisfied max age",
    selector: (a) => a.maxSatisfiedAge,
    sortable: true,
    format: (a) => humanizeAge(a.maxSatisfiedAge),
    conditionalCellStyles: ageColorStyle((row) => row.maxSatisfiedAge),
  },
  {
    name: "Latest release",
    selector: (a) => a.latestAge,
    sortable: true,
    format: (a) => <>{humanizeAge(a.latestAge)} ago</>,
    conditionalCellStyles: ageColorStyle((row) => row.latestAge),
  },
  {
    name: "Status?",
    selector: (a) => a.latestAge,
    sortable: true,
    format: (a) => {
      if (a.latestAge > YEAR_SECONDS * 5) return "👻";
      if (a.latestAge > YEAR_SECONDS * 3) return "💀";
      if (a.latestAge > YEAR_SECONDS * 1.5) return "🧟";
      if (a.latestAge < YEAR_SECONDS / 2) return "🔥";
      return "👍";
    },
    maxWidth: "50px",
    right: true,
  },
];

type StepResultsProps = { className?: string; data: PackageStatData[] };
const StepResults: FunctionComponent<StepResultsProps> = ({
  className,
  data,
}) => (
  <StepSection
    className={className}
    titleAction={data?.length ? <DownloadButton data={data} /> : null}
    title="3. Results"
  >
    {data?.length < 1 && <Text>Complete the previous step first.</Text>}
    {data?.length > 0 && (
      <>
        <DataTable
          columns={statColumns}
          data={data}
          dense
          fixedHeader
          pagination
          paginationPerPage={15}
          paginationRowsPerPageOptions={[10, 15, 30, 50, 100, 200]}
          theme="dark"
          defaultSortFieldId={"maxSatisfiedAge"}
        />
        <div className={styles.legend}>
          <div className={styles.legendSection}>
            <span>Row colors</span>
            <ul className={styles.legendList}>
              <li>
                <div className={clsx(styles.rowAlert, styles.legendColorBlock)}>
                  &nbsp;
                </div>{" "}
                Target max is 3+ years old
              </li>
              <li>
                <div
                  className={clsx(styles.rowWarning, styles.legendColorBlock)}
                >
                  &nbsp;
                </div>{" "}
                Target max is 1.5+ years old
              </li>
            </ul>
          </div>
          <div className={styles.legendSection}>
            <span>Status?</span>
            <ul className={styles.legendList}>
              <li>👻 - Haunting packages over 5 years of neglect</li>
              <li>💀 - 3 years, lost hope</li>
              <li>🧟 - Haven&#8217;t been touched in more than 1.5 years</li>
              <li>👍 - Okay</li>
              <li>🔥 - Pretty fresh</li>
            </ul>
          </div>
        </div>
      </>
    )}
  </StepSection>
);

type DownloadButtonProps = { data: PackageStatData[] };
const DownloadButton: FunctionComponent<DownloadButtonProps> = ({ data }) => {
  const fileName = `package-stats-${new Date().toISOString()}.json`;
  const download = function () {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";

    const json = JSON.stringify(data),
      blob = new Blob([json], { type: "octet/stream" }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button size="normal" variant="rainbow" onClick={download}>
      <DownloadIcon size={"1rem"} />
      &nbsp; Download
    </Button>
  );
};

export default StepResults;
