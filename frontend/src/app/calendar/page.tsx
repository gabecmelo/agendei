"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, View, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Swal from "sweetalert2";
import fetchAPI from "../utils/api";
import EventForm from "../components/EventForm";
import { RiLogoutBoxLine } from "react-icons/ri";
import { ApiEvent, ApiEventInvite, Event, EventInvite } from "../utils/types";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [userInvites, setUserInvites] = useState<EventInvite[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState<Date>(new Date());

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
      const formattedEvents = response.map((event: ApiEvent) => ({
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

      const formattedInvites = response.map((invite: ApiEventInvite) => ({
        id: invite.id,
        title: `${invite.event.description} (Convite)`,
        start: new Date(invite.event.start_time),
        end: new Date(invite.event.end_time),
        status: invite.status,
      }));

      setUserInvites(formattedInvites);
    });
  }, [router]);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const deleteEvent = (event: Event) => {
    const token = localStorage.getItem("token");
    fetchAPI(`events/${event.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setEvents(events.filter((e: Event) => e.id !== event.id));
  };

  const handleEventSelect = async (event: Event) => {
    const token = localStorage.getItem("token");

    if (event.status === "CREATOR") {
      try {
        const response = await fetchAPI(`events/${event.id}/invites`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.error) {
          Swal.fire("Erro", response.error.message, "error");
          return;
        }

        const inviteList = response.map(
          (invite: ApiEventInvite) => `<li>${invite.user.email}: <strong>${invite.status}</strong></li>`
        );

        const htmlContent = `
          <p><strong>Descrição:</strong> ${event.title}</p>
          <br>
          ${
            inviteList.length > 0
              ? `<p><strong>Convidados:</strong></p>
          <ul>${inviteList.join("")}</ul>`
              : ""
          }
          
        `;

        Swal.fire({
          title: "Detalhes do Evento",
          html: htmlContent,
          icon: "info",
          showCancelButton: true,
          showDenyButton: true,
          confirmButtonText: "Deletar Evento",
          denyButtonText: "Fechar",
        }).then((result) => {
          if (result.isConfirmed) deleteEvent(event);
        });
      } catch (error) {
        Swal.fire("Erro", "Não foi possível carregar os detalhes dos convidados.", "error");
      }
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
        if (result.isConfirmed) respondToInvite(event.id, "ACCEPTED");
        else if (result.isDenied) respondToInvite(event.id, "DECLINED");
      });
    }
  };

  const respondToInvite = async (inviteId: string, status: "ACCEPTED" | "DECLINED") => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetchAPI("events/invite/respond", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ inviteId, status }),
      });

      if (response.message) {
        Swal.fire("Sucesso!", response.message, "success");        
        setUserInvites((prev: EventInvite[]) =>{
          console.log(prev[0])
          console.log("teste: ", prev)
          return prev.map((invite: EventInvite) => (invite.id === inviteId ? { ...invite, status } : invite))
        }
        );
      }
    } catch (error) {
      Swal.fire("Erro", "Não foi possível responder ao convite.", "error");
    }
  };

  const handleNewEvent = ({ start }: { start: Date }) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const selectedDate = new Date(start);
    selectedDate.setHours(0, 0, 0, 0);

    const offset = -3;
    selectedDate.setHours(selectedDate.getHours() + offset);

    const startTime = new Date(selectedDate);

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    if (start < now) {
      Swal.fire("Aviso", "Não é possível criar eventos em dias passados.", "warning");
      return;
    }

    setSelectedStart(startTime);
    setSelectedEnd(endTime);
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
      <div className="flex justify-between px-10">
        <h1 className="text-center text-2xl font-bold mb-4">Agendei?</h1>{" "}
        <RiLogoutBoxLine
          className="cursor-pointer hover:text-red-400 transition-all duration-500 ease-in-out"
          size={35}
          onClick={handleLogOut}
        />
      </div>
      <Calendar
        localizer={localizer}
        events={[...events, ...userInvites]}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        view={view}
        date={date}
        onView={(view) => setView(view)}
        onNavigate={(date) => setDate(new Date(date))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80vh" }}
        selectable
        onSelectEvent={handleEventSelect}
        onSelectSlot={handleNewEvent}
      />
      ;
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeForm}
        >
          <div
            className="bg-white p-6 rounded-md shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
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
