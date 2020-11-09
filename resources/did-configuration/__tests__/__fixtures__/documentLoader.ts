import jsonld from "jsonld";
import { extendContextLoader } from "jsonld-signatures";
import { resolver} from "./resolver";
import didConfigurationV2Context from "../../../../contexts/did-configuration-v0.2.json";

const contexts: any = {
  "https://identity.foundation/.well-known/contexts/did-configuration-v0.2.jsonld": didConfigurationV2Context,
};

export const customDocLoader = async (url: any) => {
  if (url.startsWith("did:")) {
    const didDocument = await resolver(url);

    return {
      contextUrl: null, // this is for a context via a link header
      document: didDocument, // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  }

  const context = contexts[url];

  if (context) {
    return {
      contextUrl: null, // this is for a context via a link header
      document: context, // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  }

  return jsonld.documentLoaders.node()(url);
};

export const customLoader = extendContextLoader(customDocLoader);