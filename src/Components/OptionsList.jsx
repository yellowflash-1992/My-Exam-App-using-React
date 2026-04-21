import OptionButton from "./OptionButton";

export default function OptionsList({ options = [], selectedOption, chooseOption }) {

  return (
    <div className="flex flex-col space-y-3">

      {options.map((option, index) => (
        <OptionButton
          key={index}
          option={option}
          index={index}
          selected={selectedOption === index}
          onSelect={chooseOption}
        />
      ))}

    </div>
  );
}