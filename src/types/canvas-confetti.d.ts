declare module 'canvas-confetti' {
  interface Options {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    [key: string]: any;
  }

  function confetti(options?: Options): Promise<null>;
  
  export = confetti;
}
