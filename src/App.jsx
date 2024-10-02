import { AgGridReact } from "ag-grid-react";

import { sportsDataPromise } from "./constants/sportsDataPromise";
import { allDataPromised } from "./constants/allDataPromised";
import { linkDataPromise } from "./constants/linkDataPromise";
import { SubContainer } from "./components/SubContainer";
import { divisionDefs } from "./constants/divisionDefs"; // React Data Grid Component
import { usePromise } from "./hooks/usePromise"; // Mandatory CSS required by the Data Grid
import { Section } from "./components/Section"; // Optional Theme applied to the Data Grid

// settings for displaying only certain sections

// .sidearm-schedule-title (for sport year)
// center everything but sport & year
// PCT is Conf PCT
// could calculate separate PCT
// highlight green & red (maybe icons for positive or negative instead of bg)
// sport name should link  to schedule
// height auto on grid
// condensed grid & smaller text
// header names for columns

const getSportsGridColumnDefs = (firstSportsRow) => {
  return Object.keys(firstSportsRow)
    .map((field) => ({
      valueFormatter: ({ value }) =>
        field === "Sport"
          ? value
              .split("-")
              .map((word) =>
                word === "mens"
                  ? "Men's"
                  : word === "womens"
                  ? "Women's"
                  : word[0].toUpperCase() + word.substring(1).toLowerCase()
              )
              .join(" ")
          : value,
      field,
    }))
    .sort(
      ({ field: a }, { field: b }) =>
        (a === "Sport" ? 0 : 1) - (b === "Sport" ? 0 : 1)
    );
};

const onGridSizeChanged = (e) =>
  e.clientWidth < (e.api.getColumnDefs().length + 1) * 75
    ? e.api.autoSizeAllColumns()
    : e.api.sizeColumnsToFit();

export default function App() {
  const cardData = usePromise(allDataPromised);

  const linkData = usePromise(linkDataPromise);

  const sportsData = usePromise(sportsDataPromise);

  const sportsRowData = Array.isArray(sportsData) ? sportsData : [];

  const sportsColumnDefs =
    Array.isArray(sportsData) && sportsData.length > 0
      ? getSportsGridColumnDefs(sportsData[0])
      : [];

  const cardsGrouped = {};

  const cards = Array.isArray(cardData) ? cardData : [];

  cards.forEach((card) => {
    const { division } = card;

    if (!(division in cardsGrouped)) cardsGrouped[division] = [];

    cardsGrouped[division].push(card);
  });

  console.log(cardsGrouped);

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
          className="ag-theme-quartz" // applying the Data Grid theme
          style={{ height: 500 }} // the Data Grid will fill the size of the parent container
        >
          <AgGridReact
            onGridSizeChanged={onGridSizeChanged}
            onRowDataUpdated={onGridSizeChanged}
            columnDefs={sportsColumnDefs}
            rowData={sportsRowData}
          />
        </div>
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
