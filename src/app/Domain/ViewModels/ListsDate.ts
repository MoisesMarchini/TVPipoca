export class ListsDate {

  static readonly week = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7).valueOf().toString();
  static readonly month = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()).valueOf().toString();
  static readonly year = new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate()).valueOf().toString();

}
