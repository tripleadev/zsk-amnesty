import { useEffect, useMemo } from "react";
import debounce from "lodash.debounce";

export const useReloadOnResize = () => {
  const handleResize = useMemo(() => debounce(() => window.location.reload(), 100), []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);
};
