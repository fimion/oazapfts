import { OpenAPIV3 } from "openapi-types";
import { type SchemaObject } from "../generate";
import ts from "typescript";
import { Opts } from "../index";
import minimist from "minimist";

export type OazapftsCodegenPlugin = {
  /**
   * Required identifier for this plugin
   */
  name: string;
  /**
   * Additional command line arguments that can be specified
   * This will be parsed after all plugins have been loaded.
   */
  options?: {
    /**
     * The new arguments to be merged into the options object.
     * Cannot override existing option names.
     */
    args: minimist.Opts;
    /**
     * Description for the plugin options.
     */
    description: string;
    /**
     * Validate if the options you have are valid or not.
     * options will be considered valid by default if not validator plugin is provided.
     * @param opts - the parsed options object.
     */
    validator?(opts: Opts): Boolean;
  };

  /**
   * Called after the OAS document has been downloaded and before AST transform begins.
   * Can be async.
   * @param options - command line options. will include values defined by plugin.
   * @param document - the full OAS document.
   */
  initialize?(
    options: Opts,
    document: OpenAPIV3.Document,
  ): void | Promise<void>;

  /**
   * Modify the `defaults` value definition in the head of the new TS document
   * Can be async
   * @param defaults - the AST of the `defaults` definition
   * @param fullTree - the full AST tree of the document
   * @param document - the full OAS document
   */
  modifyDefaults?(
    defaults: ts.VariableDeclaration,
    fullTree: ts.SourceFile,
    document: OpenAPIV3.Document,
  ): void | Promise<void>;

  /**
   * Modify the `servers` value definition in the head of the new TS document
   * Can be async
   * @param servers - the AST of the `servers` definition
   * @param fullTree - the full AST tree of the document
   * @param document - the full OAS document
   */
  modifyServers?(
    servers: ts.VariableDeclaration,
    fullTree: ts.SourceFile,
    document: OpenAPIV3.Document,
  ): void | Promise<void>;

  /**
   * Run before an OAS endpoint is converted to an AST node
   * Can be async
   * @param schema - the current endpoint Object from the OAS document
   * @param fullTree - the full AST tree
   * @param document - the full OAS document
   */
  beforeConvertEndpoint?(
    schema: OpenAPIV3.OperationObject,
    fullTree: ts.SourceFile,
    document: OpenAPIV3.Document,
  ): void | Promise<void>;

  /**
   * Run after an OAS endpoint is converted to an AST node
   * Can be async
   * @param schema - the current endpoint Object from the OAS document
   * @param functionTree - the AST node for the function definition
   * @param fullTree - the full AST tree
   * @param document - the full OAS document
   */
  afterConvertEndpoint?(
    schema: OpenAPIV3.OperationObject,
    functionTree: ts.FunctionDeclaration,
    fullTree: ts.SourceFile,
    document: OpenAPIV3.Document,
  ): void | Promise<void>;

  /**
   * Run before an OAS schema is converted to an AST node
   * Can be async
   * @param schema - the current OAS Schema about to be converted
   * @param fullTree - the full AST tree
   * @param document - the full OAS document
   */
  beforeConvertSchema?(
    schema: SchemaObject | OpenAPIV3.ReferenceObject,
    fullTree: ts.SourceFile,
    document: OpenAPIV3.Document,
  ): void | Promise<void>;

  /**
   * Run after an OAS schema is converted to an AST node
   * Can be async
   * @param schema - the current OAS Schema that was converted
   * @param typeTree - the AST Type Definition
   * @param fullTree - the full AST tree
   * @param document - the full OAS document
   */
  afterConvertSchema?(
    schema: SchemaObject | OpenAPIV3.ReferenceObject,
    typeTree: ts.TypeNode,
    fullTree: ts.SourceFile,
    document: OpenAPIV3.Document,
  ): void | Promise<void>;

  /**
   * Runs after the full AST tree has been created, but before the ts file contents have been generated
   * Can be async
   * @param fullTree - the full AST tree
   * @param document - the full OAS document
   */
  afterASTGenerate?(
    fullTree: ts.SourceFile,
    document: OpenAPIV3.Document,
  ): void | Promise<void>;

  /**
   * Runs after the TS file contents have been generated, but before writing to file.
   * Can be async
   * @param fileName - name of the file to write to (should this be a full path object?)
   * @param fileContents - The TS file contents as a string.
   * @param document - the full OAS document.
   */
  beforeWriteToFile?(
    fileName: string,
    fileContents: string,
    document: OpenAPIV3.Document,
  ): void | Promise<void>;

  /**
   * Runs after the TS file has been written to. Allows for... cleanup?
   * @param fileName - name of the file to write to (should this be a full path object?)
   * @param fileContents - The TS file contents as a string.
   * @param document - the full OAS document.
   */
  afterWriteToFile?(
    fileName: string,
    fileContents: string,
    document: OpenAPIV3.Document,
  ): void | Promise<void>;
};

export function defineOazapftsPlugin(
  plugin: OazapftsCodegenPlugin,
): OazapftsCodegenPlugin {
  // Do some checks to ensure that we have a valid plugin (if there are required params)
  if (!plugin.name || plugin.name === "") {
    throw new Error("defineOazapftsPlugin: 'name' property is required!");
  }

  // Maybe we do the registration right here? force module developers to use this function?
  return plugin;
}
