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
}

export type CompileContractArguments = Omit<
  CompileArguments,
  'parameterExpression' | 'storageExpression'
>;

export type CompileStorageArguments = Required<
  Omit<CompileArguments, 'storageExpression'>
>;

export type CompileParameterArguments = Required<
  Omit<CompileArguments, 'parameterExpression'>
>;

export interface CommonOptions {
  displayFormat?: DisplayFormat;
  infer?: boolean;
  michelsonFormat?: MichelsonFormat;
  outputFile?: string;
  protocol?: string;
  syntax?: Syntax;
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
}

export interface CompileStorageOptions extends CommonOptions {
  amount?: number;
  balance?: number;
  now?: string;
  sender?: string;
  source?: string;
}

export type CompileParameterOptions = CompileStorageOptions;

export interface DryRunArguments {
  entrypoint: string;
  sourceFile: string;
  parameterExpression: string;
  storageExpression: string;
}

export type DryRunOptions = CompileStorageOptions;
