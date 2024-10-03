export const getSportsGridColumnDefs = (firstSportsRow) =>
  sortColumnDefs(
    Object.keys(firstSportsRow).map((field) => ({
      valueFormatter: ({ value }) =>
        field === "Title"
          ? value
              .split(" ")
              .filter((word) => word.toLowerCase() !== "schedule")
              .join(" ")
          : value,
      type: field === "Title" ? null : "rightAligned",
      cellClassRules: getCellClassRules(field),
      headerName: getHeaderName(field),
      field,
    }))
  );

const getHeaderName = (field) => {
  const specificHeaderNames = { Conf: "Conference", PCT: "Percentage" };

  if (field in specificHeaderNames) {
    return specificHeaderNames[field];
  }

  return field;
};

const sortColumnDefs = (columnDefs) => {
  const definiteOrder = ["Title", "Conf", "PCT"];

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
      "bg-success-subtle": (params) =>
        params.value &&
        Number(params.value.split("-")[0]) > Number(params.value.split("-")[1]),
      "bg-danger-subtle": (params) =>
        params.value &&
        Number(params.value.split("-")[0]) < Number(params.value.split("-")[1]),
    };
  }

  if (field === "Streak") {
    return {
      "bg-success-subtle": (params) =>
        params.value && `${params.value}`.startsWith("W"),
      "bg-danger-subtle": (params) =>
        params.value && `${params.value}`.startsWith("L"),
    };
  }

  if (field === "PCT") {
    return {
      "bg-success-subtle": ({ data: { Overall }, value }) =>
        value && !Overall.startsWith("0-0") && Number(value) > 0.5,
      "bg-danger-subtle": ({ data: { Overall }, value }) =>
        value && !Overall.startsWith("0-0") && Number(value) < 0.5,
    };
  }

  return {};
};
