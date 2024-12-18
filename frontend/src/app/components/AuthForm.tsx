import React, { useState } from "react";

type AuthFormProps = {
  type: "login" | "register";
  onSubmit: (data: { email: string; password: string; name?: string }) => void;
};

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) newErrors.email = "O campo Email é obrigatório.";
    if (!formData.password) newErrors.password = "O campo Senha é obrigatório.";
    if (type === "register" && !formData.name) newErrors.name = "O campo Nome é obrigatório.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFields()) {      
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value});
    setErrors({ ...errors, [name]: ""});
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white shadow-md rounded-md max-w-md w-full mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        {type === 'login' ? `Faça Login no "Agendei?"` : `Comece no "Agendei?"`}
      </h2>

      {type === "register" && (
        <div className="mb-4">
          <label className="block mb-1">Nome</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Digite seu nome"
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Digite seu email"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-1">Senha</label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Digite sua senha"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
      </div>

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
