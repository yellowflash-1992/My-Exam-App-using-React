export default function ProgressBar({ current, total }) {

  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="w-full bg-gray-200 h-3 rounded mt-4">
      <div
        className="bg-green-500 h-3 rounded"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}