export interface SimpleRoutine {
  _id: string;
  className: string;
  isPublishable: boolean;
  publishedDate: string;
  file: {
    asset: {
      url: string;
      mimeType: string;
    };
  };
}
