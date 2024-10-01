export const renderBuiltUrl = (filename, base = import.meta.env.BASE_URL) =>
  `.${base}${filename[0] === "/" ? "" : "/"}${filename}`;
