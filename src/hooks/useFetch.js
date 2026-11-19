import axios from "axios";
import React, { useEffect, useState } from "react";

function useFetch() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  async function fetchData(url, method, requestData = null) {
    try {
      setLoading(true);

      let response;
      if (method === "GET") {
        response = await axios.get(url);
      } else if (method === "POST") {
        response = await axios.post(url, requestData);
      }

      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }

  return { data, loading, error, fetchData };
}

export default useFetch;
