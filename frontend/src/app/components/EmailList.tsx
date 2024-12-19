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

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmail = () => {
    if (!newEmail) {
      Swal.fire("Aviso", "Por favor, insira um e-mail.", "warning");
      return;
    }

    if (!isValidEmail(newEmail)) {
      Swal.fire("Erro", "Por favor, insira um e-mail válido.", "error");
      return;
    }

    if (emails.includes(newEmail)) {
      Swal.fire("Aviso", "E-mail já adicionado.", "warning");
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
      <label className="block text-sm font-medium mb-1">Convidar Pessoas: (emails inexistentes não serão adicionados)</label>
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
