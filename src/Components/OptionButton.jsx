export default function OptionButton({ option, index, selected, onSelect }) {

  return (
    <button
      onClick={() => onSelect(index)}
      className={`w-full h-10 rounded cursor-pointer
      ${selected ? "bg-green-400" : "bg-slate-200"}`}
    >
      {option}
    </button>
  );
}