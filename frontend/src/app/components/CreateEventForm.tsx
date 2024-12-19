import React, { useState } from "react";
import Swal from "sweetalert2";
import fetchAPI from '../utils/api';

const CreateEventForm = ({ setEvents }: any) => {
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");

  const addEmail = () => {
    if (!newEmail || invitedEmails.includes(newEmail)) {
      Swal.fire("Aviso", "E-mail inválido ou já adicionado.", "warning");
      return;
    }
    setInvitedEmails((prev) => [...prev, newEmail]);
    setNewEmail("");
  };

  const removeEmail = (email: string) => {
    setInvitedEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleSubmit = async () => {
    if (!description || !start || !end) {
      Swal.fire("Erro", "Por favor, preencha todos os campos obrigatórios.", "error");
      return;
    }

    const token = localStorage.getItem("token");
    try {      
      const response = await fetchAPI("events", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          description,
          start_time: start,
          end_time: end,
          invitedUsersEmails: invitedEmails,
        }),
      });

      if (response.id) {
        Swal.fire("Sucesso!", "Evento criado com sucesso.", "success");
        setEvents((prev: any) => [
          ...prev,
          {
            id: response.id,
            title: response.description,
            start: new Date(response.start_time),
            end: new Date(response.end_time),
            status: "CREATOR",
          },
        ]);
      }
    } catch (error) {
      Swal.fire("Erro", "Não foi possível criar o evento.", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Criar Evento</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Descrição:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição do evento"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Início:</label>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fim:</label>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
        </div>
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
            {invitedEmails.map((email) => (
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
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
        >
          Criar Evento
        </button>
      </form>
    </div>
  );
};

export default CreateEventForm;
