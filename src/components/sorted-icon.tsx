import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  ChevronsUpDown,
} from "lucide-react";
import { SortDirection } from "@tanstack/react-table";

export const SortedIcon = ({
  isSorted,
}: {
  isSorted: false | SortDirection;
}) => {
  if (isSorted === "asc") {
    return <ArrowUpWideNarrow className="ml-2 h-4 w-4" />;
  }

  if (isSorted === "desc") {
    return <ArrowDownWideNarrow className="ml-2 h-4 w-4" />;
  }

  return <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />;
};
