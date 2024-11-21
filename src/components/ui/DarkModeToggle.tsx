import { DarkModeIcon, LightModeIcon } from "../icons";
import { usePersistedState } from "../../hooks";
import { useEffect } from "react";

export const DarkModeToggle = () => {
  const [theme, setTheme] = usePersistedState("theme", "");

  const $htmlClass = document.documentElement.classList;

  useEffect(() => {
    if (theme) {
      $htmlClass.add(theme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      $htmlClass.add("dark");
    } else {
      setTheme("light");
      $htmlClass.add("light");
    }
  }, [$htmlClass, setTheme, theme]);

  function handleToggleTheme() {
    if (theme === "light") {
      $htmlClass.remove("light");
      setTheme("dark");
    } else {
      $htmlClass.remove("dark");
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
