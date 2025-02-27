import { JSX, ReactNode } from "react";

interface MorseBlockProps {
  code: string;
}

export default function MorseBlock({ code }: MorseBlockProps): JSX.Element {
  return (
    <div className={`flex flex-wrap`}>
      {code
        .split(" ")
        .slice(1)
        .map((letter: string, letterIdx: number): ReactNode => {
          return (
            <>
              <div className={`flex py-0.5`}>
                {letter
                  .split("")
                  .map((char: string, index: number): ReactNode => {
                    if (char === ".") {
                      return (
                        <>
                          <Dit key={`${letterIdx}${index}`} />
                          <Space />
                        </>
                      );
                    } else if (char === "_") {
                      return (
                        <>
                          <Dah key={`${letterIdx}${index}`} />
                          <Space />
                        </>
                      );
                    }
                  })}
                <Space />
              </div>
            </>
          );
        })}
    </div>
  );
}

function Space(): JSX.Element {
  return <div className="h-1.5 aspect-square" />;
}

function Dit(): JSX.Element {
  return (
    <div className="bg-blue-500">
      <Space />
    </div>
  );
}

function Dah(): JSX.Element {
  return (
    <div className="flex">
      <Dit />
      <Dit />
      <Dit />
    </div>
  );
}
