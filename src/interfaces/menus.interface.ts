export interface Menu{
    menuId: number;
    name: string;
    icon: string;
    url: string,
    fatherId: number | null;
    state: number;
    position: number;
}

export interface MenuRequest{
    name: string;
    icon: string;
    url: string;
    fatherId: number | null;
    position: number;
}

export interface MenuActivo {
  menuId: number;
  name: string;
  fatherId: number | null;
}
