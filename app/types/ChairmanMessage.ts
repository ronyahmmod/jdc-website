export interface ChairmanMessage {
  _id: string;
  _type: "chairmanMessage";
  name: string;
  designation: string;
  photoUrl: string;
  shortMessage: string;
  fullMessage?: string;
  showOnHome?: boolean;
}
