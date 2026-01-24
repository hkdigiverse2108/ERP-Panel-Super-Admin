export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  children?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};
