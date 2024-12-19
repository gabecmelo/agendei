type AuthFormProps = {
  type: "login" | "register";
  onSubmit: (data: { email: string; password: string; name?: string }) => void;
};

type Event = {
  id: string;
  title: string;
  start: Date | null;
  end: Date | null;
  status: string;
};

type EventInvite = {
  id: string;
  end: Date;
  start: Date;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  title: string;
};

type ApiEvent = {
  id: string;
  description: string;
  start_time: Date;
  end_time: Date;
  status: string;
};

type ApiEventInvite = {
  id: string;
  event: ApiEvent;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  user: any;
};

export type { AuthFormProps, Event, EventInvite, ApiEvent, ApiEventInvite };
