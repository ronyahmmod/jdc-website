export interface Slide {
  _id: string;
  _type: "heroImage";
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  showInSlider?: boolean;
  image?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
}
