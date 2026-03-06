export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  number?: number;
  children?: { name: string; path: string; pro?: boolean; new?: boolean ,number?:number}[];
};
