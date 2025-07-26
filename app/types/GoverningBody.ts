// Types
export interface GBMember {
  name: string;
  role: string;
  mobile?: string;
  address?: string;
  occupation?: string;
  currentDuties?: string;
  photo?: {
    asset: {
      url: string;
    };
  };
}

export interface GoverningBody {
  approvalDate: string;
  termStart: string;
  termEnd: string;
  members: GBMember[];
}
