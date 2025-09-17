import { ArrowLeft, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  className?: string;
  descripcion?: string;
  showBack?: boolean;
  linkBack?: string;
  showLink?: boolean;
  children?: React.ReactNode;
  linkConfig?: {
    url: string;
    title: string;
  };
}

export default function HeaderPage({
  title,
  className,
  descripcion,
  showBack = false,
  linkBack,
  showLink = true,
  linkConfig,
  children,
}: Props) {
  return (
    <div
      className={`flex flex-col lg:flex-row w-full gap-4 justify-between items-center ${className}`}
    >
      <div className="flex flex-col gap-1 w-full lg:w-auto">
        <div className="flex items-center gap-2">
          {showBack && linkBack && (
            <Link to={linkBack}>
              <ArrowLeft className="rounded-full h-7 w-7 flex items-center justify-center" />
            </Link>
          )}

          <h1 className="text-4xl font-bold text-[#efa159] text-pretty">
            {title}
          </h1>
        </div>

        {descripcion && (
          <span className="text-gray-600 text-pretty">{descripcion}</span>
        )}
        </div>
        <div className="flex flex-row items-center gap-2">
        {showLink && linkConfig && (
          <Link
            to={linkConfig.url}
            className="bg-[#efa159] hover:bg-[#efa159]/80 text-white rounded-md px-4 py-1.5 flex gap-2 items-center justify-center w-full lg:w-auto"
          >
            <PlusIcon size={20} />
            {linkConfig.title}
          </Link>
        )}
        {children}
      </div>
    </div>
  );
}
