import { isNumericString } from "../helpers/isNumericString";
import { TruncatedListItem } from "./TruncatedListItem";

export const Card = (props) => {
  const isSpecial = props.elementType === "Special";

  const As = isSpecial ? "a" : "div";

  const processedProps = isSpecial
    ? {
        ...Object.fromEntries(Object.entries(props).map(([key]) => [key, ""])),
        value: <i className={props.timeFactor}></i>,
        metric: props.metric,
        link: props.link,
      }
    : props;

  const {
    change_perc: changePercentage,
    timeFactor,
    link: href,
    division,
    metric,
    change,
    value,
    term,
    date,
  } = processedProps;

  const anchorProps = isSpecial
    ? { rel: "noreferrer", target: "_blank", href }
    : { target: null, href: null, rel: null };

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

  const renderDate = (param) => {
    if (!param) return "ㅤ";

    const string = new Date(param).toLocaleDateString(undefined, {
      timeZone: "UTC",
    });

    if (string.toLowerCase() === "invalid date") return "ㅤ";

    return string;
  };

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

  const addMoney = (value) =>
    division.toLowerCase() === "development & alumni engagement" &&
    value !== "ㅤ"
      ? `$${value}`
      : value;

  const changeDescription = [
    addMoney(renderNumber(change).replace("-", "")),
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

  const focalPoint = (
    <>
      <TruncatedListItem className="fw-medium text-primary fs-4">
        {addMoney(renderNumber(value))}
      </TruncatedListItem>
      <TruncatedListItem title={renderString(metric)}>
        {renderString(metric)}
      </TruncatedListItem>
    </>
  );

  return (
    <As
      className="card rounded-3 shadow-sm text-muted small position-relative overflow-hidden text-decoration-none text-center"
      style={{ width: 250 }}
      {...anchorProps}
    >
      <div className="position-absolute top-50 start-50 translate-middle">
        <ul
          className={joinClasses(
            "list-unstyled mb-0",
            isSpecial ? "" : "pe-none opacity-0"
          )}
        >
          {focalPoint}
        </ul>
      </div>
      <div
        className={joinClasses(
          "card-header py-3 fw-medium",
          variant ? `text-${variant}` : "",
          variant ? `bg-${variant}-subtle` : "",
          isSpecial ? "bg-secondary-subtle" : ""
        )}
        style={isSpecial ? { borderBottomColor: "transparent" } : {}}
      >
        <div className="text-truncate">{renderString(term)}</div>
      </div>
      <div
        className={joinClasses(
          "card-body",
          isSpecial ? "bg-secondary-subtle" : ""
        )}
      >
        <ul className="list-unstyled">
          <TruncatedListItem>{renderDate(date)}</TruncatedListItem>
        </ul>
        <ul
          className={joinClasses(
            "list-unstyled",
            isSpecial ? "pe-none opacity-0" : ""
          )}
        >
          {focalPoint}
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
    </As>
  );
};
