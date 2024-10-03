export const intelligentAutoSize = (e) =>
  e.clientWidth < (e.api.getColumnDefs().length + 1) * 75
    ? e.api.autoSizeAllColumns()
    : e.api.sizeColumnsToFit();
