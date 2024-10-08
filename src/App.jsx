import { AgGridReact } from "ag-grid-react";

import { moveEmptyRecordsToBottom } from "./helpers/moveEmptyRecordsToBottom.js";
import { getSportsGridColumnDefs } from "./helpers/getSportsGridColumnDefs.jsx";
import { intelligentAutoSize } from "./helpers/intelligentAutoSize";
import { sportsDataPromise } from "./constants/sportsDataPromise";
import { allDataPromised } from "./constants/allDataPromised";
import { linkDataPromise } from "./constants/linkDataPromise";
import { SubContainer } from "./components/SubContainer";
import { divisionDefs } from "./constants/divisionDefs";
import { usePromise } from "./hooks/usePromise";
import { Section } from "./components/Section";

// up arrow to dot on green
// down arrow to dot on red

// * .sidearm-schedule-title (for sport year)
// ? center everything but sport & year (opted to right align)
// ? PCT is Conf PCT (opted to arrange columns more clearly)
// ! could calculate separate PCT
// ? highlight green & red (maybe icons for positive or negative instead of bg) (opted to do bg for brevity's sake)
// * sport name should link to schedule
// * height auto on grid
// * condensed grid & smaller text
// ? header names for columns (opted to not distinguish percentage as conf percentage in favor column arrangement)

// ? what to do with cross country (no record) & other sports with irrelevant records?
// ! which sports are irrelevant? will handle them the same way cross-country is handled in the python file
// maybe display last outcome
// could add to grid with blanks (-) (add to bottom of grid)
// * some kind of note at bottom of table showing as_of_date (retrieved from data)

// add chad to repos tomorrow
// ie&r github group?? (chad should be owner of repos)

const sumArray = (array) =>
  array.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);

export default function App() {
  const cardData = usePromise(allDataPromised);

  const linkData = usePromise(linkDataPromise);

  const sportsData = usePromise(sportsDataPromise);

  const sportsRowData = moveEmptyRecordsToBottom(
    Array.isArray(sportsData)
      ? sportsData.map((row) => ({
          ...row,
          "Overall PCT": !row.Overall
            ? null
            : `${row.Overall}`.startsWith("0-0")
            ? ".000"
            : [
                (
                  Number(row.Overall.split("-")[0]) /
                  sumArray(
                    row.Overall.split("-").map((string) => Number(string))
                  )
                ).toFixed(3),
              ].map((string) =>
                string[0] === "0" ? string.substring(1) : string
              )[0],
        }))
      : []
  );

  const sportsColumnDefs =
    Array.isArray(sportsRowData) && sportsRowData.length > 0
      ? getSportsGridColumnDefs(sportsRowData[0])
      : [];

  const sportsAsOfDate =
    Array.isArray(sportsRowData) &&
    sportsRowData.length > 0 &&
    sportsRowData[0]["As of"];

  const cardsGrouped = {};

  const cards = Array.isArray(cardData) ? cardData : [];

  cards.forEach((card) => {
    const { division } = card;

    if (!(division in cardsGrouped)) cardsGrouped[division] = [];

    cardsGrouped[division].push(card);
  });

  const sortByOrderProperty = ({ order: a }, { order: b }) => a - b;

  return (
    <div>
      <h1 className="mb-0 text-center">President&apos;s Cabinet Dashboard</h1>
      {Object.entries(cardsGrouped).map(([division, rowOfCards]) => (
        <Section
          icon={
            <i
              className={divisionDefs[division].icon}
              style={{ color: "#611f34" }}
            ></i>
          }
          header={divisionDefs[division].header}
          key={division}
        >
          {rowOfCards.sort(sortByOrderProperty)}
        </Section>
      ))}
      <SubContainer className="pb-4">
        <h2 className="pb-3 border-bottom d-flex align-items-center gap-2 mb-3">
          <i
            className="fa-solid fa-ranking-star"
            style={{ color: "#611f34" }}
          ></i>
          <div className="text-truncate">Sports Records</div>
        </h2>
        <div
          className="ag-theme-balham" // applying the Data Grid theme
        >
          <AgGridReact
            onGridSizeChanged={intelligentAutoSize}
            onRowDataUpdated={intelligentAutoSize}
            columnDefs={sportsColumnDefs}
            rowData={sportsRowData}
            domLayout="autoHeight"
          />
        </div>
        <div className="pt-3">As of: {sportsAsOfDate}</div>
      </SubContainer>
      <SubContainer className="pb-4">
        <h2 className="pb-3 border-bottom d-flex align-items-center gap-2 mb-3">
          <i
            className="fa-solid fa-arrow-up-right-from-square"
            style={{ color: "#611f34" }}
          ></i>
          <div className="text-truncate">Other Links</div>
        </h2>
        <div className="row gap-3">
          <div className="col">
            <h5 className="text-truncate">
              Council on Postsecondary Education (CPE)
            </h5>
            <ul className="nav flex-column">
              {(Array.isArray(linkData) ? linkData : []).map(
                ({ link_title, link }, index) => (
                  <li
                    className={`nav-item mb-${
                      Array.isArray(linkData) && index === linkData.length - 1
                        ? 0
                        : 2
                    }`}
                    key={index}
                  >
                    <a
                      className="nav-link p-0 text-body-secondary text-truncate"
                      rel="noreferrer"
                      target="_blank"
                      href={link}
                    >
                      {link_title}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="col">
            <h5 className="text-truncate">
              Institutional Effectiveness & Research
            </h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-0">
                <a
                  className="nav-link p-0 text-body-secondary text-truncate"
                  href="https://irserver.eku.edu/reports/datapage/"
                  rel="noreferrer"
                  target="_blank"
                >
                  EKU Data Page
                </a>
              </li>
            </ul>
          </div>
        </div>
      </SubContainer>
    </div>
  );
}
