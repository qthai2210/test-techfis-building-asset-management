interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

interface ApiResponseMetadata<T, M> {
  status: number;
  message: string;
  data: T;
  metadata: M;
}

function formatResponse<T>(status: number, message: string, data: T): ApiResponse<T> {
  return {
    status,
    message,
    data,
  };
}

function formatResponseMetadata<T, M>(
  status: number,
  message: string,
  data: T,
  metadata: M,
): ApiResponseMetadata<T, M> {
  return {
    status,
    message,
    data,
    metadata,
  };
}

export { formatResponse, formatResponseMetadata };
