export const getSportsGridColumnDefs = (firstSportsRow) =>
  sortColumnDefs(
    Object.keys(firstSportsRow).map((field) => ({
      cellRenderer: field === "Title" ? titleRenderer : null,
      suppressSizeToFit: field === "Title" ? true : false,
      type: field === "Title" ? null : "rightAligned",
      cellClassRules: getCellClassRules(field),
      headerName: getHeaderName(field),
      field,
    }))
  ).filter(({ field }) => field !== "Website" && field !== "As of");

const getHeaderName = (field) => {
  const specificHeaderNames = {
    "Overall PCT": "Overall %",
    PCT: "Conference %",
    Conf: "Conference",
    Title: "Sport",
  };

  if (field in specificHeaderNames) {
    return specificHeaderNames[field];
  }

  return field;
};

const sortColumnDefs = (columnDefs) => {
  const definiteOrder = ["Title", "Overall", "Overall PCT", "Conf", "PCT"];

  const set = new Set(definiteOrder);

  const findPlacement = (field) =>
    set.has(field) ? definiteOrder.indexOf(field) : Number.MAX_SAFE_INTEGER;

  return [...columnDefs].sort(
    ({ field: a }, { field: b }) => findPlacement(a) - findPlacement(b)
  );
};

const getCellClassRules = (field) => {
  const winLossFields = new Set(["Overall", "Neutral", "Conf", "Home", "Away"]);

  if (winLossFields.has(field)) {
    return {
      "text-opacity-25 text-body": ({ data: { Overall }, value }) =>
        value && (value === "0-0" || Overall === "0-0"),
      "text-success fw-bold": ({ value }) =>
        value && Number(value.split("-")[0]) > Number(value.split("-")[1]),
      "text-danger fw-bold": ({ value }) =>
        value && Number(value.split("-")[0]) < Number(value.split("-")[1]),
    };
  }

  if (field === "Streak") {
    return {
      "text-opacity-25 text-body": ({ data: { Overall }, value }) =>
        value && Overall === "0-0",
      "text-success fw-bold": (params) =>
        params.value && `${params.value}`.startsWith("W"),
      "text-danger fw-bold": (params) =>
        params.value && `${params.value}`.startsWith("L"),
    };
  }

  if (field === "PCT" || field === "Overall PCT") {
    return {
      "text-success fw-bold": ({ data: { Overall }, value }) =>
        value && !Overall.startsWith("0-0") && Number(value) > 0.5,
      "text-danger fw-bold": ({ data: { Overall }, value }) =>
        value && !Overall.startsWith("0-0") && Number(value) < 0.5,
      "text-opacity-25 text-body": ({ data: { Overall }, value }) =>
        value && Overall.startsWith("0-0"),
    };
  }

  return {};
};

const titleRenderer = ({ value, data }) => {
  const sport = value
    .split(" ")
    .filter((word) => word.toLowerCase() !== "schedule")
    .join(" ");

  return (
    <a
      className="text-decoration-none"
      href={data.Website}
      target="_blank"
      title={sport}
    >
      {sport}
    </a>
  );
};
