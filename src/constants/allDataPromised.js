export const allDataPromised = Promise.all(
  ["cardData", "cpeData", "specialData"].map((fileName) =>
    fetch(`data/${fileName}.json`).then((response) => response.json())
  )
).then((response) => response.flat());
