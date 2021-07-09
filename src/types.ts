export type DisplayFormat = 'dev' | 'json' | 'human-readable';
export type Help = 'auto' | 'pager' | 'groff' | 'plain';
export type MichelsonFormat = 'text' | 'json' | 'hex';
export type Syntax = 'pascaligo' | 'cameligo' | 'reasonligo' | 'jsligo';

export interface StringIndex {
  [key: string]: string;
}

export interface CompileContractArguments {
  entrypoint: string;
  sourceFile: string;
}

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

export interface CompileStorageArguments extends CompileContractArguments {
  storageExpression: string;
}

export interface CompileParameterArguments extends CompileContractArguments {
  parameterExpression: string;
}

export interface CompileStorageOptions extends CommonOptions {
  amount?: number;
  balance?: number;
  now?: string;
  sender?: string;
  source?: string;
}

export interface CompileParameterOptions extends CompileStorageOptions {}
