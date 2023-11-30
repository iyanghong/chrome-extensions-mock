// export const useCurrentTab = () => {
//   return new Promise<chrome.tabs.Tab>(resolve => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
//       resolve(tab[0]);
//     });
//   });
// };


export function useCurrentTab ():Promise<chrome.tabs.Tab> {
  return new Promise<chrome.tabs.Tab>(resolve => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
      resolve(tab[0]);
    });
  });
}