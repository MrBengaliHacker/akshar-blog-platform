//  Custom Modules
import { aksharApi  } from "@/api";

//  Types
import type { ActionFunction } from 'react-router';
import { AxiosError } from 'axios';
import type { ActionResponse, AuthResponse } from '@/types';


const signupAction: ActionFunction = async ({ request }) => {
    const data = await request.json();

    try {
      const response = await aksharApi.post('/auth/register', data, {
          withCredentials: true,
      });

      const responseData = response.data as AuthResponse;

      localStorage.setItem('accessToken', responseData.accessToken);
      localStorage.setItem('user', JSON.stringify(responseData.user));

      return {
          ok: true,
          data: responseData,
      } as ActionResponse<AuthResponse>;
    } catch (err) {
        if (err instanceof AxiosError) {
            return {
                ok: false,
                err: err.response?.data,
            } as ActionResponse;
        }
    }
};

export default signupAction;