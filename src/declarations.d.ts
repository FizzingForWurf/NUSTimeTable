declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.png';

declare module '*.svg' {
  const content: string;
  export default content;
}
