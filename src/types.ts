export type DisplayFormat = 'dev' | 'json' | 'human-readable';
export type Help = 'auto' | 'pager' | 'groff' | 'plain';
export type MichelsonFormat = 'text' | 'json' | 'hex';
export type Syntax = 'pascaligo' | 'cameligo' | 'reasonligo' | 'jsligo';

export interface StringIndex {
  [key: string]: string;
}

export interface CompileArguments {
  entrypoint: string;
  sourceFile: string;
  parameterExpression?: string;
  storageExpression?: string;
  syntax?: Syntax;
  expression?: string;
}

export type CompileContractArguments = Required<
  Omit<
    CompileArguments,
    'parameterExpression' | 'storageExpression' | 'expression' | 'syntax'
  >
>;

export type CompileStorageArguments = Required<
  Omit<CompileArguments, 'parameterExpression' | 'expression' | 'syntax'>
>;

export type CompileParameterArguments = Required<
  Omit<CompileArguments, 'storageExpression' | 'expression' | 'syntax'>
>;

export interface CompileExpressionArguments {
  syntax: Syntax;
  expression: string;
}

export interface CommonOptions {
  format?: DisplayFormat;
  infer?: boolean;
  michelsonFormat?: MichelsonFormat;
  outputFile?: string;
  protocol?: string;
  warn?: boolean;
  [key: string]:
    | string
    | number
    | boolean
    | DisplayFormat
    | Help
    | MichelsonFormat
    | Syntax
    | undefined;
}

export interface CompileContractOptions extends CommonOptions {
  disableMichelsonTypeChecking?: boolean;
  syntax?: Syntax;
}

export interface CompileStorageOptions extends CommonOptions {
  amount?: number;
  balance?: number;
  now?: string;
  sender?: string;
  source?: string;
  syntax?: Syntax;
}

export type CompileParameterOptions = CompileStorageOptions;

export interface DryRunArguments {
  entrypoint: string;
  sourceFile: string;
  parameterExpression: string;
  storageExpression: string;
}

export type DryRunOptions = CompileStorageOptions;

export interface CompileExpressionOptions extends CommonOptions {
  initFile?: string;
}

export interface ErrorWarningMessage {
  status: string;
  stage: string;
  content: Content;
}

export interface Content {
  message: string;
  location: string;
}
