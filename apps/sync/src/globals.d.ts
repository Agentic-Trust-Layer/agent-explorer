declare var process: {
  argv: string[];
  env: Record<string, string | undefined>;
  exitCode?: number;
};

declare var Buffer: {
  from(input: string, encoding?: string): { toString(encoding: string): string };
  byteLength(input: string, encoding?: string): number;
};

