export function getContextDocument(context: string[]) {
  let doc = document;
  for (let key of context) {
    let iframe = doc.querySelector(key);
    //@ts-ignore
    if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
      //@ts-ignore
      doc = iframe.contentWindow.document;
    }
  }
  return doc;
}