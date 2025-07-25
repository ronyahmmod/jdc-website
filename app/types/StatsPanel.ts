export interface StatsPanel {
  _id: string;
  _type: "statsPanel";
  title: string;
  background: {
    image: {
      asset: {
        url: string;
        _id: string;
        originalFilename: string;
      };
    };
  };
  stats: Stats[];
}

export interface Stats {
  label: string;
  value: string;
}
