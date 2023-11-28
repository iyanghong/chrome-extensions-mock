chrome.runtime.onConnect.addListener((port) => {
  console.log(port);
  console.assert(port.name === 'knockknock');
  port.onMessage.addListener((msg) => {
    console.log(msg);
    if (msg.joke === 'Knock knock')
      port.postMessage({ question: "Who's there?" });
    else if (msg.answer === 'Madame')
      port.postMessage({ question: 'Madame who?' });
    else if (msg.answer === 'Madame... Bovary')
      port.postMessage({ question: "I don't get it." });
  });
});
// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('收到来自content-script的消息：');
  console.log(request, sender, sendResponse);
  sendResponse(`我是后台，我已收到你的消息：${JSON.stringify(request)}`);
});
