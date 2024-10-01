import { renderBuiltUrl } from "../renderBuiltUrl";
import { dataDirectory } from "./dataDirectory";

export const linkDataPromise = fetch(
  renderBuiltUrl(
    `${dataDirectory.folderName}/${dataDirectory.fileNames.linkDataset}`
  )
).then((response) => response.json());
