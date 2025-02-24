import { JSX, useEffect, useState } from "react";
import socket from "./socket";

function App(): JSX.Element {
  const [beeping, setBeeping] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState(false);
  const [morseMessage, setMorseMessage] =
    useState<string>("__ ___ ._. ... .\n");

  useEffect((): (() => void) => {
    socket.connect();
    socket.on("connected", (): void => {
      setIsConnected(true);
    });

    socket.on("start", (char: string = ""): void => {
      console.log("start");
      setMorseMessage((pMM: string): string => pMM + char);
      setBeeping(true);
    });
    socket.on("stop", (char: string = ""): void => {
      console.log("stop");
      setMorseMessage((pMM: string): string => pMM + char);
      setBeeping(false);
    });

    return (): void => {
      socket.off("connected");
      socket.off("start");
      socket.off("stop");
      socket.close();
    };
  }, []);

  useEffect((): (() => void) => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === " ") {
        setBeeping(true);
        socket.emit("start", (): void => {
          console.log("start");
        });
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    function handleKeyUp(event: KeyboardEvent): void {
      if (event.key === " ") {
        setBeeping(false);
        socket.emit("stop", (): void => {
          console.log("stop");
        });
      }
    }

    document.addEventListener("keyup", handleKeyUp);

    return (): void => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className={`bg-gray-800 h-screen flex flex-col`}>
      <nav>
        <div className={`text-white px-4 py-2`}>__ ___ ._. ... .</div>
      </nav>
      <div className={`flex flex-col justify-center items-center gap-4 grow`}>
        <div className={`text-white`}>{morseMessage}</div>
        <button
          className={`${
            beeping ? "bg-white" : "bg-black scale-80"
          } p-10 rounded-full text-gray-800 duration-150`}
          onClick={(): void => {
            socket.emit("start", (): void => {
              console.log("start");
            });
          }}
        />
      </div>
      <div>
        <div
          className={`text-white px-4 py-2 ${
            isConnected ? "bg-green-400" : "bg-red-400"
          }`}
        />
      </div>
    </div>
  );
}

export default App;
