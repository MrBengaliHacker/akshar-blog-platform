import { redirect } from 'react-router';

//  Custom Modules
import { aksharApi  } from "@/api";

//  Types
import type { ActionFunction } from 'react-router';
import { AxiosError } from 'axios';
import type { ActionResponse } from '@/types';


const blogEditAction: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const blogId = formData.get('blogId') as string;

    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) return redirect('/');

    try {
      const response = await aksharApi.patch(`/blogs/${blogId}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      const responseData = response.data;

      return {
          ok: true,
          data: responseData,
      } as ActionResponse;
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

export default blogEditAction;