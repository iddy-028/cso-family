import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../services/api";

export default function useApiData(fetcher, fallback = null, deps = []) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refresh = useCallback(() => setTick((value) => value + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    fetcherRef
      .current()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (!active) return;
        setError(getErrorMessage(err));
        if (fallback !== null) setData(fallback);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { data, setData, loading, error, refresh };
}
