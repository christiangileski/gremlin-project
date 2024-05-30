export type ResultType = {
  name: string;
  description: string;
  keywords: string[];
  version: string;
  date: string;
  publisher: {
    username: string;
  };
  links: {
    npm: string;
  };
};
