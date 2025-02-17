import { useEffect, useState } from "react";

const useReactiveLocalStorage = (localStorage_key: string) => {
  if (!localStorage_key || typeof localStorage_key !== "string") {
    return [null];
  }

  const [storageValue, setStorageValue] = useState(localStorage.getItem(localStorage_key));

  useEffect(() => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, newValue) {
      const setItemEvent = new CustomEvent("setItemEvent", {
        detail: { key, newValue },
      });
      window.dispatchEvent(setItemEvent);
      originalSetItem.apply(this, [key, newValue]);
    };

    const handleSetItemEvent = (event: CustomEvent) => {
      if (event.detail.key === localStorage_key) {
        setStorageValue(event.detail.newValue);
      }
    };

    window.addEventListener("setItemEvent", handleSetItemEvent as EventListener);

    return () => {
      window.removeEventListener("setItemEvent", handleSetItemEvent as EventListener);
      localStorage.setItem = originalSetItem;
    };
  }, [localStorage_key]);

  return [storageValue];
};
export default useReactiveLocalStorage;
