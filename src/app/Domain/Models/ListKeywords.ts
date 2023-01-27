import { Genre } from "./Genre";

export interface ListKeywords {
  page: number;
  results: Genre[];
  total_pages: number;
  total_results: number;
}
