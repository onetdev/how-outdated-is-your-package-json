import { FunctionComponent } from "react";
import DataTable, {
  ConditionalStyles,
  TableColumn,
} from "react-data-table-component";

import styles from "@/components/organisms/StatTable.module.css";
import { AgeInSeconds, PackageStatData } from "@/types";
import dayjs from "@/utils/date";

const YEAR_SECONDS = 365 * 24 * 60 * 60;
const humanizeAge = (age: AgeInSeconds) =>
  dayjs.duration(age, "seconds").humanize(false);
const isAgeAlert = (age: AgeInSeconds) => age > YEAR_SECONDS * 3;
const isAgeWarning = (age: AgeInSeconds) => age > YEAR_SECONDS * 1.5;
const ageColorStyle = (
  selector: (row: PackageStatData) => AgeInSeconds
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
        {a.package}
      </a>
    ),
  },
  {
    name: "",
    selector: (a) => a.isDev,
    sortable: true,
    format: (a) => (a.isDev ? "dev" : ""),
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

type StatTableProps = { data: PackageStatData[] };
const StatTable: FunctionComponent<StatTableProps> = ({ data }) => (
  <>
    <DataTable
      columns={statColumns}
      data={data}
      dense
      fixedHeader
      pagination
      paginationPerPage={15}
      theme="dark"
      defaultSortFieldId={"maxSatisfiedAge"}
    />
    <div className={styles.legend}>
      <div>
        <span>Row colors</span>
        <ul>
          <li>
            <div className={styles.rowAlert}>&nbsp;</div>Target max is 3+ years
            old
          </li>
          <li>
            <div className={styles.rowWarning}>&nbsp;</div>Target max is 1.5+
            years old
          </li>
        </ul>
      </div>
      <div>
        <span>Status?</span>
        <ul>
          <li>👻 - Haunting packages over 5 years of neglect</li>
          <li>💀 - 3 years, lost hope</li>
          <li>🧟 - Haven&#8217;t been touched in more than 1.5 years</li>
          <li>👍 - Okay</li>
          <li>🔥 - Pretty fresh</li>
        </ul>
      </div>
    </div>
  </>
);

export default StatTable;
