import { dataDirectory } from "./dataDirectory";

export const linkDataPromise = fetch(
  `${dataDirectory.folderName}/${dataDirectory.fileNames.linkDataset}`
).then((response) => response.json());
