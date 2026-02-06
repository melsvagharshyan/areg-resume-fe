import { api } from '../api';

const base = '/cover-letter';

const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    updateCoverLetter: build.mutation<void, { type: string; text: string }>({
      query: ({ type, ...body }) => ({
        url: `${base}/${type}`,
        method: 'PUT',
        body,
      }),
    }),

    getCoverLetter: build.query<{ text: string; type: string }, string>({
      query: (type) => ({
        url: `${base}/${type}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useUpdateCoverLetterMutation, useGetCoverLetterQuery } = userApi;
