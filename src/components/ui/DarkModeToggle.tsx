import { DarkModeIcon, LightModeIcon } from "../icons";
import { usePersistedState } from "../../hooks";
import { useEffect } from "react";

export const DarkModeToggle = () => {
  const [theme, setTheme] = usePersistedState("theme", "");

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.add(theme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      console.log("ENTRE EN DARK");
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      console.log("ENTRE EN LIGHT");
      setTheme("light");
      document.documentElement.classList.add("light");
    }
  }, [setTheme, theme]);

  function handleToggleTheme() {
    if (theme === "light") {
      document.documentElement.classList.remove("light");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }

  return (
    <>
      {theme === "light" ? (
        <DarkModeIcon
          className="m-4 fill-[#213547] hover:cursor-pointer"
          onClick={handleToggleTheme}
        />
      ) : (
        <LightModeIcon
          className="m-4 fill-white/85 hover:cursor-pointer"
          onClick={handleToggleTheme}
        />
      )}
    </>
  );
};
