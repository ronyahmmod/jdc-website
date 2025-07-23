import type { PortableTextBlock } from "sanity";

export interface InstitutionInfo {
  _id: string;
  _type: "institutionInfo";
  name: string;
  description?: PortableTextBlock[];
  logo?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
}
