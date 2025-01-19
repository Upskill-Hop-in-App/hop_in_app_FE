export interface ModelList {
    brand: YearsList[]
  }

  interface YearsList {
    model: Years[]
  }

  interface Years {
    startYear: number;
    endYear: number | null;
  }
  