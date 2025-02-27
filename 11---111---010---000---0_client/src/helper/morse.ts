const morse: { [key: string]: string } = {
  a: "._",
  b: "_...",
  c: "_._.",
  d: "_..",
  e: ".",
  f: ".._.",
  g: "__.",
  h: "....",
  i: "..",
  j: ".___",
  k: "_._",
  l: "._..",
  m: "__",
  n: "_.",
  o: "___",
  p: ".__.",
  q: "__._",
  r: "._.",
  s: "...",
  t: "_",
  u: ".._",
  v: "..._",
  w: ".__",
  x: "_.._",
  y: "_.__",
  z: "__..",
  " ": "       ",
  "1": ".____",
  "2": "..___",
  "3": "...__",
  "4": "...._",
  "5": ".....",
  "6": "_....",
  "7": "__...",
  "8": "___..",
  "9": "____.",
  "0": "_____",
  ".": "._._._",
  ",": "__..__",
  "?": "..__..",
  "'": ".____.",
  "!": "_._.__",
  "❌": "........",
};

export function toMorse(text: string): string {
  return text
    .split("")
    .map((char: string): string => {
      const morseChar: string = morse[char.toLowerCase()];
      if (morseChar) {
        return morseChar;
      }
      return "";
    })
    .join(" ");
}

const morseReverse: { [k: string]: string } = Object.fromEntries(
  Object.entries(morse).map(
    ([key, value]: [string, string]): [string, string] => [value, key]
  )
);

export function fromMorse(morseCode: string): string {
  return morseCode
    .split(" ")
    .map((letter: string): string => {
      return morseReverse[letter];
    })
    .join("");
}
