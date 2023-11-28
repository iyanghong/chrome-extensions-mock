// need to make sure we aren't affected by overlapping namespaces
// and that we dont affect the app with our namespace
// mostly a fix for web3's BigNumber if AMD's "define" is defined...
// @ts-ignore
let __define;

/**
 * Caches reference to global define object and deletes it to
 * avoid conflicts with other global define objects, such as
 * AMD's define function
 */
const cleanContextForImports = () => {
  // @ts-ignore
  __define = global.define;
  try {
    // @ts-ignore
    global.define = undefined;
  } catch (_) {
    console.warn('MetaMask - global.define could not be deleted.');
  }
};

/**
 * Restores global define object from cached reference
 */
const restoreContextAfterImports = () => {
  try {
    // @ts-ignore
    global.define = __define;
  } catch (_) {
    console.warn('MetaMask - global.define could not be overwritten.');
  }
};

cleanContextForImports();

/* eslint-disable import/first */
import log from 'loglevel';
import LocalMessageDuplexStream from 'post-message-stream';
import { initializeProvider } from '@metamask/providers';
// import shouldInjectProvider from '../../shared/modules/provider-injection';

// contexts
// const CONTENT_SCRIPT = 'metamask-contentscript';
// const INPAGE = 'metamask-inpage';

restoreContextAfterImports();

log.setDefaultLevel(process.env.METAMASK_DEBUG ? 'debug' : 'warn');

//
// setup plugin communication
//

// if (shouldInjectProvider()) {
// setup background connection
const metamaskStream = new LocalMessageDuplexStream({
  name: 'inpage',
  target: 'contentscript'
});

initializeProvider({
  connectionStream: metamaskStream,
  logger: log,
  shouldShimWeb3: true
});
const { ethereum } = window as any;
console.log(ethereum);
// }
