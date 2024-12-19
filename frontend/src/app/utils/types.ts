type AuthFormProps = {
  type: "login" | "register";
  onSubmit: (data: { email: string; password: string; name?: string }) => void;
};

export type { AuthFormProps };
