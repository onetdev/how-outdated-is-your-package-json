import { FunctionComponent } from "react";
import { DownloadIcon } from "lucide-react";

import Button from "@/components/atoms/Button";

type DownloadButtonProps = { data: unknown };
const JsonDownloadButton: FunctionComponent<DownloadButtonProps> = ({
  data,
}) => {
  const fileName = `package-stats-${new Date().toISOString()}.json`;
  const download = function () {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";

    const json = JSON.stringify(data),
      blob = new Blob([json], { type: "octet/stream" }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button size="normal" variant="rainbow" onClick={download}>
      <DownloadIcon size={"1rem"} />
      &nbsp; Download
    </Button>
  );
};

export default JsonDownloadButton;
