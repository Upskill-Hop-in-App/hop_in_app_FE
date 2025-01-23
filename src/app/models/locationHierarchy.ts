export interface LocationHierarchy {
    [district: string]: {
      [municipality: string]: string[];
    };
  }