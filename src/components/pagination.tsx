import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";

interface Props {
  allPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  allPages,
  currentPage,
  onPageChange,
}: Props) {
  return (
    <div className="mt-5">
      <ResponsivePagination
        total={allPages}
        current={currentPage}
        onPageChange={(page) => onPageChange(page)}
      />
    </div>
  );
}
