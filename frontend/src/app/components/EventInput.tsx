const EventInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  min = "",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  min?: string;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
    />
  </div>
);

export default EventInput;
