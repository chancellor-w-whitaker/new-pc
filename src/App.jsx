import { allDataPromised } from "./constants/allDataPromised";
import { linkDataPromise } from "./constants/linkDataPromise";
import { SubContainer } from "./components/SubContainer";
import { divisionDefs } from "./constants/divisionDefs";
import { usePromise } from "./hooks/usePromise";
import { Section } from "./components/Section";

// settings for displaying only certain sections

// use wrapper

export default function App() {
  const cardData = usePromise(allDataPromised);

  const linkData = usePromise(linkDataPromise);

  console.log(linkData);

  const cardsGrouped = {};

  const cards = Array.isArray(cardData) ? cardData : [];

  cards.forEach((card) => {
    const { division } = card;

    if (!(division in cardsGrouped)) cardsGrouped[division] = [];

    cardsGrouped[division].push(card);
  });

  const sortSpecialToFront = ({ elementType: a }, { elementType: b }) =>
    (a === "Special" ? 0 : 1) - (b === "Special" ? 0 : 1);

  return (
    <div>
      {Object.entries(cardsGrouped).map(([division, rowOfCards]) => (
        <Section
          icon={<i className={divisionDefs[division].icon}></i>}
          header={divisionDefs[division].header}
          key={division}
        >
          {rowOfCards.sort(sortSpecialToFront)}
        </Section>
      ))}
      <SubContainer className="pb-4">
        <h2 className="pb-3 border-bottom d-flex align-items-center gap-2 mb-3">
          <i className="fa-solid fa-arrow-up-right-from-square"></i>
          <div className="text-truncate">Other Links</div>
        </h2>
        <div className="row">
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
