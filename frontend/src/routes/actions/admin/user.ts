import { redirect } from 'react-router';

//  Custom Modules
import { aksharApi  } from "@/api";

//  Types
import type { ActionFunction } from 'react-router';
import { AxiosError } from 'axios';
import type { ActionResponse } from '@/types';


const allUserAction: ActionFunction = async ({ request }) => {
    const data = (await request.json()) as { userId: string };

    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) return redirect('/');

    try {
      // PATCH = ban or unban the user, DELETE = delete the user
      if (request.method === 'PATCH') {
        const response = await aksharApi.patch(`/users/${data.userId}/ban`);

        return {
          ok: true,
          data: response.data,
        } as ActionResponse<{ message: string; isBanned: boolean }>;
      }

      await aksharApi.delete(`/users/${data.userId}`);

      return { ok: true };
    } catch (err) {
        if (err instanceof AxiosError) {
            return {
              ok: false,
              err: err.response?.data,
            } as ActionResponse;
        }

        throw err;
    }
};

export default allUserAction;