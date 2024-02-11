interface Coordinate {
  Ma: string;
  La: string;
}

interface CafeInfo {
  id?: number;
  name?: string;
  address?: string;
  location?: string;
  category?: string;
  qa?: Coordinate[];
}

interface CafeData {
  cafes: CafeInfo[];
}

export type { CafeData, CafeInfo, Coordinate };
