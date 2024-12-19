import React, { useState } from "react";
import Swal from "sweetalert2";
import fetchAPI from "../utils/api";
import { GoX } from "react-icons/go";
import EventInput from "./EventInput";
import EmailList from "./EmailList";

const EventForm = ({ setEvents, start, end, onClose }: any) => {
  const now = new Date(new Date().getTime() - 3 * 60 * 60 * 1000);
  const formatDate = (date: Date) => date.toISOString().slice(0, 16);

  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(formatDate(start || now));
  const [endTime, setEndTime] = useState(formatDate(end || now));
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!description || !startTime || !endTime) {
      Swal.fire("Erro", "Por favor, preencha todos os campos obrigatórios.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetchAPI("events", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          description,
          start_time: startTime,
          end_time: endTime,
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
        onClose();
      }
    } catch {
      Swal.fire("Erro", "Não foi possível criar o evento.", "error");
    }
  };

  return (
    <form className="relative max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <button
        onClick={onClose}
        className="absolute top-2 text-black right-2 hover:text-red-500 focus:outline-none"
      >
        <GoX size={20} />
      </button>
      <h2 className="text-xl font-semibold mb-4">Criar Evento</h2>

      <EventInput
        label="Descrição"
        value={description}
        onChange={setDescription}
        placeholder="Descrição do evento"
      />

      <EventInput
        label="Início"
        value={startTime}
        onChange={setStartTime}
        type="datetime-local"
        min={formatDate(now)}
      />

      <EventInput label="Fim" value={endTime} onChange={setEndTime} type="datetime-local" />

      <EmailList emails={invitedEmails} setEmails={setInvitedEmails} />

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
      >
        Criar Evento
      </button>
    </form>
  );
};

export default EventForm;
