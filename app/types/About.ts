import { PortableTextBlock } from "next-sanity";

export interface About {
  _id: string;
  _type: "about";
  title: string;
  overview?: string;

  history?: History[];

  sections?: Section[]; // Portable Text blocks (can be typed more strictly if needed)

  quickFacts?: {
    founded?: string;
    campusArea?: string;
    affiliation?: string;
    eiin?: string;
    code?: string;
    mpo?: boolean;
  };

  contact?: {
    address?: string;
    mapUrl?: string;
  };
}

export interface Section {
  heading: string;
  body: PortableTextBlock[];
}

export interface History {
  year: number;
  event: string;
}
