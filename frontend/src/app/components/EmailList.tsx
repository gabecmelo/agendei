import { useState } from "react";
import Swal from "sweetalert2";

const EmailList = ({
  emails,
  setEmails,
}: {
  emails: string[];
  setEmails: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [newEmail, setNewEmail] = useState("");

  const addEmail = () => {
    if (!newEmail || emails.includes(newEmail)) {
      Swal.fire("Aviso", "E-mail inválido ou já adicionado.", "warning");
      return;
    }
    setEmails((prev) => [...prev, newEmail]);
    setNewEmail("");
  };

  const removeEmail = (email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Convidar Pessoas:</label>
      <div className="flex gap-2">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Digite o e-mail"
          className="flex-1 px-3 py-2 w-1/2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
        />
        <button
          type="button"
          onClick={addEmail}
          className="px-4 py-2 w-1/3 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
        >
          Adicionar
        </button>
      </div>
      <ul className="mt-2">
        {emails.map((email) => (
          <li
            key={email}
            className="flex justify-between items-center bg-gray-100 p-2 rounded-md mb-2"
          >
            <span>{email}</span>
            <button
              type="button"
              onClick={() => removeEmail(email)}
              className="text-red-500 hover:underline"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailList;
