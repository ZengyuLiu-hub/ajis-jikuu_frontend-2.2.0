import { AuthorityType } from './app';

export type LoginFormData = {
  loginId: string;
  password: string;
};

export type Employee = {
  jurisdictionClass: string;
  zoneCode: string;
  doCode: string;
  employeeCode: string;
  employeeName: string;
};

export type User = {
  loginId: string;
  userId: string;
  userName: string;
  lang: string;
  timeZone: string;
  homePage: string;
  authorities: AuthorityType[];
  employee: Employee;
};
