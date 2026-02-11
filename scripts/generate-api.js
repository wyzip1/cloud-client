/**
 * Swagger API Generator
 * 根据Swagger配置生成API方法文件和TypeScript类型定义文件
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const { execSync } = require("child_process");
const config = require("./config");

/**
 * 后端类型到前端类型的映射
 */
const TYPE_MAPPING = {
  integer: "number",
  long: "number",
  float: "number",
  double: "number",
  string: "string",
  boolean: "boolean",
  array: "Array",
  object: "Record<string, any>",
  file: "File",
  date: "string",
  "date-time": "string",
  byte: "string",
  binary: "string",
  password: "string",
  email: "string",
  uuid: "string",
  uri: "string",
  url: "string",
};

/**
 * 转换后端类型为前端类型
 * @param {string} backendType - 后端类型
 * @returns {string} 前端类型
 */
function convertType(backendType) {
  return TYPE_MAPPING[backendType] || backendType || "any";
}

/**
 * 从URL或本地文件获取Swagger配置
 * @param {string} urlOrPath - Swagger配置文件的URL或本地路径
 * @returns {Promise<Object>} Swagger配置对象
 */
async function fetchSwaggerConfig(urlOrPath) {
  return new Promise((resolve, reject) => {
    // 检查是否是本地文件路径
    if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
      // 处理URL
      const protocol = urlOrPath.startsWith("https") ? https : http;

      protocol
        .get(urlOrPath, (response) => {
          let data = "";

          response.on("data", (chunk) => {
            data += chunk;
          });

          response.on("end", () => {
            try {
              const config = JSON.parse(data);
              resolve(config);
            } catch (error) {
              reject(
                new Error(`Failed to parse Swagger config: ${error.message}`)
              );
            }
          });
        })
        .on("error", (error) => {
          reject(new Error(`Failed to fetch Swagger config: ${error.message}`));
        });
    } else {
      // 处理本地文件
      fs.readFile(urlOrPath, "utf8", (error, data) => {
        if (error) {
          reject(
            new Error(`Failed to read Swagger config file: ${error.message}`)
          );
        } else {
          try {
            const config = JSON.parse(data);
            resolve(config);
          } catch (error) {
            reject(
              new Error(`Failed to parse Swagger config: ${error.message}`)
            );
          }
        }
      });
    }
  });
}

/**
 * 生成API方法名称
 * @param {string} path - API路径
 * @param {string} method - HTTP方法
 * @returns {string} 生成的方法名
 */
function generateMethodName(path, method) {
  let name = path.replace(/^\/api\/v\d+/, "");
  name = name.replace(/\{([^}]+)\}/g, "$1");
  const parts = name.split("/").filter(Boolean);
  let methodName = parts
    .map((part, index) => {
      if (index === 0) {
        return part.toLowerCase();
      }
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join("");

  const methodPrefix = method.toLowerCase();
  if (!methodName.startsWith(methodPrefix)) {
    methodName =
      methodPrefix + methodName.charAt(0).toUpperCase() + methodName.slice(1);
  }

  return methodName;
}

/**
 * 生成类型定义名称
 * @param {string} path - API路径
 * @param {string} method - HTTP方法
 * @param {string} suffix - 后缀
 * @returns {string} 类型定义名称
 */
function generateTypeName(path, method, suffix) {
  const methodName = generateMethodName(path, method);
  const capitalizedName =
    methodName.charAt(0).toUpperCase() + methodName.slice(1);
  return capitalizedName + suffix;
}

/**
 * 清理类型名称中的非法字符
 * @param {string} typeName - 类型名称
 * @returns {string} 清理后的类型名称
 */
function cleanTypeName(typeName) {
  return typeName.replace(/«/g, "<").replace(/»/g, ">");
}

/**
 * 解析类型引用
 * @param {Object} schema - Swagger schema对象
 * @param {Object} swaggerConfig - Swagger配置对象
 * @param {Set<string>} processedTypes - 已处理的类型集合
 * @returns {string} 解析后的类型字符串
 */
function resolveType(schema, swaggerConfig, processedTypes) {
  if (!schema) {
    return "any";
  }

  if (schema.$ref) {
    const refName = cleanTypeName(schema.$ref.replace(/.*\//, ""));
    const definitions =
      swaggerConfig.definitions || swaggerConfig.components?.schemas || {};
    const refSchema = definitions[cleanTypeName(refName)];

    if (refSchema) {
      return refName;
    }
    return "any";
  }

  if (schema.type === "array") {
    if (schema.items) {
      const itemType = resolveType(schema.items, swaggerConfig, processedTypes);
      return `Array<${itemType}>`;
    }
    return "Array<any>";
  }

  if (schema.type === "object") {
    if (schema.properties) {
      return "Record<string, any>";
    }
    return "Record<string, any>";
  }

  return convertType(schema.type) || "any";
}

/**
 * 生成TypeScript类型定义
 * @param {Object} schema - Swagger schema对象
 * @param {string} typeName - 类型名称
 * @param {Object} swaggerConfig - Swagger配置对象
 * @param {Set<string>} processedTypes - 已处理的类型集合
 * @param {Array<string>} typeDefs - 类型定义数组
 */
function generateTypeDefinition(
  schema,
  typeName,
  swaggerConfig,
  processedTypes,
  typeDefs
) {
  if (!schema) {
    return;
  }

  if (processedTypes.has(typeName)) {
    return;
  }
  processedTypes.add(typeName);

  if (schema.$ref) {
    const refName = cleanTypeName(schema.$ref.replace(/.*\//, ""));
    const originalRefName = schema.$ref.replace(/.*\//, "");
    const definitions =
      swaggerConfig.definitions || swaggerConfig.components?.schemas || {};
    const refSchema = definitions[originalRefName];

    if (refSchema) {
      typeDefs.push(`export type ${typeName} = ${refName};\n`);
      generateTypeDefinition(
        refSchema,
        refName,
        swaggerConfig,
        processedTypes,
        typeDefs
      );
    } else {
      typeDefs.push(`export type ${typeName} = any;\n`);
    }
    return;
  }

  if (schema.type === "array" && schema.items) {
    const itemType = resolveType(schema.items, swaggerConfig, processedTypes);
    typeDefs.push(`export type ${typeName} = Array<${itemType}>;\n`);

    if (schema.items.$ref) {
      const refName = schema.items.$ref.replace(/.*\//, "");
      const definitions =
        swaggerConfig.definitions || swaggerConfig.components?.schemas || {};
      const refSchema = definitions[refName];
      if (refSchema) {
        generateTypeDefinition(
          refSchema,
          refName,
          swaggerConfig,
          processedTypes,
          typeDefs
        );
      }
    }
    return;
  }

  if (schema.type === "object" && schema.properties) {
    let typeDef = `export interface ${typeName} {\n`;
    Object.entries(schema.properties).forEach(([propName, propSchema]) => {
      const type = resolveType(propSchema, swaggerConfig, processedTypes);
      const optional =
        !schema.required || !schema.required.includes(propName) ? "?" : "";
      const description = propSchema.description
        ? ` // ${propSchema.description}`
        : "";
      typeDef += `  ${propName}${optional}: ${type};${description}\n`;

      if (propSchema.$ref) {
        const refName = propSchema.$ref.replace(/.*\//, "");
        const definitions =
          swaggerConfig.definitions || swaggerConfig.components?.schemas || {};
        const refSchema = definitions[refName];
        if (refSchema) {
          generateTypeDefinition(
            refSchema,
            refName,
            swaggerConfig,
            processedTypes,
            typeDefs
          );
        }
      }
    });
    typeDef += "}\n";
    typeDefs.push(typeDef);
    return;
  }

  const type = convertType(schema.type) || "any";
  typeDefs.push(`export type ${typeName} = ${type};\n`);
}

/**
 * 生成JSDoc注释
 * @param {Object} operation - Swagger操作对象
 * @param {string} path - API路径
 * @param {string} method - HTTP方法
 * @param {Object} typeNames - 类型名称映射
 * @returns {string} 生成的JSDoc注释
 */
function generateJSDoc(operation, path, method, typeNames) {
  let jsdoc = "/**\n";

  if (operation.summary) {
    jsdoc += ` * ${operation.summary}\n`;
  } else {
    jsdoc += ` * ${method.toUpperCase()} ${path}\n`;
  }

  if (operation.description) {
    jsdoc += ` * ${operation.description}\n`;
  }

  if (operation.parameters) {
    operation.parameters.forEach((param) => {
      if (param.in === "body") {
        if (typeNames.requestType) {
          jsdoc += ` * @param {import("./type").${typeNames.requestType}} data - 请求参数\n`;
        } else {
          jsdoc += ` * @param {Object} data - 请求参数\n`;
        }
      } else if (param.in === "path") {
        const type = convertType(param.type) || "string";
        const description = param.description ? ` - ${param.description}` : "";
        jsdoc += ` * @param {${type}} ${param.name}${description}\n`;
      } else if (param.in === "query") {
        if (typeNames.queryType) {
          jsdoc += ` * @param {import("./type").${typeNames.queryType}} query - 查询参数\n`;
        } else {
          const type = convertType(param.type) || "string";
          const description = param.description
            ? ` - ${param.description}`
            : "";
          jsdoc += ` * @param {${type}} [query.${param.name}]${description}\n`;
        }
      }
    });
  }

  if (typeNames.responseType) {
    if (config.baseResponseType) {
      jsdoc += ` * @returns {Promise<import("./type").BaseResponse<import("./type").${typeNames.responseType}>>} - 响应数据\n`;
    } else {
      jsdoc += ` * @returns {Promise<import("./type").${typeNames.responseType}>} - 响应数据\n`;
    }
  } else {
    jsdoc += ` * @returns {Promise<Object>} - 响应数据\n`;
  }
  jsdoc += ` */\n`;

  return jsdoc;
}

/**
 * 生成方法名和JSDoc注释
 * @param {Object} operation - Swagger操作对象
 * @param {string} path - API路径
 * @param {string} method - HTTP方法
 * @param {Object} typeNames - 类型名称映射
 * @returns {Object} 包含methodName和jsdoc的对象
 */
function generateMethodNameAndJSDoc(operation, path, method, typeNames) {
  const methodName = generateMethodName(path, method);
  const jsdoc = generateJSDoc(operation, path, method, typeNames);
  return { methodName, jsdoc };
}

/**
 * 生成API方法代码
 * @param {Object} operation - Swagger操作对象
 * @param {string} path - API路径
 * @param {string} method - HTTP方法
 * @param {Object} typeNames - 类型名称映射
 * @returns {string} 生成的API方法代码
 */
function generateApiMethod(operation, path, method, typeNames) {
  const { methodName, jsdoc } = generateMethodNameAndJSDoc(
    operation,
    path,
    method,
    typeNames
  );

  let params = [];
  let pathParams = [];
  let hasBodyParam = false;
  let hasQueryParam = false;

  if (operation.parameters) {
    operation.parameters.forEach((param) => {
      if (param.in === "path") {
        params.push(param.name);
        pathParams.push(param.name);
      } else if (param.in === "body") {
        if (!params.includes("data")) {
          params.push("data");
        }
        hasBodyParam = true;
      } else if (param.in === "query") {
        if (!hasQueryParam) {
          params.push("query");
          hasQueryParam = true;
        }
      }
    });
  }

  if (params.length === 0) {
    params.push("data");
    hasBodyParam = true;
  }

  let methodBody = `  ${jsdoc}  const ${methodName} = (${params.join(
    ", "
  )}) => {\n`;

  let url = path;
  if (pathParams.length > 0) {
    url = path.replace(
      /\{([^}]+)\}/g,
      (match, paramName) => `\${${paramName}}`
    );
    methodBody += `    const url = \`${url}\`;\n`;
  } else {
    methodBody += `    const url = "${url}";\n`;
  }

  methodBody += `    return request({\n`;
  methodBody += `      url,\n`;
  methodBody += `      method: "${method.toUpperCase()}",\n`;

  if (hasBodyParam) {
    methodBody += `      data,\n`;
  } else if (hasQueryParam) {
    methodBody += `      data: query,\n`;
  }

  methodBody += `    });\n`;
  methodBody += `  };\n\n`;

  return methodBody;
}

/**
 * 生成基础响应类型定义
 * @param {Object} baseResponseType - 基础响应类型配置
 * @param {Array<string>} typeDefs - 类型定义数组
 */
function generateBaseResponseType(baseResponseType, typeDefs) {
  if (!baseResponseType) {
    return;
  }

  let typeDef = "export interface BaseResponse<T> {\n";
  Object.entries(baseResponseType).forEach(([key, type]) => {
    if (type === "<T>") {
      typeDef += `  ${key}: T;\n`;
    } else {
      typeDef += `  ${key}: ${type};\n`;
    }
  });
  typeDef += "}\n";
  typeDefs.push(typeDef);
}

/**
 * 收集类型定义信息
 * @param {Object} swaggerConfig - Swagger配置对象
 * @returns {Array<Object>} 类型定义信息数组
 */
function collectTypeDefinitions(swaggerConfig) {
  const typeDefs = [];
  const processedTypes = new Set();

  if (!swaggerConfig.paths) {
    return typeDefs;
  }

  if (config.baseResponseType) {
    generateBaseResponseType(config.baseResponseType, typeDefs);
  }

  // 处理所有definitions，确保清理类型名称中的非法字符
  if (swaggerConfig.definitions) {
    Object.entries(swaggerConfig.definitions).forEach(
      ([defName, defSchema]) => {
        const cleanedDefName = cleanTypeName(defName);
        if (!processedTypes.has(cleanedDefName)) {
          generateTypeDefinition(
            defSchema,
            cleanedDefName,
            swaggerConfig,
            processedTypes,
            typeDefs
          );
        }
      }
    );
  }

  Object.entries(swaggerConfig.paths).forEach(([path, pathItem]) => {
    Object.entries(pathItem).forEach(([method, operation]) => {
      if (!["get", "post", "put", "delete", "patch"].includes(method)) {
        return;
      }

      const typeNames = {
        requestType: null,
        queryType: null,
        responseType: null,
      };

      if (operation.parameters) {
        operation.parameters.forEach((param) => {
          if (param.in === "body" && param.schema) {
            typeNames.requestType = generateTypeName(path, method, "Request");
            generateTypeDefinition(
              param.schema,
              typeNames.requestType,
              swaggerConfig,
              processedTypes,
              typeDefs
            );
          } else if (param.in === "query" && param.schema) {
            typeNames.queryType = generateTypeName(path, method, "Query");
            generateTypeDefinition(
              param.schema.schema || param.schema,
              typeNames.queryType,
              swaggerConfig,
              processedTypes,
              typeDefs
            );
          }
        });
      }

      if (operation.responses && operation.responses["200"]) {
        const response = operation.responses["200"];
        if (response.schema) {
          typeNames.responseType = generateTypeName(path, method, "Response");
          generateTypeDefinition(
            response.schema,
            typeNames.responseType,
            swaggerConfig,
            processedTypes,
            typeDefs
          );
        }
      }

      operation._typeNames = typeNames;
    });
  });

  return typeDefs;
}

/**
 * 生成TypeScript类型定义文件内容
 * @param {Array<string>} typeDefs - 类型定义字符串数组
 * @returns {string} 生成的类型定义文件内容
 */
function generateTypeDefinitionsFile(typeDefs) {
  let content = "/**\n";
  content += " * Auto-generated TypeScript type definitions from Swagger\n";
  content += " * Generated on: " + new Date().toISOString() + "\n";
  content += " */\n\n";

  typeDefs.forEach((typeDef) => {
    content += typeDef;
    content += "\n";
  });

  return content;
}

/**
 * 生成API文件内容
 * @param {Object} swaggerConfig - Swagger配置对象
 * @returns {string} 生成的API文件内容
 */
function generateApiFile(swaggerConfig) {
  let fileContent = "/**\n";
  fileContent += " * Auto-generated API methods from Swagger\n";
  fileContent += " * Generated on: " + new Date().toISOString() + "\n";
  fileContent += " */\n\n";

  fileContent += "/**\n";
  fileContent +=
    ' * @param {import("../../config/vue").CustomRequest} request\n';
  fileContent += " */\n";
  fileContent += "export default function generateApiMethods(request) {\n\n";

  if (swaggerConfig.paths) {
    Object.entries(swaggerConfig.paths).forEach(([path, pathItem]) => {
      Object.entries(pathItem).forEach(([method, operation]) => {
        if (!["get", "post", "put", "delete", "patch"].includes(method)) {
          return;
        }

        const typeNames = operation._typeNames || {};
        fileContent += generateApiMethod(operation, path, method, typeNames);
      });
    });
  }

  fileContent += "  return {\n";

  const methodNames = [];
  if (swaggerConfig.paths) {
    Object.entries(swaggerConfig.paths).forEach(([path, pathItem]) => {
      Object.entries(pathItem).forEach(([method, operation]) => {
        if (!["get", "post", "put", "delete", "patch"].includes(method)) {
          return;
        }
        methodNames.push(generateMethodName(path, method));
      });
    });
  }

  methodNames.forEach((methodName, index) => {
    const comma = index < methodNames.length - 1 ? "," : "";
    fileContent += `    ${methodName}${comma}\n`;
  });

  fileContent += "  };\n}\n";

  return fileContent;
}

/**
 * 检查并执行eslint fix
 * @param {string} filePath - 文件路径
 */
function runEslintFix(filePath) {
  try {
    const eslintConfigPath = path.join(process.cwd(), ".eslintrc");
    const eslintRcPath = path.join(process.cwd(), ".eslintrc.json");

    if (fs.existsSync(eslintConfigPath) || fs.existsSync(eslintRcPath)) {
      console.log(`Running eslint fix on ${filePath}...`);
      try {
        execSync(`npx eslint --fix "${filePath}"`, { stdio: "inherit" });
        console.log(`Successfully formatted ${filePath} with eslint`);
      } catch (error) {
        console.warn(
          `Warning: eslint fix failed for ${filePath}: ${error.message}`
        );
      }
    } else {
      console.log("No eslint configuration found, skipping eslint fix");
    }
  } catch (error) {
    console.warn(`Warning: Failed to run eslint fix: ${error.message}`);
  }
}

/**
 * 写入文件
 * @param {string} content - 文件内容
 * @param {string} outputPath - 输出文件路径
 * @returns {Promise<void>}
 */
async function writeFile(content, outputPath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(outputPath, content, (error) => {
      if (error) {
        reject(new Error(`Failed to write file: ${error.message}`));
      } else {
        resolve();
      }
    });
  });
}

/**
 * 主函数
 * @param {Object} options - 选项对象
 * @param {string} options.swaggerUrl - Swagger配置文件的URL
 * @param {string} options.outputPath - 输出文件路径（sdk.js）
 * @param {string} options.typesPath - 类型定义文件路径（type.d.ts）
 */
async function main(options) {
  try {
    console.log("Fetching Swagger configuration...");
    if (!options.swaggerUrl) {
      throw new Error("config swaggerUrl is required");
    }
    const swaggerConfig = await fetchSwaggerConfig(options.swaggerUrl);

    console.log("Collecting type definitions...");
    const typeDefs = collectTypeDefinitions(swaggerConfig);

    console.log("Generating TypeScript type definitions...");
    const typesContent = generateTypeDefinitionsFile(typeDefs);

    console.log("Writing type definitions file...");
    await writeFile(typesContent, options.typesPath);

    console.log("Generating API methods...");
    const apiContent = generateApiFile(swaggerConfig);

    console.log("Writing API file...");
    await writeFile(apiContent, options.outputPath);

    console.log(`Successfully generated API file at: ${options.outputPath}`);
    console.log(
      `Successfully generated type definitions at: ${options.typesPath}`
    );

    runEslintFix(options.outputPath);
  } catch (error) {
    console.error("Error generating files:", error.message);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const outputDir = args[1] || path.join(__dirname, "../src/api");
const options = {
  swaggerUrl: args[0] || config.swaggerUrl,
  outputPath: path.join(config.outputPath || outputDir, "sdk.gen.js"),
  typesPath: path.join(config.outputPath || outputDir, "type.d.ts"),
};

main(options);
