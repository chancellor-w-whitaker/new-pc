const getRecordPlacement = ({ Overall = "" }) =>
  !Overall ? 3 : Overall === "0-0" ? 2 : Overall.startsWith("0-0") ? 1 : 0;

export const moveEmptyRecordsToBottom = (rowData) =>
  [...rowData].sort((a, b) => getRecordPlacement(a) - getRecordPlacement(b));
