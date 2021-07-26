import { useState } from 'react';

function useSendRequest() {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function sendRequest(requestConfig, applyData) {
    try {
      setError(false);
      setIsLoading(true);
      const res = await fetch(requestConfig.url, {
        method: requestConfig.method,
        body: JSON.stringify(requestConfig.body),
        headers: requestConfig.headers,
      });
      const data = await res.json();
      console.log(data);
      let errorMessage = 'Authentication failed';
      if (data.error) {
        errorMessage = data.error.message;
      }
      if (!res.ok) throw new Error(errorMessage);

      setIsLoading(false);
      applyData(data);
    } catch (err) {
      console.error(err);
      setError(true);
      setErrorMessage(err.message);
      setIsLoading(false);
    }
  }
  return { isLoading, error, sendRequest, errorMessage };
}

export default useSendRequest;
