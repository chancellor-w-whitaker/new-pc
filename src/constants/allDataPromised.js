import { renderBuiltUrl } from "../renderBuiltUrl";
import { dataDirectory } from "./dataDirectory";

export const allDataPromised = Promise.all(
  dataDirectory.fileNames.cardDatasets.map((fileName) =>
    fetch(renderBuiltUrl(`${dataDirectory.folderName}/${fileName}`)).then(
      (response) => response.json()
    )
  )
).then((response) => response.flat());
