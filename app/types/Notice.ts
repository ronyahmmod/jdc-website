// types/Notice.ts
export interface Notice {
  _id: string;
  _createdAt: string;
  title: string;
  slug: {
    _type: "slug";
    current: string;
  };
  summary?: string;
  category?: "exam" | "admission" | "general" | "event";
  important?: boolean;
  showInNoticeBoard?: boolean;
  attachments: Attachment[];
  published?: boolean;
  archived?: boolean;
  publishedAt: string;
  updatedAt?: string;
  eventDate?: Date;
}

export interface Attachment {
  _type: "file";
  _key: string;
  url: string;
  originalFilename: string;
  asset: {
    _type: "reference";
    _ref: string;
    _id: string;
    url: string;
    originalFilename: string;
    mimeType: string;
  };
}
