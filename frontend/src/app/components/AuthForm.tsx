import React, { useState } from "react";
import { AuthFormProps } from "../utils/types";
import FormInput from "./FormInput";

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateFields = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) errors.email = "O campo Email é obrigatório.";
    if (!formData.password) errors.password = "O campo Senha é obrigatório.";
    if (type === "register" && !formData.name) errors.name = "O campo Nome é obrigatório.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFields()) {
      onSubmit(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white shadow-md rounded-md max-w-md w-full mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        {type === "login" ? "Faça Login no 'Agendei?'" : "Comece no 'Agendei?'"}
      </h2>

      {type === "register" && (
        <FormInput
          label="Nome"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
          placeholder="Digite seu nome"
        />
      )}

      <FormInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        placeholder="Digite seu email"
      />

      <FormInput
        label="Senha"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
        placeholder="Digite sua senha"
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        {type === "login" ? "Entrar" : "Enviar"}
      </button>
    </form>
  );
};

export default AuthForm;
