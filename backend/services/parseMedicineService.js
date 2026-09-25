const PARSE_BASE_URL = 'https://api.parse.bot';
const ENDPOINT_NAME = 'search_medicines';
const OPEN_API_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options']);

export const AVAILABILITY_VALUES = Object.freeze(['in-stock', 'out-of-stock', 'not-serviceable', 'unknown']);

export const MEDICINE_PROVIDERS = Object.freeze([
  Object.freeze({ name: 'PharmEasy', scraperId: '60e3a396-2cf6-45cf-9d04-9f865dcbf334' }),
  Object.freeze({ name: 'Apollo', scraperId: 'b3e3992c-e113-4b1d-8826-f8280149ac28' }),
  Object.freeze({ name: '1mg', scraperId: '147c82cf-4ca5-4ffc-9c2f-cf6c935f30d7' })
]);

const ERROR_DEFINITIONS = Object.freeze({
  unauthorized: ['unauthorized', 'Provider authentication failed.'],
  payment_required: ['payment_required', 'Provider access requires payment.'],
  client_error: ['client_error', 'Provider rejected the search request.'],
  server_error: ['server_error', 'Provider is temporarily unavailable.'],
  openapi_timeout: ['timeout', 'Provider schema request timed out.'],
  timeout: ['timeout', 'Provider request timed out.'],
  openapi_network_error: ['network_error', 'Provider schema could not be reached.'],
  network_error: ['network_error', 'Provider could not be reached.'],
  openapi_invalid_response: ['invalid_response', 'Provider returned an invalid schema document.'],
  invalid_response: ['invalid_response', 'Provider returned an unsupported search response.'],
  contract_error: ['contract_error', 'Provider search inputs could not be resolved confidently.'],
  internal_error: ['internal_error', 'Provider search failed.']
});

const openApiCache = new Map();
const openApiRequests = new Map();

class ProviderFailure extends Error {
  constructor(code) {
    const [publicCode, message] = ERROR_DEFINITIONS[code] || ERROR_DEFINITIONS.internal_error;
    super(message);
    this.name = 'ProviderFailure';
    this.code = publicCode;
  }
}

function boundedInteger(value, fallback, minimum, maximum) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, parsed));
}

function getRuntimeConfig() {
  return {
    requestTimeoutMs: boundedInteger(process.env.PARSE_MEDICINE_TIMEOUT_MS, 12000, 100, 60000),
    openApiTimeoutMs: boundedInteger(process.env.PARSE_MEDICINE_OPENAPI_TIMEOUT_MS, 8000, 100, 30000),
    openApiCacheTtlMs: boundedInteger(process.env.PARSE_MEDICINE_OPENAPI_CACHE_TTL_MS, 300000, 0, 600000),
    maxResultsPerProvider: boundedInteger(process.env.PARSE_MEDICINE_MAX_RESULTS, 20, 1, 50)
  };
}

export function isParseMedicineSearchConfigured() {
  return typeof process.env.PARSE_API_KEY === 'string' && process.env.PARSE_API_KEY.trim().length > 0;
}

export function clearOpenApiCache() {
  openApiCache.clear();
  openApiRequests.clear();
}

function responseIsOk(response) {
  if (response?.ok === true) return true;
  const status = Number(response?.status);
  return Number.isFinite(status) && status >= 200 && status < 300;
}

function failureForResponse(response, stage) {
  const status = Number(response?.status);
  if (status === 401) return new ProviderFailure(stage === 'openapi' ? 'unauthorized' : 'unauthorized');
  if (status === 402) return new ProviderFailure('payment_required');
  if (status >= 400 && status < 500) return new ProviderFailure('client_error');
  if (status >= 500) return new ProviderFailure('server_error');
  return new ProviderFailure(stage === 'openapi' ? 'openapi_invalid_response' : 'invalid_response');
}

async function fetchWithTimeout(url, options, timeoutMs) {
  if (typeof globalThis.fetch !== 'function') {
    throw new ProviderFailure(options?.stage === 'openapi' ? 'openapi_network_error' : 'network_error');
  }

  const controller = new AbortController();
  let didTimeout = false;
  const timeout = setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, timeoutMs);

  try {
    return await globalThis.fetch(url, {
      ...options,
      signal: controller.signal
    });
  } catch (error) {
    if (didTimeout || error?.name === 'AbortError' || error?.code === 'ABORT_ERR') {
      throw new ProviderFailure(options?.stage === 'openapi' ? 'openapi_timeout' : 'timeout');
    }
    throw new ProviderFailure(options?.stage === 'openapi' ? 'openapi_network_error' : 'network_error');
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJson(url, options, timeoutMs, stage) {
  const response = await fetchWithTimeout(url, options, timeoutMs);
  if (!responseIsOk(response)) throw failureForResponse(response, stage);

  try {
    return await response.json();
  } catch {
    throw new ProviderFailure(stage === 'openapi' ? 'openapi_invalid_response' : 'invalid_response');
  }
}

async function fetchProviderOpenApi(provider, apiKey, config) {
  const cached = openApiCache.get(provider.scraperId);
  if (cached && cached.expiresAt > Date.now()) return cached.document;

  const activeRequest = openApiRequests.get(provider.scraperId);
  if (activeRequest) return activeRequest;

  const request = (async () => {
    const document = await fetchJson(
      `${PARSE_BASE_URL}/v1/apis/${encodeURIComponent(provider.scraperId)}/openapi.json`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-API-Key': apiKey
        },
        stage: 'openapi'
      },
      config.openApiTimeoutMs,
      'openapi'
    );

    if (!document || typeof document !== 'object' || Array.isArray(document)) {
      throw new ProviderFailure('openapi_invalid_response');
    }

    if (config.openApiCacheTtlMs > 0) {
      openApiCache.set(provider.scraperId, {
        document,
        expiresAt: Date.now() + config.openApiCacheTtlMs
      });
    }
    return document;
  })();

  openApiRequests.set(provider.scraperId, request);
  try {
    return await request;
  } finally {
    if (openApiRequests.get(provider.scraperId) === request) {
      openApiRequests.delete(provider.scraperId);
    }
  }
}

function decodeReferencePart(value) {
  return decodeURIComponent(value).replace(/~1/g, '/').replace(/~0/g, '~');
}

function resolveReference(document, node, referenceStack = new Set()) {
  if (!node || typeof node !== 'object' || typeof node.$ref !== 'string') return node;
  if (!node.$ref.startsWith('#/')) throw new ProviderFailure('contract_error');

  const reference = node.$ref;
  if (referenceStack.has(reference)) return {};
  const nextStack = new Set(referenceStack);
  nextStack.add(reference);

  const target = reference
    .slice(2)
    .split('/')
    .map(decodeReferencePart)
    .reduce((current, segment) => current?.[segment], document);

  if (!target || typeof target !== 'object') throw new ProviderFailure('contract_error');
  const { $ref, ...siblings } = node;
  return resolveReference(document, { ...target, ...siblings }, nextStack);
}

function mergeExpandedSchemas(left, right) {
  const merged = { ...left, ...right };
  const leftProperties = left?.properties && typeof left.properties === 'object' ? left.properties : {};
  const rightProperties = right?.properties && typeof right.properties === 'object' ? right.properties : {};
  const properties = { ...leftProperties };

  for (const [name, schema] of Object.entries(rightProperties)) {
    properties[name] = leftProperties[name] && typeof leftProperties[name] === 'object' && typeof schema === 'object'
      ? mergeExpandedSchemas(leftProperties[name], schema)
      : schema;
  }

  if (Object.keys(properties).length > 0 || leftProperties || rightProperties) {
    merged.properties = properties;
  }

  const required = new Set([
    ...(Array.isArray(left?.required) ? left.required : []),
    ...(Array.isArray(right?.required) ? right.required : [])
  ]);
  if (required.size > 0 || left?.required || right?.required) {
    merged.required = [...required];
  }

  return merged;
}

function expandSchema(document, schema, referenceStack = new Set()) {
  if (!schema || typeof schema !== 'object') return {};

  if (typeof schema.$ref === 'string') {
    const reference = schema.$ref;
    if (referenceStack.has(reference)) return {};
    const nextStack = new Set(referenceStack);
    nextStack.add(reference);
    return expandSchema(document, resolveReference(document, schema, referenceStack), nextStack);
  }

  const { allOf, ...base } = schema;
  let expanded = base;
  if (Array.isArray(allOf)) {
    for (const part of allOf) {
      expanded = mergeExpandedSchemas(expanded, expandSchema(document, part, referenceStack));
    }
  }
  return expanded;
}

function normalizedToken(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizedText(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function operationSemantics(operation) {
  return normalizedText([
    operation?.operationId,
    operation?.summary,
    operation?.description,
    ...(Array.isArray(operation?.tags) ? operation.tags : [])
  ].filter(Boolean).join(' '));
}

function listOperations(document) {
  const paths = document?.paths && typeof document.paths === 'object' ? document.paths : {};
  const operations = [];

  for (const [path, unresolvedPathItem] of Object.entries(paths)) {
    const pathItem = resolveReference(document, unresolvedPathItem);
    if (!pathItem || typeof pathItem !== 'object') continue;

    for (const [method, unresolvedOperation] of Object.entries(pathItem)) {
      const normalizedMethod = method.toLowerCase();
      if (!OPEN_API_METHODS.has(normalizedMethod)) continue;
      const operation = resolveReference(document, unresolvedOperation);
      if (!operation || typeof operation !== 'object') continue;
      operations.push({ path, pathItem, method: normalizedMethod, operation });
    }
  }

  return operations;
}

function operationMatchScore(entry, endpointName) {
  const endpointToken = normalizedToken(endpointName);
  const operation = entry.operation;
  const explicitNames = [
    operation?.operationId,
    operation?.['x-operation-name'],
    operation?.['x-endpoint-name'],
    operation?.['x-scraper-endpoint']
  ].filter(Boolean);
  const pathSegments = entry.path.split('/').filter(Boolean).map(normalizedToken);
  const semantics = operationSemantics(operation);
  let score = 0;

  if (explicitNames.some((name) => normalizedToken(name) === endpointToken)) score += 1000;
  else if (explicitNames.some((name) => normalizedToken(name).includes(endpointToken))) score += 850;

  if (pathSegments.includes(endpointToken)) score += 600;
  if (semantics.replace(/[^a-z0-9]/g, '').includes(normalizedToken(endpointName))) score += 300;
  if (normalizedToken(entry.path).includes(endpointToken)) score += 200;
  if (score === 0 && explicitNames.length === 0 && pathSegments.length === 1) score += 10;

  return score;
}

export function findSearchMedicinesOperation(document, endpointName = ENDPOINT_NAME) {
  const ranked = listOperations(document)
    .map((entry) => ({ ...entry, score: operationMatchScore(entry, endpointName) }))
    .filter((entry) => entry.score >= 200)
    .sort((left, right) => right.score - left.score);

  if (ranked.length === 0) throw new ProviderFailure('contract_error');

  const best = ranked[0];
  const equallySpecific = ranked.filter((entry) => (
    entry.score === best.score
    && entry.path === best.path
    && entry.method === best.method
  ));
  if (equallySpecific.length !== 1) throw new ProviderFailure('contract_error');

  return best;
}

function parameterKey(parameter) {
  return `${parameter?.in || ''}:${parameter?.name || ''}`;
}

function parameterSchema(parameter) {
  if (parameter?.schema) return parameter.schema;
  const content = parameter?.content && typeof parameter.content === 'object' ? parameter.content : null;
  if (!content) return {};
  const mediaType = Object.values(content)[0];
  return mediaType?.schema && typeof mediaType.schema === 'object' ? mediaType.schema : {};
}

function schemaKind(document, schema) {
  const expanded = expandSchema(document, schema);
  let type = expanded?.type;
  if (Array.isArray(type)) type = type.find((entry) => entry !== 'null') || type[0];
  if (!type && expanded?.properties) type = 'object';
  return type;
}

function descriptorsFromSchema(document, schema, parentPath = [], inheritedRequired = false, depth = 0) {
  if (depth > 6) {
    return [{
      name: parentPath[parentPath.length - 1] || 'body',
      path: [...parentPath],
      in: 'body',
      required: inheritedRequired,
      description: '',
      schema: schema && typeof schema === 'object' ? schema : {}
    }];
  }

  const expanded = expandSchema(document, schema);
  const properties = expanded?.properties && typeof expanded.properties === 'object' ? expanded.properties : {};
  const required = new Set(Array.isArray(expanded?.required) ? expanded.required : []);
  const descriptors = [];

  for (const [name, unresolvedPropertySchema] of Object.entries(properties)) {
    const propertySchema = expandSchema(document, unresolvedPropertySchema);
    const path = [...parentPath, name];
    const isRequired = inheritedRequired || required.has(name);
    const nested = schemaKind(document, propertySchema) === 'object'
      ? descriptorsFromSchema(document, propertySchema, path, isRequired, depth + 1)
      : [];

    if (nested.length > 0) {
      descriptors.push(...nested);
    } else {
      descriptors.push({
        name,
        path,
        in: 'body',
        required: isRequired,
        description: String(propertySchema?.description || ''),
        schema: propertySchema
      });
    }
  }

  if (descriptors.length === 0 && parentPath.length > 0) {
    descriptors.push({
      name: parentPath[parentPath.length - 1],
      path: [...parentPath],
      in: 'body',
      required: inheritedRequired,
      description: String(expanded?.description || ''),
      schema: expanded
    });
  }

  return descriptors;
}

function jsonMediaSchema(document, requestBody) {
  const resolved = resolveReference(document, requestBody);
  const content = resolved?.content && typeof resolved.content === 'object' ? resolved.content : {};
  const mediaTypes = Object.keys(content);
  const selected = mediaTypes.find((mediaType) => mediaType.toLowerCase() === 'application/json')
    || mediaTypes.find((mediaType) => mediaType.toLowerCase().endsWith('+json'))
    || (mediaTypes.length === 1 && /json/i.test(mediaTypes[0]) ? mediaTypes[0] : null);
  return selected ? content[selected]?.schema : null;
}

function mergeDescriptors(descriptors) {
  const merged = new Map();
  for (const descriptor of descriptors) {
    const key = `${descriptor.in}:${descriptor.path.join('.')}`;
    const existing = merged.get(key);
    merged.set(key, existing ? {
      ...existing,
      required: existing.required || descriptor.required,
      description: existing.description || descriptor.description,
      schema: existing.schema || descriptor.schema
    } : descriptor);
  }
  return [...merged.values()];
}

export function deriveEndpointInputDescriptors(document, operationEntry) {
  const pathParameters = Array.isArray(operationEntry.pathItem?.parameters) ? operationEntry.pathItem.parameters : [];
  const operationParameters = Array.isArray(operationEntry.operation?.parameters) ? operationEntry.operation.parameters : [];
  const parameterMap = new Map();
  const descriptors = [];

  for (const unresolvedParameter of [...pathParameters, ...operationParameters]) {
    const parameter = resolveReference(document, unresolvedParameter);
    if (!parameter || typeof parameter !== 'object' || !parameter.in || !parameter.name) continue;
    parameterMap.set(parameterKey(parameter), parameter);
  }

  for (const parameter of parameterMap.values()) {
    if (parameter.in === 'body') {
      descriptors.push(...descriptorsFromSchema(document, parameterSchema(parameter)));
      continue;
    }

    if (!['query', 'header', 'path', 'cookie'].includes(parameter.in)) continue;
    descriptors.push({
      name: String(parameter.name),
      path: [String(parameter.name)],
      in: parameter.in,
      required: parameter.required === true,
      description: String(parameter.description || parameterSchema(parameter)?.description || ''),
      schema: parameterSchema(parameter)
    });
  }

  if (operationEntry.operation?.requestBody) {
    const schema = jsonMediaSchema(document, operationEntry.operation.requestBody);
    if (schema) descriptors.push(...descriptorsFromSchema(document, schema));
  }

  return mergeDescriptors(descriptors);
}

function descriptorSemantics(descriptor) {
  return normalizedText([
    descriptor.name,
    descriptor.path.join(' '),
    descriptor.description,
    descriptor.schema?.title,
    descriptor.schema?.description
  ].filter(Boolean).join(' '));
}

function scoreMedicineDescriptor(descriptor) {
  const key = normalizedToken(descriptor.name);
  const direct = new Set([
    'medicine', 'medicinename', 'drug', 'drugname', 'medication', 'medicationname',
    'product', 'productname', 'productsearch', 'drugsearch', 'medicinesearch', 'medicinequery'
  ]);
  const genericQuery = new Set(['query', 'q', 'term', 'search', 'searchterm', 'searchtext', 'keyword', 'keywords', 'text']);
  const semantics = descriptorSemantics(descriptor);

  if (direct.has(key)) return 140;
  if (/\b(medicine|medicines|drug|drugs|pharmaceutical|medication|pharmaceuticals)\b/.test(semantics)) return 130;
  if (genericQuery.has(key) && ENDPOINT_NAME.replace('_', ' ') === 'search medicines') return 110;
  if (key === 'name' && /\b(medicine|drug|medication|product)\b/.test(semantics)) return 100;
  return 0;
}

function scoreLocationDescriptor(descriptor) {
  const key = normalizedToken(descriptor.name);
  const semantics = descriptorSemantics(descriptor);
  const pin = new Set(['pin', 'pincode', 'postalcode', 'zipcode', 'zip']);
  const location = new Set(['location', 'locationid', 'servicelocation', 'deliverylocation', 'nearbylocation']);

  if (pin.has(key)) return 150;
  if (/\b(pin|pincode|postal code|postalcode|zip code|zipcode)\b/.test(semantics)) return 140;
  if (location.has(key)) return 120;
  if (/\b(location|locality|delivery area|service area)\b/.test(semantics) && /\b(location|delivery|nearby|service|locality)\b/.test(semantics)) return 100;
  return 0;
}

function uniqueBestDescriptor(descriptors, scorer) {
  const scored = descriptors
    .map((descriptor) => ({ descriptor, score: scorer(descriptor) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);

  if (scored.length === 0) return null;
  const bestScore = scored[0].score;
  const best = scored.filter((entry) => entry.score === bestScore);
  const unique = new Map(best.map((entry) => [
    `${entry.descriptor.in}:${entry.descriptor.path.join('.')}`,
    entry.descriptor
  ]));
  if (unique.size !== 1) throw new ProviderFailure('contract_error');
  return [...unique.values()][0];
}

function schemaTypeCandidates(document, schema) {
  const expanded = expandSchema(document, schema);
  const variants = [expanded, ...(Array.isArray(expanded?.oneOf) ? expanded.oneOf : []), ...(Array.isArray(expanded?.anyOf) ? expanded.anyOf : [])];
  const types = new Set();
  for (const variant of variants) {
    if (Array.isArray(variant?.type)) {
      for (const type of variant.type) if (type !== 'null') types.add(type);
    } else if (variant?.type) {
      if (variant.type !== 'null') types.add(variant.type);
    } else if (!expanded?.oneOf && !expanded?.anyOf && !variant?.oneOf && !variant?.anyOf) {
      types.add('unspecified');
    }
  }
  return types;
}

function descriptorAcceptsValue(document, descriptor, valueKind) {
  const types = schemaTypeCandidates(document, descriptor.schema);
  if (types.size === 0) return true;
  if (valueKind === 'medicine') return types.has('string') || types.has('unspecified');
  if (descriptor.in === 'query') return types.has('string') || types.has('integer') || types.has('number') || types.has('unspecified');
  return types.has('string') || types.has('integer') || types.has('number') || types.has('unspecified');
}

function ignoredRequiredDescriptor(descriptor) {
  const key = normalizedToken(descriptor.name);
  if (descriptor.in === 'path' && ['scraperid', 'endpointname', 'id'].includes(key)) return true;
  if (descriptor.in === 'header' && ['xapikey', 'apikey', 'authorization'].includes(key)) return true;
  if (descriptor.in === 'cookie') return true;
  return false;
}

function setNestedValue(target, path, value) {
  let current = target;
  for (let index = 0; index < path.length - 1; index += 1) {
    const segment = path[index];
    if (!current[segment] || typeof current[segment] !== 'object') current[segment] = {};
    current = current[segment];
  }
  current[path[path.length - 1]] = value;
}

function bodyValueForDescriptor(document, descriptor, value, valueKind) {
  if (descriptor.in === 'query' || descriptor.in !== 'body') return value;
  const types = schemaTypeCandidates(document, descriptor.schema);
  if (valueKind === 'location' && (types.has('integer') || types.has('number'))) return Number(value);
  return value;
}

export function buildSearchEndpointRequest(document, operationEntry, medicine, location) {
  if (!['get', 'post'].includes(operationEntry?.method)) {
    throw new ProviderFailure('contract_error');
  }

  const descriptors = deriveEndpointInputDescriptors(document, operationEntry);
  const medicineDescriptor = uniqueBestDescriptor(descriptors, scoreMedicineDescriptor);
  if (!medicineDescriptor || !['query', 'body'].includes(medicineDescriptor.in)) {
    throw new ProviderFailure('contract_error');
  }

  const locationDescriptor = uniqueBestDescriptor(descriptors, scoreLocationDescriptor);
  if (medicineDescriptor && !descriptorAcceptsValue(document, medicineDescriptor, 'medicine')) {
    throw new ProviderFailure('contract_error');
  }
  if (locationDescriptor && (!['query', 'body'].includes(locationDescriptor.in) || !descriptorAcceptsValue(document, locationDescriptor, 'location'))) {
    throw new ProviderFailure('contract_error');
  }

  const selected = new Set();
  if (medicineDescriptor) selected.add(`${medicineDescriptor.in}:${medicineDescriptor.path.join('.')}`);
  if (locationDescriptor) selected.add(`${locationDescriptor.in}:${locationDescriptor.path.join('.')}`);

  for (const descriptor of descriptors) {
    const key = `${descriptor.in}:${descriptor.path.join('.')}`;
    if (descriptor.required && !selected.has(key) && !ignoredRequiredDescriptor(descriptor)) {
      throw new ProviderFailure('contract_error');
    }
  }

  if (operationEntry.method === 'get' && [...selected].some((key) => key.startsWith('body:'))) {
    throw new ProviderFailure('contract_error');
  }

  const query = {};
  let body;
  if ([...selected].some((key) => key.startsWith('body:'))) body = {};

  if (medicineDescriptor) {
    const value = bodyValueForDescriptor(document, medicineDescriptor, medicine, 'medicine');
    if (medicineDescriptor.in === 'query') query[medicineDescriptor.name] = value;
    else setNestedValue(body, medicineDescriptor.path, value);
  }

  if (locationDescriptor) {
    const value = bodyValueForDescriptor(document, locationDescriptor, location, 'location');
    if (locationDescriptor.in === 'query') query[locationDescriptor.name] = value;
    else setNestedValue(body, locationDescriptor.path, value);
  }

  return {
    method: operationEntry.method,
    query,
    body,
    medicineInput: {
      location: medicineDescriptor.in,
      path: [...medicineDescriptor.path]
    },
    locationInput: locationDescriptor ? {
      location: locationDescriptor.in,
      path: [...locationDescriptor.path]
    } : null
  };
}

function canonicalKey(value) {
  return normalizedToken(value);
}

function scalarEntry(path, value) {
  return {
    path,
    segments: path.map((segment) => String(segment)),
    key: canonicalKey(path[path.length - 1]),
    value
  };
}

function flattenValue(value, path, entries, depth = 0) {
  if (entries.length >= 2000 || depth > 10 || value == null) return;
  if (Array.isArray(value)) {
    value.forEach((entry, index) => flattenValue(entry, [...path, index], entries, depth + 1));
    return;
  }
  if (typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      flattenValue(entry, [...path, key], entries, depth + 1);
    }
    return;
  }
  entries.push(scalarEntry(path, value));
}

function entriesForObject(value) {
  const entries = [];
  flattenValue(value, [], entries);
  return entries;
}

function safeText(value, maximumLength = 500) {
  if (typeof value === 'string' || typeof value === 'number') {
    const text = String(value).trim();
    return text && text.length <= maximumLength ? text : text.slice(0, maximumLength);
  }
  return null;
}

function pathContainsAny(segments, aliases) {
  return segments.some((segment) => aliases.has(canonicalKey(segment)));
}

function findText(entries, aliases, contextAliases = new Set()) {
  const candidates = [];

  for (const entry of entries) {
    if (!aliases.has(entry.key)) continue;
    let score = 120 - entry.path.length;
    if (contextAliases.size > 0 && pathContainsAny(entry.segments, contextAliases)) score += 30;
    if (entry.key === 'name') score -= 25;
    const text = safeText(entry.value);
    if (text) candidates.push({ text, score });
  }

  candidates.sort((left, right) => right.score - left.score);
  return candidates[0]?.text || null;
}

function parseMoney(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value >= 0 ? value : null;
  }
  if (typeof value !== 'string') return null;

  const cleaned = value
    .trim()
    .replace(/^(?:inr|rs\.?|₹)\s*/i, '')
    .replace(/,/g, '')
    .trim();
  if (!/^\d+(?:\.\d+)?$/.test(cleaned)) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function findMoney(entries, aliases, excludedAncestors = new Set()) {
  const candidates = [];

  for (const entry of entries) {
    if (excludedAncestors.size > 0 && pathContainsAny(entry.segments, excludedAncestors)) continue;
    const hasAlias = aliases.has(entry.key);
    const ancestorIndex = entry.segments.findIndex((segment) => aliases.has(canonicalKey(segment)));
    const leaf = canonicalKey(entry.segments[entry.segments.length - 1]);
    const nestedValue = ancestorIndex >= 0 && ['amount', 'value', 'price'].includes(leaf);
    if (!hasAlias && !nestedValue) continue;
    const money = parseMoney(entry.value);
    if (money == null) continue;
    candidates.push({ money, score: (hasAlias ? 100 : 70) - entry.path.length });
  }

  candidates.sort((left, right) => right.score - left.score);
  return candidates[0]?.money ?? null;
}

function safeUrl(value) {
  const text = safeText(value, 2048);
  if (!text || /^(?:javascript|data|vbscript):/i.test(text)) return null;
  try {
    const candidate = text.startsWith('//') ? `https:${text}` : text;
    const parsed = new URL(candidate, 'https://provider.invalid');
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    if (parsed.username || parsed.password) return null;
    return text;
  } catch {
    return null;
  }
}

function findUrl(entries, aliases, contextAliases = new Set(), excludedContextAliases = new Set()) {
  const candidates = [];

  for (const entry of entries) {
    if (excludedContextAliases.size > 0 && excludedUrlContext(entry, excludedContextAliases)) continue;
    const direct = aliases.has(entry.key);
    const contextual = contextAliases.size > 0
      && pathContainsAny(entry.segments, contextAliases)
      && ['url', 'src', 'link', 'href', 'path'].includes(entry.key);
    if (!direct && !contextual) continue;
    const url = safeUrl(entry.value);
    if (url) candidates.push({ url, score: (direct ? 100 : 70) - entry.path.length });
  }

  candidates.sort((left, right) => right.score - left.score);
  return candidates[0]?.url || null;
}

function excludedUrlContext(entry, contextAliases) {
  return entry.segments.slice(0, -1).some((segment) => contextAliases.has(canonicalKey(segment)));
}

function findPrescriptionRequirement(entries) {
  const aliases = new Set([
    'prescriptionrequired', 'prescription', 'rxrequired', 'rx', 'requiresprescription',
    'isprescriptionrequired', 'isrx', 'prescriptionneeded'
  ]);
  const candidates = [];

  for (const entry of entries) {
    if (!aliases.has(entry.key)) continue;
    const value = typeof entry.value === 'string' ? entry.value.trim().toLowerCase() : entry.value;
    if (value === true || value === 1 || ['true', 'yes', 'required', 'rx', 'prescription'].includes(value)) {
      candidates.push(true);
    } else if (value === false || value === 0 || ['false', 'no', 'notrequired', 'withoutprescription', 'otc'].includes(value)) {
      candidates.push(false);
    }
  }

  if (candidates.includes(true)) return true;
  if (candidates.length > 0 && candidates.every((value) => value === false)) return false;
  return null;
}

function availabilityEntry(entry) {
  const direct = new Set([
    'availability', 'available', 'isavailable', 'instock', 'isinstock', 'outofstock',
    'isoutofstock', 'notserviceable', 'unserviceable', 'isserviceable', 'serviceable',
    'stock', 'stockcount', 'stockquantity', 'inventory', 'inventorycount', 'availablecount',
    'availabilitystatus', 'stockstatus', 'serviceability', 'deliverystatus', 'fulfillmentstatus'
  ]);
  if (direct.has(entry.key)) return true;
  if (entry.key === 'status' || entry.key === 'code') {
    return entry.segments.slice(0, -1).some((segment) => [
      'availability', 'stock', 'inventory', 'serviceability', 'deliveryavailability', 'fulfillment'
    ].includes(canonicalKey(segment)));
  }
  if (entry.key === 'count' || entry.key === 'quantity') {
    return entry.segments.slice(0, -1).some((segment) => ['stock', 'inventory', 'availability'].includes(canonicalKey(segment)));
  }
  return false;
}

function availabilityFromEntry(entry) {
  const key = entry.key;
  const text = normalizedText(entry.value).replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const serviceabilityKey = key.includes('serviceable') || pathContainsAny(entry.segments, new Set(['serviceability']));
  const outOfStockKey = key.includes('outofstock') || key.includes('notserviceable') || key.includes('unserviceable');

  if (typeof entry.value === 'boolean') {
    if (serviceabilityKey) return entry.value ? 'unknown' : 'not-serviceable';
    if (outOfStockKey) return entry.value ? (key.includes('notserviceable') || key.includes('unserviceable') ? 'not-serviceable' : 'out-of-stock') : 'unknown';
    return entry.value ? 'in-stock' : 'out-of-stock';
  }

  if (typeof entry.value === 'number' && Number.isFinite(entry.value)) {
    if (['stock', 'stockcount', 'stockquantity', 'inventory', 'inventorycount', 'availablecount', 'count', 'quantity'].includes(key)) {
      return entry.value > 0 ? 'in-stock' : 'out-of-stock';
    }
    if (serviceabilityKey) return entry.value === 0 ? 'not-serviceable' : 'unknown';
    if (outOfStockKey) {
      if (entry.value === 0) return 'unknown';
      return key.includes('notserviceable') || key.includes('unserviceable') ? 'not-serviceable' : 'out-of-stock';
    }
    if (['availability', 'available', 'isavailable', 'instock', 'isinstock'].includes(key)) {
      return entry.value > 0 ? 'in-stock' : 'out-of-stock';
    }
    return 'unknown';
  }

  if (typeof entry.value !== 'string') return 'unknown';
  if (/(^|_)(not_serviceable|non_serviceable|unserviceable|not_serviceable_for_delivery|cannot_deliver|not_deliverable|out_of_service)($|_)/.test(text)
    || ['not_serviceable', 'unserviceable', 'not_deliverable', 'cannot_deliver'].includes(text)) {
    return 'not-serviceable';
  }
  if (/(^|_)(out_of_stock|not_in_stock|no_stock|sold_out|unavailable|not_available)($|_)/.test(text)
    || ['outofstock', 'nostock', 'soldout', 'unavailable', 'notavailable', 'false'].includes(text.replace(/_/g, ''))) {
    return 'out-of-stock';
  }
  if (serviceabilityKey && ['serviceable', 'true'].includes(text.replace(/_/g, ''))) return 'unknown';
  if (/(^|_)(in_stock|available|is_available|yes|true)($|_)/.test(text)
    || ['instock', 'available', 'isavailable', 'yes', 'true'].includes(text.replace(/_/g, ''))) {
    return 'in-stock';
  }
  return 'unknown';
}

function availabilityIsLocationSpecific(source) {
  const token = canonicalKey(source);
  return /(locationavailability|availabilitybylocation|locationstock|pinavailability|pincodeavailability|postalcodeavailability|zipcodeavailability|nearbystock|serviceability|serviceable|isserviceable|notserviceable|unserviceable|deliverystatus|fulfillmentstatus)/.test(token);
}

function availabilityHasScopedContext(entries, source) {
  const sourcePath = source.split('.');
  const parentPath = sourcePath.slice(0, -1);
  if (parentPath.length === 0) return false;
  return entries.some((entry) => {
    const entryPath = entry.path.map(String);
    if (entryPath.length <= parentPath.length) return false;
    if (!parentPath.every((segment, index) => entryPath[index] === segment)) return false;
    return entryPath.slice(parentPath.length).some((segment) => (
      /(location|locality|pin|postal|zip|nearby|delivery|serviceab)/i.test(segment)
    ));
  });
}

function findAvailability(entries) {
  const candidates = entries
    .filter(availabilityEntry)
    .map((entry) => ({
      availability: availabilityFromEntry(entry),
      source: entry.path.map(String).join('.').slice(0, 250)
    }));

  const priority = { 'not-serviceable': 4, 'out-of-stock': 3, 'in-stock': 2, unknown: 1 };
  candidates.sort((left, right) => priority[right.availability] - priority[left.availability]);
  const selected = candidates[0];
  return {
    availability: selected?.availability || 'unknown',
    availabilitySource: selected?.source || null,
    locationSpecific: selected
      ? availabilityIsLocationSpecific(selected.source) || availabilityHasScopedContext(entries, selected.source)
      : false
  };
}

function findLocation(entries, requestedLocation) {
  const location = findText(
    entries,
    new Set(['location', 'locationname', 'address', 'pin', 'pincode', 'postalcode', 'zipcode', 'city', 'locality']),
    new Set(['location', 'store', 'pharmacy', 'warehouse'])
  );
  return location || requestedLocation || null;
}

function findDeliveryEstimate(entries) {
  return findText(
    entries,
    new Set([
      'deliveryestimate', 'estimateddelivery', 'estimateddeliverytime', 'estimateddeliverydate',
      'deliverytime', 'deliveryeta', 'deliveryduration', 'timetodeliver', 'deliveryby'
    ])
  );
}

function normalizeCandidate(provider, requestedLocation, candidate) {
  const entries = candidate.stringName
    ? [scalarEntry([], candidate.stringName)]
    : entriesForObject(candidate.value);
  const medicineName = candidate.stringName || findText(
    entries,
    new Set(['medicinename', 'productname', 'drugname', 'genericname', 'brandname', 'displayname', 'name', 'title']),
    new Set(['medicine', 'product', 'drug', 'pharmacy', 'store'])
  );
  if (!medicineName) return null;

  const manufacturer = findText(
    entries,
    new Set(['manufacturer', 'manufacturername', 'manufacturerid', 'marketedby', 'company', 'companyname', 'brand', 'brandname', 'mfr']),
    new Set(['manufacturer', 'company', 'brand', 'mfr'])
  );
  const priceAliases = new Set(['price', 'sellingprice', 'saleprice', 'offerprice', 'discountedprice', 'finalprice', 'currentprice', 'dealprice']);
  const mrpAliases = new Set(['mrp', 'markedprice', 'listprice', 'maximumretailprice', 'marketprice', 'regularprice']);
  const image = findUrl(
    entries,
    new Set(['image', 'imageurl', 'productimage', 'medicineimage', 'thumbnail', 'thumbnailurl']),
    new Set(['image'])
  );
  const url = findUrl(
    entries,
    new Set(['producturl', 'medicineurl', 'productlink', 'medicinelink', 'canonicalurl', 'weburl', 'buyurl', 'url', 'link']),
    new Set(),
    new Set(['image'])
  );
  const availability = findAvailability(entries);

  return {
    provider,
    medicineName,
    manufacturer: manufacturer || null,
    price: findMoney(entries, priceAliases, mrpAliases),
    mrp: findMoney(entries, mrpAliases),
    availability: availability.availability,
    prescriptionRequired: findPrescriptionRequirement(entries),
    image: image || null,
    url: url || null,
    location: findLocation(entries, requestedLocation),
    locationSpecific: availability.locationSpecific,
    availabilitySource: availability.availabilitySource,
    deliveryEstimate: findDeliveryEstimate(entries)
  };
}

const PRIMARY_RESULT_KEYS = new Set([
  'data', 'result', 'results', 'items', 'medicines', 'medicinelist', 'products',
  'productlist', 'drugs', 'searchresults', 'output', 'payload'
]);

function looksLikeMedicineObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const keys = new Set(Object.keys(value).map(canonicalKey));
  const strongName = ['medicinename', 'productname', 'drugname', 'brandname', 'genericname', 'title'].some((key) => keys.has(key));
  if (strongName) return true;
  const detail = ['price', 'sellingprice', 'saleprice', 'mrp', 'manufacturer', 'image', 'imageurl', 'url', 'producturl', 'availability', 'stock', 'prescriptionrequired', 'rx'].some((key) => keys.has(key));
  return keys.has('name') && detail;
}

function collectCandidates(value, state, seen, inPrimaryCollection = false, depth = 0) {
  if (value == null || depth > 12) return;
  if (typeof value !== 'object') {
    if (inPrimaryCollection && typeof value === 'string' && value.trim()) {
      state.candidates.push({ stringName: value.trim().slice(0, 500) });
      state.namedCandidates += 1;
    }
    return;
  }
  if (seen.has(value)) return;
  seen.add(value);

  if (Array.isArray(value)) {
    if (inPrimaryCollection) state.foundCollection = true;
    for (const entry of value) collectCandidates(entry, state, seen, inPrimaryCollection, depth + 1);
    return;
  }

  if (looksLikeMedicineObject(value) || (inPrimaryCollection && Object.keys(value).some((key) => canonicalKey(key) === 'name'))) {
    state.candidates.push({ value });
  }

  for (const [key, entry] of Object.entries(value)) {
    const primary = PRIMARY_RESULT_KEYS.has(canonicalKey(key));
    if (primary) state.foundCollection = true;
    collectCandidates(entry, state, seen, primary, depth + 1);
  }
}

function inspectMedicineResponse(payload, options = {}) {
  const provider = String(options.provider || '');
  const requestedLocation = options.location == null ? null : safeText(options.location, 100);
  const limit = boundedInteger(options.limit, 20, 1, 50);
  const state = { candidates: [], foundCollection: false, namedCandidates: 0 };
  collectCandidates(payload, state, new Set(), Array.isArray(payload));
  const seenFingerprints = new Set();
  const items = [];

  for (const candidate of state.candidates) {
    const normalized = normalizeCandidate(provider, requestedLocation, candidate);
    if (!normalized) continue;
    state.namedCandidates += 1;
    const fingerprint = JSON.stringify([
      normalized.provider,
      normalized.medicineName.toLowerCase(),
      normalized.manufacturer?.toLowerCase() || '',
      normalized.price,
      normalized.mrp,
      normalized.availability,
      normalized.prescriptionRequired,
      normalized.image,
      normalized.url,
      normalized.location,
      normalized.deliveryEstimate
    ]);
    if (seenFingerprints.has(fingerprint)) continue;
    seenFingerprints.add(fingerprint);
    items.push(normalized);
    if (items.length >= limit) break;
  }

  return {
    items,
    foundCollection: state.foundCollection,
    candidateCount: state.candidates.length
  };
}

export function normalizeMedicineResponse(payload, options = {}) {
  return inspectMedicineResponse(payload, options).items;
}

async function executeProvider(provider, medicine, location, apiKey, config) {
  try {
    const document = await fetchProviderOpenApi(provider, apiKey, config);
    const operationEntry = findSearchMedicinesOperation(document, ENDPOINT_NAME);
    const endpointRequest = buildSearchEndpointRequest(document, operationEntry, medicine, location);
    const baseUrl = `${PARSE_BASE_URL}/scraper/${encodeURIComponent(provider.scraperId)}/${encodeURIComponent(ENDPOINT_NAME)}`;
    let url = baseUrl;
    const options = {
      method: endpointRequest.method.toUpperCase(),
      headers: {
        Accept: 'application/json',
        'X-API-Key': apiKey
      },
      stage: 'execution'
    };

    const query = new URLSearchParams();
    for (const [name, value] of Object.entries(endpointRequest.query)) query.set(name, String(value));
    const queryString = query.toString();
    if (queryString) url += `?${queryString}`;

    if (endpointRequest.method === 'post') {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(endpointRequest.body || {});
    }

    const payload = await fetchJson(url, options, config.requestTimeoutMs, 'execution');
    const inspected = inspectMedicineResponse(payload, {
      provider: provider.name,
      location,
      limit: config.maxResultsPerProvider
    });

    if (inspected.items.length === 0 && !inspected.foundCollection && inspected.candidateCount === 0) {
      throw new ProviderFailure('invalid_response');
    }

    return {
      provider: provider.name,
      status: inspected.items.length > 0 ? 'success' : 'empty',
      count: inspected.items.length,
      items: inspected.items,
      locationIncluded: Boolean(endpointRequest.locationInput),
      error: null
    };
  } catch (error) {
    const failure = error instanceof ProviderFailure ? error : new ProviderFailure('internal_error');
    return {
      provider: provider.name,
      status: 'error',
      count: 0,
      items: [],
      locationIncluded: false,
      error: { code: failure.code, message: failure.message }
    };
  }
}

export async function searchMedicinesNearby(medicine, location) {
  const apiKey = process.env.PARSE_API_KEY?.trim();
  if (!apiKey) {
    const error = new Error('Medicine search is temporarily unavailable.');
    error.status = 503;
    throw error;
  }

  const config = getRuntimeConfig();
  const providerResults = await Promise.all(
    MEDICINE_PROVIDERS.map((provider) => executeProvider(provider, medicine, location, apiKey, config))
  );
  const results = providerResults.flatMap((providerResult) => providerResult.items);
  const providerStatuses = Object.fromEntries(providerResults.map((result) => [result.provider, result.status]));
  const providerErrors = Object.fromEntries(providerResults.map((result) => [result.provider, result.error]));
  const countsByProvider = Object.fromEntries(providerResults.map((result) => [result.provider, result.count]));
  const failedProviders = providerResults.filter((result) => result.status === 'error').length;
  const emptyProviders = providerResults.filter((result) => result.status === 'empty').length;
  const providersWithResults = providerResults.filter((result) => result.status === 'success').length;

  return {
    query: medicine,
    location,
    results,
    providerStatuses,
    providerErrors,
    providers: providerResults.map(({ items, ...result }) => result),
    counts: {
      total: results.length,
      byProvider: countsByProvider
    },
    summary: {
      totalResults: results.length,
      providersSearched: MEDICINE_PROVIDERS.length,
      providersWithResults,
      providersEmpty: emptyProviders,
      providersFailed: failedProviders,
      partial: failedProviders > 0 && failedProviders < MEDICINE_PROVIDERS.length
    }
  };
}
