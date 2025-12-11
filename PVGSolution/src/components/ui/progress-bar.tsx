export function ProgressBar({ value }: { value: number }) {
    return (
        <div className="w-full">
        <div className="w-full bg-gray-200/70 rounded-full h-4 shadow-inner">
            <div
            className="h-4 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-md transition-all duration-500 ease-out"
            style={{ width: `${value}%` }}
            ></div>
        </div>

        <div className="mt-1 text-right text-sm font-medium text-gray-700">
            {value}%
        </div>
        </div>
    );
}