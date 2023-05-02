import { useRive } from "@rive-app/react-canvas";
import { type NextPage } from "next";
import LoginFormComponent from "./LoginForm";
import { useState } from "react";

const Home: NextPage = () => {
  const [isBookAnimationStopped, setIsBookAnimationStopped] = useState(false);
  const { rive: riveVehicle, RiveComponent: RiveVehicleComponent } = useRive({
    src: "/images/vehicles.riv",
    autoplay: false,
  });

  const { rive: riveBooks, RiveComponent: RiveBookComponent } = useRive({
    src: "/images/book-stack.riv",
    autoplay: false,
    onStop: (e) => {
      setIsBookAnimationStopped(true);
    },
  });

  const toggleBookAnimation = () => {
    if (riveBooks && riveBooks.isPaused) {
      riveBooks.play();
    } else if (riveBooks && riveBooks.isPlaying) {
      riveBooks.pause();
    }
  };

  const resetBookAnimation = () => {
    if (riveBooks) {
      riveBooks.reset();
      riveBooks.play();
      setIsBookAnimationStopped(false);
    } 
  };

  return (
    <>
      <h1 className="text-5xl">Hello there Rive</h1>
      <h3>Hover to animate</h3>
      <div className="h-60 border">
        <RiveVehicleComponent
          onMouseEnter={() => riveVehicle && riveVehicle.play()}
          onMouseLeave={() => riveVehicle && riveVehicle.pause()}
        />
      </div>
      <h3>Buttons to animate</h3>
      {isBookAnimationStopped ? (
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={() => resetBookAnimation()}
        >
          Reset
        </button>
      ) : (
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={() => toggleBookAnimation()}
        >
          Toggle
        </button>
      )}

      <div className="h-60 border">
        <RiveBookComponent />
      </div>
      <h3>Animated Login Form (pw: teddy)</h3>
      <LoginFormComponent />
    </>
  );
};

export default Home;
