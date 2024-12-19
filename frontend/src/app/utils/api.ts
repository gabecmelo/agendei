const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}/${endpoint}`;

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const config: RequestInit = {
    method: options.method || "GET",
    headers,
    body: options.body || undefined,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
};

export default fetchAPI;
