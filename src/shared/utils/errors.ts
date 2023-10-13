import axios, { AxiosResponse, AxiosError } from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';

import { ApiError } from 'shared/state';

type ErrorData = Error | AxiosError<ApiError> | unknown;

export const isError = (error: unknown): error is Error => error instanceof Error;

export const getErrorData = (error: ErrorData) => {
  if (isError(error)) {
    if (axios.isAxiosError(error) && error?.response?.data?.result?.length) {
      return error.response?.data?.result[0];
    }

    return error;
  } else if (typeof error === 'object') {
    const err = error as AxiosResponse;

    return err?.data;
  }

  return error;
};

export const getErrorMessage = (error: ErrorData) => {
  const errorData = getErrorData(error);

  return errorData?.message ?? String(errorData);
};

export const getApiError = (action: PayloadAction<AxiosError>) => {
  const axiosError = action.payload as AxiosError;
  const axiosResponse = axiosError?.response as AxiosResponse;

  return axiosResponse?.data.result;
};
