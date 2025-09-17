interface Props {
  text: string;
}

export default function EmptyTable({ text }: Props) {
  return (
    <div className="flex flex-col w-full bg-gray-100 rounded-md py-20 justify-center items-center border border-dashed">
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
