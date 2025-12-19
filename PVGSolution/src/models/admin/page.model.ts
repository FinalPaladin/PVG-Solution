import type { ReactElement } from "react";

export interface IPageModel{
    path: string;
    pathIcon: ReactElement;
    pathName: string;
    permissions: string[];
    index: boolean,
    element: ReactElement;
    isMenu: boolean;
}