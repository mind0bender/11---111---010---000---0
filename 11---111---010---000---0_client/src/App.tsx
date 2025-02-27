import { JSX, ReactNode, useEffect, useState } from "react";
import socket from "./socket";
import MessageCard from "./components/messageCard";
import MorseBlock from "./components/morseBlocks";

export type MorseFragment = "." | "_" | " ";
export type MorseMessage = string;

function App(): JSX.Element {
  const [beeping, setBeeping] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<string | null>(null);
  const [morseMessages, setMorseMessages] = useState<Map<string, MorseMessage>>(
    new Map()
  );

  useEffect((): (() => void) => {
    socket.connect();
    socket.on("connected", ({ user }: { user: string }): void => {
      setIsConnected(user);
      setMorseMessages(
        (pMM: Map<string, MorseMessage>): Map<string, MorseMessage> =>
          new Map(pMM).set(user, "")
      );
    });
    socket.on("friend++", ({ user }: { user: string }): void => {
      setMorseMessages(
        (pMM: Map<string, MorseMessage>): Map<string, MorseMessage> =>
          new Map(pMM).set(user, "")
      );
    });
    socket.on("friend--", ({ user }: { user: string }): void => {
      setMorseMessages(
        (pMM: Map<string, MorseMessage>): Map<string, MorseMessage> => {
          const newMM = new Map(pMM);
          newMM.delete(user);
          console.log(user, "deleted", newMM);
          return newMM;
        }
      );
    });

    socket.on(
      "start",
      ({ user, char }: { user: string; char: MorseFragment }): void => {
        setMorseMessages(
          (pMM: Map<string, MorseMessage>): Map<string, MorseMessage> => {
            console.log(pMM.get(user));
            return new Map(pMM).set(user, (pMM.get(user) || "") + char);
          }
        );
        setBeeping(true);
      }
    );
    socket.on(
      "stop",
      ({ user, char }: { user: string; char: MorseFragment }): void => {
        setMorseMessages(
          (pMM: Map<string, MorseMessage>): Map<string, MorseMessage> =>
            new Map(pMM).set(user, (pMM.get(user) || "") + char)
        );
        setBeeping(false);
      }
    );

    socket.on("clear", ({ user }: { user: string }): void => {
      console.log("clear");
      setMorseMessages(
        (pMM: Map<string, MorseMessage>): Map<string, MorseMessage> =>
          new Map(pMM).set(user, "")
      );
    });

    return (): void => {
      socket.off("connected");
      socket.off("friend++");
      socket.off("friend--");
      socket.off("start");
      socket.off("stop");
      socket.off("clear");

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
    <div
      className={`bg-indigo-200 h-screen flex flex-col font-mono text-stone-800`}>
      <nav>
        <div
          className={`px-4 py-4 tracking-widest flex flex-col justify-center items-center`}>
          <MorseBlock code={`__ ___ ._. ... .`} />
          <hr
            className={`pt-4 mx-4 w-full border-t-0 border-b-2 border-indigo-300`}
          />
        </div>
      </nav>
      <div className={`flex flex-col justify-center items-center grow`}>
        <div className={`h-1/2 w-full px-4`}>
          {/* <div className={`text-lg px-10 py-2`}>Friends</div> */}
          <div
            className={`w-full flex justify-center items-center flex-wrap gap-4 overflow-hidden`}>
            {((): ReactNode => {
              const users: string[] = Array.from(morseMessages.keys()).filter(
                (user: string): boolean => user !== isConnected
              );
              return users.length ? (
                users.map(
                  (user: string): JSX.Element => (
                    <MessageCard
                      key={user}
                      user={user}
                      message={morseMessages.get(user) || ""}
                    />
                  )
                )
              ) : (
                <span className={`text-center text-blue-800`}>
                  No one's here yet.
                  <br />
                  Invite a friend to join the chat!
                </span>
              );
            })()}
          </div>
        </div>
        <div
          className={`flex flex-col justify-center items-center h-1/2 w-full px-4 py-10 gap-4`}>
          <div className={`w-full flex justify-center items-center`}>
            <MessageCard
              writeMode
              user={isConnected || "X".repeat(20)}
              message={isConnected ? morseMessages.get(isConnected) || "" : ""}
            />
          </div>
          <div className={`border-10 border-blue-300 rounded-full`}>
            <button
              className={`${
                beeping ? "bg-white scale-110" : "bg-black"
              } border border-blue-400 p-10 w-fit rounded-full duration-150`}
              onTouchStart={(): void => {
                socket.emit("start", (): void => {
                  console.log("start");
                });
              }}
              onTouchEnd={(): void => {
                socket.emit("stop", (): void => {
                  console.log("stop");
                });
              }}
            />
          </div>
          <div
            className={`text-sm text-slate-500 ${
              isConnected && morseMessages.get(isConnected) && "scale-0"
            }`}>
            Use spacebar to send a message.
          </div>
        </div>
      </div>
      <div>
        <div
          className={`flex justify-center items-center gap-4 text-sm px-4 py-1 ${
            isConnected ? "bg-green-400" : "bg-red-400"
          }`}>
          <div>{isConnected || "Waiting for connection"}</div>
          <hr className={`grow ${isConnected || "border-dashed"}`} />
        </div>
      </div>
    </div>
  );
}

export default App;
