export interface Profile {
  _id: string;
  _createdAt: string;
  name: string;
  designation: string;
  mobileNumber: string;
  subject: string;
  image: string;
  joiningDate: string;
  slug: {
    _type: "slug";
    current: string;
  };
  bio?: Array<unknown>;
  weight: number;
}
