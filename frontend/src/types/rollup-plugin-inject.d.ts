// src/types/rollup-plugin-inject.d.ts
declare module "rollup-plugin-inject" {
  interface InjectOptions {
    [key: string]: any; // 옵션에 대한 보다 구체적인 타입을 제공할 수 있습니다.
  }

  export default function inject(options: InjectOptions): any;
}
