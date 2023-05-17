export type ImportedFile = {
  name: string;
  data: Record<string, string | number>[];
};

export type FileUploaderProps = {
  uploadLabel: JSX.Element;
  onFileReady: (file: ImportedFile | null) => void;
  invalidFileFormatError: JSX.Element;
  onDownloadTemplate?: () => void;
  validationError?: JSX.Element | null;
};
