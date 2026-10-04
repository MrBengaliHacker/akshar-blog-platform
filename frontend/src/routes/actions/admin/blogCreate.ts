import { redirect } from 'react-router';

//  Custom Modules
import { aksharApi  } from "@/api";

//  Types
import type { ActionFunction } from 'react-router';
import { AxiosError } from 'axios';
import type { ActionResponse, BlogCreateResponse } from '@/types';


const blogCreateAction: ActionFunction = async ({ request }) => {
    const formData = await request.formData();

    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) return redirect('/');

    try {
      const response = await aksharApi.post('/blogs', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      const responseData = response.data as BlogCreateResponse;

      return {
          ok: true,
          data: responseData,
      } as ActionResponse<BlogCreateResponse>;
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

export default blogCreateAction;