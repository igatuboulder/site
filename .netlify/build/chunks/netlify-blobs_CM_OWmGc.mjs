import { getDeployStore, getStore } from '@netlify/blobs';
import { fetch } from 'ofetch';

function defineDriver(factory) {
  return factory;
}
function assertURLPathKey(driver, key) {
  const invalid = (reason) => createError(driver, `Invalid key: ${JSON.stringify(key)}. ${reason}`);
  if (!key) {
    throw invalid("Empty keys are not allowed");
  }
  if (/[?#]/.test(key)) {
    throw invalid(`"?" and "#" are not allowed`);
  }
  if (/[\u0000-\u001F]|^ | $/.test(key)) {
    throw invalid(
      "Control characters and leading/trailing spaces are not allowed"
    );
  }
  const hasDotSegment = key.split(/[/\\]|%2f|%5c/i).some((segment) => {
    segment = segment.replace(/%2e/gi, ".");
    return segment === "." || segment === "..";
  });
  if (hasDotSegment) {
    throw invalid(`"." and ".." segments are not allowed`);
  }
  return key;
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

const DRIVER_NAME = "netlify-blobs";
const netlifyBlobs = defineDriver((options) => {
  const { deployScoped, name, ...opts } = options;
  let store;
  const getClient = () => {
    if (!store) {
      if (deployScoped) {
        if (name) {
          throw createError(
            DRIVER_NAME,
            "deploy-scoped stores cannot have a name"
          );
        }
        store = getDeployStore({ fetch, ...options });
      } else {
        if (!name) {
          throw createRequiredError(DRIVER_NAME, "name");
        }
        store = getStore({ name: encodeURIComponent(name), fetch, ...opts });
      }
    }
    return store;
  };
  const k = (key) => assertURLPathKey(DRIVER_NAME, key);
  return {
    name: DRIVER_NAME,
    options,
    getInstance: getClient,
    async hasItem(key) {
      return getClient().getMetadata(k(key)).then(Boolean);
    },
    getItem: async (key, tops) => {
      return getClient().get(k(key), tops);
    },
    async getMeta(key) {
      return getClient().getMetadata(k(key));
    },
    async getItemRaw(key, topts) {
      return getClient().get(k(key), { type: topts?.type ?? "arrayBuffer" });
    },
    async setItem(key, value, topts) {
      await getClient().set(k(key), value, topts);
    },
    async setItemRaw(key, value, topts) {
      await getClient().set(k(key), value, topts);
    },
    async removeItem(key) {
      return getClient().delete(k(key));
    },
    async getKeys(base, tops) {
      return (await getClient().list({ ...tops, prefix: base })).blobs.map(
        (item) => item.key
      );
    },
    async clear(base) {
      const client = getClient();
      return Promise.allSettled(
        (await client.list({ prefix: base })).blobs.map(
          (item) => client.delete(item.key)
        )
      ).then(() => {
      });
    }
  };
});

export { netlifyBlobs as default };
