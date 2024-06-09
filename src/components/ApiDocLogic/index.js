import { capitalCase, sentenceCase, pascalCase, noCase } from "change-case";

const methodTask = {
  PUT: 'update',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete',
  GET: 'fetch',
}

export const parseUrl = (url) => {
  const urlObj = new URL(url, "http://localhost");
  const endpoint = urlObj.pathname;
  const pathParams = endpoint.match(/:\w+/g) || [];
  const queryParams = [...urlObj.searchParams.entries()];

  return { endpoint, pathParams, queryParams };
};

const canBeNumber = (value) => !isNaN(value);

const getTypePlaceholder = (value, isArray = false) => {
  if (Array.isArray(value) || isArray) {
    return `{${canBeNumber(value[0]) ? "Number" : "String"}[]}`;
  }
  return `{${canBeNumber(value) ? "Number" : "String"}}`;
};

function convertObjectToQueryStringWithTypes(params) {
  return Object.keys(params)
    .map((key) => {
      const value = params[key];
      if (Array.isArray(value)) {
        return `${key}[]=${getTypePlaceholder(value)}`;
      }
      return `${key}=${getTypePlaceholder(value)}`;
    })
    .join("&");
}

const getDocRoute = (method, url, queryParams, name) => {
  let docString = "";
  const parseUrl = new URL(url);
  const path = convertObjectToQueryStringWithTypes(queryParams[0]);

  docString = ` * @api {${method.toUpperCase()}} ${parseUrl.pathname}?${path} ${sentenceCase(name)}\n`;
  return docString;
};

const getApiName = (apiName) => {
  if (apiName) {
    return ` * @apiName ${apiName}\n`;
  }
  return "";
};

const getGroupName = (groupNmae) => {
  if (groupNmae) {
    return ` * @apiGroup ${groupNmae}\n`;
  }
  return "";
};

const getApiVersion = (apiVersion) => {
  if (apiVersion) {
    return ` * @apiVersion ${apiVersion}\n`;
  }
  return "";
}

const getDescription = (description) => {
  if (description) {
    return ` *\n * @apiDescription\n * ${description}\n`;
  }
  return "";
};

const getExamples = (method, url, queryParams) => {
  // let examples = "";
  const parseUrl = new URL(url);
  let combineParams = ''
  if (Object.keys(queryParams).length) {
    for (const key in queryParams) {
      combineParams += `&${key}=${queryParams[key]}`;
    }
  }
  return ` *\n * @apiExample Example usage:\n * ${method.toUpperCase()} ${parseUrl.pathname}?${combineParams}\n`
};

function generateApiParamsString(params) {
  const apiParamsString = Object.keys(params)
    .map((key) => {
      const value = params[key];
      return ` * @apiParam ${key.includes("[]")
        ? `${getTypePlaceholder(value, true)}`
        : getTypePlaceholder(value)
        } ${key.replace(/\[\]$/, "")}${Array.isArray(value) ? "[]" : ""} ${capitalCase(key)}`;
    })
    .join("\n");
  return ` *\n${apiParamsString}`;
}

const getBodyDoc = (body, oldkey) => {
  let bodyDoc = "";
  for (let key in body) {
    if (typeof body[key] === 'object') {
      bodyDoc += `\n * @apiBody {Object} ${key} Object for ${noCase(key)} data`
      bodyDoc += getBodyDoc(body[key], key);
    } else {
      bodyDoc += `\n * @apiBody ${getTypePlaceholder(body[key])} ${oldkey ? `${oldkey}.` : ''}${key} ${capitalCase(key)}`;
    }
  }
  return bodyDoc;
}

function generateApiSuccessExample(responseObject, isArray) {
  let exampleResponse = isArray ? "[{\n" : "{\n";
  const response = isArray ? responseObject[0] : responseObject;

  for (const [key, value] of Object.entries(response)) {
    exampleResponse += ` "${key}": {${capitalCase(key)}},\n`;
  }
  exampleResponse = `${exampleResponse.slice(0, -2)} ${isArray ? "\n}]" : "\n}"}`;
  // Remove the last comma and add the closing brace

  const jsDocComment = `
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 201 Created
 *    ${exampleResponse.split('\n').join('\n *    ')}`;

  return jsDocComment;
}

const getError = (method, groupName) => {
  return `\n *\n * @apiError No${pascalCase(groupName)} Unable to ${methodTask[method]} ${noCase(groupName)}`;
}

export const generateDocs = ({
  method,
  url,
  queryParams,
  body,
  formData: {
    name,
    version,
    groupName,
    description,
  },
}) => {

  if (!method || !url) {
    return null;
  }

  let docs = `/**\n`
  docs += getDocRoute(method, url, queryParams, name);
  docs += getApiName(name);
  docs += getApiVersion(version);
  docs += getGroupName(groupName);
  docs += getDescription(description);
  docs += getExamples(method, url, queryParams[0]);
  docs += generateApiParamsString(queryParams[0])
  docs += getBodyDoc(body);
  docs += generateApiSuccessExample(body, Array.isArray(body));
  docs += getError(method, groupName)
  docs += `\n */`;
  return docs;
};