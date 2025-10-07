
export const authRequest = async (url: string, options: RequestInit = {}) => {
  let accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");
  if (!accessToken || !refreshToken) {
    console.error("Missing tokens:", { accessToken, refreshToken });
    throw new Error("Please login first!");
  }
  let response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  });


  // If unauthorized, try refreshing token and retry
  if (response.status === 401) {
    const refreshResponse = await fetch("http://localhost:8000/api/token/refresh/", {
      method: "POST",   
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!refreshResponse.ok) {
      throw new Error("Session expired. Please login again.");
    }
    const refreshData = await refreshResponse.json();
    accessToken = refreshData.access;
    localStorage.setItem("access_token", accessToken);
    // Retry original request
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  return response;
};

