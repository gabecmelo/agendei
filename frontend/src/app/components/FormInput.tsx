const FormInput: React.FC<{
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}> = ({ label, name, type, value, onChange, error, placeholder }) => (
  <div className="mb-4">
    <label className="block mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border rounded-md"
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default FormInput;
