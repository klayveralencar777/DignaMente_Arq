export const Input = ({ label, mask, ...props }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-lg font-medium text-gray-700">{label}</label>
    <input
      className="h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-[#50C878] outline-none text-lg transition-all"
      {...props}
    />
  </div>
);