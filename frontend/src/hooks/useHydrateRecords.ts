import { useEffect } from "react";
import { useCarbonStore } from "../stores/carbonStore";

export function useHydrateRecords() {
  const hydrate = useCarbonStore((state) => state.hydrate);
  useEffect(() => { hydrate(); }, [hydrate]);
}
