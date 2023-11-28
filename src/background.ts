import PageRuleStoreService from './store/PageRuleStore';

const PageRuleStore = new PageRuleStoreService()

PageRuleStore.refreshData()

chrome.runtime.onInstalled.addListener( async () => {

});



