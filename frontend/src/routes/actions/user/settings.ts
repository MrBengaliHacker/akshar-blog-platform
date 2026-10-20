import { redirect } from "react-router";

// Custom Modules
import { aksharApi } from "@/api";
import { notifyUserChange } from "@/hooks/useUser";

// Types

import type { ActionFunction } from "react-router";
import { AxiosError } from "axios";

const settingsAction: ActionFunction = async ({ request }) => {
  const data = await request.json();

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return redirect("/");

  try {
    const response = await aksharApi.patch('/users/current', data);

    const responseData = response.data;

    // Keep the same shape as login: only what the app needs
    const { _id, username, email, role } = responseData.user;

    localStorage.setItem('user', JSON.stringify({ _id, username, email, role }));
    notifyUserChange();

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

    throw err;
  }
};

export default settingsAction;