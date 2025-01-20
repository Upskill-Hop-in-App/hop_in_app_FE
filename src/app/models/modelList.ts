// modelList.ts
export interface ModelList {
  [brand: string]: {
    [model: string]: {
      startYear: number;
      endYear: number | null;
    };
  };
}