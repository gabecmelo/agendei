"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AuthForm from "./components/AuthForm";
import fetchAPI from "./utils/api";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/calendar");
  }, [router]);

  const handleAuthSubmit = async (data: { email: string; password: string; name?: string }) => {
    try {
      const endpoint = isLogin ? "auth/login" : "users/register";
      const body = isLogin
        ? { email: data.email, password: data.password }
        : { name: data.name, email: data.email, password: data.password };

      const response = await fetchAPI(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (isLogin && response.access_token) {
        localStorage.setItem("token", response.access_token);
        Swal.fire("Sucesso!", "Login efetuado com sucesso!", "success");
        router.push("/calendar");
      } else if (!isLogin && response.id) {
        Swal.fire("Sucesso!", "Registro realizado com sucesso!", "success");
        setIsLogin(true);
      }
    } catch (error: any) {
      Swal.fire("Erro", error.message || "Ocorreu um erro", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
      <div className="p-8 bg-white shadow-lg rounded-md w-full max-w-lg">
        <AuthForm type={isLogin ? "login" : "register"} onSubmit={handleAuthSubmit} />
        <p className="mt-4 text-center">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 ml-2 hover:underline"
          >
            {isLogin ? "Criar nova conta" : "Faça Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
