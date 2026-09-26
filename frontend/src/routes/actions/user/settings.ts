import { redirect } from "react-router";

// Custom Modules
import { aksharApi } from "@/api";

// Types

import type { ActionFunction } from "react-router";
import { AxiosError } from "axios";

const settingsAction: ActionFunction = async ({ request }) => {
  const data = await request.json();

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return redirect("/");

  try {
    const response = await aksharApi.patch('/users/current', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
  
    const responseData = response.data;
  
    localStorage.setItem('user', JSON.stringify(responseData.user));
  
    return {
      ok: true,
      data: responseData,
    };
  } catch (err) {
      if (err instanceof AxiosError) {
        return {
          ok: false,
          err: err.response?.data,
        };
      }
  }
};

export default settingsAction;