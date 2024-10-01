export const linkDataPromise = fetch("data/linkData.json").then((response) =>
  response.json()
);
