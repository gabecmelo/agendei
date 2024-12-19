"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Swal from "sweetalert2";
import fetchAPI from "../utils/api";
import EventForm from "../components/EventForm";

type Event = {
  id: number;
  title: string;
  start: Date | null;
  end: Date | null;
  status: string;
}

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [userInvites, setUserInvites] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    fetchAPI("events", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }).then((response: any) => {
      if (response.error) {
        Swal.fire("Erro", response.error.message, "error");
        return;
      }
      const formattedEvents = response.map((event: any) => ({
        id: event.id,
        title: `${event.description}`,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        status: "CREATOR",
      }));

      setEvents(formattedEvents);
    });

    fetchAPI("events?invited=true", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (response.error) {
        Swal.fire("Erro", response.error.message, "error");
        return;
      }

      const formattedInvites = response.map((invite: any) => ({
        id: invite.id,
        title: `${invite.event.description} (Convite)`,
        start: new Date(invite.event.start_time),
        end: new Date(invite.event.end_time),
        status: invite.status,
      }));

      setUserInvites(formattedInvites);
    });
  }, [router]);

  const deleteEvent = (event: Event) => {
    const token = localStorage.getItem("token");
    fetchAPI(`events/${event.id}`, {      
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setEvents(events.filter((e: Event) => e.id !== event.id));

  }

  const handleEventSelect = (event: Event) => {
    if (event.status === "CREATOR") {
      Swal.fire({
        title: event.title,
        icon: 'question',
        text: "Deletar evento?",
        showDenyButton: true,
        confirmButtonText: "Deletar",
        denyButtonText: "Fechar",
      }).then((result) => {
        if (result.isConfirmed) deleteEvent(event);
        
      }) 
    } else {
      Swal.fire({
        title: "Convite",
        text: `Status atual: ${event.status}`,
        icon: "info",
        showCancelButton: true,
        showDenyButton: true,
        cancelButtonText: "Fechar",
        confirmButtonText: "Aceitar",
        denyButtonText: "Recusar",
      }).then((result) => {
        if (result.isConfirmed) {
          respondToInvite(event.id, "ACCEPTED");
        } else if (result.isDenied) {
          respondToInvite(event.id, "DECLINED");
        }
      });
    }
  };

  const respondToInvite = async (inviteId: any, status: any) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetchAPI("events/invite/respond", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ inviteId, status }),
      });

      if (response.message) {
        Swal.fire("Sucesso!", response.message, "success");
        setUserInvites((prev: any) =>
          prev.map((invite: any) => (invite.id === inviteId ? { ...invite, status } : invite))
        );
      }
    } catch (error) {
      Swal.fire("Erro", "Não foi possível responder ao convite.", "error");
    }
  };

  const handleNewEvent = ({ start, end }: any) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (start < now) {
      Swal.fire("Aviso", "Não é possível criar eventos em dias passados.", "warning");
      return;
    }

    setSelectedStart(start);
    setSelectedEnd(end);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedStart(null);
    setSelectedEnd(null);
    setSelectedEvent(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl font-bold mb-4">Agendei?</h1>
      <Calendar
        localizer={localizer}
        events={[...events, ...userInvites]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80vh" }}
        selectable
        onSelectEvent={handleEventSelect}
        onSelectSlot={handleNewEvent}
      />

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <EventForm
              setEvents={setEvents}
              start={selectedStart}
              end={selectedEnd}
              onClose={closeForm}
              eventToEdit={selectedEvent}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
