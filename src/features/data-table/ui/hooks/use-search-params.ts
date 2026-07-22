import { useCallback, useEffect, useState } from "react";

export function useSearchParams() {
  const [searchParams, setSearchParamsState] = useState(
    new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
  );

  useEffect(() => {
    const handlePopState = () => {
      setSearchParamsState(new URLSearchParams(window.location.search));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const setSearchParams = useCallback(
    (newParams: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)) => {
      setSearchParamsState((prev) => {
        const updatedParams = typeof newParams === "function" ? newParams(prev) : newParams;
        const searchString = updatedParams.toString();
        const newUrl = searchString
          ? `${window.location.pathname}?${searchString}${window.location.hash}`
          : `${window.location.pathname}${window.location.hash}`;

        window.history.pushState(null, "", newUrl);
        window.dispatchEvent(new Event("popstate"));
        return updatedParams;
      });
    },
    []
  );

  return [searchParams, setSearchParams] as const;
}
