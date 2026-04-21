import OptionsList from "./OptionsList";

export default function QuestionCard({
  question,
  selectedOption,
  chooseOption
}) {

  if (!question) return null;

  return (
    <div className="w-full bg-emerald-300 rounded-xl shadow-sm p-4 mt-4">

      <h1 className="text-white font-bold text-2xl mb-4">
        {question.prompt}
      </h1>

      <OptionsList
        options={question.options}
        selectedOption={selectedOption}
        chooseOption={chooseOption}
      />

    </div>
  );
}