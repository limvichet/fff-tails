import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { LRUCache } from 'lru-cache';
import { createGenerator } from '@unocss/core';
import presetWind from '@unocss/preset-wind3';
import { parse as parse$3 } from 'devalue';
import { createConsola, consola } from 'consola';
import { createUnhead } from 'unhead';
import { ZodError } from 'zod';
import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import { createHash } from 'node:crypto';
import { toValue, isRef, hasInjectionContext, inject, ref, watchEffect, getCurrentInstance, onBeforeUnmount, onDeactivated, onActivated } from 'vue';
import { fileURLToPath } from 'node:url';
import { createHead as createHead$1, propsToString } from 'unhead/server';
import { FlatMetaPlugin } from 'unhead/plugins';
import { walkResolver } from 'unhead/utils';
import { createRenderer } from 'vue-bundle-renderer/runtime';
import { renderToString } from 'vue/server-renderer';
import { getIcons } from '@iconify/utils';
import { ipxFSStorage, ipxHttpStorage, createIPX, createIPXH3Handler } from 'ipx';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode$2(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$2(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$2(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$2(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withoutLeadingSlash(input = "") {
  return (hasLeadingSlash(input) ? input.slice(1) : input) || "/";
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const nextChar = input[_base.length];
  if (nextChar && nextChar !== "/" && nextChar !== "?") {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}
function withHttps(input) {
  return withProtocol(input, "https://");
}
function withProtocol(input, protocol) {
  let match = input.match(PROTOCOL_REGEX);
  if (!match) {
    match = input.match(/^\/{2,}/);
  }
  if (!match) {
    return protocol + input;
  }
  return protocol + input.slice(match[0].length);
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

function parse$2(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = {};
  const dec = opt.decode || decode$1;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode$1(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode$1(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode$1(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$2(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o$1(n){throw new Error(`${n} is not implemented yet!`)}let i$2 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o$1("Readable.asyncIterator")}iterator(e){throw o$1("Readable.iterator")}map(e,t){throw o$1("Readable.map")}filter(e,t){throw o$1("Readable.filter")}forEach(e,t){throw o$1("Readable.forEach")}reduce(e,t,r){throw o$1("Readable.reduce")}find(e,t){throw o$1("Readable.find")}findIndex(e,t){throw o$1("Readable.findIndex")}some(e,t){throw o$1("Readable.some")}toArray(e){throw o$1("Readable.toArray")}every(e,t){throw o$1("Readable.every")}flatMap(e,t){throw o$1("Readable.flatMap")}drop(e,t){throw o$1("Readable.drop")}take(e,t){throw o$1("Readable.take")}asIndexedPairs(e){throw o$1("Readable.asIndexedPairs")}};let l$2 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c$2=class c{allowHalfOpen=true;_destroy;constructor(e=new i$2,t=new l$2){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _$1(){return Object.assign(c$2.prototype,i$2.prototype),Object.assign(c$2.prototype,l$2.prototype),c$2}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_$1();let A$1 = class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}};class y extends i$2{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A$1;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$2{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R$1(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S$1=new Set([101,204,205,304]);async function b$1(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R$1(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S$1.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C$1(n,e,t={}){try{const r=await b$1(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function useBase(base, handler) {
  base = withoutTrailingSlash(base);
  if (!base || base === "/") {
    return handler;
  }
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _path = event._path || event.node.req.url || "/";
    event._path = withoutBase(event.path || "/", base);
    event.node.req.url = event._path;
    try {
      return await handler(event);
    } finally {
      event._path = event.node.req.url = _path;
    }
  });
}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function parse$1(multipartBodyBuffer, boundary) {
  let lastline = "";
  let state = 0 /* INIT */;
  let buffer = [];
  const allParts = [];
  let currentPartHeaders = [];
  for (let i = 0; i < multipartBodyBuffer.length; i++) {
    const prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null;
    const currByte = multipartBodyBuffer[i];
    const newLineChar = currByte === 10 || currByte === 13;
    if (!newLineChar) {
      lastline += String.fromCodePoint(currByte);
    }
    const newLineDetected = currByte === 10 && prevByte === 13;
    if (0 /* INIT */ === state && newLineDetected) {
      if ("--" + boundary === lastline) {
        state = 1 /* READING_HEADERS */;
      }
      lastline = "";
    } else if (1 /* READING_HEADERS */ === state && newLineDetected) {
      if (lastline.length > 0) {
        const i2 = lastline.indexOf(":");
        if (i2 > 0) {
          const name = lastline.slice(0, i2).toLowerCase();
          const value = lastline.slice(i2 + 1).trim();
          currentPartHeaders.push([name, value]);
        }
      } else {
        state = 2 /* READING_DATA */;
        buffer = [];
      }
      lastline = "";
    } else if (2 /* READING_DATA */ === state) {
      if (lastline.length > boundary.length + 4) {
        lastline = "";
      }
      if ("--" + boundary === lastline) {
        const j = buffer.length - lastline.length;
        const part = buffer.slice(0, j - 1);
        allParts.push(process$1(part, currentPartHeaders));
        buffer = [];
        currentPartHeaders = [];
        lastline = "";
        state = 3 /* READING_PART_SEPARATOR */;
      } else {
        buffer.push(currByte);
      }
      if (newLineDetected) {
        lastline = "";
      }
    } else if (3 /* READING_PART_SEPARATOR */ === state && newLineDetected) {
      state = 1 /* READING_HEADERS */;
    }
  }
  return allParts;
}
function process$1(data, headers) {
  const dataObj = {};
  const contentDispositionHeader = headers.find((h) => h[0] === "content-disposition")?.[1] || "";
  for (const i of contentDispositionHeader.split(";")) {
    const s = i.split("=");
    if (s.length !== 2) {
      continue;
    }
    const key = (s[0] || "").trim();
    if (key === "name" || key === "filename") {
      const _value = (s[1] || "").trim().replace(/"/g, "");
      dataObj[key] = Buffer.from(_value, "latin1").toString("utf8");
    }
  }
  const contentType = headers.find((h) => h[0] === "content-type")?.[1] || "";
  if (contentType) {
    dataObj.type = contentType;
  }
  dataObj.data = Buffer.from(data);
  return dataObj;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = decode$2(params[key]);
    }
  }
  return params;
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !/\bchunked\b/i.test(
    String(event.node.req.headers["transfer-encoding"] ?? "")
  )) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
async function readMultipartFormData(event) {
  const contentType = getRequestHeader(event, "content-type");
  if (!contentType || !contentType.startsWith("multipart/form-data")) {
    return;
  }
  const boundary = contentType.match(/boundary=([^;]*)(;|$)/i)?.[1];
  if (!boundary) {
    return;
  }
  const body = await readRawBody(event, false);
  if (!body) {
    return;
  }
  return parse$1(body, boundary);
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return void 0;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse$2(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$2(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i$1=globalThis.AbortController,l$1=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l$1;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l$1(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch$1 = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController = globalThis.AbortController || i$1;
const ofetch = createFetch({ fetch: fetch$1, Headers: Headers$1, AbortController });
const $fetch$1 = ofetch;

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive$1(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive$1(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$2 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$2,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {
  ["nuxt-og-image:fonts:Inter-normal-400.ttf.base64"]: {
    import: () => import('../raw/Inter-normal-400.ttf.mjs').then(r => r.default || r),
    meta: {"type":"text/plain; charset=utf-8","etag":"\"652cc-qEeSD1DXCSV8gPP2rnBA6ePGdZ4\"","mtime":"2026-04-23T01:48:38.687Z"}
  },
  ["nuxt-og-image:fonts:Inter-normal-700.ttf.base64"]: {
    import: () => import('../raw/Inter-normal-700.ttf.mjs').then(r => r.default || r),
    meta: {"type":"text/plain; charset=utf-8","etag":"\"674f0-FZReUXHhPTnY0HmYVn2iPpKm9ds\"","mtime":"2026-04-23T01:48:38.687Z"}
  }
};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME$1 = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME$1, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME$1,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME$1,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function serialize$1(o){return typeof o=="string"?`'${o}'`:new c$1().serialize(o)}const c$1=/*@__PURE__*/function(){class o{#t=new Map;compare(t,r){const e=typeof t,n=typeof r;return e==="string"&&n==="string"?t.localeCompare(r):e==="number"&&n==="number"?t-r:String.prototype.localeCompare.call(this.serialize(t,true),this.serialize(r,true))}serialize(t,r){if(t===null)return "null";switch(typeof t){case "string":return r?t:`'${t}'`;case "bigint":return `${t}n`;case "object":return this.$object(t);case "function":return this.$function(t)}return String(t)}serializeObject(t){const r=Object.prototype.toString.call(t);if(r!=="[object Object]")return this.serializeBuiltInType(r.length<10?`unknown:${r}`:r.slice(8,-1),t);const e=t.constructor,n=e===Object||e===void 0?"":e.name;if(n!==""&&globalThis[n]===e)return this.serializeBuiltInType(n,t);if(typeof t.toJSON=="function"){const i=t.toJSON();return n+(i!==null&&typeof i=="object"?this.$object(i):`(${this.serialize(i)})`)}return this.serializeObjectEntries(n,Object.entries(t))}serializeBuiltInType(t,r){const e=this["$"+t];if(e)return e.call(this,r);if(typeof r?.entries=="function")return this.serializeObjectEntries(t,r.entries());throw new Error(`Cannot serialize ${t}`)}serializeObjectEntries(t,r){const e=Array.from(r).sort((i,a)=>this.compare(i[0],a[0]));let n=`${t}{`;for(let i=0;i<e.length;i++){const[a,l]=e[i];n+=`${this.serialize(a,true)}:${this.serialize(l)}`,i<e.length-1&&(n+=",");}return n+"}"}$object(t){let r=this.#t.get(t);return r===void 0&&(this.#t.set(t,`#${this.#t.size}`),r=this.serializeObject(t),this.#t.set(t,r)),r}$function(t){const r=Function.prototype.toString.call(t);return r.slice(-15)==="[native code] }"?`${t.name||""}()[native]`:`${t.name}(${t.length})${r.replace(/\s*\n\s*/g,"")}`}$Array(t){let r="[";for(let e=0;e<t.length;e++)r+=this.serialize(t[e]),e<t.length-1&&(r+=",");return r+"]"}$Date(t){try{return `Date(${t.toISOString()})`}catch{return "Date(null)"}}$ArrayBuffer(t){return `ArrayBuffer[${new Uint8Array(t).join(",")}]`}$Set(t){return `Set${this.$Array(Array.from(t).sort((r,e)=>this.compare(r,e)))}`}$Map(t){return this.serializeObjectEntries("Map",t.entries())}}for(const s of ["Error","RegExp","URL"])o.prototype["$"+s]=function(t){return `${s}(${t})`};for(const s of ["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join(",")}]`};for(const s of ["BigInt64Array","BigUint64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join("n,")}${t.length>0?"n":""}]`};return o}();

function isEqual(object1, object2) {
  if (object1 === object2) {
    return true;
  }
  if (serialize$1(object1) === serialize$1(object2)) {
    return true;
  }
  return false;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r$1="sha256",s="base64url";function digest(t){if(e)return e(r$1,t,s);const o=createHash(r$1).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

function hash$1(input) {
  return digest(serialize$1(input));
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {},
  "icon": {
    "provider": "server",
    "class": "",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "localApiEndpoint": "/api/_nuxt_icon",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "mode": "css",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "catppuccin",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codex",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "cuida",
      "dashicons",
      "devicon",
      "devicon-plain",
      "dinkie-icons",
      "duo-icons",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fa7-brands",
      "fa7-regular",
      "fa7-solid",
      "fad",
      "famicons",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-color",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "garden",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "hugeicons",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "ix",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "lineicons",
      "logos",
      "ls",
      "lsicon",
      "lucide",
      "lucide-lab",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-icon-theme",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "meteor-icons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "nrk",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "picon",
      "pixel",
      "pixelarticons",
      "prime",
      "proicons",
      "ps",
      "qlementine-icons",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "rivet-icons",
      "roentgen",
      "si",
      "si-glyph",
      "sidekickicons",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "stash",
      "streamline",
      "streamline-block",
      "streamline-color",
      "streamline-cyber",
      "streamline-cyber-color",
      "streamline-emojis",
      "streamline-flex",
      "streamline-flex-color",
      "streamline-freehand",
      "streamline-freehand-color",
      "streamline-kameleon-color",
      "streamline-logos",
      "streamline-pixel",
      "streamline-plump",
      "streamline-plump-color",
      "streamline-sharp",
      "streamline-sharp-color",
      "streamline-stickies-color",
      "streamline-ultimate",
      "streamline-ultimate-color",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "temaki",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "weui",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons"
    ],
    "fetchTimeout": 1500
  }
};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "92bec4ae-b7e2-47eb-a90d-e5e7727a0444",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/signin": {
        "redirect": {
          "to": "/app/signin",
          "statusCode": 307
        }
      },
      "/signup": {
        "redirect": {
          "to": "/app/signup",
          "statusCode": 307
        }
      },
      "/dashboard": {
        "redirect": {
          "to": "/app/dashboard",
          "statusCode": 307
        }
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      },
      "/_fonts/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "siteUrl": "https://chhoukroit.pages.dev"
  },
  "apiBaseUrl": "https://apiloan.cdcf.info",
  "icon": {
    "serverKnownCssClasses": []
  },
  "nuxt-site-config": {
    "stack": [
      {
        "_context": "system",
        "_priority": -15,
        "name": "fff-tails",
        "env": "production"
      },
      {
        "_context": "package.json",
        "_priority": -10,
        "name": "fff-tails"
      },
      {
        "_context": "buildEnv",
        "_priority": -1,
        "url": "https://chhoukroit.pages.dev"
      }
    ],
    "version": "3.2.18",
    "debug": false,
    "multiTenancy": []
  },
  "nuxt-og-image": {
    "version": "5.1.13",
    "satoriOptions": {},
    "resvgOptions": {},
    "sharpOptions": {},
    "publicStoragePath": "root:public",
    "defaults": {
      "emojis": "noto",
      "renderer": "satori",
      "component": "NuxtSeo",
      "extension": "png",
      "width": 1200,
      "height": 600,
      "cacheMaxAgeSeconds": 259200
    },
    "debug": false,
    "baseCacheKey": "/cache/nuxt-og-image/5.1.13",
    "fonts": [
      {
        "cacheKey": "Inter:undefined:400",
        "style": "normal",
        "weight": 400,
        "name": "Inter",
        "key": "nuxt-og-image:fonts:Inter-normal-400.ttf.base64"
      },
      {
        "cacheKey": "Inter:undefined:700",
        "style": "normal",
        "weight": 700,
        "name": "Inter",
        "key": "nuxt-og-image:fonts:Inter-normal-700.ttf.base64"
      }
    ],
    "hasNuxtIcon": true,
    "colorPreference": "light",
    "strictNuxtContentPaths": "",
    "isNuxtContentDocumentDriven": false
  },
  "ipx": {
    "baseURL": "/_ipx",
    "alias": {},
    "fs": {
      "dir": "../public"
    },
    "http": {
      "domains": []
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
const _sharedAppConfig = _deepFreeze(klona(appConfig));
function useAppConfig(event) {
  {
    return _sharedAppConfig;
  }
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
  errorObject.message ||= "Server Error";
  errorObject.data ||= error.data;
  errorObject.statusMessage ||= error.statusMessage;
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await import('../_/error-500.mjs');
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    if (header === "set-cookie") {
      appendResponseHeader(event, header, value);
      continue;
    }
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
const unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
const reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
const escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
const objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  const counts = /* @__PURE__ */ new Map();
  let logNum = 0;
  function log(message) {
    if (logNum < 100) {
      console.warn(message);
      logNum += 1;
    }
  }
  function walk(thing) {
    if (typeof thing === "function") {
      log(`Cannot stringify a function ${thing.name}`);
      return;
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      const type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          const proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            if (typeof thing.toJSON !== "function") {
              log(`Cannot stringify arbitrary non-POJOs ${thing.constructor.name}`);
            }
          } else if (Object.getOwnPropertySymbols(thing).length > 0) {
            log(`Cannot stringify POJOs with symbolic keys ${Object.getOwnPropertySymbols(thing).map((symbol) => symbol.toString())}`);
          } else {
            Object.keys(thing).forEach((key) => walk(thing[key]));
          }
      }
    }
  }
  walk(value);
  const names = /* @__PURE__ */ new Map();
  Array.from(counts).filter((entry) => entry[1] > 1).sort((a, b) => b[1] - a[1]).forEach((entry, i) => {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    const type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return `Object(${stringify(thing.valueOf())})`;
      case "RegExp":
        return thing.toString();
      case "Date":
        return `new Date(${thing.getTime()})`;
      case "Array":
        const members = thing.map((v, i) => i in thing ? stringify(v) : "");
        const tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return `[${members.join(",")}${tail}]`;
      case "Set":
      case "Map":
        return `new ${type}([${Array.from(thing).map(stringify).join(",")}])`;
      default:
        if (thing.toJSON) {
          let json = thing.toJSON();
          if (getType(json) === "String") {
            try {
              json = JSON.parse(json);
            } catch (e) {
            }
          }
          return stringify(json);
        }
        if (Object.getPrototypeOf(thing) === null) {
          if (Object.keys(thing).length === 0) {
            return "Object.create(null)";
          }
          return `Object.create(null,{${Object.keys(thing).map((key) => `${safeKey(key)}:{writable:true,enumerable:true,value:${stringify(thing[key])}}`).join(",")}})`;
        }
        return `{${Object.keys(thing).map((key) => `${safeKey(key)}:${stringify(thing[key])}`).join(",")}}`;
    }
  }
  const str = stringify(value);
  if (names.size) {
    const params = [];
    const statements = [];
    const values = [];
    names.forEach((name, thing) => {
      params.push(name);
      if (isPrimitive(thing)) {
        values.push(stringifyPrimitive(thing));
        return;
      }
      const type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values.push(`Object(${stringify(thing.valueOf())})`);
          break;
        case "RegExp":
          values.push(thing.toString());
          break;
        case "Date":
          values.push(`new Date(${thing.getTime()})`);
          break;
        case "Array":
          values.push(`Array(${thing.length})`);
          thing.forEach((v, i) => {
            statements.push(`${name}[${i}]=${stringify(v)}`);
          });
          break;
        case "Set":
          values.push("new Set");
          statements.push(`${name}.${Array.from(thing).map((v) => `add(${stringify(v)})`).join(".")}`);
          break;
        case "Map":
          values.push("new Map");
          statements.push(`${name}.${Array.from(thing).map(([k, v]) => `set(${stringify(k)}, ${stringify(v)})`).join(".")}`);
          break;
        default:
          values.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach((key) => {
            statements.push(`${name}${safeProp(key)}=${stringify(thing[key])}`);
          });
      }
    });
    statements.push(`return ${str}`);
    return `(function(${params.join(",")}){${statements.join(";")}}(${values.join(",")}))`;
  } else {
    return str;
  }
}
function getName(num) {
  let name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? `${name}0` : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string") {
    return stringifyString(thing);
  }
  if (thing === void 0) {
    return "void 0";
  }
  if (thing === 0 && 1 / thing < 0) {
    return "-0";
  }
  const str = String(thing);
  if (typeof thing === "number") {
    return str.replace(/^(-)?0\./, "$1.");
  }
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? `.${key}` : `[${escapeUnsafeChars(JSON.stringify(key))}]`;
}
function stringifyString(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}

function normalizeSiteConfig(config) {
  if (typeof config.indexable !== "undefined")
    config.indexable = String(config.indexable) !== "false";
  if (typeof config.trailingSlash !== "undefined" && !config.trailingSlash)
    config.trailingSlash = String(config.trailingSlash) !== "false";
  if (config.url && !hasProtocol(String(config.url), { acceptRelative: true, strict: false }))
    config.url = withHttps(String(config.url));
  const keys = Object.keys(config).sort((a, b) => a.localeCompare(b));
  const newConfig = {};
  for (const k of keys)
    newConfig[k] = config[k];
  return newConfig;
}
function createSiteConfigStack(options) {
  const debug = options?.debug || false;
  const stack = [];
  function push(input) {
    if (!input || typeof input !== "object" || Object.keys(input).length === 0) {
      return () => {
      };
    }
    if (!input._context && debug) {
      let lastFunctionName = new Error("tmp").stack?.split("\n")[2]?.split(" ")[5];
      if (lastFunctionName?.includes("/"))
        lastFunctionName = "anonymous";
      input._context = lastFunctionName;
    }
    const entry = {};
    for (const k in input) {
      const val = input[k];
      if (typeof val !== "undefined" && val !== "")
        entry[k] = val;
    }
    if (Object.keys(entry).filter((k) => !k.startsWith("_")).length === 0) {
      return () => {
      };
    }
    stack.push(entry);
    return () => {
      const idx = stack.indexOf(entry);
      if (idx !== -1)
        stack.splice(idx, 1);
    };
  }
  function get(options2) {
    const siteConfig = {};
    if (options2?.debug)
      siteConfig._context = {};
    siteConfig._priority = {};
    for (const o in stack.sort((a, b) => (a._priority || 0) - (b._priority || 0))) {
      for (const k in stack[o]) {
        const key = k;
        const val = options2?.resolveRefs ? toValue(stack[o][k]) : stack[o][k];
        if (!k.startsWith("_") && typeof val !== "undefined" && val !== "") {
          siteConfig[k] = val;
          if (typeof stack[o]._priority !== "undefined" && stack[o]._priority !== -1) {
            siteConfig._priority[key] = stack[o]._priority;
          }
          if (options2?.debug)
            siteConfig._context[key] = stack[o]._context?.[key] || stack[o]._context || "anonymous";
        }
      }
    }
    return options2?.skipNormalize ? siteConfig : normalizeSiteConfig(siteConfig);
  }
  return {
    stack,
    push,
    get
  };
}

function envSiteConfig(env) {
  return Object.fromEntries(Object.entries(env).filter(([k]) => k.startsWith("NUXT_SITE_") || k.startsWith("NUXT_PUBLIC_SITE_")).map(([k, v]) => [
    k.replace(/^NUXT_(PUBLIC_)?SITE_/, "").split("_").map((s, i) => i === 0 ? s.toLowerCase() : s[0]?.toUpperCase() + s.slice(1).toLowerCase()).join(""),
    v
  ]));
}

function getSiteConfig(e, _options) {
  e.context.siteConfig = e.context.siteConfig || createSiteConfigStack();
  const options = defu(_options, useRuntimeConfig(e)["nuxt-site-config"], { debug: false });
  return e.context.siteConfig.get(options);
}

const _S4JVxQYs2ym7je0v0VUjV5DBDrlEWlv__7nssgb0fs = defineNitroPlugin(async (nitroApp) => {
  nitroApp.hooks.hook("render:html", async (ctx, { event }) => {
    const routeOptions = getRouteRules(event);
    const isIsland = process.env.NUXT_COMPONENT_ISLANDS && event.path.startsWith("/__nuxt_island");
    event.path;
    const noSSR = event.context.nuxt?.noSSR || routeOptions.ssr === false && !isIsland || (false);
    if (noSSR) {
      const siteConfig = Object.fromEntries(
        Object.entries(getSiteConfig(event)).map(([k, v]) => [k, toValue(v)])
      );
      ctx.body.push(`<script>window.__NUXT_SITE_CONFIG__=${devalue(siteConfig)}<\/script>`);
    }
  });
});

const DRIVER_NAME = "lru-cache";
const lruCacheDriver = defineDriver((opts = {}) => {
  const cache = new LRUCache({
    max: 1e3,
    sizeCalculation: opts.maxSize || opts.maxEntrySize ? (value, key) => {
      return key.length + byteLength(value);
    } : void 0,
    ...opts
  });
  return {
    name: DRIVER_NAME,
    options: opts,
    getInstance: () => cache,
    hasItem(key) {
      return cache.has(key);
    },
    getItem(key) {
      return cache.get(key) ?? null;
    },
    getItemRaw(key) {
      return cache.get(key) ?? null;
    },
    setItem(key, value) {
      cache.set(key, value);
    },
    setItemRaw(key, value) {
      cache.set(key, value);
    },
    removeItem(key) {
      cache.delete(key);
    },
    getKeys() {
      return [...cache.keys()];
    },
    clear() {
      cache.clear();
    },
    dispose() {
      cache.clear();
    }
  };
});
function byteLength(value) {
  if (typeof Buffer !== "undefined") {
    try {
      return Buffer.byteLength(value);
    } catch {
    }
  }
  try {
    return typeof value === "string" ? value.length : JSON.stringify(value).length;
  } catch {
  }
  return 0;
}

const htmlPayloadCache = createStorage({
  // short cache time so we don't need many entries at runtime
  driver: lruCacheDriver({ max: 50 })
});
const fontCache = createStorage({
  driver: lruCacheDriver({ max: 10 })
});
const emojiCache = createStorage({
  driver: lruCacheDriver({ max: 1e3 })
});

function resolveSitePath(pathOrUrl, options) {
  let path = pathOrUrl;
  if (hasProtocol(pathOrUrl, { strict: false, acceptRelative: true })) {
    const parsed = parseURL(pathOrUrl);
    path = parsed.pathname;
  }
  const base = withLeadingSlash(options.base || "/");
  if (base !== "/" && path.startsWith(base)) {
    path = path.slice(base.length);
  }
  let origin = withoutTrailingSlash(options.absolute ? options.siteUrl : "");
  if (base !== "/" && origin.endsWith(base)) {
    origin = origin.slice(0, origin.indexOf(base));
  }
  const baseWithOrigin = options.withBase ? withBase(base, origin || "/") : origin;
  const resolvedUrl = withBase(path, baseWithOrigin);
  return path === "/" && !options.withBase ? withTrailingSlash(resolvedUrl) : fixSlashes(options.trailingSlash, resolvedUrl);
}
const fileExtensions = [
  // Images
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "svg",
  "ico",
  // Documents
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "md",
  "markdown",
  // Archives
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  // Audio
  "mp3",
  "wav",
  "flac",
  "ogg",
  "opus",
  "m4a",
  "aac",
  "midi",
  "mid",
  // Video
  "mp4",
  "avi",
  "mkv",
  "mov",
  "wmv",
  "flv",
  "webm",
  // Web
  "html",
  "css",
  "js",
  "json",
  "xml",
  "tsx",
  "jsx",
  "ts",
  "vue",
  "svelte",
  "xsl",
  "rss",
  "atom",
  // Programming
  "php",
  "py",
  "rb",
  "java",
  "c",
  "cpp",
  "h",
  "go",
  // Data formats
  "csv",
  "tsv",
  "sql",
  "yaml",
  "yml",
  // Fonts
  "woff",
  "woff2",
  "ttf",
  "otf",
  "eot",
  // Executables/Binaries
  "exe",
  "msi",
  "apk",
  "ipa",
  "dmg",
  "iso",
  "bin",
  // Scripts/Config
  "bat",
  "cmd",
  "sh",
  "env",
  "htaccess",
  "conf",
  "toml",
  "ini",
  // Package formats
  "deb",
  "rpm",
  "jar",
  "war",
  // E-books
  "epub",
  "mobi",
  // Common temporary/backup files
  "log",
  "tmp",
  "bak",
  "old",
  "sav"
];
function isPathFile(path) {
  const lastSegment = path.split("/").pop();
  const ext = (lastSegment || path).match(/\.[0-9a-z]+$/i)?.[0];
  return ext && fileExtensions.includes(ext.replace(".", ""));
}
function fixSlashes(trailingSlash, pathOrUrl) {
  const $url = parseURL(pathOrUrl);
  if (isPathFile($url.pathname))
    return pathOrUrl;
  const fixedPath = trailingSlash ? withTrailingSlash($url.pathname) : withoutTrailingSlash($url.pathname);
  return `${$url.protocol ? `${$url.protocol}//` : ""}${$url.host || ""}${fixedPath}${$url.search || ""}${$url.hash || ""}`;
}

const r=Object.create(null),i=e=>globalThis.process?.env||globalThis._importMeta_.env||globalThis.Deno?.env.toObject()||globalThis.__env__||(e?r:globalThis),o=new Proxy(r,{get(e,s){return i()[s]??r[s]},has(e,s){const E=i();return s in E||s in r},set(e,s,E){const B=i(true);return B[s]=E,true},deleteProperty(e,s){if(!s)return  false;const E=i(true);return delete E[s],true},ownKeys(){const e=i(true);return Object.keys(e)}}),t=typeof process<"u"&&process.env&&"production"||"",f=[["APPVEYOR"],["AWS_AMPLIFY","AWS_APP_ID",{ci:true}],["AZURE_PIPELINES","SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"],["AZURE_STATIC","INPUT_AZURE_STATIC_WEB_APPS_API_TOKEN"],["APPCIRCLE","AC_APPCIRCLE"],["BAMBOO","bamboo_planKey"],["BITBUCKET","BITBUCKET_COMMIT"],["BITRISE","BITRISE_IO"],["BUDDY","BUDDY_WORKSPACE_ID"],["BUILDKITE"],["CIRCLE","CIRCLECI"],["CIRRUS","CIRRUS_CI"],["CLOUDFLARE_PAGES","CF_PAGES",{ci:true}],["CLOUDFLARE_WORKERS","WORKERS_CI",{ci:true}],["CODEBUILD","CODEBUILD_BUILD_ARN"],["CODEFRESH","CF_BUILD_ID"],["DRONE"],["DRONE","DRONE_BUILD_EVENT"],["DSARI"],["GITHUB_ACTIONS"],["GITLAB","GITLAB_CI"],["GITLAB","CI_MERGE_REQUEST_ID"],["GOCD","GO_PIPELINE_LABEL"],["LAYERCI"],["HUDSON","HUDSON_URL"],["JENKINS","JENKINS_URL"],["MAGNUM"],["NETLIFY"],["NETLIFY","NETLIFY_LOCAL",{ci:false}],["NEVERCODE"],["RENDER"],["SAIL","SAILCI"],["SEMAPHORE"],["SCREWDRIVER"],["SHIPPABLE"],["SOLANO","TDDIUM"],["STRIDER"],["TEAMCITY","TEAMCITY_VERSION"],["TRAVIS"],["VERCEL","NOW_BUILDER"],["VERCEL","VERCEL",{ci:false}],["VERCEL","VERCEL_ENV",{ci:false}],["APPCENTER","APPCENTER_BUILD_ID"],["CODESANDBOX","CODESANDBOX_SSE",{ci:false}],["CODESANDBOX","CODESANDBOX_HOST",{ci:false}],["STACKBLITZ"],["STORMKIT"],["CLEAVR"],["ZEABUR"],["CODESPHERE","CODESPHERE_APP_ID",{ci:true}],["RAILWAY","RAILWAY_PROJECT_ID"],["RAILWAY","RAILWAY_SERVICE_ID"],["DENO-DEPLOY","DENO_DEPLOYMENT_ID"],["FIREBASE_APP_HOSTING","FIREBASE_APP_HOSTING",{ci:true}]];function b(){if(globalThis.process?.env)for(const e of f){const s=e[1]||e[0];if(globalThis.process?.env[s])return {name:e[0].toLowerCase(),...e[2]}}return globalThis.process?.env?.SHELL==="/bin/jsh"&&globalThis.process?.versions?.webcontainer?{name:"stackblitz",ci:false}:{name:"",ci:false}}const l=b();l.name;function n(e){return e?e!=="false":false}const I=globalThis.process?.platform||"",T=n(o.CI)||l.ci!==false,R=n(globalThis.process?.stdout&&globalThis.process?.stdout.isTTY);n(o.DEBUG);const a=t==="test"||n(o.TEST),h=t==="dev"||t==="development";n(o.MINIMAL)||T||a||!R;const A=/^win/i.test(I);!n(o.NO_COLOR)&&(n(o.FORCE_COLOR)||(R||A)&&o.TERM!=="dumb"||T);const C=(globalThis.process?.versions?.node||"").replace(/^v/,"")||null;Number(C?.split(".")[0])||null;const W=globalThis.process||Object.create(null),_={versions:{}};new Proxy(W,{get(e,s){if(s==="env")return o;if(s in e)return e[s];if(s in _)return _[s]}});const O=globalThis.process?.release?.name==="node",c=!!globalThis.Bun||!!globalThis.process?.versions?.bun,D=!!globalThis.Deno,L=!!globalThis.fastly,S=!!globalThis.Netlify,u=!!globalThis.EdgeRuntime,N=globalThis.navigator?.userAgent==="Cloudflare-Workers",F=[[S,"netlify"],[u,"edge-light"],[N,"workerd"],[L,"fastly"],[D,"deno"],[c,"bun"],[O,"node"]];function G(){const e=F.find(s=>s[0]);if(e)return {name:e[1]}}const P=G();P?.name||"";

function getNitroOrigin$1(ctx = {}) {
  const isDev = ctx.isDev ?? h;
  const isPrerender = ctx.isPrerender ?? !!o.prerender;
  let host = "";
  let port = "";
  let protocol = o.NITRO_SSL_CERT && o.NITRO_SSL_KEY ? "https" : "http";
  if (isDev || isPrerender) {
    const devEnv = o.__NUXT_DEV__ || o.NUXT_VITE_NODE_OPTIONS;
    if (devEnv) {
      const parsed = JSON.parse(devEnv);
      const origin = parsed.proxy?.url || parsed.baseURL?.replace("/__nuxt_vite_node__", "");
      host = origin.replace(/^https?:\/\//, "").replace(/\/$/, "");
      protocol = origin.startsWith("https") ? "https" : "http";
    }
  }
  const hostIsLocalhost = !host || host.startsWith("localhost") || host.startsWith("127.");
  if (isDev && hostIsLocalhost && ctx.requestHost) {
    const reqHost = ctx.requestHost.split(":")[0] || "";
    if (reqHost && !reqHost.startsWith("localhost") && !reqHost.startsWith("127.")) {
      host = ctx.requestHost;
      protocol = ctx.requestProtocol || protocol;
    }
  }
  if (!host && ctx.requestHost) {
    host = ctx.requestHost;
    protocol = ctx.requestProtocol || protocol;
  }
  if (!host) {
    host = o.NITRO_HOST || o.HOST || "";
    if (isDev)
      port = o.NITRO_PORT || o.PORT || "3000";
  }
  if (host.includes(":")) {
    const i = host.lastIndexOf(":");
    port = host.slice(i + 1);
    host = host.slice(0, i);
  }
  host = o.NUXT_SITE_HOST_OVERRIDE || host;
  port = o.NUXT_SITE_PORT_OVERRIDE || port;
  if (host.startsWith("http://") || host.startsWith("https://")) {
    protocol = host.startsWith("https://") ? "https" : "http";
    host = host.replace(/^https?:\/\//, "");
  } else if (!host.includes("localhost") && !host.startsWith("127.")) {
    protocol = "https";
  }
  return `${protocol}://${host}${port ? `:${port}` : ""}/`;
}

function getNitroOrigin(e) {
  return getNitroOrigin$1({
    isDev: false,
    isPrerender: false,
    requestHost: e ? getRequestHost(e, { xForwardedHost: true }) : void 0,
    requestProtocol: e ? getRequestProtocol(e, { xForwardedProto: true }) : void 0
  });
}

function createSitePathResolver(e, options = {}) {
  const siteConfig = getSiteConfig(e);
  const nitroOrigin = getNitroOrigin(e);
  const nuxtBase = useRuntimeConfig(e).app.baseURL || "/";
  return (path) => {
    return resolveSitePath(path, {
      ...options,
      siteUrl: options.canonical !== false || false ? siteConfig.url : nitroOrigin,
      trailingSlash: siteConfig.trailingSlash,
      base: nuxtBase
    });
  };
}

function detectBase64MimeType(data) {
  const signatures = {
    "R0lGODdh": "image/gif",
    "R0lGODlh": "image/gif",
    "iVBORw0KGgo": "image/png",
    "/9j/": "image/jpeg",
    "UklGR": "image/webp",
    "AAABAA": "image/x-icon"
  };
  for (const s in signatures) {
    if (data.startsWith(s)) {
      return signatures[s];
    }
  }
  return "image/svg+xml";
}
function toBase64Image(data) {
  const base64 = typeof data === "string" ? data : Buffer.from(data).toString("base64");
  const type = detectBase64MimeType(base64);
  return `data:${type};base64,${base64}`;
}
function filterIsOgImageOption(key) {
  const keys = [
    "url",
    "extension",
    "width",
    "height",
    "fonts",
    "alt",
    "props",
    "renderer",
    "html",
    "component",
    "renderer",
    "emojis",
    "_query",
    "satori",
    "resvg",
    "sharp",
    "screenshot",
    "cacheMaxAgeSeconds"
  ];
  return keys.includes(key);
}
function separateProps(options, ignoreKeys = []) {
  options = options || {};
  const _props = defu(options.props, Object.fromEntries(
    Object.entries({ ...options }).filter(([k]) => !filterIsOgImageOption(k) && !ignoreKeys.includes(k))
  ));
  const props = {};
  Object.entries(_props).forEach(([key, val]) => {
    props[key.replace(/-([a-z])/g, (g) => String(g[1]).toUpperCase())] = val;
  });
  return {
    ...Object.fromEntries(
      Object.entries({ ...options }).filter(([k]) => filterIsOgImageOption(k) || ignoreKeys.includes(k))
    ),
    props
  };
}
function normaliseFontInput(fonts) {
  return fonts.map((f) => {
    if (typeof f === "string") {
      const vals = f.split(":");
      const includesStyle = vals.length === 3;
      let name, weight, style;
      if (includesStyle) {
        name = vals[0];
        style = vals[1];
        weight = vals[2];
      } else {
        name = vals[0];
        weight = vals[1];
      }
      return {
        cacheKey: f,
        name,
        weight: weight || 400,
        style: style || "normal",
        path: void 0
      };
    }
    return {
      cacheKey: f.key || `${f.name}:${f.style}:${f.weight}`,
      style: "normal",
      weight: 400,
      ...f
    };
  });
}

const theme = {};

function useSiteConfig(e, _options) {
  return getSiteConfig(e, _options);
}

function htmlDecodeQuotes(html) {
  return html.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'");
}
function decodeHtml(html) {
  return html.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&cent;/g, "\xA2").replace(/&pound;/g, "\xA3").replace(/&yen;/g, "\xA5").replace(/&euro;/g, "\u20AC").replace(/&copy;/g, "\xA9").replace(/&reg;/g, "\xAE").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&#x2F;/g, "/").replace(/&#(\d+);/g, (full, int) => {
    return String.fromCharCode(Number.parseInt(int));
  }).replace(/&amp;/g, "&");
}
function decodeObjectHtmlEntities(obj) {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "string")
      obj[key] = decodeHtml(value);
  });
  return obj;
}

function fetchIsland(e, component, props) {
  const hashId = hash$1([component, props]).replaceAll("_", "-");
  return e.$fetch(`/__nuxt_island/${component}_${hashId}.json`, {
    params: {
      props: JSON.stringify(props)
    }
  });
}
function withoutQuery(path) {
  return path.split("?")[0];
}
function createNitroRouteRuleMatcher() {
  const { nitro, app } = useRuntimeConfig();
  const _routeRulesMatcher = toRouteMatcher(
    createRouter$1({
      routes: Object.fromEntries(
        Object.entries(nitro?.routeRules || {}).map(([path, rules]) => [withoutTrailingSlash(path), rules])
      )
    })
  );
  return (path) => {
    return defu({}, ..._routeRulesMatcher.matchAll(
      // radix3 does not support trailing slashes
      withoutBase(withoutTrailingSlash(withoutQuery(path)), app.baseURL)
    ).reverse());
  };
}

const logger = createConsola({
  defaults: {
    tag: "Nuxt OG Image"
  }
});

const componentNames = [{"hash":"MG873QJE80gYu0lHdOhqbSWowGj8kqgR49asUC-LB3k","pascalName":"OgImageEachPage","kebabName":"og-image-each-page","path":"/Users/limvichet/Documents/Apps/fff-tails/app/components/OgImage/EachPage.vue","category":"app"},{"hash":"SOHaoKfoo4fUkREsCFGw8ewxkl4-XkkHkug2VwYRtFM","pascalName":"BrandedLogo","kebabName":"branded-logo","path":"/Users/limvichet/Documents/Apps/fff-tails/node_modules/.pnpm/nuxt-og-image@5.1.13_@unhead+vue@2.1.2_vue@3.5.27_typescript@5.9.3___magicast@0.5.1_uns_8d5afb97e113681a3783549c3b584ba2/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/BrandedLogo.vue","category":"community"},{"hash":"tFoYPh0fXaZR3uXybAqFEOGnQuQsvz-E-Yq-CtrFlIY","pascalName":"Frame","kebabName":"frame","path":"/Users/limvichet/Documents/Apps/fff-tails/node_modules/.pnpm/nuxt-og-image@5.1.13_@unhead+vue@2.1.2_vue@3.5.27_typescript@5.9.3___magicast@0.5.1_uns_8d5afb97e113681a3783549c3b584ba2/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/Frame.vue","category":"community"},{"hash":"NPQTTXYQ8toXx5OaJ1VlRUUcxy1SNOxg-FoM7C08ZPM","pascalName":"Nuxt","kebabName":"nuxt","path":"/Users/limvichet/Documents/Apps/fff-tails/node_modules/.pnpm/nuxt-og-image@5.1.13_@unhead+vue@2.1.2_vue@3.5.27_typescript@5.9.3___magicast@0.5.1_uns_8d5afb97e113681a3783549c3b584ba2/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/Nuxt.vue","category":"community"},{"hash":"VAHSTZlVcPHzkozocV1iTnwc4-YttdoOkHsYfoSgDZ4","pascalName":"NuxtSeo","kebabName":"nuxt-seo","path":"/Users/limvichet/Documents/Apps/fff-tails/node_modules/.pnpm/nuxt-og-image@5.1.13_@unhead+vue@2.1.2_vue@3.5.27_typescript@5.9.3___magicast@0.5.1_uns_8d5afb97e113681a3783549c3b584ba2/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/NuxtSeo.vue","category":"community"},{"hash":"8CNn4yU043gQFqO-sZNDPz9GKED-h7ahXJ-61c9ThHM","pascalName":"Pergel","kebabName":"pergel","path":"/Users/limvichet/Documents/Apps/fff-tails/node_modules/.pnpm/nuxt-og-image@5.1.13_@unhead+vue@2.1.2_vue@3.5.27_typescript@5.9.3___magicast@0.5.1_uns_8d5afb97e113681a3783549c3b584ba2/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/Pergel.vue","category":"community"},{"hash":"b-Juo-FXQepo6SOCnA478MTAqbXNZuve6-MzHgTKA7s","pascalName":"SimpleBlog","kebabName":"simple-blog","path":"/Users/limvichet/Documents/Apps/fff-tails/node_modules/.pnpm/nuxt-og-image@5.1.13_@unhead+vue@2.1.2_vue@3.5.27_typescript@5.9.3___magicast@0.5.1_uns_8d5afb97e113681a3783549c3b584ba2/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/SimpleBlog.vue","category":"community"},{"hash":"vRUm5ru-64PEHIGsBby6-vCgLBg7iUJfvFKL6VuCXtI","pascalName":"UnJs","kebabName":"un-js","path":"/Users/limvichet/Documents/Apps/fff-tails/node_modules/.pnpm/nuxt-og-image@5.1.13_@unhead+vue@2.1.2_vue@3.5.27_typescript@5.9.3___magicast@0.5.1_uns_8d5afb97e113681a3783549c3b584ba2/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/UnJs.vue","category":"community"},{"hash":"hq07GBU-Yd16ICfETt8SfSxfaYj3qBmDAiQkTcv89nw","pascalName":"Wave","kebabName":"wave","path":"/Users/limvichet/Documents/Apps/fff-tails/node_modules/.pnpm/nuxt-og-image@5.1.13_@unhead+vue@2.1.2_vue@3.5.27_typescript@5.9.3___magicast@0.5.1_uns_8d5afb97e113681a3783549c3b584ba2/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/Wave.vue","category":"community"},{"hash":"zSwOodBXcjwS1qvFqGBJqitTEEnrvVfwQYkTeIxNpws","pascalName":"WithEmoji","kebabName":"with-emoji","path":"/Users/limvichet/Documents/Apps/fff-tails/node_modules/.pnpm/nuxt-og-image@5.1.13_@unhead+vue@2.1.2_vue@3.5.27_typescript@5.9.3___magicast@0.5.1_uns_8d5afb97e113681a3783549c3b584ba2/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/WithEmoji.vue","category":"community"}];

function normaliseOptions(_options) {
  const options = { ..._options };
  if (!options)
    return options;
  if (options.component && componentNames) {
    const originalName = options.component;
    for (const component of componentNames) {
      if (component.pascalName.endsWith(originalName) || component.kebabName.endsWith(originalName)) {
        options.component = component.pascalName;
        break;
      }
    }
  } else if (!options.component) {
    options.component = componentNames[0]?.pascalName;
  }
  return options;
}

function useOgImageRuntimeConfig(e) {
  const c = useRuntimeConfig(e);
  return {
    ...c["nuxt-og-image"],
    app: {
      baseURL: c.app.baseURL
    }
  };
}

const satoriRendererInstance = { instance: void 0 };
const chromiumRendererInstance = { instance: void 0 };
async function useSatoriRenderer() {
  satoriRendererInstance.instance = satoriRendererInstance.instance || await import('../_/renderer.mjs').then((m) => m.default);
  return satoriRendererInstance.instance;
}
async function useChromiumRenderer() {
  chromiumRendererInstance.instance = chromiumRendererInstance.instance || await import('../_/empty.mjs').then((m) => m.default);
  return chromiumRendererInstance.instance;
}

function resolvePathCacheKey(e, path) {
  const siteConfig = useSiteConfig(e, {
    resolveRefs: true
  });
  const basePath = withoutTrailingSlash(withoutLeadingSlash(normalizeKey$1(path)));
  return [
    !basePath || basePath === "/" ? "index" : basePath,
    hash$1([
      basePath,
      siteConfig.url,
      hash$1(getQuery(e))
    ])
  ].join(":");
}
async function resolveContext(e) {
  const runtimeConfig = useOgImageRuntimeConfig();
  const resolvePathWithBase = createSitePathResolver(e, {
    absolute: false,
    withBase: true
  });
  const path = resolvePathWithBase(parseURL(e.path).pathname);
  const extension = path.split(".").pop();
  if (!extension) {
    return createError$1({
      statusCode: 400,
      statusMessage: `[Nuxt OG Image] Missing OG Image type.`
    });
  }
  if (!["png", "jpeg", "jpg", "svg", "html", "json"].includes(extension)) {
    return createError$1({
      statusCode: 400,
      statusMessage: `[Nuxt OG Image] Unknown OG Image type ${extension}.`
    });
  }
  const query = getQuery(e);
  let queryParams = {};
  for (const k in query) {
    const v = String(query[k]);
    if (!v)
      continue;
    if (v.startsWith("{")) {
      try {
        queryParams[k] = JSON.parse(v);
      } catch (error) {
      }
    } else {
      queryParams[k] = v;
    }
  }
  queryParams = separateProps(queryParams);
  const basePath = withoutTrailingSlash(
    path.replace(`/__og-image__/image`, "").replace(`/__og-image__/static`, "").replace(`/og.${extension}`, "")
  );
  const basePathWithQuery = queryParams._query && typeof queryParams._query === "object" ? withQuery(basePath, queryParams._query) : basePath;
  const isDebugJsonPayload = extension === "json" && runtimeConfig.debug;
  const key = resolvePathCacheKey(e, basePathWithQuery);
  let options = queryParams.options;
  if (!options) {
    if (!options) {
      const payload = await fetchPathHtmlAndExtractOptions(e, basePathWithQuery, key);
      if (payload instanceof Error)
        return payload;
      options = payload;
    }
  }
  delete queryParams.options;
  const routeRuleMatcher = createNitroRouteRuleMatcher();
  const routeRules = routeRuleMatcher(basePath);
  if (typeof routeRules.ogImage === "undefined" && !options) {
    return createError$1({
      statusCode: 400,
      statusMessage: "The route is missing the Nuxt OG Image payload or route rules."
    });
  }
  const ogImageRouteRules = separateProps(routeRules.ogImage);
  options = defu(queryParams, options, ogImageRouteRules, runtimeConfig.defaults);
  if (!options) {
    return createError$1({
      statusCode: 404,
      statusMessage: "[Nuxt OG Image] OG Image not found."
    });
  }
  let renderer;
  switch (options.renderer) {
    case "satori":
      renderer = await useSatoriRenderer();
      break;
    case "chromium":
      renderer = await useChromiumRenderer();
      break;
  }
  if (!renderer || renderer.__mock__) {
    throw createError$1({
      statusCode: 400,
      statusMessage: `[Nuxt OG Image] Renderer ${options.renderer} is not enabled.`
    });
  }
  const unocss = await createGenerator({ theme }, {
    presets: [
      presetWind()
    ]
  });
  const ctx = {
    unocss,
    e,
    key,
    renderer,
    isDebugJsonPayload,
    runtimeConfig,
    publicStoragePath: runtimeConfig.publicStoragePath,
    extension,
    basePath,
    options: normaliseOptions(options),
    _nitro: useNitroApp()
  };
  await ctx._nitro.hooks.callHook("nuxt-og-image:context", ctx);
  return ctx;
}
const PAYLOAD_REGEX = /<script.+id="nuxt-og-image-options"[^>]*>(.+?)<\/script>/;
function getPayloadFromHtml(html) {
  const match = String(html).match(PAYLOAD_REGEX);
  return match ? String(match[1]) : null;
}
function extractAndNormaliseOgImageOptions(html) {
  const _payload = getPayloadFromHtml(html);
  let options = false;
  try {
    const payload2 = parse$3(_payload || "{}");
    Object.entries(payload2).forEach(([key, value]) => {
      if (!value && value !== 0)
        delete payload2[key];
    });
    options = payload2;
  } catch (e) {
  }
  if (options && typeof options?.props?.description === "undefined") {
    const description = html.match(/<meta[^>]+name="description"[^>]*>/)?.[0];
    if (description) {
      const [, content] = description.match(/content="([^"]+)"/) || [];
      if (content && !options.props.description)
        options.props.description = content;
    }
  }
  const payload = decodeObjectHtmlEntities(options || {});
  return payload;
}
async function doFetchWithErrorHandling(fetch, path) {
  const res = await fetch(path, {
    redirect: "follow",
    headers: {
      accept: "text/html"
    }
  }).catch((err) => {
    return err;
  });
  let errorDescription;
  if (res.status >= 300 && res.status < 400) {
    if (res.headers.has("location")) {
      return await doFetchWithErrorHandling(fetch, res.headers.get("location") || "");
    }
    errorDescription = `${res.status} redirected to ${res.headers.get("location") || "unknown"}`;
  } else if (res.status >= 500) {
    errorDescription = `${res.status} error: ${res.statusText}`;
  }
  if (errorDescription) {
    return [null, createError$1({
      statusCode: 500,
      statusMessage: `[Nuxt OG Image] Failed to parse \`${path}\` for og-image extraction. ${errorDescription}`
    })];
  }
  if (res._data) {
    return [res._data, null];
  } else if (res.text) {
    return [await res.text(), null];
  }
  return ["", null];
}
async function fetchPathHtmlAndExtractOptions(e, path, key) {
  const cachedHtmlPayload = await htmlPayloadCache.getItem(key);
  if (cachedHtmlPayload && cachedHtmlPayload.expiresAt < Date.now())
    return cachedHtmlPayload.value;
  let _payload = null;
  let [html, err] = await doFetchWithErrorHandling(e.fetch, path);
  if (err) {
    logger.warn(err);
  } else {
    _payload = getPayloadFromHtml(html);
  }
  if (!_payload) {
    const [fallbackHtml, err2] = await doFetchWithErrorHandling(globalThis.$fetch.raw, path);
    if (err2) {
      return err2;
    }
    _payload = getPayloadFromHtml(fallbackHtml);
    if (_payload) {
      html = fallbackHtml;
    }
  }
  if (!html) {
    return createError$1({
      statusCode: 500,
      statusMessage: `[Nuxt OG Image] Failed to read the path ${path} for og-image extraction, returning no HTML.`
    });
  }
  if (!_payload) {
    const payload2 = extractAndNormaliseOgImageOptions(html);
    if (payload2 && typeof payload2 === "object" && payload2.socialPreview?.og?.image) {
      const image = payload2.socialPreview.og.image;
      const p = {
        custom: true,
        url: typeof image === "string" ? image : image
      };
      if (typeof image === "object" && image["image:width"]) {
        p.width = image["image:width"];
      }
      if (typeof image === "object" && image["image:height"]) {
        p.height = image["image:height"];
      }
      return p;
    }
    return createError$1({
      statusCode: 500,
      statusMessage: `[Nuxt OG Image] HTML response from ${path} is missing the #nuxt-og-image-options script tag. Make sure you have defined an og image for this page.`
    });
  }
  const payload = extractAndNormaliseOgImageOptions(html);
  if (payload) {
    await htmlPayloadCache.setItem(key, {
      // 60 minutes for prerender, 10 seconds for runtime
      expiresAt: Date.now() + 1e3 * (10),
      value: payload
    });
  }
  return typeof payload === "object" ? payload : createError$1({
    statusCode: 500,
    statusMessage: "[Nuxt OG Image] Invalid payload type."
  });
}

const _hrdLZ_o1Rhez0iDxj2FOao0RbtOzGwVioovujw9xyk = defineNitroPlugin(async (nitro) => {
  return;
});

const script = "\"use strict\";(()=>{const t=window,e=document.documentElement,c=[\"dark\",\"light\"],n=getStorageValue(\"localStorage\",\"color-theme\")||\"system\";let i=n===\"system\"?u():n;const r=e.getAttribute(\"data-color-mode-forced\");r&&(i=r),l(i),t[\"__NUXT_COLOR_MODE__\"]={preference:n,value:i,getColorScheme:u,addColorScheme:l,removeColorScheme:d};function l(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.add(s):e.className+=\" \"+s,a&&e.setAttribute(\"data-\"+a,o)}function d(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.remove(s):e.className=e.className.replace(new RegExp(s,\"g\"),\"\"),a&&e.removeAttribute(\"data-\"+a)}function f(o){return t.matchMedia(\"(prefers-color-scheme\"+o+\")\")}function u(){if(t.matchMedia&&f(\"\").media!==\"not all\"){for(const o of c)if(f(\":\"+o).matches)return o}return\"light\"}})();function getStorageValue(t,e){switch(t){case\"localStorage\":return window.localStorage.getItem(e);case\"sessionStorage\":return window.sessionStorage.getItem(e);case\"cookie\":return getCookie(e);default:return null}}function getCookie(t){const c=(\"; \"+window.document.cookie).split(\"; \"+t+\"=\");if(c.length===2)return c.pop()?.split(\";\").shift()}";

const _TP0FHft_wP976otYRQwDIY2WNe2sc8JfIB95jhoXS9I = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _S4JVxQYs2ym7je0v0VUjV5DBDrlEWlv__7nssgb0fs,
_hrdLZ_o1Rhez0iDxj2FOao0RbtOzGwVioovujw9xyk,
_TP0FHft_wP976otYRQwDIY2WNe2sc8JfIB95jhoXS9I
];

const assets = {
  "/.DS_Store": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1804-WHPULVmGPAI6GqfMldj13cfyw2M\"",
    "mtime": "2026-04-23T01:48:46.328Z",
    "size": 6148,
    "path": "../public/.DS_Store"
  },
  "/.nojekyll": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk\"",
    "mtime": "2026-01-14T11:28:26.319Z",
    "size": 0,
    "path": "../public/.nojekyll"
  },
  "/favicon1.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-n8egyE9tcb7sKGr/pYCaQ4uWqxI\"",
    "mtime": "2026-04-23T01:48:46.328Z",
    "size": 4286,
    "path": "../public/favicon1.ico"
  },
  "/logo.rar": {
    "type": "application/vnd.rar",
    "etag": "\"e142-ImZbz2n4v5h8UOscjzmd4uZm5Dc\"",
    "mtime": "2026-04-23T01:48:46.328Z",
    "size": 57666,
    "path": "../public/logo.rar"
  },
  "/manifest.webmanifest": {
    "type": "application/manifest+json",
    "etag": "\"174-bKJHADwqn9t4Kqg3pmdYdw5YlBk\"",
    "mtime": "2026-04-23T01:48:46.233Z",
    "size": 372,
    "path": "../public/manifest.webmanifest"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"18-j8OIsL9qGDmNZ+lHhp2tyH4XtaE\"",
    "mtime": "2026-04-23T01:48:46.328Z",
    "size": 24,
    "path": "../public/robots.txt"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"3494a-m5Axa0EG5p1llNY/bkWibefiBV4\"",
    "mtime": "2026-04-23T01:48:46.328Z",
    "size": 215370,
    "path": "../public/favicon.ico"
  },
  "/sw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2e19-HJed9wT/mB22fO1og7EO6NPkuOA\"",
    "mtime": "2026-04-23T01:48:47.157Z",
    "size": 11801,
    "path": "../public/sw.js"
  },
  "/workbox-3105ea8d.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3b13-Wh1UnUyyWpyRKjt8VAzqPv3W/FM\"",
    "mtime": "2026-04-23T01:48:47.158Z",
    "size": 15123,
    "path": "../public/workbox-3105ea8d.js"
  },
  "/fonts/KrasarRegular.ttf": {
    "type": "font/ttf",
    "etag": "\"1f824-EIUb33gV7b3jneATkWda88Him4I\"",
    "mtime": "2026-04-23T01:48:46.278Z",
    "size": 129060,
    "path": "../public/fonts/KrasarRegular.ttf"
  },
  "/fonts/KhmerOSmuollight.ttf": {
    "type": "font/ttf",
    "etag": "\"38d80-dKzCI8aLdjVMJQl8X4EvNlGD0uo\"",
    "mtime": "2026-04-23T01:48:46.269Z",
    "size": 232832,
    "path": "../public/fonts/KhmerOSmuollight.ttf"
  },
  "/fonts/NotoSansKhmer.ttf": {
    "type": "font/ttf",
    "etag": "\"57c14-XSnTgxXsGCi5omaRB6LNZb9DMUs\"",
    "mtime": "2026-04-23T01:48:46.278Z",
    "size": 359444,
    "path": "../public/fonts/NotoSansKhmer.ttf"
  },
  "/_fonts/0FzYDfZ36KowU5G19FxQg1kvFIseW_2Z_SrXLtaaNAM-TMTLtw9IWPWZAzqwUVDCKJneyJVXPrmQpV2Jr_1TpfI.woff2": {
    "type": "font/woff2",
    "etag": "\"2744-R1/QSW82kdKzPETA7DEMG5H78fo\"",
    "mtime": "2026-04-23T01:48:46.231Z",
    "size": 10052,
    "path": "../public/_fonts/0FzYDfZ36KowU5G19FxQg1kvFIseW_2Z_SrXLtaaNAM-TMTLtw9IWPWZAzqwUVDCKJneyJVXPrmQpV2Jr_1TpfI.woff2"
  },
  "/_fonts/0sCScbsxXXdShLwktcf1pjREUdrxz14erwc1QEKkchk-gaY_HoF967SN7CbeGtlUYCoDFdjSDZH3Z8YHkrmao8c.woff2": {
    "type": "font/woff2",
    "etag": "\"3ac-yIV9tutKFZAhbJCAR+3WXa4Xla4\"",
    "mtime": "2026-04-23T01:48:46.231Z",
    "size": 940,
    "path": "../public/_fonts/0sCScbsxXXdShLwktcf1pjREUdrxz14erwc1QEKkchk-gaY_HoF967SN7CbeGtlUYCoDFdjSDZH3Z8YHkrmao8c.woff2"
  },
  "/fonts/Roboto.ttf": {
    "type": "font/ttf",
    "etag": "\"77158-EmRlzK7NP8VYitA9GxMe5G5heBM\"",
    "mtime": "2026-04-23T01:48:46.278Z",
    "size": 487768,
    "path": "../public/fonts/Roboto.ttf"
  },
  "/_fonts/1ZTlEDqU4DtwDJiND8f6qaugUpa0RIDvQl-v7iM6l54-8hITWWEqlkAYujHsQIFS3urN9Yv6WGeadNXzxkGf1OU.woff": {
    "type": "font/woff",
    "etag": "\"11d40-Q8j1falcAhg0X+OM7cmhMQZi+2c\"",
    "mtime": "2026-04-23T01:48:46.231Z",
    "size": 73024,
    "path": "../public/_fonts/1ZTlEDqU4DtwDJiND8f6qaugUpa0RIDvQl-v7iM6l54-8hITWWEqlkAYujHsQIFS3urN9Yv6WGeadNXzxkGf1OU.woff"
  },
  "/_fonts/1ZTlEDqU4DtwDJiND8f6qaugUpa0RIDvQl-v7iM6l54-dkhOSRmNnwvlgTdcBMgAVXaMfJmQoUwYa_2c_lr6y64.woff": {
    "type": "font/woff",
    "etag": "\"133c0-9p2QwTdVWUfXKZcQTbWB+E9ZV88\"",
    "mtime": "2026-04-23T01:48:46.232Z",
    "size": 78784,
    "path": "../public/_fonts/1ZTlEDqU4DtwDJiND8f6qaugUpa0RIDvQl-v7iM6l54-dkhOSRmNnwvlgTdcBMgAVXaMfJmQoUwYa_2c_lr6y64.woff"
  },
  "/fonts/TACTENG.ttf": {
    "type": "font/ttf",
    "etag": "\"310bc-XYhfx7/SxihVC/QriVt7VlOeXzI\"",
    "mtime": "2026-04-23T01:48:46.278Z",
    "size": 200892,
    "path": "../public/fonts/TACTENG.ttf"
  },
  "/_fonts/1ZTlEDqU4DtwDJiND8f6qaugUpa0RIDvQl-v7iM6l54-ipWWsvE65gAG7xTKuDdFqB2KgbU4TkyOAeT58a1X5h0.woff": {
    "type": "font/woff",
    "etag": "\"64b0-IkjoC8WO/DNuoc8YPIq2zNpDyQQ\"",
    "mtime": "2026-04-23T01:48:46.231Z",
    "size": 25776,
    "path": "../public/_fonts/1ZTlEDqU4DtwDJiND8f6qaugUpa0RIDvQl-v7iM6l54-ipWWsvE65gAG7xTKuDdFqB2KgbU4TkyOAeT58a1X5h0.woff"
  },
  "/_fonts/1ZTlEDqU4DtwDJiND8f6qaugUpa0RIDvQl-v7iM6l54-m6USKt9qD1gFEG_GhZwFOzqAKjDJwE_N_rf41yvQym8.woff": {
    "type": "font/woff",
    "etag": "\"106ec-imdWe0YYmkmQ++Jz9eFzYD79nvI\"",
    "mtime": "2026-04-23T01:48:46.232Z",
    "size": 67308,
    "path": "../public/_fonts/1ZTlEDqU4DtwDJiND8f6qaugUpa0RIDvQl-v7iM6l54-m6USKt9qD1gFEG_GhZwFOzqAKjDJwE_N_rf41yvQym8.woff"
  },
  "/_fonts/6llTmTU4VrhnOXxlpEAJxgTPn5R5jxwpdC8Vv1GiM6A-7mcMqWBpMl75F4XGDPNOW3GfPr50EnoDEZItt11QXtI.woff2": {
    "type": "font/woff2",
    "etag": "\"4040-kzx0y/bo882x3yw2MlhqLX3QXR8\"",
    "mtime": "2026-04-23T01:48:46.231Z",
    "size": 16448,
    "path": "../public/_fonts/6llTmTU4VrhnOXxlpEAJxgTPn5R5jxwpdC8Vv1GiM6A-7mcMqWBpMl75F4XGDPNOW3GfPr50EnoDEZItt11QXtI.woff2"
  },
  "/_fonts/GVbET22Ouy9Nep6UDGwtOz9KeAWOk3e8rJ3iXAKZz_g-cDVtBSgPCS_4ksj4wTb8aqBBeWeRRawS3Gh0Gw6KVkU.woff2": {
    "type": "font/woff2",
    "etag": "\"1904-4rQ/V7qf8a4pJRj/PTeqiCVpxGc\"",
    "mtime": "2026-04-23T01:48:46.232Z",
    "size": 6404,
    "path": "../public/_fonts/GVbET22Ouy9Nep6UDGwtOz9KeAWOk3e8rJ3iXAKZz_g-cDVtBSgPCS_4ksj4wTb8aqBBeWeRRawS3Gh0Gw6KVkU.woff2"
  },
  "/_fonts/H7JIvm-LzeiNOZAbU7tvVi7tD37bIG2T73PdbLQ9hxo-I2ubcPLBx_SdeFSIKgPsCqo9t7q1nWqrOJZOTnDYljg.woff2": {
    "type": "font/woff2",
    "etag": "\"3710-vxho9k0xZ/+J/DoCaveghd2iPMo\"",
    "mtime": "2026-04-23T01:48:46.231Z",
    "size": 14096,
    "path": "../public/_fonts/H7JIvm-LzeiNOZAbU7tvVi7tD37bIG2T73PdbLQ9hxo-I2ubcPLBx_SdeFSIKgPsCqo9t7q1nWqrOJZOTnDYljg.woff2"
  },
  "/_fonts/KjSeTzVQ_IZ_hGs2L2Za4Qh_YSxyKdO1JcSuJHk8YUE-VdAzioAjx39YSdxTrgeJHiCdfZCUi52N9lZCspNyimk.woff2": {
    "type": "font/woff2",
    "etag": "\"3684-RhlYRPdhk3t4yToHPwwvH+ClWQQ\"",
    "mtime": "2026-04-23T01:48:46.232Z",
    "size": 13956,
    "path": "../public/_fonts/KjSeTzVQ_IZ_hGs2L2Za4Qh_YSxyKdO1JcSuJHk8YUE-VdAzioAjx39YSdxTrgeJHiCdfZCUi52N9lZCspNyimk.woff2"
  },
  "/_fonts/Q3S_p5LT4oiqlER2BJCNik5cex_IJKLzuE43EAJyEQI-2AUvqw5huoArRxvdgYYN6VNFWO0PpG9VCG62HDqYVCE.woff2": {
    "type": "font/woff2",
    "etag": "\"1210-CwcarggBcih9Crcy8lUBuMTt6x8\"",
    "mtime": "2026-04-23T01:48:46.232Z",
    "size": 4624,
    "path": "../public/_fonts/Q3S_p5LT4oiqlER2BJCNik5cex_IJKLzuE43EAJyEQI-2AUvqw5huoArRxvdgYYN6VNFWO0PpG9VCG62HDqYVCE.woff2"
  },
  "/_fonts/SMlUA33CCqtZ9XHHI96jSnJe6CdDhbcmXCs-jYdC2AE-TZsqdgYzXD_3i6TSy9xK7aTYQEvnGZfNy-x3UcSkwQE.woff2": {
    "type": "font/woff2",
    "etag": "\"1fa8-qWQHeRJXks7r9/JwfWm41yRwLrU\"",
    "mtime": "2026-04-23T01:48:46.232Z",
    "size": 8104,
    "path": "../public/_fonts/SMlUA33CCqtZ9XHHI96jSnJe6CdDhbcmXCs-jYdC2AE-TZsqdgYzXD_3i6TSy9xK7aTYQEvnGZfNy-x3UcSkwQE.woff2"
  },
  "/_fonts/SVyAGW3UKufF57edQ7AdnfCxoCdiPRdVBxo9MqVSOps-VO_udcepkwpQrtqsGDMpdrOoqp7KgUQc3CbKADt2MWc.woff2": {
    "type": "font/woff2",
    "etag": "\"1434-7uIjiiG6v4VyVRjEt46VBIGtMDE\"",
    "mtime": "2026-04-23T01:48:46.232Z",
    "size": 5172,
    "path": "../public/_fonts/SVyAGW3UKufF57edQ7AdnfCxoCdiPRdVBxo9MqVSOps-VO_udcepkwpQrtqsGDMpdrOoqp7KgUQc3CbKADt2MWc.woff2"
  },
  "/_fonts/i6NU-ZRoWectnP8mLkQAhVPNXrm1jTIu1GighRLvi6E-6zrXHxCLC7Ni7NqbfpoF9uCCgrZao01mcYl6w_xAQIE.woff2": {
    "type": "font/woff2",
    "etag": "\"1c28-6PPdXjdYN6CEd7otfs/dKCcMUfk\"",
    "mtime": "2026-04-23T01:48:46.232Z",
    "size": 7208,
    "path": "../public/_fonts/i6NU-ZRoWectnP8mLkQAhVPNXrm1jTIu1GighRLvi6E-6zrXHxCLC7Ni7NqbfpoF9uCCgrZao01mcYl6w_xAQIE.woff2"
  },
  "/_fonts/kjjsrhGeTlLIKHsN73NvO-yQkSGJQgKaVnxVD9lWzDw-QL_c_Vc3IZ7hjeNk6_6LuQLsu2at9CLYCP6BJYsLJAQ.woff2": {
    "type": "font/woff2",
    "etag": "\"3a8-XtltG06emv4O4cRn3t9XXKDKEVk\"",
    "mtime": "2026-04-23T01:48:46.232Z",
    "size": 936,
    "path": "../public/_fonts/kjjsrhGeTlLIKHsN73NvO-yQkSGJQgKaVnxVD9lWzDw-QL_c_Vc3IZ7hjeNk6_6LuQLsu2at9CLYCP6BJYsLJAQ.woff2"
  },
  "/_fonts/pogFDrya8qre9JJB-wSYbICQJ291LgeDXxEnGx5JkxY-2LlGndh5bSDnC3AQDGZemj4X3QJM3C5HWHY3hB7N6LA.woff2": {
    "type": "font/woff2",
    "etag": "\"1750-m7MY986+3o/ZYgqWtV6IP+pdeNA\"",
    "mtime": "2026-04-23T01:48:46.232Z",
    "size": 5968,
    "path": "../public/_fonts/pogFDrya8qre9JJB-wSYbICQJ291LgeDXxEnGx5JkxY-2LlGndh5bSDnC3AQDGZemj4X3QJM3C5HWHY3hB7N6LA.woff2"
  },
  "/_fonts/q0X4ip5ELKnHS9z4cPzQiCpA1NmsCi5q5Vw-zduUXEs-Z96ugpRUt2pUbr3kbLEfDtLTlm6Nh_LHjiHwKNM3QP0.woff2": {
    "type": "font/woff2",
    "etag": "\"471c-FSrBl4trsre2XuEGvcRzAtaPx/s\"",
    "mtime": "2026-04-23T01:48:46.232Z",
    "size": 18204,
    "path": "../public/_fonts/q0X4ip5ELKnHS9z4cPzQiCpA1NmsCi5q5Vw-zduUXEs-Z96ugpRUt2pUbr3kbLEfDtLTlm6Nh_LHjiHwKNM3QP0.woff2"
  },
  "/_fonts/sfMudhGcaO8gHDgUczDDQmGM9FUNACG22fCmZsXLeTM-lbAbLKukAkDXPhaKrEiHI0hjt1uxB4v8d1_FQHiuqfs.woff2": {
    "type": "font/woff2",
    "etag": "\"2fc4-QOc66EhsPHQwStY0OZsRi3CGHeo\"",
    "mtime": "2026-04-23T01:48:46.232Z",
    "size": 12228,
    "path": "../public/_fonts/sfMudhGcaO8gHDgUczDDQmGM9FUNACG22fCmZsXLeTM-lbAbLKukAkDXPhaKrEiHI0hjt1uxB4v8d1_FQHiuqfs.woff2"
  },
  "/_fonts/t3VrpG2lZdfez1sg9pmH4FP873bJSlWM1tgwh2YdOv8-Y5XQBiAsptItsPQylhAQPILDvA9Yov4XGE7dYp_auRI.woff2": {
    "type": "font/woff2",
    "etag": "\"2324-/RAflLEXXUNLJQMXBqoMTqLq/O8\"",
    "mtime": "2026-04-23T01:48:46.232Z",
    "size": 8996,
    "path": "../public/_fonts/t3VrpG2lZdfez1sg9pmH4FP873bJSlWM1tgwh2YdOv8-Y5XQBiAsptItsPQylhAQPILDvA9Yov4XGE7dYp_auRI.woff2"
  },
  "/_fonts/u7UmSpWfMG8qyoetp4u4S8U9LMAg2Zt4XZ_wIsuFZUc-ZA0KxXcyBj4WsXuZcBuu1LXdvOhJHGZHxMVAZFLMAFE.woff2": {
    "type": "font/woff2",
    "etag": "\"1978-BCdVy3deeWCpIiXxHfDTkiGnRis\"",
    "mtime": "2026-04-23T01:48:46.232Z",
    "size": 6520,
    "path": "../public/_fonts/u7UmSpWfMG8qyoetp4u4S8U9LMAg2Zt4XZ_wIsuFZUc-ZA0KxXcyBj4WsXuZcBuu1LXdvOhJHGZHxMVAZFLMAFE.woff2"
  },
  "/_fonts/vnQZnmLlmpY-pqaK1sw-5k1yglIzMRwM4FHhSfsrdI-NhYVFGr_ue-Wej1Ykovhkg2MCI-7-9YQfGwc1zMfzGM.woff2": {
    "type": "font/woff2",
    "etag": "\"2b9c-dXcWB8X4h7KJtCYJQ1DZlp3PEu0\"",
    "mtime": "2026-04-23T01:48:46.232Z",
    "size": 11164,
    "path": "../public/_fonts/vnQZnmLlmpY-pqaK1sw-5k1yglIzMRwM4FHhSfsrdI-NhYVFGr_ue-Wej1Ykovhkg2MCI-7-9YQfGwc1zMfzGM.woff2"
  },
  "/icons/icon-192.png": {
    "type": "image/png",
    "etag": "\"3bb1-o0FBpQfyzgFcHWRiUHzuuIXKkLk\"",
    "mtime": "2026-04-23T01:48:46.272Z",
    "size": 15281,
    "path": "../public/icons/icon-192.png"
  },
  "/imgs/logo-48.png": {
    "type": "image/png",
    "etag": "\"da3-vFnCMMZCYXqdZMzW/PL0Vni8yUE\"",
    "mtime": "2026-04-23T01:48:46.268Z",
    "size": 3491,
    "path": "../public/imgs/logo-48.png"
  },
  "/icons/icon-512.png": {
    "type": "image/png",
    "etag": "\"ba5f-+2Fz8QlAeHGvBwC1a4+SzEPPgUI\"",
    "mtime": "2026-04-23T01:48:46.269Z",
    "size": 47711,
    "path": "../public/icons/icon-512.png"
  },
  "/imgs/logo-ori.png": {
    "type": "image/png",
    "etag": "\"ed9f-bAQDALlckEUH78Be3zRAzgJW83U\"",
    "mtime": "2026-04-23T01:48:46.278Z",
    "size": 60831,
    "path": "../public/imgs/logo-ori.png"
  },
  "/imgs/logo-dark.svg": {
    "type": "image/svg+xml",
    "etag": "\"16162-auPUbTvTZejzuBPaL2OG5v1yciQ\"",
    "mtime": "2026-04-23T01:48:46.278Z",
    "size": 90466,
    "path": "../public/imgs/logo-dark.svg"
  },
  "/imgs/logo.png": {
    "type": "image/png",
    "etag": "\"ed9f-bAQDALlckEUH78Be3zRAzgJW83U\"",
    "mtime": "2026-04-23T01:48:46.282Z",
    "size": 60831,
    "path": "../public/imgs/logo.png"
  },
  "/imgs/logo.svg": {
    "type": "image/svg+xml",
    "etag": "\"16168-BLcYvD/B0PAlqiPJjsqqPJ+jlto\"",
    "mtime": "2026-04-23T01:48:46.279Z",
    "size": 90472,
    "path": "../public/imgs/logo.svg"
  },
  "/imgs/logo-64.png": {
    "type": "image/png",
    "etag": "\"1358-gM3jFDRSYFl9ZdDQt8WhG1as/Do\"",
    "mtime": "2026-04-23T01:48:46.278Z",
    "size": 4952,
    "path": "../public/imgs/logo-64.png"
  },
  "/imgs/logo32.svg": {
    "type": "image/svg+xml",
    "etag": "\"13ec8-LkwZadq3q4JLwc3cTrmbUHGpREQ\"",
    "mtime": "2026-04-23T01:48:46.279Z",
    "size": 81608,
    "path": "../public/imgs/logo32.svg"
  },
  "/images/.DS_Store": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"2804-7QYEslpNCbvAr4yB1aXW5d9y9QU\"",
    "mtime": "2026-04-23T01:48:46.268Z",
    "size": 10244,
    "path": "../public/images/.DS_Store"
  },
  "/_nuxt/9a6AX_Nf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c7a-SnHB75taM3DGQ1Lkmdj717Bugq8\"",
    "mtime": "2026-04-23T01:48:46.241Z",
    "size": 3194,
    "path": "../public/_nuxt/9a6AX_Nf.js"
  },
  "/imgs/logo40.svg": {
    "type": "image/svg+xml",
    "etag": "\"13ec8-LyEA6VS2P9VStngp9HwPBCittX0\"",
    "mtime": "2026-04-23T01:48:46.282Z",
    "size": 81608,
    "path": "../public/imgs/logo40.svg"
  },
  "/_nuxt/0fM8IoSx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8aef-MVIN0fsaovJRfzMPjxSQpQcb7yk\"",
    "mtime": "2026-04-23T01:48:46.241Z",
    "size": 35567,
    "path": "../public/_nuxt/0fM8IoSx.js"
  },
  "/_nuxt/B-FPobv4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"10e3-Fm2UjrI9T8duzaULr1JH8s/n6jw\"",
    "mtime": "2026-04-23T01:48:46.241Z",
    "size": 4323,
    "path": "../public/_nuxt/B-FPobv4.js"
  },
  "/_nuxt/B-ymmRTc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2b7-8yTs2mf+/dYI5wBbYOLEnIyAhPo\"",
    "mtime": "2026-04-23T01:48:46.241Z",
    "size": 695,
    "path": "../public/_nuxt/B-ymmRTc.js"
  },
  "/_nuxt/BIl4cyR9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1681-8OY0+UaG+gUiKJSGiH59s2B32fM\"",
    "mtime": "2026-04-23T01:48:46.241Z",
    "size": 5761,
    "path": "../public/_nuxt/BIl4cyR9.js"
  },
  "/_nuxt/B3w4UkVH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6f8-AxLn2NDlhwZJIx2r6QVo6FdOzgo\"",
    "mtime": "2026-04-23T01:48:46.241Z",
    "size": 1784,
    "path": "../public/_nuxt/B3w4UkVH.js"
  },
  "/_nuxt/BGGUicND.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"21d-HvBA2wX9X2mL3yqBJSLGeb9mq/8\"",
    "mtime": "2026-04-23T01:48:46.241Z",
    "size": 541,
    "path": "../public/_nuxt/BGGUicND.js"
  },
  "/_nuxt/BJFto0mV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"291-HfEC/kJKsDcvbLvkTIPU275ZvOM\"",
    "mtime": "2026-04-23T01:48:46.241Z",
    "size": 657,
    "path": "../public/_nuxt/BJFto0mV.js"
  },
  "/_nuxt/BKqUd_0w.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3020-uG9edemsZ978tpjg/lfH7xtHaQg\"",
    "mtime": "2026-04-23T01:48:46.241Z",
    "size": 12320,
    "path": "../public/_nuxt/BKqUd_0w.js"
  },
  "/_nuxt/BNutlvFu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"51-WdCI140C9njE5H5/GnGmKKWpaHk\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 81,
    "path": "../public/_nuxt/BNutlvFu.js"
  },
  "/_nuxt/BOm1IgXw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"58d5-XK0zGUzS/kI+QvrfKv7WCvNMgu0\"",
    "mtime": "2026-04-23T01:48:46.241Z",
    "size": 22741,
    "path": "../public/_nuxt/BOm1IgXw.js"
  },
  "/_nuxt/BXuvgND2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5a7a-2wknQVelJDZbaJWBouM0qC6q6zU\"",
    "mtime": "2026-04-23T01:48:46.241Z",
    "size": 23162,
    "path": "../public/_nuxt/BXuvgND2.js"
  },
  "/_nuxt/BYVNSfYC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"98-Bw9vyXemfNx7xEmvbTFtx8Rc5hM\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 152,
    "path": "../public/_nuxt/BYVNSfYC.js"
  },
  "/_nuxt/BZo3WaU7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4768-51ygXvjJocPpPijw5mdlqXgXLl8\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 18280,
    "path": "../public/_nuxt/BZo3WaU7.js"
  },
  "/_nuxt/BdRS6W-e.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"61e8-etkR8o0lgGPVQj4mHCPvFmjyefk\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 25064,
    "path": "../public/_nuxt/BdRS6W-e.js"
  },
  "/_nuxt/Ber8KPFm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"37d7-rfQIsApU1eYxIXLElqKt7HSkC3g\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 14295,
    "path": "../public/_nuxt/Ber8KPFm.js"
  },
  "/_nuxt/BfaCrM9N.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"63a0-03hos+l8qSuZ59lawq3/lyV9/cc\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 25504,
    "path": "../public/_nuxt/BfaCrM9N.js"
  },
  "/_nuxt/Bmu0cZ9E.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b02-e8+Ns7zgH4T15Cj6udCjRjdesvM\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 2818,
    "path": "../public/_nuxt/Bmu0cZ9E.js"
  },
  "/_nuxt/Bs-ixn9S.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3f1-qa6ynvnl6xRoTLRTXwXWwEhq20g\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 1009,
    "path": "../public/_nuxt/Bs-ixn9S.js"
  },
  "/_nuxt/BtA9VNiL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e17-77zypdi9OD66Er9KrcEVSmjOQ5U\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 7703,
    "path": "../public/_nuxt/BtA9VNiL.js"
  },
  "/_nuxt/BvSJKMXy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5697-gI2FhhkZnIZglzR3a9IDxYMOyOw\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 22167,
    "path": "../public/_nuxt/BvSJKMXy.js"
  },
  "/_nuxt/BwDDbOsP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1886-RGSPyRYYfpHK60hveeSPGnQlbTE\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 6278,
    "path": "../public/_nuxt/BwDDbOsP.js"
  },
  "/_nuxt/BwV3lO_B.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2ab-ci43YuU6h9VDQl6IvznATYs3mn4\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 683,
    "path": "../public/_nuxt/BwV3lO_B.js"
  },
  "/_nuxt/BwZocaec.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"66-lYeqGo9XqMidcSSbl4xbvYpOdMU\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 102,
    "path": "../public/_nuxt/BwZocaec.js"
  },
  "/_nuxt/ByfHoTEI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"312-DEnYGlsT2yh2GnUday9XD3AEezU\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 786,
    "path": "../public/_nuxt/ByfHoTEI.js"
  },
  "/_nuxt/C-WSuNX7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1bf9-ius3Wiq/TE+r5877++yDcRn5NmI\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 7161,
    "path": "../public/_nuxt/C-WSuNX7.js"
  },
  "/_nuxt/C-fXwAat.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"61f0-IpaRwHex5RYMsbx8NXVcNNyHt3s\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 25072,
    "path": "../public/_nuxt/C-fXwAat.js"
  },
  "/_nuxt/C1YrwzpG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"65f4-dL4VN+CfGLYurBqn5A1tWKlbulg\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 26100,
    "path": "../public/_nuxt/C1YrwzpG.js"
  },
  "/_nuxt/C40OJqZa.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5b05-PLVGhRe6EjfXqV+q53FterL0Xlk\"",
    "mtime": "2026-04-23T01:48:46.242Z",
    "size": 23301,
    "path": "../public/_nuxt/C40OJqZa.js"
  },
  "/_nuxt/C5T1oU5f.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1562-k+QHERDWRgBgG97pZdpfqa/3x2g\"",
    "mtime": "2026-04-23T01:48:46.243Z",
    "size": 5474,
    "path": "../public/_nuxt/C5T1oU5f.js"
  },
  "/_nuxt/C63P0Vnn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1665-/Rw+2+oD7YwgYdn2/JjW+21H7wo\"",
    "mtime": "2026-04-23T01:48:46.243Z",
    "size": 5733,
    "path": "../public/_nuxt/C63P0Vnn.js"
  },
  "/_nuxt/CHQkGaTu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"323-8lvyU+iBQliPIvsTF3JWWJdD5EU\"",
    "mtime": "2026-04-23T01:48:46.243Z",
    "size": 803,
    "path": "../public/_nuxt/CHQkGaTu.js"
  },
  "/_nuxt/CIBx6KGB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"150a-Y4X35iHrtEVfhy9o/+UlImp/KTs\"",
    "mtime": "2026-04-23T01:48:46.243Z",
    "size": 5386,
    "path": "../public/_nuxt/CIBx6KGB.js"
  },
  "/_nuxt/CND7KyCz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d89-+jSiDx6AD9hfqV/zAUby4Xwi7v4\"",
    "mtime": "2026-04-23T01:48:46.243Z",
    "size": 3465,
    "path": "../public/_nuxt/CND7KyCz.js"
  },
  "/_nuxt/CPN3i7si.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ece-1z+3Dzb3U8ZPdiFs+FyZYaocoug\"",
    "mtime": "2026-04-23T01:48:46.243Z",
    "size": 3790,
    "path": "../public/_nuxt/CPN3i7si.js"
  },
  "/_nuxt/CQ-CSfi4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ae-k89pYALwrpojFRSo1KS8PearoPc\"",
    "mtime": "2026-04-23T01:48:46.243Z",
    "size": 430,
    "path": "../public/_nuxt/CQ-CSfi4.js"
  },
  "/_nuxt/CUvcwcNd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"377-mtQB+LOCiLmMifAUgaQEzcOhoCI\"",
    "mtime": "2026-04-23T01:48:46.243Z",
    "size": 887,
    "path": "../public/_nuxt/CUvcwcNd.js"
  },
  "/_nuxt/CZOaYVdl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2107-N1ymxbLfa74dqu6h4ifHjMK5yX8\"",
    "mtime": "2026-04-23T01:48:46.243Z",
    "size": 8455,
    "path": "../public/_nuxt/CZOaYVdl.js"
  },
  "/_nuxt/CGgMQ60Q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"376-OY0nqPpmSadVFF/is8NpsSLBTM4\"",
    "mtime": "2026-04-23T01:48:46.243Z",
    "size": 886,
    "path": "../public/_nuxt/CGgMQ60Q.js"
  },
  "/_nuxt/CXDgbNoi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"181a-NeVO+5NNlqnQJsFGk5KmU5h5A30\"",
    "mtime": "2026-04-23T01:48:46.243Z",
    "size": 6170,
    "path": "../public/_nuxt/CXDgbNoi.js"
  },
  "/_nuxt/Cf7YmMJT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3d9-Z9x8SzgTxeoN0LimhclN6PZHRHo\"",
    "mtime": "2026-04-23T01:48:46.243Z",
    "size": 985,
    "path": "../public/_nuxt/Cf7YmMJT.js"
  },
  "/_nuxt/Cfw7HUCZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1401-secxzVx1tMlHOO+0fDzm6MNsplI\"",
    "mtime": "2026-04-23T01:48:46.243Z",
    "size": 5121,
    "path": "../public/_nuxt/Cfw7HUCZ.js"
  },
  "/_nuxt/ChAH9Pez.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"20fd-HDllyjeujEy+76GPF0VYlzBgUao\"",
    "mtime": "2026-04-23T01:48:46.244Z",
    "size": 8445,
    "path": "../public/_nuxt/ChAH9Pez.js"
  },
  "/_nuxt/Clr4Cdi0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"126-H5HrOipeRrvIOkuV33RFnfaVTtM\"",
    "mtime": "2026-04-23T01:48:46.244Z",
    "size": 294,
    "path": "../public/_nuxt/Clr4Cdi0.js"
  },
  "/_nuxt/CZwDbGZd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e4-REUR7l26sdGxE6CUQ3yVs9v+4us\"",
    "mtime": "2026-04-23T01:48:46.243Z",
    "size": 484,
    "path": "../public/_nuxt/CZwDbGZd.js"
  },
  "/_nuxt/Cn2KZAuD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1296-2/7B/hpXKupYqKSQ03KZO0QGdqo\"",
    "mtime": "2026-04-23T01:48:46.244Z",
    "size": 4758,
    "path": "../public/_nuxt/Cn2KZAuD.js"
  },
  "/_nuxt/Ctj7DjUr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2fa3-NAaGLSe8YIvpyjmD83ajN3Otykc\"",
    "mtime": "2026-04-23T01:48:46.244Z",
    "size": 12195,
    "path": "../public/_nuxt/Ctj7DjUr.js"
  },
  "/_nuxt/CwCyJ5fx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d90-TTalb4h/CBxiLGl9lFojn60jP7g\"",
    "mtime": "2026-04-23T01:48:46.244Z",
    "size": 3472,
    "path": "../public/_nuxt/CwCyJ5fx.js"
  },
  "/_nuxt/CommonCustomerSelect2.C2Ai3R57.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"be-8P6fw8RP4GglYvU0YopzyqejwKE\"",
    "mtime": "2026-04-23T01:48:46.244Z",
    "size": 190,
    "path": "../public/_nuxt/CommonCustomerSelect2.C2Ai3R57.css"
  },
  "/_nuxt/CwQ0hgYV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c3c-iF9Yh4rhbaeW3JLvPH0NwNztjm8\"",
    "mtime": "2026-04-23T01:48:46.244Z",
    "size": 3132,
    "path": "../public/_nuxt/CwQ0hgYV.js"
  },
  "/_nuxt/CxzLZ1OH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"65-XVlxRZZcFll6iQ39cQ8rVb3TTfw\"",
    "mtime": "2026-04-23T01:48:46.244Z",
    "size": 101,
    "path": "../public/_nuxt/CxzLZ1OH.js"
  },
  "/_nuxt/D8vf1HoI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"142-fPy7q1fAhFeYgiIJng+VJQJycug\"",
    "mtime": "2026-04-23T01:48:46.245Z",
    "size": 322,
    "path": "../public/_nuxt/D8vf1HoI.js"
  },
  "/_nuxt/CwcSSMdH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"206f-n22f75eGmn1nZajakmnR/KMBWGo\"",
    "mtime": "2026-04-23T01:48:46.244Z",
    "size": 8303,
    "path": "../public/_nuxt/CwcSSMdH.js"
  },
  "/_nuxt/D33cffHg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"17c9-kjZ0nHj4ChGkZyuqz+IxFhf4/XI\"",
    "mtime": "2026-04-23T01:48:46.244Z",
    "size": 6089,
    "path": "../public/_nuxt/D33cffHg.js"
  },
  "/_nuxt/DJq8030y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"16a8-SkeIfhv7D7ib5dfqxmhlozEHoXU\"",
    "mtime": "2026-04-23T01:48:46.245Z",
    "size": 5800,
    "path": "../public/_nuxt/DJq8030y.js"
  },
  "/_nuxt/DNB8jku0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"678-KO0NSjnA2d3TraOwk/scNyp8c+4\"",
    "mtime": "2026-04-23T01:48:46.245Z",
    "size": 1656,
    "path": "../public/_nuxt/DNB8jku0.js"
  },
  "/_nuxt/DQRFAFCp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b9a-QuZoMv1c/FqBpOdFjitrdai7un8\"",
    "mtime": "2026-04-23T01:48:46.245Z",
    "size": 2970,
    "path": "../public/_nuxt/DQRFAFCp.js"
  },
  "/_nuxt/DS9oQUvi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9987-5GiwAVAYhsZobpyes5gdw10nIyQ\"",
    "mtime": "2026-04-23T01:48:46.245Z",
    "size": 39303,
    "path": "../public/_nuxt/DS9oQUvi.js"
  },
  "/_nuxt/DSESK5Ql.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"aab-yGYNU9CmYYlKMoOoOKJPpyNyYrI\"",
    "mtime": "2026-04-23T01:48:46.245Z",
    "size": 2731,
    "path": "../public/_nuxt/DSESK5Ql.js"
  },
  "/_nuxt/DXNMhHnP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6b0c-qIaae5Si+NqBNH3kpJbDDlewuZo\"",
    "mtime": "2026-04-23T01:48:46.245Z",
    "size": 27404,
    "path": "../public/_nuxt/DXNMhHnP.js"
  },
  "/_nuxt/D_23my1u.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"f7f-WfauQZlxfdVolcvl/IVFIc4LQNo\"",
    "mtime": "2026-04-23T01:48:46.245Z",
    "size": 3967,
    "path": "../public/_nuxt/D_23my1u.js"
  },
  "/_nuxt/DbouA8N3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b0d-/Sy6wXWmrr9S9fKWEvZTySna2+8\"",
    "mtime": "2026-04-23T01:48:46.245Z",
    "size": 2829,
    "path": "../public/_nuxt/DbouA8N3.js"
  },
  "/_nuxt/Dk9A3Zax.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1cd8-E6K0eqZAX45O8Ltx4p3g6T6PM8c\"",
    "mtime": "2026-04-23T01:48:46.245Z",
    "size": 7384,
    "path": "../public/_nuxt/Dk9A3Zax.js"
  },
  "/_nuxt/DtyGi4oc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"34e5-/ixrynLYHYw0P7XYT3/k2Iy50mI\"",
    "mtime": "2026-04-23T01:48:46.245Z",
    "size": 13541,
    "path": "../public/_nuxt/DtyGi4oc.js"
  },
  "/_nuxt/Dnc586b7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3a56e-oLBh024P10PT4St7e6KkskPRedY\"",
    "mtime": "2026-04-23T01:48:46.245Z",
    "size": 238958,
    "path": "../public/_nuxt/Dnc586b7.js"
  },
  "/_nuxt/TjQ6qzEV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e58a-mFwWjMejlPEM1CEswSFWpp0S/4Q\"",
    "mtime": "2026-04-23T01:48:46.245Z",
    "size": 58762,
    "path": "../public/_nuxt/TjQ6qzEV.js"
  },
  "/_nuxt/TQBvdbEG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"32b8-ftwUhfZZ55K9bCc0bHlBeV+MSL4\"",
    "mtime": "2026-04-23T01:48:46.245Z",
    "size": 12984,
    "path": "../public/_nuxt/TQBvdbEG.js"
  },
  "/_nuxt/_id_ copy.BjmPkTQ8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a4-EcpIwOPPr4EvSw6uepxFy6a5d9w\"",
    "mtime": "2026-04-23T01:48:46.246Z",
    "size": 164,
    "path": "../public/_nuxt/_id_ copy.BjmPkTQ8.css"
  },
  "/_nuxt/_id_ copy 2.gGBm26y-.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12e-Ge4D9R26cJBffYjIUo7dqrt83pA\"",
    "mtime": "2026-04-23T01:48:46.245Z",
    "size": 302,
    "path": "../public/_nuxt/_id_ copy 2.gGBm26y-.css"
  },
  "/_nuxt/_id_ copy.aljRm1qx.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d-E+LYu6bS38Dg/yJxyWeUZyWEuns\"",
    "mtime": "2026-04-23T01:48:46.246Z",
    "size": 397,
    "path": "../public/_nuxt/_id_ copy.aljRm1qx.css"
  },
  "/_nuxt/_id_ copy.yIkhwCcp.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12e-axpTuPeUOggRyLxQWlwBABmaMAs\"",
    "mtime": "2026-04-23T01:48:46.246Z",
    "size": 302,
    "path": "../public/_nuxt/_id_ copy.yIkhwCcp.css"
  },
  "/_nuxt/_id_.-qFXEDHx.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18e-N/R8+mij9UyYk0TMBffns2dMDi4\"",
    "mtime": "2026-04-23T01:48:46.246Z",
    "size": 398,
    "path": "../public/_nuxt/_id_.-qFXEDHx.css"
  },
  "/_nuxt/_id_.BgFhrzoY.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e8-QLvNkN3GPFe62jmbj8m80eGuRTY\"",
    "mtime": "2026-04-23T01:48:46.246Z",
    "size": 232,
    "path": "../public/_nuxt/_id_.BgFhrzoY.css"
  },
  "/_nuxt/_id_.CoNJG1Oi.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"11d-tpDQFLC/Y/ewZBC3qHngGIKqdRQ\"",
    "mtime": "2026-04-23T01:48:46.246Z",
    "size": 285,
    "path": "../public/_nuxt/_id_.CoNJG1Oi.css"
  },
  "/_nuxt/_id_.lV7vQ-d8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d-PdzhTWXbHMB7DoDmGOdJ3AUQ8Ds\"",
    "mtime": "2026-04-23T01:48:46.246Z",
    "size": 397,
    "path": "../public/_nuxt/_id_.lV7vQ-d8.css"
  },
  "/_nuxt/_id_.xR5Xo_QV.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d-uD6tRyC/V6To5MzELP9zAw5aalk\"",
    "mtime": "2026-04-23T01:48:46.246Z",
    "size": 397,
    "path": "../public/_nuxt/_id_.xR5Xo_QV.css"
  },
  "/_nuxt/aktE2dyw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"21fc-QRJ89z4bx82fjIAm95V4qjs69zc\"",
    "mtime": "2026-04-23T01:48:46.246Z",
    "size": 8700,
    "path": "../public/_nuxt/aktE2dyw.js"
  },
  "/_nuxt/auth.DhnbUfU2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b1-l18aHNdE1GQldEfCIehDH0sT9To\"",
    "mtime": "2026-04-23T01:48:46.246Z",
    "size": 177,
    "path": "../public/_nuxt/auth.DhnbUfU2.css"
  },
  "/_nuxt/ayudmcJL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3d-rosUUnCfinEtly5Y+9XyzHJmh4Y\"",
    "mtime": "2026-04-23T01:48:46.246Z",
    "size": 61,
    "path": "../public/_nuxt/ayudmcJL.js"
  },
  "/_nuxt/create copy 2.B4IiI5lS.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"af-WPwWIQKRCzcsQzGZGweBKG/Xx2I\"",
    "mtime": "2026-04-23T01:48:46.246Z",
    "size": 175,
    "path": "../public/_nuxt/create copy 2.B4IiI5lS.css"
  },
  "/_nuxt/create copy 3.DHfqbhAp.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"af-3vZclyLbpOgSIcBG8HcbimWLgE0\"",
    "mtime": "2026-04-23T01:48:46.247Z",
    "size": 175,
    "path": "../public/_nuxt/create copy 3.DHfqbhAp.css"
  },
  "/_nuxt/create copy.D13IXyDs.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"af-hVbJRt8yus8E0+RRzYYfYx96w8Q\"",
    "mtime": "2026-04-23T01:48:46.247Z",
    "size": 175,
    "path": "../public/_nuxt/create copy.D13IXyDs.css"
  },
  "/_nuxt/create copy.DmBx_o2h.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"af-tgdB2Lb8I7enE7lho+hot+mMkas\"",
    "mtime": "2026-04-23T01:48:46.247Z",
    "size": 175,
    "path": "../public/_nuxt/create copy.DmBx_o2h.css"
  },
  "/_nuxt/create copy.DuL5O5iK.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d-D+0o4VtUFNvG6LTUDqyOQbSwD/g\"",
    "mtime": "2026-04-23T01:48:46.247Z",
    "size": 397,
    "path": "../public/_nuxt/create copy.DuL5O5iK.css"
  },
  "/_nuxt/create copy.rI-ZbuTL.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e6-PID+Qgya2HfvuuolR23snPYs+Ks\"",
    "mtime": "2026-04-23T01:48:46.247Z",
    "size": 486,
    "path": "../public/_nuxt/create copy.rI-ZbuTL.css"
  },
  "/_nuxt/create.CmP4Elb5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d-wMYXDmYktcQYlyhzZUFlZraJorI\"",
    "mtime": "2026-04-23T01:48:46.247Z",
    "size": 397,
    "path": "../public/_nuxt/create.CmP4Elb5.css"
  },
  "/_nuxt/create.CmWCj2JX.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e8-LUuvjDEdLxB5Fh3Wk9dGJ/hvT7E\"",
    "mtime": "2026-04-23T01:48:46.247Z",
    "size": 232,
    "path": "../public/_nuxt/create.CmWCj2JX.css"
  },
  "/_nuxt/create.D9ExtPdH.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10e-XLHwdef1iqre4ZqrZzzQ5y1hGeU\"",
    "mtime": "2026-04-23T01:48:46.247Z",
    "size": 270,
    "path": "../public/_nuxt/create.D9ExtPdH.css"
  },
  "/_nuxt/create.DhdCE4LH.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13e-MB3MTbSNaf0ukRXLf5XhuJ5yZyw\"",
    "mtime": "2026-04-23T01:48:46.247Z",
    "size": 318,
    "path": "../public/_nuxt/create.DhdCE4LH.css"
  },
  "/_nuxt/create.KM63edCC.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13e-1WtM+5fa9wiLbMLPeg7vqeTfcZI\"",
    "mtime": "2026-04-23T01:48:46.247Z",
    "size": 318,
    "path": "../public/_nuxt/create.KM63edCC.css"
  },
  "/_nuxt/error-404.NYILrxgj.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"97e-GFVyO3shLCU1+znfmiCGMSvrSL0\"",
    "mtime": "2026-04-23T01:48:46.247Z",
    "size": 2430,
    "path": "../public/_nuxt/error-404.NYILrxgj.css"
  },
  "/_nuxt/entry.CpWtNKrL.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1b9c0-Yszo4jwjcw2knxUzaI78TTS+G24\"",
    "mtime": "2026-04-23T01:48:46.247Z",
    "size": 113088,
    "path": "../public/_nuxt/entry.CpWtNKrL.css"
  },
  "/_nuxt/error-500.BTQFLit9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"773-JX4+WaF8eiOXhWyk6YlOumOzers\"",
    "mtime": "2026-04-23T01:48:46.247Z",
    "size": 1907,
    "path": "../public/_nuxt/error-500.BTQFLit9.css"
  },
  "/_nuxt/index copy.CKME-vOd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"105-tUQ7fIuNlGu8tKUEzyJb5q94xv0\"",
    "mtime": "2026-04-23T01:48:46.249Z",
    "size": 261,
    "path": "../public/_nuxt/index copy.CKME-vOd.css"
  },
  "/_nuxt/index.BTJtnz7e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"bc-9xJawyTbo0MBdG0r+D3iq/gpYMQ\"",
    "mtime": "2026-04-23T01:48:46.249Z",
    "size": 188,
    "path": "../public/_nuxt/index.BTJtnz7e.css"
  },
  "/_nuxt/index.BvGRF1xV.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"bc-y2StVd6NHEBG9jatGQ4X7yC2pRE\"",
    "mtime": "2026-04-23T01:48:46.249Z",
    "size": 188,
    "path": "../public/_nuxt/index.BvGRF1xV.css"
  },
  "/_nuxt/index.Chnz7mBg.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5d-VqLwBxxbs4AOErYDEafeBhMO1UU\"",
    "mtime": "2026-04-23T01:48:46.249Z",
    "size": 93,
    "path": "../public/_nuxt/index.Chnz7mBg.css"
  },
  "/_nuxt/index.DQ22RV-i.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"bc-z1kDto98IkewaKrOPp+ahaZV5vM\"",
    "mtime": "2026-04-23T01:48:46.249Z",
    "size": 188,
    "path": "../public/_nuxt/index.DQ22RV-i.css"
  },
  "/_nuxt/index.DKZtKc8r.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"159-GJAlJFi5E/DVthwXbygP7hVdQTc\"",
    "mtime": "2026-04-23T01:48:46.250Z",
    "size": 345,
    "path": "../public/_nuxt/index.DKZtKc8r.css"
  },
  "/_nuxt/index.DoPPhCRD.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"105-jVmJ1XkBCrBJ+7m9n+ov0aMFf2o\"",
    "mtime": "2026-04-23T01:48:46.250Z",
    "size": 261,
    "path": "../public/_nuxt/index.DoPPhCRD.css"
  },
  "/_nuxt/index.wJBc7rmG.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"105-61esuN0AoXAeQXfL+rptPobPUoo\"",
    "mtime": "2026-04-23T01:48:46.249Z",
    "size": 261,
    "path": "../public/_nuxt/index.wJBc7rmG.css"
  },
  "/_nuxt/k6VCT92J.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b2d-HvO6oxUsNd6dT1QqUbCrGHgRwxM\"",
    "mtime": "2026-04-23T01:48:46.250Z",
    "size": 2861,
    "path": "../public/_nuxt/k6VCT92J.js"
  },
  "/_nuxt/kLf9ctkK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-/mp7dc8OC2A+5+sTzu2+ac/vbAI\"",
    "mtime": "2026-04-23T01:48:46.250Z",
    "size": 78,
    "path": "../public/_nuxt/kLf9ctkK.js"
  },
  "/_nuxt/print-atm.8yjJfoGW.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"851-jhSjvHlZz4Ba22czDrqNdA+4QFc\"",
    "mtime": "2026-04-23T01:48:46.250Z",
    "size": 2129,
    "path": "../public/_nuxt/print-atm.8yjJfoGW.css"
  },
  "/_nuxt/print-contract2.D4kgQSqY.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9f4-v+b4GZbJhNwbj4WsZ2XOmCkyhf4\"",
    "mtime": "2026-04-23T01:48:46.250Z",
    "size": 2548,
    "path": "../public/_nuxt/print-contract2.D4kgQSqY.css"
  },
  "/_nuxt/print-landlayout.BOXpWzP5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"941-G6VUZooPhaXDQe7oqclCOJuT1ks\"",
    "mtime": "2026-04-23T01:48:46.250Z",
    "size": 2369,
    "path": "../public/_nuxt/print-landlayout.BOXpWzP5.css"
  },
  "/_nuxt/print-receipt2.C2N02j7Q.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9f4-H5HN4WnhvGCDzXxNk38I07IMIHE\"",
    "mtime": "2026-04-23T01:48:46.250Z",
    "size": 2548,
    "path": "../public/_nuxt/print-receipt2.C2N02j7Q.css"
  },
  "/_nuxt/print-sched copy.CDVUyUuc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a34-sfn3X5u5GSJW7gFgVeejEgW3oW4\"",
    "mtime": "2026-04-23T01:48:46.251Z",
    "size": 2612,
    "path": "../public/_nuxt/print-sched copy.CDVUyUuc.css"
  },
  "/_nuxt/print-sched2.Dv4eTrCV.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7db-wkQTPj7vguYKocWl9bNbr44at+0\"",
    "mtime": "2026-04-23T01:48:46.250Z",
    "size": 2011,
    "path": "../public/_nuxt/print-sched2.Dv4eTrCV.css"
  },
  "/_nuxt/print.CzU1XS6o.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"709-7A4Q3GHYul04cZQwKDEACzF7HPA\"",
    "mtime": "2026-04-23T01:48:46.251Z",
    "size": 1801,
    "path": "../public/_nuxt/print.CzU1XS6o.css"
  },
  "/_nuxt/qoG7u9nY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"115e-BHnXXXhjLh8+Oyl4B28U5nRvt7M\"",
    "mtime": "2026-04-23T01:48:46.251Z",
    "size": 4446,
    "path": "../public/_nuxt/qoG7u9nY.js"
  },
  "/_nuxt/soUfglLb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1529-uguDrnuBzpZ3J3Ftv7dtSExQUzk\"",
    "mtime": "2026-04-23T01:48:46.251Z",
    "size": 5417,
    "path": "../public/_nuxt/soUfglLb.js"
  },
  "/_nuxt/wcw5qTfb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"318-GwDLYvd346t2yI0MF49EFCWhtPw\"",
    "mtime": "2026-04-23T01:48:46.251Z",
    "size": 792,
    "path": "../public/_nuxt/wcw5qTfb.js"
  },
  "/fonts/static/Roboto-Black.ttf": {
    "type": "font/ttf",
    "etag": "\"2723c-xSC3YR8F8Ax+fxJC55hD657HcGQ\"",
    "mtime": "2026-04-23T01:48:46.269Z",
    "size": 160316,
    "path": "../public/fonts/static/Roboto-Black.ttf"
  },
  "/fonts/static/Roboto-BlackItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"28b7c-7CeLhJT9RpHht0ctCyOBkwbeS3Y\"",
    "mtime": "2026-04-23T01:48:46.283Z",
    "size": 166780,
    "path": "../public/fonts/static/Roboto-BlackItalic.ttf"
  },
  "/fonts/static/Roboto-Bold.ttf": {
    "type": "font/ttf",
    "etag": "\"2709c-PkVfUXNUpFgHZI+9PXGturL06QU\"",
    "mtime": "2026-04-23T01:48:46.291Z",
    "size": 159900,
    "path": "../public/fonts/static/Roboto-Bold.ttf"
  },
  "/fonts/static/Roboto-BoldItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"28970-irMyNQiIlJFaEWB1b8O9ty6tw6E\"",
    "mtime": "2026-04-23T01:48:46.282Z",
    "size": 166256,
    "path": "../public/fonts/static/Roboto-BoldItalic.ttf"
  },
  "/fonts/static/Roboto-ExtraBold.ttf": {
    "type": "font/ttf",
    "etag": "\"2710c-C+zlj7S1DQB6af3LWxF72ocGmV4\"",
    "mtime": "2026-04-23T01:48:46.282Z",
    "size": 160012,
    "path": "../public/fonts/static/Roboto-ExtraBold.ttf"
  },
  "/fonts/static/Roboto-ExtraBoldItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"28a1c-0PeVoiXl+Lp+W1wI3TAtU04TyC8\"",
    "mtime": "2026-04-23T01:48:46.282Z",
    "size": 166428,
    "path": "../public/fonts/static/Roboto-ExtraBoldItalic.ttf"
  },
  "/fonts/static/Roboto-ExtraLight.ttf": {
    "type": "font/ttf",
    "etag": "\"26de0-G8CbnXga6HkTTY16XPiIXvvolIE\"",
    "mtime": "2026-04-23T01:48:46.283Z",
    "size": 159200,
    "path": "../public/fonts/static/Roboto-ExtraLight.ttf"
  },
  "/fonts/static/Roboto-ExtraLightItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"283ac-XC4Lu18uTWtwP7+GgZOr8RVFm2Y\"",
    "mtime": "2026-04-23T01:48:46.283Z",
    "size": 164780,
    "path": "../public/fonts/static/Roboto-ExtraLightItalic.ttf"
  },
  "/fonts/static/Roboto-Italic.ttf": {
    "type": "font/ttf",
    "etag": "\"28594-0eOQq9TgqbIuwKSLVDy21sLWNgo\"",
    "mtime": "2026-04-23T01:48:46.283Z",
    "size": 165268,
    "path": "../public/fonts/static/Roboto-Italic.ttf"
  },
  "/fonts/static/Roboto-Light.ttf": {
    "type": "font/ttf",
    "etag": "\"26de0-MLxQ5F/T2AmefUbY3tV4a3HM3V8\"",
    "mtime": "2026-04-23T01:48:46.283Z",
    "size": 159200,
    "path": "../public/fonts/static/Roboto-Light.ttf"
  },
  "/fonts/static/Roboto-LightItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"284bc-AJ7okkBKkGPlmTu8/MQ6pMnO3Gg\"",
    "mtime": "2026-04-23T01:48:46.284Z",
    "size": 165052,
    "path": "../public/fonts/static/Roboto-LightItalic.ttf"
  },
  "/fonts/static/Roboto-Medium.ttf": {
    "type": "font/ttf",
    "etag": "\"26e40-+BYzOYGHdWo0e8bUOq16j8NWFxs\"",
    "mtime": "2026-04-23T01:48:46.285Z",
    "size": 159296,
    "path": "../public/fonts/static/Roboto-Medium.ttf"
  },
  "/fonts/static/Roboto-MediumItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"286cc-rAzkuBUeSLkhpkX0+NwRM+cwRYU\"",
    "mtime": "2026-04-23T01:48:46.285Z",
    "size": 165580,
    "path": "../public/fonts/static/Roboto-MediumItalic.ttf"
  },
  "/fonts/static/Roboto-Regular.ttf": {
    "type": "font/ttf",
    "etag": "\"26d84-y2zFcQdkufBrjYySP5YePBzrelk\"",
    "mtime": "2026-04-23T01:48:46.285Z",
    "size": 159108,
    "path": "../public/fonts/static/Roboto-Regular.ttf"
  },
  "/fonts/static/Roboto-SemiBold.ttf": {
    "type": "font/ttf",
    "etag": "\"27084-DmsquNGRmyeKdkrnqIR5bHX6nEk\"",
    "mtime": "2026-04-23T01:48:46.285Z",
    "size": 159876,
    "path": "../public/fonts/static/Roboto-SemiBold.ttf"
  },
  "/fonts/static/Roboto-SemiBoldItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"28904-vUkV123BzwaT4K5+Uvob35lp24U\"",
    "mtime": "2026-04-23T01:48:46.285Z",
    "size": 166148,
    "path": "../public/fonts/static/Roboto-SemiBoldItalic.ttf"
  },
  "/fonts/static/Roboto-Thin.ttf": {
    "type": "font/ttf",
    "etag": "\"26c78-h24f/9lAjNlLGXj6z+BCPLnHsgE\"",
    "mtime": "2026-04-23T01:48:46.286Z",
    "size": 158840,
    "path": "../public/fonts/static/Roboto-Thin.ttf"
  },
  "/fonts/static/Roboto-ThinItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"28124-rBpZZh9ADMCEsqyfaq9Yj/rU9do\"",
    "mtime": "2026-04-23T01:48:46.287Z",
    "size": 164132,
    "path": "../public/fonts/static/Roboto-ThinItalic.ttf"
  },
  "/fonts/static/Roboto_Condensed-Black.ttf": {
    "type": "font/ttf",
    "etag": "\"27198-+mfPlsXzZdnq/gP1U1Tx83hTx+g\"",
    "mtime": "2026-04-23T01:48:46.287Z",
    "size": 160152,
    "path": "../public/fonts/static/Roboto_Condensed-Black.ttf"
  },
  "/fonts/static/Roboto_Condensed-BlackItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"28b5c-xUyJjI4wm5S9I6AU6w+Yj+luYio\"",
    "mtime": "2026-04-23T01:48:46.287Z",
    "size": 166748,
    "path": "../public/fonts/static/Roboto_Condensed-BlackItalic.ttf"
  },
  "/fonts/static/Roboto_Condensed-Bold.ttf": {
    "type": "font/ttf",
    "etag": "\"26fa8-XvWj1zhjGK0TBfNR+UOwYmAdISg\"",
    "mtime": "2026-04-23T01:48:46.287Z",
    "size": 159656,
    "path": "../public/fonts/static/Roboto_Condensed-Bold.ttf"
  },
  "/fonts/static/Roboto_Condensed-BoldItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"2890c-NNUjUDaaOjmkiVfFLjB5QQwlzK8\"",
    "mtime": "2026-04-23T01:48:46.288Z",
    "size": 166156,
    "path": "../public/fonts/static/Roboto_Condensed-BoldItalic.ttf"
  },
  "/fonts/static/Roboto_Condensed-ExtraBold.ttf": {
    "type": "font/ttf",
    "etag": "\"270cc-L1mjMte+Dtijt+AtVgU26tOCcTY\"",
    "mtime": "2026-04-23T01:48:46.288Z",
    "size": 159948,
    "path": "../public/fonts/static/Roboto_Condensed-ExtraBold.ttf"
  },
  "/fonts/static/Roboto_Condensed-ExtraBoldItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"28a68-DeZDn2gmE1vxHHEFKMs4XweGE4g\"",
    "mtime": "2026-04-23T01:48:46.288Z",
    "size": 166504,
    "path": "../public/fonts/static/Roboto_Condensed-ExtraBoldItalic.ttf"
  },
  "/fonts/static/Roboto_Condensed-ExtraLight.ttf": {
    "type": "font/ttf",
    "etag": "\"26e70-nEiRoHW7AZlLlpLbAAVVJympuDA\"",
    "mtime": "2026-04-23T01:48:46.291Z",
    "size": 159344,
    "path": "../public/fonts/static/Roboto_Condensed-ExtraLight.ttf"
  },
  "/fonts/static/Roboto_Condensed-ExtraLightItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"2868c-PCzIlNMA0d79pzONgrqCVhUdeLg\"",
    "mtime": "2026-04-23T01:48:46.291Z",
    "size": 165516,
    "path": "../public/fonts/static/Roboto_Condensed-ExtraLightItalic.ttf"
  },
  "/fonts/static/Roboto_Condensed-Italic.ttf": {
    "type": "font/ttf",
    "etag": "\"285bc-m8KvuGPSD1Rs57AgBwmxbi9uaeU\"",
    "mtime": "2026-04-23T01:48:46.292Z",
    "size": 165308,
    "path": "../public/fonts/static/Roboto_Condensed-Italic.ttf"
  },
  "/fonts/static/Roboto_Condensed-Light.ttf": {
    "type": "font/ttf",
    "etag": "\"26de0-SaNYQaNhxikhWRhhEiwRkDVrYpI\"",
    "mtime": "2026-04-23T01:48:46.292Z",
    "size": 159200,
    "path": "../public/fonts/static/Roboto_Condensed-Light.ttf"
  },
  "/fonts/static/Roboto_Condensed-LightItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"286e4-1ItGeJCH8EkrXTsH5vuLoSuP9q4\"",
    "mtime": "2026-04-23T01:48:46.292Z",
    "size": 165604,
    "path": "../public/fonts/static/Roboto_Condensed-LightItalic.ttf"
  },
  "/fonts/static/Roboto_Condensed-Medium.ttf": {
    "type": "font/ttf",
    "etag": "\"26d68-mSQrO09k0ZY9IUCAE90IY7QAJ2w\"",
    "mtime": "2026-04-23T01:48:46.292Z",
    "size": 159080,
    "path": "../public/fonts/static/Roboto_Condensed-Medium.ttf"
  },
  "/fonts/static/Roboto_Condensed-MediumItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"286d0-KAer+FwzpU6g+fhSW+lax7p1EL8\"",
    "mtime": "2026-04-23T01:48:46.293Z",
    "size": 165584,
    "path": "../public/fonts/static/Roboto_Condensed-MediumItalic.ttf"
  },
  "/fonts/static/Roboto_Condensed-Regular.ttf": {
    "type": "font/ttf",
    "etag": "\"26cfc-oh7rdF72EIWS8pK0MSf/9lvOEfs\"",
    "mtime": "2026-04-23T01:48:46.293Z",
    "size": 158972,
    "path": "../public/fonts/static/Roboto_Condensed-Regular.ttf"
  },
  "/fonts/static/Roboto_Condensed-SemiBold.ttf": {
    "type": "font/ttf",
    "etag": "\"26f70-CXjkfTHgResLvRaW+hmWtoul9BM\"",
    "mtime": "2026-04-23T01:48:46.294Z",
    "size": 159600,
    "path": "../public/fonts/static/Roboto_Condensed-SemiBold.ttf"
  },
  "/fonts/static/Roboto_Condensed-SemiBoldItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"2879c-GyX8DIlsuldU8JytzikWT2P407k\"",
    "mtime": "2026-04-23T01:48:46.295Z",
    "size": 165788,
    "path": "../public/fonts/static/Roboto_Condensed-SemiBoldItalic.ttf"
  },
  "/fonts/static/Roboto_Condensed-Thin.ttf": {
    "type": "font/ttf",
    "etag": "\"26ea8-MjH1rkiKu7XYJks1vIXLxE8q+Q8\"",
    "mtime": "2026-04-23T01:48:46.294Z",
    "size": 159400,
    "path": "../public/fonts/static/Roboto_Condensed-Thin.ttf"
  },
  "/fonts/static/Roboto_Condensed-ThinItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"284dc-+U055toDMmkpvJg9uDXmUPmCtDM\"",
    "mtime": "2026-04-23T01:48:46.294Z",
    "size": 165084,
    "path": "../public/fonts/static/Roboto_Condensed-ThinItalic.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-Black.ttf": {
    "type": "font/ttf",
    "etag": "\"27284-FiIWVLt3dBGnASJxoL4FbpBysfU\"",
    "mtime": "2026-04-23T01:48:46.294Z",
    "size": 160388,
    "path": "../public/fonts/static/Roboto_SemiCondensed-Black.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-BlackItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"28bf0-VuYg09ymTwUmwC4lI+I0JQhMtys\"",
    "mtime": "2026-04-23T01:48:46.295Z",
    "size": 166896,
    "path": "../public/fonts/static/Roboto_SemiCondensed-BlackItalic.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-Bold.ttf": {
    "type": "font/ttf",
    "etag": "\"27054-KpPRv+BDkXW97aiRSAgrohJ6dv4\"",
    "mtime": "2026-04-23T01:48:46.295Z",
    "size": 159828,
    "path": "../public/fonts/static/Roboto_SemiCondensed-Bold.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-BoldItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"28970-r7SoaB6hGbl9rdmqiKebFbxzOyE\"",
    "mtime": "2026-04-23T01:48:46.295Z",
    "size": 166256,
    "path": "../public/fonts/static/Roboto_SemiCondensed-BoldItalic.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-ExtraBold.ttf": {
    "type": "font/ttf",
    "etag": "\"270f4-MMtcbgkS1asWSKFkPtpfjG+Afmg\"",
    "mtime": "2026-04-23T01:48:46.296Z",
    "size": 159988,
    "path": "../public/fonts/static/Roboto_SemiCondensed-ExtraBold.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-ExtraBoldItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"28a7c-Uex/i1PJUEst86l+VQGaPTO4mCU\"",
    "mtime": "2026-04-23T01:48:46.296Z",
    "size": 166524,
    "path": "../public/fonts/static/Roboto_SemiCondensed-ExtraBoldItalic.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-ExtraLight.ttf": {
    "type": "font/ttf",
    "etag": "\"26e58-FDy55b159LEFmSXlYk+BD6IVZok\"",
    "mtime": "2026-04-23T01:48:46.298Z",
    "size": 159320,
    "path": "../public/fonts/static/Roboto_SemiCondensed-ExtraLight.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-ExtraLightItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"2858c-Ghr6bZA+OjbQc1GhHxCPkKr0a34\"",
    "mtime": "2026-04-23T01:48:46.299Z",
    "size": 165260,
    "path": "../public/fonts/static/Roboto_SemiCondensed-ExtraLightItalic.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-Italic.ttf": {
    "type": "font/ttf",
    "etag": "\"285d4-jmd8GvXTeR8kYjOXxkNgpnLFH60\"",
    "mtime": "2026-04-23T01:48:46.299Z",
    "size": 165332,
    "path": "../public/fonts/static/Roboto_SemiCondensed-Italic.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-Light.ttf": {
    "type": "font/ttf",
    "etag": "\"26e20-lI2J4tMgcV8v+4q2aMV/Tz2p340\"",
    "mtime": "2026-04-23T01:48:46.300Z",
    "size": 159264,
    "path": "../public/fonts/static/Roboto_SemiCondensed-Light.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-LightItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"2866c-3Hqv2/n7juY5D3peeznA06esh4Y\"",
    "mtime": "2026-04-23T01:48:46.301Z",
    "size": 165484,
    "path": "../public/fonts/static/Roboto_SemiCondensed-LightItalic.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-Medium.ttf": {
    "type": "font/ttf",
    "etag": "\"26e1c-tTCHQGifozLVeYoZRTYJb7IG3Ys\"",
    "mtime": "2026-04-23T01:48:46.301Z",
    "size": 159260,
    "path": "../public/fonts/static/Roboto_SemiCondensed-Medium.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-MediumItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"286e4-dIzinB+oJslyRBCJ1qn02JLsMAM\"",
    "mtime": "2026-04-23T01:48:46.301Z",
    "size": 165604,
    "path": "../public/fonts/static/Roboto_SemiCondensed-MediumItalic.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-Regular.ttf": {
    "type": "font/ttf",
    "etag": "\"26d70-OALMzg42EEV2jPwggO0jG0mMLhk\"",
    "mtime": "2026-04-23T01:48:46.301Z",
    "size": 159088,
    "path": "../public/fonts/static/Roboto_SemiCondensed-Regular.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-SemiBold.ttf": {
    "type": "font/ttf",
    "etag": "\"27044-hiGk7qwGrmk1yCfuSjHL5U5LAvs\"",
    "mtime": "2026-04-23T01:48:46.302Z",
    "size": 159812,
    "path": "../public/fonts/static/Roboto_SemiCondensed-SemiBold.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-SemiBoldItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"28850-UWdAHj5FkVIpr5YwdJ675WKMD3g\"",
    "mtime": "2026-04-23T01:48:46.301Z",
    "size": 165968,
    "path": "../public/fonts/static/Roboto_SemiCondensed-SemiBoldItalic.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-Thin.ttf": {
    "type": "font/ttf",
    "etag": "\"26e60-xyRxSjXME68XSOIG9afMURjy/UI\"",
    "mtime": "2026-04-23T01:48:46.302Z",
    "size": 159328,
    "path": "../public/fonts/static/Roboto_SemiCondensed-Thin.ttf"
  },
  "/fonts/static/Roboto_SemiCondensed-ThinItalic.ttf": {
    "type": "font/ttf",
    "etag": "\"283b4-p70JvtdtyZ5/UGhLgJiAySqZTfg\"",
    "mtime": "2026-04-23T01:48:46.305Z",
    "size": 164788,
    "path": "../public/fonts/static/Roboto_SemiCondensed-ThinItalic.ttf"
  },
  "/images/chat/chat.jpg": {
    "type": "image/jpeg",
    "etag": "\"11ac0-4/7VHS2rckrFInf0KHX/NnC8E3A\"",
    "mtime": "2026-04-23T01:48:46.270Z",
    "size": 72384,
    "path": "../public/images/chat/chat.jpg"
  },
  "/images/carousel/carousel-03.png": {
    "type": "image/png",
    "etag": "\"713e8-oHvLKsj2IP+9LaD6x6Jk7oeY95U\"",
    "mtime": "2026-04-23T01:48:46.308Z",
    "size": 463848,
    "path": "../public/images/carousel/carousel-03.png"
  },
  "/images/cards/card-02.jpg": {
    "type": "image/jpeg",
    "etag": "\"2862a-WVqCd5J6QvfbLxU5OJEl530h/aM\"",
    "mtime": "2026-04-23T01:48:46.308Z",
    "size": 165418,
    "path": "../public/images/cards/card-02.jpg"
  },
  "/images/cards/card-01.jpg": {
    "type": "image/jpeg",
    "etag": "\"38b84-GpQZDU9Jpxc1ACIiken2iwZa1eo\"",
    "mtime": "2026-04-23T01:48:46.270Z",
    "size": 232324,
    "path": "../public/images/cards/card-01.jpg"
  },
  "/images/cards/card-01.png": {
    "type": "image/png",
    "etag": "\"569f3-tf6Z9OnmQnxJeYXQaGZCOTVgeSk\"",
    "mtime": "2026-04-23T01:48:46.309Z",
    "size": 354803,
    "path": "../public/images/cards/card-01.png"
  },
  "/images/cards/card-02.png": {
    "type": "image/png",
    "etag": "\"4185f-+71tbQd9CcJq56pZk7Ow5VYQc7I\"",
    "mtime": "2026-04-23T01:48:46.310Z",
    "size": 268383,
    "path": "../public/images/cards/card-02.png"
  },
  "/images/cards/card-03.png": {
    "type": "image/png",
    "etag": "\"4e228-Ocn8KtM0BeVWD1s86bCT/JnkaEc\"",
    "mtime": "2026-04-23T01:48:46.313Z",
    "size": 320040,
    "path": "../public/images/cards/card-03.png"
  },
  "/images/country/country-01.svg": {
    "type": "image/svg+xml",
    "etag": "\"894-2eJj5J5S0Tev84hgg4W87gpQU+4\"",
    "mtime": "2026-04-23T01:48:46.270Z",
    "size": 2196,
    "path": "../public/images/country/country-01.svg"
  },
  "/images/cards/card-03.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f343-uOMkH6YO5upcM68Qymd0LBqx7vg\"",
    "mtime": "2026-04-23T01:48:46.313Z",
    "size": 193347,
    "path": "../public/images/cards/card-03.jpg"
  },
  "/images/carousel/carousel-02.png": {
    "type": "image/png",
    "etag": "\"b00ed-RKJ5wCutncXLaU0LgKXW7h5DeLw\"",
    "mtime": "2026-04-23T01:48:46.309Z",
    "size": 721133,
    "path": "../public/images/carousel/carousel-02.png"
  },
  "/images/carousel/carousel-01.png": {
    "type": "image/png",
    "etag": "\"d92ec-QgdOoMfh3vOr+87Y6l4DkfPeFKE\"",
    "mtime": "2026-04-23T01:48:46.271Z",
    "size": 889580,
    "path": "../public/images/carousel/carousel-01.png"
  },
  "/images/carousel/carousel-04.png": {
    "type": "image/png",
    "etag": "\"d4403-ZjbO5XUiatD8hul+BnGCYKa99PA\"",
    "mtime": "2026-04-23T01:48:46.309Z",
    "size": 869379,
    "path": "../public/images/carousel/carousel-04.png"
  },
  "/images/country/country-02.svg": {
    "type": "image/svg+xml",
    "etag": "\"2a8-PftPUIqF4sgExpSOrWVJeX4tb7k\"",
    "mtime": "2026-04-23T01:48:46.311Z",
    "size": 680,
    "path": "../public/images/country/country-02.svg"
  },
  "/images/country/country-03.svg": {
    "type": "image/svg+xml",
    "etag": "\"73f-qqeExO1poIO32HwHpydrTZFbBKs\"",
    "mtime": "2026-04-23T01:48:46.311Z",
    "size": 1855,
    "path": "../public/images/country/country-03.svg"
  },
  "/images/country/country-04.svg": {
    "type": "image/svg+xml",
    "etag": "\"99a-2qxbeTT8m/txKrqwkN0WXUPzalo\"",
    "mtime": "2026-04-23T01:48:46.309Z",
    "size": 2458,
    "path": "../public/images/country/country-04.svg"
  },
  "/images/country/country-05.svg": {
    "type": "image/svg+xml",
    "etag": "\"2f6-ntVzkUTfW+pElHiw82ICacVTNmA\"",
    "mtime": "2026-04-23T01:48:46.311Z",
    "size": 758,
    "path": "../public/images/country/country-05.svg"
  },
  "/images/country/country-06.svg": {
    "type": "image/svg+xml",
    "etag": "\"382-de79t0sRrfRcKxQt4rSJSPm+CX0\"",
    "mtime": "2026-04-23T01:48:46.311Z",
    "size": 898,
    "path": "../public/images/country/country-06.svg"
  },
  "/images/country/country-07.svg": {
    "type": "image/svg+xml",
    "etag": "\"36a-JLv0AllS0PPPxX4afNOum3mS6DU\"",
    "mtime": "2026-04-23T01:48:46.311Z",
    "size": 874,
    "path": "../public/images/country/country-07.svg"
  },
  "/images/country/country-08.svg": {
    "type": "image/svg+xml",
    "etag": "\"2bf-bzwmstuNbtB+khy9JlFvC+sK66Y\"",
    "mtime": "2026-04-23T01:48:46.311Z",
    "size": 703,
    "path": "../public/images/country/country-08.svg"
  },
  "/images/brand/brand-01.svg": {
    "type": "image/svg+xml",
    "etag": "\"627-SiydX5DG/mU/LY8Un07rKfo4+7o\"",
    "mtime": "2026-04-23T01:48:46.269Z",
    "size": 1575,
    "path": "../public/images/brand/brand-01.svg"
  },
  "/images/brand/brand-02.svg": {
    "type": "image/svg+xml",
    "etag": "\"2d5-zsdymc9BILPsMYF5/hUxVL3NHls\"",
    "mtime": "2026-04-23T01:48:46.304Z",
    "size": 725,
    "path": "../public/images/brand/brand-02.svg"
  },
  "/images/brand/brand-03.svg": {
    "type": "image/svg+xml",
    "etag": "\"344-94OWkcbDG7srNBuD4fyKwusjjrk\"",
    "mtime": "2026-04-23T01:48:46.302Z",
    "size": 836,
    "path": "../public/images/brand/brand-03.svg"
  },
  "/images/brand/brand-04.svg": {
    "type": "image/svg+xml",
    "etag": "\"cd4-bGv+Ns0Kgo9ZUWINyO7SSU7h7yo\"",
    "mtime": "2026-04-23T01:48:46.302Z",
    "size": 3284,
    "path": "../public/images/brand/brand-04.svg"
  },
  "/images/brand/brand-05.svg": {
    "type": "image/svg+xml",
    "etag": "\"49d-gbcIQGkY4IEWeU/7pzAANDqx6Pk\"",
    "mtime": "2026-04-23T01:48:46.304Z",
    "size": 1181,
    "path": "../public/images/brand/brand-05.svg"
  },
  "/images/brand/brand-06.svg": {
    "type": "image/svg+xml",
    "etag": "\"2ac-NYfJbIVVEH38e0nwsePnbGVWDQw\"",
    "mtime": "2026-04-23T01:48:46.304Z",
    "size": 684,
    "path": "../public/images/brand/brand-06.svg"
  },
  "/images/brand/brand-07.svg": {
    "type": "image/svg+xml",
    "etag": "\"461-LeKwPtBOyyEK3d8OXdjsFaGcBz8\"",
    "mtime": "2026-04-23T01:48:46.302Z",
    "size": 1121,
    "path": "../public/images/brand/brand-07.svg"
  },
  "/images/brand/brand-08.svg": {
    "type": "image/svg+xml",
    "etag": "\"a67-gjcolo76wCvQjX+XGZ02xWB87h8\"",
    "mtime": "2026-04-23T01:48:46.304Z",
    "size": 2663,
    "path": "../public/images/brand/brand-08.svg"
  },
  "/images/brand/brand-09.svg": {
    "type": "image/svg+xml",
    "etag": "\"37c-KMHdlSChaqNEFkkTZiPMCUh/ctw\"",
    "mtime": "2026-04-23T01:48:46.304Z",
    "size": 892,
    "path": "../public/images/brand/brand-09.svg"
  },
  "/images/brand/brand-10.svg": {
    "type": "image/svg+xml",
    "etag": "\"90a-pwb9cU7/lWjyFg91MG2KEeI0umE\"",
    "mtime": "2026-04-23T01:48:46.305Z",
    "size": 2314,
    "path": "../public/images/brand/brand-10.svg"
  },
  "/images/brand/brand-11.svg": {
    "type": "image/svg+xml",
    "etag": "\"43b-SxzciV7Nx1tyZmiSdcO6G1yNHg8\"",
    "mtime": "2026-04-23T01:48:46.304Z",
    "size": 1083,
    "path": "../public/images/brand/brand-11.svg"
  },
  "/images/brand/brand-12.svg": {
    "type": "image/svg+xml",
    "etag": "\"604-Gk5+JHn6LeywSfu4enoXW+S5Xlk\"",
    "mtime": "2026-04-23T01:48:46.304Z",
    "size": 1540,
    "path": "../public/images/brand/brand-12.svg"
  },
  "/images/brand/brand-13.svg": {
    "type": "image/svg+xml",
    "etag": "\"554-csxVOFN3VuQgbxKqx/sMY8kTof8\"",
    "mtime": "2026-04-23T01:48:46.304Z",
    "size": 1364,
    "path": "../public/images/brand/brand-13.svg"
  },
  "/images/brand/brand-14.svg": {
    "type": "image/svg+xml",
    "etag": "\"696-wPYYHaMSJJYDwIL69ZBgawTgb5k\"",
    "mtime": "2026-04-23T01:48:46.308Z",
    "size": 1686,
    "path": "../public/images/brand/brand-14.svg"
  },
  "/images/brand/brand-15.svg": {
    "type": "image/svg+xml",
    "etag": "\"47d-Y+s78gX/8TQ2g1tfkES+YVQqgxo\"",
    "mtime": "2026-04-23T01:48:46.308Z",
    "size": 1149,
    "path": "../public/images/brand/brand-15.svg"
  },
  "/images/grid-image/image-02.png": {
    "type": "image/png",
    "etag": "\"50635-juNoo4X5oN0m//Qwb3jLjmDWufU\"",
    "mtime": "2026-04-23T01:48:46.317Z",
    "size": 329269,
    "path": "../public/images/grid-image/image-02.png"
  },
  "/images/grid-image/image-03.png": {
    "type": "image/png",
    "etag": "\"765a9-KNl9vOfMe71H6ZeliVH5bkOH8gw\"",
    "mtime": "2026-04-23T01:48:46.314Z",
    "size": 484777,
    "path": "../public/images/grid-image/image-03.png"
  },
  "/images/grid-image/image-01.png": {
    "type": "image/png",
    "etag": "\"1318bd-uv7j2V5Kzf0zLbmWtLd8ZFhkulQ\"",
    "mtime": "2026-04-23T01:48:46.274Z",
    "size": 1251517,
    "path": "../public/images/grid-image/image-01.png"
  },
  "/images/grid-image/image-05.png": {
    "type": "image/png",
    "etag": "\"24fad-Kef/+7ccK2srFZjrzz7u/85c3y8\"",
    "mtime": "2026-04-23T01:48:46.317Z",
    "size": 151469,
    "path": "../public/images/grid-image/image-05.png"
  },
  "/images/grid-image/image-04.png": {
    "type": "image/png",
    "etag": "\"330d9-xwvZ25JzopyAzA82m2ECPL9gRFs\"",
    "mtime": "2026-04-23T01:48:46.314Z",
    "size": 209113,
    "path": "../public/images/grid-image/image-04.png"
  },
  "/images/error/404-dark.svg": {
    "type": "image/svg+xml",
    "etag": "\"87f-mPPA3zdLlLQyVjxyZ7ttdW4DZS8\"",
    "mtime": "2026-04-23T01:48:46.271Z",
    "size": 2175,
    "path": "../public/images/error/404-dark.svg"
  },
  "/images/grid-image/image-06.png": {
    "type": "image/png",
    "etag": "\"14006-liFQHD0/dN9FfMEDeUWW9z7Ag7A\"",
    "mtime": "2026-04-23T01:48:46.313Z",
    "size": 81926,
    "path": "../public/images/grid-image/image-06.png"
  },
  "/images/error/404.svg": {
    "type": "image/svg+xml",
    "etag": "\"87f-2M4klMY8p+TMH5vDtSwdJcJDGM0\"",
    "mtime": "2026-04-23T01:48:46.317Z",
    "size": 2175,
    "path": "../public/images/error/404.svg"
  },
  "/images/error/500-dark.svg": {
    "type": "image/svg+xml",
    "etag": "\"b03-khh47nc2FNh+ynYnvfjh8KjyLB4\"",
    "mtime": "2026-04-23T01:48:46.319Z",
    "size": 2819,
    "path": "../public/images/error/500-dark.svg"
  },
  "/images/error/500.svg": {
    "type": "image/svg+xml",
    "etag": "\"b03-kCRq7005zcLsmfNYuCm5Z36pTpg\"",
    "mtime": "2026-04-23T01:48:46.320Z",
    "size": 2819,
    "path": "../public/images/error/500.svg"
  },
  "/images/error/503-dark.svg": {
    "type": "image/svg+xml",
    "etag": "\"bd0-WBCitfKdGRnKKbUHwDwg+Cs7Q5k\"",
    "mtime": "2026-04-23T01:48:46.320Z",
    "size": 3024,
    "path": "../public/images/error/503-dark.svg"
  },
  "/images/error/503.svg": {
    "type": "image/svg+xml",
    "etag": "\"bcc-7nVeeZGJX34WA+3spl/ZChRj2X4\"",
    "mtime": "2026-04-23T01:48:46.319Z",
    "size": 3020,
    "path": "../public/images/error/503.svg"
  },
  "/images/error/maintenance-dark.svg": {
    "type": "image/svg+xml",
    "etag": "\"ef4-Jbi/eE1Wm6FTjmzClMEgRFyPTk8\"",
    "mtime": "2026-04-23T01:48:46.319Z",
    "size": 3828,
    "path": "../public/images/error/maintenance-dark.svg"
  },
  "/images/error/maintenance.svg": {
    "type": "image/svg+xml",
    "etag": "\"efa-6Ug5wyn6AabD+ynkerGU2cxIJbw\"",
    "mtime": "2026-04-23T01:48:46.320Z",
    "size": 3834,
    "path": "../public/images/error/maintenance.svg"
  },
  "/images/error/success-dark.svg": {
    "type": "image/svg+xml",
    "etag": "\"a48-merXgYiVbMQD8+WqKLLbyuqLY28\"",
    "mtime": "2026-04-23T01:48:46.320Z",
    "size": 2632,
    "path": "../public/images/error/success-dark.svg"
  },
  "/images/error/success.svg": {
    "type": "image/svg+xml",
    "etag": "\"a48-H4WttzFeLwWowOdAOfDE7VlknUE\"",
    "mtime": "2026-04-23T01:48:46.320Z",
    "size": 2632,
    "path": "../public/images/error/success.svg"
  },
  "/images/icons/file-image-dark.svg": {
    "type": "image/svg+xml",
    "etag": "\"6b0-abt9hywZ0paeZWCoHvUjJUJupzk\"",
    "mtime": "2026-04-23T01:48:46.320Z",
    "size": 1712,
    "path": "../public/images/icons/file-image-dark.svg"
  },
  "/images/icons/file-image.svg": {
    "type": "image/svg+xml",
    "etag": "\"6b0-aZwdVcbakQIEq9UyphnHkziumH4\"",
    "mtime": "2026-04-23T01:48:46.271Z",
    "size": 1712,
    "path": "../public/images/icons/file-image.svg"
  },
  "/images/icons/file-pdf-dark.svg": {
    "type": "image/svg+xml",
    "etag": "\"ec4-kYYGN3AbUZZul38Wo3e0ltk4QPQ\"",
    "mtime": "2026-04-23T01:48:46.320Z",
    "size": 3780,
    "path": "../public/images/icons/file-pdf-dark.svg"
  },
  "/images/icons/file-pdf.svg": {
    "type": "image/svg+xml",
    "etag": "\"ec4-BzAUjqJNwZarwwogXjaMHyeUUdw\"",
    "mtime": "2026-04-23T01:48:46.320Z",
    "size": 3780,
    "path": "../public/images/icons/file-pdf.svg"
  },
  "/images/icons/file-video-dark.svg": {
    "type": "image/svg+xml",
    "etag": "\"531-rBy+XNddqgqy/jIomt0G298cE68\"",
    "mtime": "2026-04-23T01:48:46.320Z",
    "size": 1329,
    "path": "../public/images/icons/file-video-dark.svg"
  },
  "/images/icons/file-video.svg": {
    "type": "image/svg+xml",
    "etag": "\"531-9V5zsUV+K1ac9C7nCUi6CzAFBBU\"",
    "mtime": "2026-04-23T01:48:46.320Z",
    "size": 1329,
    "path": "../public/images/icons/file-video.svg"
  },
  "/images/product/product-01.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d03-ECPQbZ8FFYLywd7DbNF5vBMeZBE\"",
    "mtime": "2026-04-23T01:48:46.320Z",
    "size": 7427,
    "path": "../public/images/product/product-01.jpg"
  },
  "/images/product/product-02.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a4b-Qqke70gTTNoR7Hq8APAPor8ElgQ\"",
    "mtime": "2026-04-23T01:48:46.320Z",
    "size": 10827,
    "path": "../public/images/product/product-02.jpg"
  },
  "/images/product/product-03.jpg": {
    "type": "image/jpeg",
    "etag": "\"18b9-/bCW/KcxJ6aHAFblTz3cqJGTvhY\"",
    "mtime": "2026-04-23T01:48:46.271Z",
    "size": 6329,
    "path": "../public/images/product/product-03.jpg"
  },
  "/images/product/product-04.jpg": {
    "type": "image/jpeg",
    "etag": "\"10a5-1zBtyjGBgfL+BT9TZRvJWI8ZBXE\"",
    "mtime": "2026-04-23T01:48:46.320Z",
    "size": 4261,
    "path": "../public/images/product/product-04.jpg"
  },
  "/images/product/product-05.jpg": {
    "type": "image/jpeg",
    "etag": "\"c01-FWnHam55BbI8KIxkJOlxo3YtcV8\"",
    "mtime": "2026-04-23T01:48:46.320Z",
    "size": 3073,
    "path": "../public/images/product/product-05.jpg"
  },
  "/images/logo/auth-logo.svg": {
    "type": "image/svg+xml",
    "etag": "\"1901-mrK1V3THqiS9o09BTVbZmzdMLxk\"",
    "mtime": "2026-04-23T01:48:46.270Z",
    "size": 6401,
    "path": "../public/images/logo/auth-logo.svg"
  },
  "/images/logo/auth-logo2.svg": {
    "type": "image/svg+xml",
    "etag": "\"c38-yXFgEhJOYASyMQ/hGq4FfcseV2g\"",
    "mtime": "2026-04-23T01:48:46.316Z",
    "size": 3128,
    "path": "../public/images/logo/auth-logo2.svg"
  },
  "/images/logo/logo-dark.svg": {
    "type": "image/svg+xml",
    "etag": "\"189e-R8kmuN6+lXO8GjUfjDEoksAue5w\"",
    "mtime": "2026-04-23T01:48:46.316Z",
    "size": 6302,
    "path": "../public/images/logo/logo-dark.svg"
  },
  "/images/logo/logo-icon.svg": {
    "type": "image/svg+xml",
    "etag": "\"d60-XVJsjVFtZLvKJnqTQ0B+Xjk7BS4\"",
    "mtime": "2026-04-23T01:48:46.317Z",
    "size": 3424,
    "path": "../public/images/logo/logo-icon.svg"
  },
  "/images/logo/logo.svg": {
    "type": "image/svg+xml",
    "etag": "\"18f7-xto5mWCL/BaPFfhC/jVQdh4eBAk\"",
    "mtime": "2026-04-23T01:48:46.320Z",
    "size": 6391,
    "path": "../public/images/logo/logo.svg"
  },
  "/images/shape/grid-01.svg": {
    "type": "image/svg+xml",
    "etag": "\"177e-cS2WJihxy8yi5LXE+OwTWeshAj0\"",
    "mtime": "2026-04-23T01:48:46.272Z",
    "size": 6014,
    "path": "../public/images/shape/grid-01.svg"
  },
  "/images/task/pdf.svg": {
    "type": "image/svg+xml",
    "etag": "\"848-1d9GcKmqxCX8C/Rw3IKCDaaE6pM\"",
    "mtime": "2026-04-23T01:48:46.272Z",
    "size": 2120,
    "path": "../public/images/task/pdf.svg"
  },
  "/images/task/google-drive.svg": {
    "type": "image/svg+xml",
    "etag": "\"acf-Y4CaHrLJFppcZ/DOkDd2OeXcwsc\"",
    "mtime": "2026-04-23T01:48:46.321Z",
    "size": 2767,
    "path": "../public/images/task/google-drive.svg"
  },
  "/images/task/task.jpg": {
    "type": "image/jpeg",
    "etag": "\"12853-7cQUMNWqbwENoJIoiRPFIbfYr2s\"",
    "mtime": "2026-04-23T01:48:46.322Z",
    "size": 75859,
    "path": "../public/images/task/task.jpg"
  },
  "/images/task/task.png": {
    "type": "image/png",
    "etag": "\"23bca-I92maobAvKSN/4A41TR0CDIlTko\"",
    "mtime": "2026-04-23T01:48:46.322Z",
    "size": 146378,
    "path": "../public/images/task/task.png"
  },
  "/images/video-thumb/thumb-16.png": {
    "type": "image/png",
    "etag": "\"1da9e-Z/46xA5hTMoOZVOEcV4IiTCPQns\"",
    "mtime": "2026-04-23T01:48:46.276Z",
    "size": 121502,
    "path": "../public/images/video-thumb/thumb-16.png"
  },
  "/images/video-thumb/youtube-icon-84.svg": {
    "type": "image/svg+xml",
    "etag": "\"2b3-ajVzPxvkFQzEl81DZqfCNiwub2c\"",
    "mtime": "2026-04-23T01:48:46.327Z",
    "size": 691,
    "path": "../public/images/video-thumb/youtube-icon-84.svg"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-bhA/vQOqUwbIQ1mqiCm4J9pMrfE\"",
    "mtime": "2026-04-23T01:48:46.229Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/images/user/user-01.jpg": {
    "type": "image/jpeg",
    "etag": "\"4878-cQ+l85bSJ3O0eKWTgRE86+b0XJM\"",
    "mtime": "2026-04-23T01:48:46.321Z",
    "size": 18552,
    "path": "../public/images/user/user-01.jpg"
  },
  "/images/user/user-02.jpg": {
    "type": "image/jpeg",
    "etag": "\"2558-17UfmfRUxPx8YeMoG1rpJ9yd5hg\"",
    "mtime": "2026-04-23T01:48:46.321Z",
    "size": 9560,
    "path": "../public/images/user/user-02.jpg"
  },
  "/images/user/user-03.jpg": {
    "type": "image/jpeg",
    "etag": "\"3262-p+MLa+0AowJXo+NVpX6zfHrDljc\"",
    "mtime": "2026-04-23T01:48:46.322Z",
    "size": 12898,
    "path": "../public/images/user/user-03.jpg"
  },
  "/images/user/owner.jpg": {
    "type": "image/jpeg",
    "etag": "\"2530d-kCwz6h/RBBAQ/dPreOzqT79YD6Y\"",
    "mtime": "2026-04-23T01:48:46.274Z",
    "size": 152333,
    "path": "../public/images/user/owner.jpg"
  },
  "/images/user/user-04.jpg": {
    "type": "image/jpeg",
    "etag": "\"2527-IOeka64O/esaTz9iKwT1hZ9r7d4\"",
    "mtime": "2026-04-23T01:48:46.322Z",
    "size": 9511,
    "path": "../public/images/user/user-04.jpg"
  },
  "/images/user/user-05.jpg": {
    "type": "image/jpeg",
    "etag": "\"1dd3-WlE/93a8gHPBWGj/9+uH22W6KqE\"",
    "mtime": "2026-04-23T01:48:46.321Z",
    "size": 7635,
    "path": "../public/images/user/user-05.jpg"
  },
  "/images/user/user-06.jpg": {
    "type": "image/jpeg",
    "etag": "\"1c9e-ITXinvQ7P37LnM9haJ4zT5MUKH4\"",
    "mtime": "2026-04-23T01:48:46.323Z",
    "size": 7326,
    "path": "../public/images/user/user-06.jpg"
  },
  "/images/user/user-07.jpg": {
    "type": "image/jpeg",
    "etag": "\"1542-OjVoFVGvYQfxHfuqHykb+XZ0Eys\"",
    "mtime": "2026-04-23T01:48:46.321Z",
    "size": 5442,
    "path": "../public/images/user/user-07.jpg"
  },
  "/images/user/user-08.jpg": {
    "type": "image/jpeg",
    "etag": "\"1257-vnv7Ez+orX5qmwn6OcQJCQpksUk\"",
    "mtime": "2026-04-23T01:48:46.322Z",
    "size": 4695,
    "path": "../public/images/user/user-08.jpg"
  },
  "/images/user/user-09.jpg": {
    "type": "image/jpeg",
    "etag": "\"14a2-GSsKrbDaFdOzXQwCWhomK89llcU\"",
    "mtime": "2026-04-23T01:48:46.322Z",
    "size": 5282,
    "path": "../public/images/user/user-09.jpg"
  },
  "/images/user/user-10.jpg": {
    "type": "image/jpeg",
    "etag": "\"1526-YrX8aI5z2iSePLdH1SYewDHoE2c\"",
    "mtime": "2026-04-23T01:48:46.322Z",
    "size": 5414,
    "path": "../public/images/user/user-10.jpg"
  },
  "/images/user/user-11.jpg": {
    "type": "image/jpeg",
    "etag": "\"1322-HF2P+4Al6OALkAqJ76P4JQnT6u8\"",
    "mtime": "2026-04-23T01:48:46.324Z",
    "size": 4898,
    "path": "../public/images/user/user-11.jpg"
  },
  "/images/user/user-12.jpg": {
    "type": "image/jpeg",
    "etag": "\"147a-ybB4WYLXUDdjqqjbsWTL6jUAAYA\"",
    "mtime": "2026-04-23T01:48:46.323Z",
    "size": 5242,
    "path": "../public/images/user/user-12.jpg"
  },
  "/images/user/user-13.jpg": {
    "type": "image/jpeg",
    "etag": "\"102b-2o88kMk46H/wgY/+dlEYPZ2ni8c\"",
    "mtime": "2026-04-23T01:48:46.323Z",
    "size": 4139,
    "path": "../public/images/user/user-13.jpg"
  },
  "/images/user/user-14.jpg": {
    "type": "image/jpeg",
    "etag": "\"1312-Hia5SE/us29Ltux6Ow6cmYk72AA\"",
    "mtime": "2026-04-23T01:48:46.324Z",
    "size": 4882,
    "path": "../public/images/user/user-14.jpg"
  },
  "/images/user/user-15.jpg": {
    "type": "image/jpeg",
    "etag": "\"17ba-43EJYUv0KiCHoCp3Fk/yfPPzQik\"",
    "mtime": "2026-04-23T01:48:46.324Z",
    "size": 6074,
    "path": "../public/images/user/user-15.jpg"
  },
  "/images/user/user-16.jpg": {
    "type": "image/jpeg",
    "etag": "\"14c6-q8Ei1842O3rx1LbPXvLSsQcpZN4\"",
    "mtime": "2026-04-23T01:48:46.323Z",
    "size": 5318,
    "path": "../public/images/user/user-16.jpg"
  },
  "/images/user/user-17.jpg": {
    "type": "image/jpeg",
    "etag": "\"298a-GKRabxD+9sLUeOrg7lluEa1YlXc\"",
    "mtime": "2026-04-23T01:48:46.325Z",
    "size": 10634,
    "path": "../public/images/user/user-17.jpg"
  },
  "/images/user/user-18.jpg": {
    "type": "image/jpeg",
    "etag": "\"2664-yLvPbD6opLgORXonWwg5hySXkpY\"",
    "mtime": "2026-04-23T01:48:46.326Z",
    "size": 9828,
    "path": "../public/images/user/user-18.jpg"
  },
  "/images/user/user-19.jpg": {
    "type": "image/jpeg",
    "etag": "\"22fb-7AbTflE6OkAQt3Cy7bXoNDd8r04\"",
    "mtime": "2026-04-23T01:48:46.325Z",
    "size": 8955,
    "path": "../public/images/user/user-19.jpg"
  },
  "/images/user/user-20.jpg": {
    "type": "image/jpeg",
    "etag": "\"21dc-23Dsu1rRL1ScmkBVkB8c9RbJHaA\"",
    "mtime": "2026-04-23T01:48:46.324Z",
    "size": 8668,
    "path": "../public/images/user/user-20.jpg"
  },
  "/images/user/user-21.jpg": {
    "type": "image/jpeg",
    "etag": "\"210c-qgkKdi7R/s5jSc1fY9qH5vb0ZFE\"",
    "mtime": "2026-04-23T01:48:46.325Z",
    "size": 8460,
    "path": "../public/images/user/user-21.jpg"
  },
  "/images/user/user-22.jpg": {
    "type": "image/jpeg",
    "etag": "\"11bd-zHTylNVjfbTWUvzvj2b5vSYpSxI\"",
    "mtime": "2026-04-23T01:48:46.324Z",
    "size": 4541,
    "path": "../public/images/user/user-22.jpg"
  },
  "/images/user/user-24.jpg": {
    "type": "image/jpeg",
    "etag": "\"12ee-260T3b31APFxIzsAKqiUXfsozsU\"",
    "mtime": "2026-04-23T01:48:46.326Z",
    "size": 4846,
    "path": "../public/images/user/user-24.jpg"
  },
  "/images/user/user-25.jpg": {
    "type": "image/jpeg",
    "etag": "\"1391-qT47pCEbcAVHNy4SDju/3gNdnOw\"",
    "mtime": "2026-04-23T01:48:46.326Z",
    "size": 5009,
    "path": "../public/images/user/user-25.jpg"
  },
  "/images/user/user-26.jpg": {
    "type": "image/jpeg",
    "etag": "\"16fa-IzdNe0LmgDESz0BPHKGceJZLp5g\"",
    "mtime": "2026-04-23T01:48:46.326Z",
    "size": 5882,
    "path": "../public/images/user/user-26.jpg"
  },
  "/images/user/user-27.jpg": {
    "type": "image/jpeg",
    "etag": "\"151e-KMYvdx68zNf4Rx2AzZnxjCB1rMc\"",
    "mtime": "2026-04-23T01:48:46.326Z",
    "size": 5406,
    "path": "../public/images/user/user-27.jpg"
  },
  "/images/user/user-23.jpg": {
    "type": "image/jpeg",
    "etag": "\"1290-bl0EkoBy9y+9LNwSVWwmORu4czo\"",
    "mtime": "2026-04-23T01:48:46.324Z",
    "size": 4752,
    "path": "../public/images/user/user-23.jpg"
  },
  "/images/user/user-28.jpg": {
    "type": "image/jpeg",
    "etag": "\"1291-1i5bY8gXutayaUP2HhfyGBW052o\"",
    "mtime": "2026-04-23T01:48:46.326Z",
    "size": 4753,
    "path": "../public/images/user/user-28.jpg"
  },
  "/images/user/user-29.jpg": {
    "type": "image/jpeg",
    "etag": "\"13d8-g7O1HS2FmjDIf0QArfzPimNLgF8\"",
    "mtime": "2026-04-23T01:48:46.326Z",
    "size": 5080,
    "path": "../public/images/user/user-29.jpg"
  },
  "/images/user/user-30.jpg": {
    "type": "image/jpeg",
    "etag": "\"114a-yYiC0r1Ye6ceyM11VnQj731zvyY\"",
    "mtime": "2026-04-23T01:48:46.326Z",
    "size": 4426,
    "path": "../public/images/user/user-30.jpg"
  },
  "/images/user/user-31.jpg": {
    "type": "image/jpeg",
    "etag": "\"e12-GKjr5nBTKPEw9sjk+Q0bIi/WWao\"",
    "mtime": "2026-04-23T01:48:46.326Z",
    "size": 3602,
    "path": "../public/images/user/user-31.jpg"
  },
  "/images/user/user-32.jpg": {
    "type": "image/jpeg",
    "etag": "\"1447-sT8bhmu7FkPHUyxIptNe6ma59/o\"",
    "mtime": "2026-04-23T01:48:46.327Z",
    "size": 5191,
    "path": "../public/images/user/user-32.jpg"
  },
  "/images/user/user-33.jpg": {
    "type": "image/jpeg",
    "etag": "\"1491-w/YsUXLnuGAfHxFccV1hpufetY8\"",
    "mtime": "2026-04-23T01:48:46.326Z",
    "size": 5265,
    "path": "../public/images/user/user-33.jpg"
  },
  "/images/user/user-34.jpg": {
    "type": "image/jpeg",
    "etag": "\"3821-f8QGnOa3YHJkFA/3M6ikhoWsjYc\"",
    "mtime": "2026-04-23T01:48:46.326Z",
    "size": 14369,
    "path": "../public/images/user/user-34.jpg"
  },
  "/images/user/user-36.jpg": {
    "type": "image/jpeg",
    "etag": "\"359e-JRetTb8TL/W4XUbY7NSfc5PNN8A\"",
    "mtime": "2026-04-23T01:48:46.327Z",
    "size": 13726,
    "path": "../public/images/user/user-36.jpg"
  },
  "/images/user/user-35.jpg": {
    "type": "image/jpeg",
    "etag": "\"3275-OD1ZqXl2oM5XvBJzL2V8/zmX3Q4\"",
    "mtime": "2026-04-23T01:48:46.327Z",
    "size": 12917,
    "path": "../public/images/user/user-35.jpg"
  },
  "/images/user/user-37.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f47-WvQOvfwKhN2knkHLJOGgYyA61h0\"",
    "mtime": "2026-04-23T01:48:46.326Z",
    "size": 12103,
    "path": "../public/images/user/user-37.jpg"
  },
  "/_nuxt/builds/meta/92bec4ae-b7e2-47eb-a90d-e5e7727a0444.json": {
    "type": "application/json",
    "etag": "\"ff-pqzvdc1MFqbVcDfW9hXu8vzxFH0\"",
    "mtime": "2026-04-23T01:48:46.227Z",
    "size": 255,
    "path": "../public/_nuxt/builds/meta/92bec4ae-b7e2-47eb-a90d-e5e7727a0444.json"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};
const basename = function(p, extension) {
  const segments = normalizeWindowsPath(p).split("/");
  let lastSegment = "";
  for (let i = segments.length - 1; i >= 0; i--) {
    const val = segments[i];
    if (val) {
      lastSegment = val;
      break;
    }
  }
  return extension && lastSegment.endsWith(extension) ? lastSegment.slice(0, -extension.length) : lastSegment;
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_fonts/":{"maxAge":31536000},"/_nuxt/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _pu03mH = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

// @__NO_SIDE_EFFECTS__
function injectHead() {
  if (hasInjectionContext()) {
    const instance = inject(headSymbol);
    if (!instance) {
      throw new Error("useHead() was called without provide context, ensure you call it through the setup() function.");
    }
    return instance;
  }
  throw new Error("useHead() was called without provide context, ensure you call it through the setup() function.");
}
function useHead(input, options = {}) {
  const head = options.head || /* @__PURE__ */ injectHead();
  return head.ssr ? head.push(input || {}, options) : clientUseHead(head, input, options);
}
function clientUseHead(head, input, options = {}) {
  const deactivated = ref(false);
  let entry;
  watchEffect(() => {
    const i = deactivated.value ? {} : walkResolver(input, VueResolver);
    if (entry) {
      entry.patch(i);
    } else {
      entry = head.push(i, options);
    }
  });
  const vm = getCurrentInstance();
  if (vm) {
    onBeforeUnmount(() => {
      entry.dispose();
    });
    onDeactivated(() => {
      deactivated.value = true;
    });
    onActivated(() => {
      deactivated.value = false;
    });
  }
  return entry;
}
function useSeoMeta(input = {}, options = {}) {
  const head = options.head || /* @__PURE__ */ injectHead();
  head.use(FlatMetaPlugin);
  const { title, titleTemplate, ...meta } = input;
  return useHead({
    title,
    titleTemplate,
    _flatMeta: meta
  }, options);
}

// @__NO_SIDE_EFFECTS__
function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

const createHeadCore = createUnhead;

// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const unheadOptions = {
  disableDefaults: true,
};

function createSSRContext(event) {
  const ssrContext = {
    url: event.path,
    event,
    runtimeConfig: useRuntimeConfig(event),
    noSSR: event.context.nuxt?.noSSR || (false),
    head: createHead(unheadOptions),
    error: false,
    nuxt: void 0,
    /* NuxtApp */
    payload: {},
    _payloadReducers: /* @__PURE__ */ Object.create(null),
    modules: /* @__PURE__ */ new Set()
  };
  return ssrContext;
}
function setSSRError(ssrContext, error) {
  ssrContext.error = true;
  ssrContext.payload = { error };
  ssrContext.url = error.url;
}

const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1"},{"charset":"utf-8"},{"name":"theme-color","content":"#4F46E5"},{"name":"apple-mobile-web-app-capable","content":"yes"},{"name":"apple-mobile-web-app-status-bar-style","content":"default"}],"link":[{"rel":"apple-touch-icon","href":"/icons/icon-192.png"}],"style":[],"script":[],"noscript":[]};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appSpaLoaderTag = "div";

const appSpaLoaderAttrs = {"id":"__nuxt-loader"};

const appId = "nuxt-app";

function baseURL() {
  return useRuntimeConfig().app.baseURL;
}
function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const getServerEntry = () => import('../build/server.mjs').then((r) => r.default || r);
const getPrecomputedDependencies = () => import('../build/client.precomputed.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getSSRRenderer = lazyCachedFunction(async () => {
  const createSSRApp = await getServerEntry();
  if (!createSSRApp) {
    throw new Error("Server bundle is not available");
  }
  const precomputed = await getPrecomputedDependencies();
  const renderer = createRenderer(createSSRApp, {
    precomputed,
    manifest: void 0,
    renderToString: renderToString$1,
    buildAssetsURL
  });
  async function renderToString$1(input, context) {
    const html = await renderToString(input, context);
    return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
  }
  return renderer;
});
const getSPARenderer = lazyCachedFunction(async () => {
  const precomputed = await getPrecomputedDependencies();
  const spaTemplate = await import('../virtual/_virtual_spa-template.mjs').then((r) => r.template).catch(() => "").then((r) => {
    {
      const APP_SPA_LOADER_OPEN_TAG = `<${appSpaLoaderTag}${propsToString(appSpaLoaderAttrs)}>`;
      const APP_SPA_LOADER_CLOSE_TAG = `</${appSpaLoaderTag}>`;
      const appTemplate = APP_ROOT_OPEN_TAG + APP_ROOT_CLOSE_TAG;
      const loaderTemplate = r ? APP_SPA_LOADER_OPEN_TAG + r + APP_SPA_LOADER_CLOSE_TAG : "";
      return appTemplate + loaderTemplate;
    }
  });
  const renderer = createRenderer(() => () => {
  }, {
    precomputed,
    manifest: void 0,
    renderToString: () => spaTemplate,
    buildAssetsURL
  });
  const result = await renderer.renderToString({});
  const renderToString = (ssrContext) => {
    const config = useRuntimeConfig(ssrContext.event);
    ssrContext.modules ||= /* @__PURE__ */ new Set();
    ssrContext.payload.serverRendered = false;
    ssrContext.config = {
      public: config.public,
      app: config.app
    };
    return Promise.resolve(result);
  };
  return {
    rendererContext: renderer.rendererContext,
    renderToString
  };
});
function lazyCachedFunction(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}
function getRenderer(ssrContext) {
  return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
const getSSRStyles = lazyCachedFunction(() => import('../build/styles.mjs').then((r) => r.default || r));

async function renderInlineStyles(usedModules) {
  const styleMap = await getSSRStyles();
  const inlinedStyles = /* @__PURE__ */ new Set();
  for (const mod of usedModules) {
    if (mod in styleMap && styleMap[mod]) {
      for (const style of await styleMap[mod]()) {
        inlinedStyles.add(style);
      }
    }
  }
  return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);
function getServerComponentHTML(body) {
  const match = body.match(ROOT_NODE_REGEX);
  return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
    return void 0;
  }
  const response = {};
  for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
    response[name] = {
      ...slot,
      fallback: ssrContext.teleports?.[`island-fallback=${name}`]
    };
  }
  return response;
}
function getClientIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
    return void 0;
  }
  const response = {};
  for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
    const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
    response[clientUid] = {
      ...component,
      html,
      slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
    };
  }
  return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
  const entries = Object.entries(teleports);
  const slots = {};
  for (const [key, value] of entries) {
    const match = key.match(SSR_CLIENT_SLOT_MARKER);
    if (match) {
      const [, id, slot] = match;
      if (!slot || clientUid !== id) {
        continue;
      }
      slots[slot] = value;
    }
  }
  return slots;
}
function replaceIslandTeleports(ssrContext, html) {
  const { teleports, islandContext } = ssrContext;
  if (islandContext || !teleports) {
    return html;
  }
  for (const key in teleports) {
    const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
    if (matchClientComp) {
      const [, uid, clientId] = matchClientComp;
      if (!uid || !clientId) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
      continue;
    }
    const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
    if (matchSlot) {
      const [, uid, slot] = matchSlot;
      if (!uid || !slot) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
    }
  }
  return html;
}

const ISLAND_SUFFIX_RE = /\.json(?:\?.*)?$/;
const _SxA8c9 = defineEventHandler(async (event) => {
  const nitroApp = useNitroApp();
  setResponseHeaders(event, {
    "content-type": "application/json;charset=utf-8",
    "x-powered-by": "Nuxt"
  });
  const islandContext = await getIslandContext(event);
  const ssrContext = {
    ...createSSRContext(event),
    islandContext,
    noSSR: false,
    url: islandContext.url
  };
  const renderer = await getSSRRenderer();
  const renderResult = await renderer.renderToString(ssrContext).catch(async (err) => {
    await ssrContext.nuxt?.hooks.callHook("app:error", err);
    throw err;
  });
  if (ssrContext.payload?.error) {
    throw ssrContext.payload.error;
  }
  const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult });
  if (inlinedStyles.length) {
    ssrContext.head.push({ style: inlinedStyles });
  }
  const islandHead = {};
  for (const entry of ssrContext.head.entries.values()) {
    for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
      const currentValue = islandHead[key];
      if (Array.isArray(currentValue)) {
        currentValue.push(...value);
      }
      islandHead[key] = value;
    }
  }
  const islandResponse = {
    id: islandContext.id,
    head: islandHead,
    html: getServerComponentHTML(renderResult.html),
    components: getClientIslandResponse(ssrContext),
    slots: getSlotIslandResponse(ssrContext)
  };
  await nitroApp.hooks.callHook("render:island", islandResponse, { event, islandContext });
  return islandResponse;
});
async function getIslandContext(event) {
  let url = event.path || "";
  const componentParts = url.substring("/__nuxt_island".length + 1).replace(ISLAND_SUFFIX_RE, "").split("_");
  const hashId = componentParts.length > 1 ? componentParts.pop() : void 0;
  const componentName = componentParts.join("_");
  const context = event.method === "GET" ? getQuery(event) : await readBody(event);
  const ctx = {
    url: "/",
    ...context,
    id: hashId,
    name: componentName,
    props: destr(context.props) || {},
    slots: {},
    components: {}
  };
  return ctx;
}

function defineNitroPlugin(def) {
  return def;
}

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

function useNitroOrigin(e) {
  return getNitroOrigin(e);
}

const BAD_REQUEST = {
  code: 400,
  message: "ERROR: Bad Request - Please check your request body."
};
const UNAUTHORIZED = {
  code: 401,
  message: "ERROR: Unauthorized - Please login again."
};
const INTERNAL_SERVER_ERROR = {
  code: 500,
  message: "ERROR: Internal Server Error - Something went wrong on our side."
};

const customCreateError = (error, message) => {
  var _a;
  if (error instanceof ZodError) {
    return createError$1({
      statusCode: BAD_REQUEST.code,
      statusMessage: BAD_REQUEST.message,
      message: "Validation Error",
      data: error.formErrors.fieldErrors
    });
  }
  if (error instanceof FetchError) {
    return createError$1({
      statusCode: ((_a = error.response) == null ? void 0 : _a.status) || error.statusCode || INTERNAL_SERVER_ERROR.code,
      statusMessage: error.statusMessage || error.message,
      message: message != null ? message : INTERNAL_SERVER_ERROR.message,
      data: void 0
    });
  }
  if (error.statusCode && error.statusMessage) {
    return createError$1(error);
  }
  return createError$1({
    statusCode: INTERNAL_SERVER_ERROR.code,
    statusMessage: INTERNAL_SERVER_ERROR.message,
    message: message != null ? message : INTERNAL_SERVER_ERROR.message,
    data: void 0
  });
};

const collections = {
};

const DEFAULT_ENDPOINT = "https://api.iconify.design";
const _mbgvTX = defineCachedEventHandler(async (event) => {
  const url = getRequestURL(event);
  if (!url)
    return createError$1({ status: 400, message: "Invalid icon request" });
  const options = useAppConfig().icon;
  const collectionName = event.context.params?.collection?.replace(/\.json$/, "");
  const collection = collectionName ? await collections[collectionName]?.() : null;
  const apiEndPoint = options.iconifyApiEndpoint || DEFAULT_ENDPOINT;
  const icons = url.searchParams.get("icons")?.split(",");
  if (collection) {
    if (icons?.length) {
      const data = getIcons(
        collection,
        icons
      );
      consola.debug(`[Icon] serving ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from bundled collection`);
      return data;
    }
  }
  if (options.fallbackToApi === true || options.fallbackToApi === "server-only") {
    const apiUrl = new URL("./" + basename(url.pathname) + url.search, apiEndPoint);
    consola.debug(`[Icon] fetching ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from iconify api`);
    if (apiUrl.host !== new URL(apiEndPoint).host) {
      return createError$1({ status: 400, message: "Invalid icon request" });
    }
    try {
      const data = await $fetch(apiUrl.href);
      return data;
    } catch (e) {
      consola.error(e);
      if (e.status === 404)
        return createError$1({ status: 404 });
      else
        return createError$1({ status: 500, message: "Failed to fetch fallback icon" });
    }
  }
  return createError$1({ status: 404 });
}, {
  group: "nuxt",
  name: "icon",
  getKey(event) {
    const collection = event.context.params?.collection?.replace(/\.json$/, "") || "unknown";
    const icons = String(getQuery(event).icons || "");
    return `${collection}_${icons.split(",")[0]}_${icons.length}_${hash$1(icons)}`;
  },
  swr: true,
  maxAge: 60 * 60 * 24 * 7
  // 1 week
});

const _CwwFs5 = eventHandler(async (e) => {
  if (e.context._initedSiteConfig)
    return;
  const runtimeConfig = useRuntimeConfig(e);
  const config = runtimeConfig["nuxt-site-config"];
  const nitroApp = useNitroApp();
  const siteConfig = e.context.siteConfig || createSiteConfigStack({
    debug: config.debug
  });
  const nitroOrigin = getNitroOrigin(e);
  e.context.siteConfigNitroOrigin = nitroOrigin;
  {
    siteConfig.push({
      _context: "nitro:init",
      _priority: -4,
      url: nitroOrigin
    });
  }
  siteConfig.push({
    _context: "runtimeEnv",
    _priority: 0,
    ...runtimeConfig.site || {},
    ...runtimeConfig.public.site || {},
    ...envSiteConfig(globalThis._importMeta_.env)
    // just in-case, shouldn't be needed
  });
  const buildStack = config.stack || [];
  buildStack.forEach((c) => siteConfig.push(c));
  if (e.context._nitro.routeRules.site) {
    siteConfig.push({
      _context: "route-rules",
      ...e.context._nitro.routeRules.site
    });
  }
  if (config.multiTenancy) {
    const host = parseURL(nitroOrigin).host;
    const tenant = config.multiTenancy?.find((t) => t.hosts.includes(host));
    if (tenant) {
      siteConfig.push({
        _context: `multi-tenancy:${host}`,
        _priority: 0,
        ...tenant.config
      });
    }
  }
  const ctx = { siteConfig, event: e };
  await nitroApp.hooks.callHook("site-config:init", ctx);
  e.context.siteConfig = ctx.siteConfig;
  e.context._initedSiteConfig = true;
});

const _pQ8CUB = lazyEventHandler(() => {
  const opts = useRuntimeConfig().ipx || {};
  const fsDir = opts?.fs?.dir ? (Array.isArray(opts.fs.dir) ? opts.fs.dir : [opts.fs.dir]).map((dir) => isAbsolute(dir) ? dir : fileURLToPath(new URL(dir, globalThis._importMeta_.url))) : void 0;
  const fsStorage = opts.fs?.dir ? ipxFSStorage({ ...opts.fs, dir: fsDir }) : void 0;
  const httpStorage = opts.http?.domains ? ipxHttpStorage({ ...opts.http }) : void 0;
  if (!fsStorage && !httpStorage) {
    throw new Error("IPX storage is not configured!");
  }
  const ipxOptions = {
    ...opts,
    storage: fsStorage || httpStorage,
    httpStorage
  };
  const ipx = createIPX(ipxOptions);
  const ipxHandler = createIPXH3Handler(ipx);
  return useBase(opts.baseURL, ipxHandler);
});

const _lazy_4YRxoe = () => import('../routes/api/admin-secure/customers-form-data.get.mjs');
const _lazy_W4gg8V = () => import('../routes/api/admin-secure/customers/_id_.post.mjs');
const _lazy_XAW1Ph = () => import('../routes/api/admin-secure/customers/_id_.mjs');
const _lazy_QhvTPR = () => import('../routes/api/admin-secure/index.get.mjs');
const _lazy_u2tMc8 = () => import('../routes/api/admin-secure/index.post.mjs');
const _lazy_K3sfQU = () => import('../routes/api/admin-secure/employees-form-data.get.mjs');
const _lazy_b0m7DV = () => import('../routes/api/admin-secure/employees/_id_.post.mjs');
const _lazy_DSFTPE = () => import('../routes/api/admin-secure/employees/_id_.mjs');
const _lazy_SH63Iu = () => import('../routes/api/admin-secure/index.get2.mjs');
const _lazy_rgxHbk = () => import('../routes/api/admin-secure/index.post2.mjs');
const _lazy_KjwI12 = () => import('../routes/api/admin-secure/loanrecords-form-data.get.mjs');
const _lazy_UYE4dQ = () => import('../routes/api/admin-secure/loanrecords-need-approval.mjs');
const _lazy_xZjiNO = () => import('../routes/api/admin-secure/loanrecords/_id_.post.mjs');
const _lazy_YUZIHs = () => import('../routes/api/admin-secure/loanrecords/_id_.put copy.mjs');
const _lazy_m62Ho6 = () => import('../routes/api/admin-secure/loanrecords/_id_.mjs');
const _lazy_ZNx03Y = () => import('../routes/api/admin-secure/loanrecords/_lid/print-atm.get.mjs');
const _lazy_rQV1cD = () => import('../routes/api/admin-secure/loanrecords/_lid/print-contract2.get.mjs');
const _lazy_GUjl4r = () => import('../routes/api/admin-secure/loanrecords/_lid/print-landlayout.get.mjs');
const _lazy_IhjDKn = () => import('../routes/api/admin-secure/loanrecords/_lid/print-receipt2.get.mjs');
const _lazy_3o0qYf = () => import('../routes/api/admin-secure/index.get3.mjs');
const _lazy_5H9QGO = () => import('../routes/api/admin-secure/index.post3.mjs');
const _lazy_bICBTz = () => import('../routes/api/admin-secure/index.get4.mjs');
const _lazy_OGvYDI = () => import('../routes/api/admin-secure/index.get5.mjs');
const _lazy_OAKzmK = () => import('../routes/api/admin-secure/index.get6.mjs');
const _lazy_m1IgRK = () => import('../routes/api/admin-secure/schedules-cheque-data/_id_.get.mjs');
const _lazy_9tY30_ = () => import('../routes/api/admin-secure/schedules-cheque-edit/_id_.get.mjs');
const _lazy_jQd0s5 = () => import('../routes/api/admin-secure/schedules-cheque-save/_id_.put.mjs');
const _lazy_9jKWZy = () => import('../routes/api/admin-secure/schedules-form-data.get.mjs');
const _lazy_S7Q23Y = () => import('../routes/api/admin-secure/schedules/_id_.mjs');
const _lazy_yciOY8 = () => import('../routes/api/admin-secure/schedules/_sid/print-sched.get.mjs');
const _lazy_AppYmn = () => import('../routes/api/admin-secure/schedules/_sid/print-sched2.get.mjs');
const _lazy_4qo1vK = () => import('../routes/api/admin-secure/index.get7.mjs');
const _lazy_LANeX5 = () => import('../routes/api/admin-secure/index.post4.mjs');
const _lazy_nrrX22 = () => import('../routes/api/admin-secure/user-permissions-form-data.get.mjs');
const _lazy_kuctCi = () => import('../routes/api/admin-secure/user-permissions/_id_.mjs');
const _lazy_zP0qdD = () => import('../routes/api/admin-secure/index.get8.mjs');
const _lazy_5Ae9r9 = () => import('../routes/api/admin-secure/index.post5.mjs');
const _lazy_Oy4yHY = () => import('../routes/api/admin-secure/user.get.mjs');
const _lazy_QeoDIW = () => import('../routes/api/auth/login.post copy 2.mjs');
const _lazy_7LlLSE = () => import('../routes/api/auth/login.post.mjs');
const _lazy_KbdQuo = () => import('../routes/api/auth/logout.post.mjs');
const _lazy_gbxEtU = () => import('../routes/renderer.mjs');
const _lazy_2732Ht = () => import('../routes/__og-image__/font/font.mjs');
const _lazy_5meWuT = () => import('../routes/__og-image__/image/image.mjs');

const handlers = [
  { route: '', handler: _pu03mH, lazy: false, middleware: true, method: undefined },
  { route: '/api/admin-secure/customers-form-data', handler: _lazy_4YRxoe, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/customers/:id', handler: _lazy_W4gg8V, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin-secure/customers/:id', handler: _lazy_XAW1Ph, lazy: true, middleware: false, method: undefined },
  { route: '/api/admin-secure/customers', handler: _lazy_QhvTPR, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/customers', handler: _lazy_u2tMc8, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin-secure/employees-form-data', handler: _lazy_K3sfQU, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/employees/:id', handler: _lazy_b0m7DV, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin-secure/employees/:id', handler: _lazy_DSFTPE, lazy: true, middleware: false, method: undefined },
  { route: '/api/admin-secure/employees', handler: _lazy_SH63Iu, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/employees', handler: _lazy_rgxHbk, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin-secure/loanrecords-form-data', handler: _lazy_KjwI12, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/loanrecords-need-approval', handler: _lazy_UYE4dQ, lazy: true, middleware: false, method: undefined },
  { route: '/api/admin-secure/loanrecords/:id', handler: _lazy_xZjiNO, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin-secure/loanrecords/:id.put copy', handler: _lazy_YUZIHs, lazy: true, middleware: false, method: undefined },
  { route: '/api/admin-secure/loanrecords/:id', handler: _lazy_m62Ho6, lazy: true, middleware: false, method: undefined },
  { route: '/api/admin-secure/loanrecords/:lid/print-atm', handler: _lazy_ZNx03Y, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/loanrecords/:lid/print-contract2', handler: _lazy_rQV1cD, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/loanrecords/:lid/print-landlayout', handler: _lazy_GUjl4r, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/loanrecords/:lid/print-receipt2', handler: _lazy_IhjDKn, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/loanrecords', handler: _lazy_3o0qYf, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/loanrecords', handler: _lazy_5H9QGO, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin-secure/payments', handler: _lazy_bICBTz, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/permissions', handler: _lazy_OGvYDI, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/roles', handler: _lazy_OAKzmK, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/schedules-cheque-data/:id', handler: _lazy_m1IgRK, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/schedules-cheque-edit/:id', handler: _lazy_9tY30_, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/schedules-cheque-save/:id', handler: _lazy_jQd0s5, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin-secure/schedules-form-data', handler: _lazy_9jKWZy, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/schedules/:id', handler: _lazy_S7Q23Y, lazy: true, middleware: false, method: undefined },
  { route: '/api/admin-secure/schedules/:sid/print-sched', handler: _lazy_yciOY8, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/schedules/:sid/print-sched2', handler: _lazy_AppYmn, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/schedules', handler: _lazy_4qo1vK, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/schedules', handler: _lazy_LANeX5, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin-secure/user-permissions-form-data', handler: _lazy_nrrX22, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/user-permissions/:id', handler: _lazy_kuctCi, lazy: true, middleware: false, method: undefined },
  { route: '/api/admin-secure/user-permissions', handler: _lazy_zP0qdD, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin-secure/user-permissions', handler: _lazy_5Ae9r9, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin-secure/user', handler: _lazy_Oy4yHY, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/login.post copy 2', handler: _lazy_QeoDIW, lazy: true, middleware: false, method: undefined },
  { route: '/api/auth/login', handler: _lazy_7LlLSE, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/logout', handler: _lazy_KbdQuo, lazy: true, middleware: false, method: "post" },
  { route: '/__nuxt_error', handler: _lazy_gbxEtU, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/api/_nuxt_icon/:collection', handler: _mbgvTX, lazy: false, middleware: false, method: undefined },
  { route: '/__og-image__/font/**', handler: _lazy_2732Ht, lazy: true, middleware: false, method: undefined },
  { route: '', handler: _CwwFs5, lazy: false, middleware: true, method: undefined },
  { route: '/__og-image__/image/**', handler: _lazy_5meWuT, lazy: true, middleware: false, method: undefined },
  { route: '/__og-image__/static/**', handler: _lazy_5meWuT, lazy: true, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _pQ8CUB, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_gbxEtU, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b$1(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C$1(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = options || {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { isScriptProtocol as $, getRenderer as A, renderInlineStyles as B, replaceIslandTeleports as C, useNitroApp as D, prefixStorage as E, useStorage as F, useNitroOrigin as G, emojiCache as H, useOgImageRuntimeConfig as I, fetchIsland as J, createHeadCore as K, normaliseFontInput as L, theme as M, withTrailingSlash as N, handleCacheHeaders as O, setHeaders as P, hash$1 as Q, parseURL as R, proxyRequest as S, sendRedirect as T, UNAUTHORIZED as U, resolveContext as V, H3Error as W, headSymbol as X, klona as Y, defuFn as Z, hasProtocol as _, customCreateError as a, joinURL as a0, withQuery as a1, defu as a2, useSeoMeta as a3, useHead as a4, getRequestHeaders as a5, sanitizeStatusCode as a6, getContext as a7, parse as a8, getRequestHeader as a9, isEqual as aa, $fetch$1 as ab, baseURL as ac, resolveUnrefHeadInput as ad, createHooks as ae, executeAsync as af, toRouteMatcher as ag, createRouter$1 as ah, withoutBase as ai, withLeadingSlash as aj, withoutTrailingSlash as ak, withBase as al, decodeHtml as am, logger as an, toBase64Image as ao, htmlDecodeQuotes as ap, sendError as aq, fontCache as ar, parseQuery as as, nodeServer as at, getRouterParam as b, createError$1 as c, defineEventHandler as d, getQuery as e, readBody as f, getCookie as g, setHeader as h, setCookie as i, deleteCookie as j, getResponseStatusText as k, getResponseStatus as l, appId as m, defineRenderHandler as n, buildAssetsURL as o, publicAssetsURL as p, appTeleportTag as q, readMultipartFormData as r, setResponseHeader as s, appTeleportAttrs as t, useRuntimeConfig as u, createSSRContext as v, appHead as w, destr as x, setSSRError as y, getRouteRules as z };
//# sourceMappingURL=nitro.mjs.map
