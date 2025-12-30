export interface MData {
  id: number;
  groupName: string;
  inactive: boolean;
  createdBy: number | null;
  createdByName: string;
  createdDate: Date;
  modifiedBy: number | null;
  modifiedByName: string | null;
  modifiedDate: Date | null;
  isDeleted: boolean;
  group: number;
  sortId: number;
  key: string;
  value: string;
  value_ENG: string;
}
