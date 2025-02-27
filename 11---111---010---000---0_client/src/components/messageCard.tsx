import { HTMLAttributes, JSX } from "react";
import { MorseMessage } from "../App";
import MorseBlock from "./morseBlocks";
import { fromMorse } from "../helper/morse";

interface MessageCardProps extends HTMLAttributes<HTMLDivElement> {
  message: MorseMessage;
  user: string;
  writeMode?: boolean;
}

export default function MessageCard({
  message,
  user,
  writeMode = false,
  className,
  ...rest
}: MessageCardProps): JSX.Element {
  return (
    <div
      className={`flex flex-col justify-between gap-4 w-full ${
        writeMode ? "max-w-3xl" : "max-w-sm md:max-w-md lg:max-w-lg"
      } px-4 py-2 grow tracking-widest rounded-md bg-blue-300 ${className}`}
      {...rest}>
      {/* <textarea
        rows={8}
        readOnly
        value={message}
        placeholder={writeMode ? `Send a message` : `Waiting for message...`}
        className={`text-sm text-blue-800 outline-none`}
      /> */}
      <div className={`h-40 py-2 flex flex-col grow`}>
        {message ? (
          <div className={`flex flex-col justify-between grow`}>
            <MorseBlock code={message} />
            <div>{fromMorse(message)}</div>
          </div>
        ) : (
          <span className={`text-xs text-blue-800`}>
            {writeMode ? `Send a message` : `Waiting for message...`}
          </span>
        )}
      </div>
      <div className={`text-sm text-end border-t border-blue-400 py-1`}>
        {writeMode ? <>you: </> : <>user </>}
        {user}
      </div>
    </div>
  );
}
