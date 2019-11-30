import { AxiosError } from 'axios';

export function extractStatusCode(error: AxiosError): number | null {
  const code = error.response && error.response.status;
  if (typeof code === 'number') {
    return code;
  } else {
    return null;
  }
}

export function extractErrorCode(error: AxiosError): number | null {
  const code =
    error.response && error.response.data && error.response.data.code;
  if (typeof code === 'number') {
    return code;
  } else {
    return null;
  }
}
