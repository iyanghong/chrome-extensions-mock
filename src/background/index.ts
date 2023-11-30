import PageRuleStoreService from '@/common/store/PageRuleStore';

const PageRuleStore = new PageRuleStoreService()

await PageRuleStore.refreshData()

chrome.runtime.onInstalled.addListener( async () => {

});



