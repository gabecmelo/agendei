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
    if (token) {
      router.push("/calendar");
    }
  }, [router]);

  const handleAuthSubmit = async (data: { email: string; password: string; name?: string }) => {
    try {
      if (isLogin) {
        const response = await fetchAPI("auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });

        if (response.access_token) {
          localStorage.setItem("token", response.access_token);
          Swal.fire("Sucesso!", "Login efetuado com sucesso!", "success");
          router.push("/calendar");
        } else {
          console.log(response);
          Swal.fire("Erro!", "Falha no login. Verifique suas credenciais.", "error");
        }
      } else {
        const response = await fetchAPI(`users/register`, {
          method: "POST",
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
          }),
        });
        if (response.id) {
          Swal.fire("Sucesso!", "Registro realizado com sucesso!", "success");
          setIsLogin(true);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Ocorreu um erro ao registrar",
            footer: response.message,
          });
        }
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <div className="min-h-screen text-gray-700 bg-gray-100 flex items-center justify-center">
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
