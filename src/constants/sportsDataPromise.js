import { renderBuiltUrl } from "../renderBuiltUrl";
import { dataDirectory } from "./dataDirectory";

export const sportsDataPromise = fetch(
  renderBuiltUrl(
    `${dataDirectory.folderName}/${dataDirectory.fileNames.sportsDataset}`
  )
).then((response) => response.json());
