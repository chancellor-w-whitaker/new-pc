import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";

import { TruncatedListItem } from "./components/TruncatedListItem";
import { isNumericString } from "./helpers/isNumericString";
import { MainContainer } from "./components/MainContainer";
import { SubContainer } from "./components/SubContainer";
import { usePromise } from "./hooks/usePromise";

const allDataPromised = Promise.all(
  ["cardData", "cpeData", "specialData"].map((fileName) =>
    fetch(`data/${fileName}.json`).then((response) => response.json())
  )
).then((response) => response.flat());

const divisionData = {
  "Student Success & Enrollment Management": {
    header: "Student Success & Enrollment Management",
    icon: "fa-solid fa-graduation-cap",
  },
  "Development & Alumni Engagement": {
    header: "Development & Alumni Engagement",
    icon: "fa-solid fa-hand-holding-dollar",
  },
  "Student Affairs & Campus Life": {
    header: "Student Affairs & Campus Life",
    icon: "fa-solid fa-bed",
  },
  "Finance & Administration": {
    header: "Finance & Administration",
    icon: "fa-solid fa-dollar-sign",
  },
  "Corporate Partnerships": {
    header: "Corporate Partnerships",
    icon: "fa-solid fa-handshake",
  },
  "Academic Affairs": {
    icon: "fa-solid fa-school",
    header: "Academic Affairs",
  },
  Athletics: {
    icon: "fa-solid fa-medal",
    header: "Athletics",
  },
  Diversity: {
    icon: "fa-solid fa-hand-fist",
    header: "URM",
  },
  "CPE Metrics": { icon: "fa-solid fa-user-tie", header: "CPE Metrics" },
};

// settings for displaying certain sections
// responsiveness stuff

export default function App() {
  const cardData = usePromise(allDataPromised);

  // console.log(allData);

  // const cardData = usePromise(cardDataPromise);

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
    <MainContainer>
      {Object.entries(cardsGrouped).map(([division, rowOfCards]) => (
        <Section
          icon={<i className={divisionData[division].icon}></i>}
          header={divisionData[division].header}
          key={division}
        >
          {rowOfCards.sort(sortSpecialToFront)}
        </Section>
      ))}
    </MainContainer>
  );
}

const Card = (props) => {
  const processedProps =
    props.elementType === "Special"
      ? {
          ...Object.fromEntries(
            Object.entries(props).map(([key]) => [key, ""])
          ),
          value: <i className={props.timeFactor}></i>,
          metric: props.metric,
        }
      : props;

  const {
    change_perc: changePercentage,
    timeFactor,
    metric,
    change,
    value,
    term,
    date,
  } = processedProps;

  function percentStringToNumber(percentString) {
    const numberString = percentString.replace("%", "");
    const number = parseFloat(numberString);
    return number / 100;
  }

  const percentageFormatter = (number) => {
    return new Intl.NumberFormat("default", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: "percent",
    }).format(number);
  };

  const renderString = (param) => (!param ? "ㅤ" : param);

  const renderDate = (param) =>
    !param
      ? "ㅤ"
      : new Date(param).toLocaleDateString(undefined, { timeZone: "UTC" });

  const renderNumber = (param) => {
    if (param || param === 0) {
      if (typeof param === "number" || isNumericString(param)) {
        if (Math.abs(Number(param)) < 1 && Math.abs(Number(param)) > 0) {
          return percentageFormatter(Number(param));
        }

        return Number(param).toLocaleString();
      }

      return param;
    }

    return "ㅤ";
  };

  const renderChangePercentage = (param) =>
    isNaN(percentStringToNumber(param))
      ? "ㅤ"
      : renderNumber(percentStringToNumber(param)).replace("-", "");

  const changeDescription = [
    renderNumber(change).replace("-", ""),
    `(${renderChangePercentage(changePercentage)})`,
  ]
    .filter((value) => value !== "(ㅤ)")
    .join(" ");

  const renderTimeFactor = (param) => {
    if (!param) return "ㅤ";

    if (param.toLowerCase() === "weekly") return "From last week";

    if (param.toLowerCase() === "yearly") return "From last year";

    return "ㅤ";
  };

  const getVariant = (param) => {
    if (
      (param || param === 0) &&
      (typeof param === "number" || isNumericString(param))
    ) {
      if (Number(param) > 0) return "success";

      if (Number(param) < 0) return "danger";
    }
  };

  const variant = getVariant(change);

  const joinClasses = (...classNames) =>
    classNames
      .filter((string) => typeof string === "string" && string.length > 0)
      .join(" ");

  return (
    <div className="card rounded-3 shadow-sm" style={{ width: 250 }}>
      <div
        className={joinClasses(
          "card-header py-3 fw-medium",
          variant ? `text-${variant}` : "",
          variant ? `bg-${variant}-subtle` : ""
        )}
      >
        <div className="text-truncate">{renderString(term)}</div>
      </div>
      <div className="card-body">
        <ul className="list-unstyled">
          <TruncatedListItem>{renderDate(date)}</TruncatedListItem>
        </ul>
        <ul className="list-unstyled">
          <TruncatedListItem className="fw-medium fs-4 text-primary">
            {renderNumber(value)}
          </TruncatedListItem>
          <TruncatedListItem title={renderString(metric)} className="fs-5">
            {renderString(metric)}
          </TruncatedListItem>
        </ul>
        <ul className="list-unstyled mb-0">
          <TruncatedListItem
            className={joinClasses(
              "fw-medium",
              variant ? `text-${variant}` : ""
            )}
          >
            {variant === "success" && "🠅"}
            {variant === "danger" && "🠇"} {changeDescription}
          </TruncatedListItem>
          <TruncatedListItem>{renderTimeFactor(timeFactor)}</TruncatedListItem>
        </ul>
      </div>
    </div>
  );
};

const Section = ({
  icon = <i className="fa-solid fa-school"></i>,
  children = [0, 1, 2, 3],
  header = "Section",
}) => {
  return (
    <SubContainer>
      <h2 className="pb-3 border-bottom d-flex align-items-center gap-2 mb-0">
        {icon}
        <div className="text-truncate">{header}</div>
      </h2>
      <Swiper className="py-3 text-center" spaceBetween={50} slidesPerView={3}>
        {children.map((element, index) => (
          <SwiperSlide key={index}>
            <Card {...element}></Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </SubContainer>
  );
};
