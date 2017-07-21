document.addEventListener('DOMContentLoaded', initHtml);

function initHtml(){
	syncVoteType();
	syncAngelType();
	syncNumberOfPosts();
	syncLogContent();
	syncProgressBar();
	
	
	document.getElementById("startVoting").addEventListener('click', function() {		
		 chrome.storage.local.set({"logContent":""});
		//start the event page
		chrome.runtime.getBackgroundPage(function(backgroundPage){
			backgroundPage.startVoting();
		});
		
    });
	
	document.getElementById("stopCurrentVoting").addEventListener('click',function(){
		chrome.storage.local.get({"voteTabId":0},function(items){
			if(items.voteTabId!=0){
				chrome.storage.local.set({"voteTabId":0,"voteTabWindowId":0});
				addToLog("Vote Stoped");
			}
		});
	});
	
	document.getElementById("openHelp").addEventListener('click', function() {		
		 chrome.tabs.create({url: chrome.extension.getURL('helpPage.html')});	
    });
	
}

function syncVoteType(){
	chrome.storage.local.get({"voteType":"upvote"},function(items){
		var type=items.voteType;
		if(type=="upvote"){
			document.getElementById("upvote").click();
		}else{
			if(type=="cancel vote"){
				document.getElementById("cancel vote").click();
			}else{
				if(type=="downvote"){
					document.getElementById("downvote").click();
				}
			}
		}
	});
	
	document.getElementById("upvote").addEventListener('click',function() {
        chrome.storage.local.set({"voteType":"upvote"});
    });
	document.getElementById("cancel vote").addEventListener('click',function() {
        chrome.storage.local.set({"voteType":"cancel vote"});
    });
	document.getElementById("downvote").addEventListener('click',function() {
        chrome.storage.local.set({"voteType":"downvote"});
    });
	
	chrome.storage.onChanged.addListener(function(changes, namespace) {
			for(key in changes){
				if(key=="voteType"){
					chrome.storage.local.get({"voteType":"upvote"},function(items){
						var type=items.voteType;
						if(type=="upvote"){
							document.getElementById("upvote").click();
						}else{
							if(type=="cancel vote"){
								document.getElementById("cancel vote").click();
							}else{
								if(type=="downvote"){
									document.getElementById("downvote").click();
								}
							}
						}
					});
				}
			}
		
      });
}

function syncAngelType(){
	chrome.storage.local.get({"angelType":"mortal"},function(items){
		var type=items.angelType;
		if(type=="angel"){
			document.getElementById("angelRadio").click();
		}else{
			if(type=="mortal"){
				document.getElementById("mortalRadio").click();
			}else{
				if(type=="devil"){
					document.getElementById("devilRadio").click();
				}
			}
		}
	});
	
	document.getElementById("angelRadio").addEventListener('click',function() {
        chrome.storage.local.set({"angelType":"angel"});
    });
	document.getElementById("mortalRadio").addEventListener('click',function() {
        chrome.storage.local.set({"angelType":"mortal"});
    });
	document.getElementById("devilRadio").addEventListener('click',function() {
        chrome.storage.local.set({"angelType":"devil"});
    });
	
	chrome.storage.onChanged.addListener(function(changes, namespace) {
			for(key in changes){
				if(key=="angelType"){
					chrome.storage.local.get({"angelType":"mortal"},function(items){
						var type=items.angelType;
						if(type=="angel"){
							document.getElementById("angelRadio").click();
						}else{
							if(type=="mortal"){
								document.getElementById("mortalRadio").click();
							}else{
								if(type=="devil"){
									document.getElementById("devilRadio").click();
								}
							}
						}
					});
				}
			}
		
      });
}

function syncNumberOfPosts(){
	chrome.storage.local.get({"numberOfPosts":10},function(items){
		document.getElementById("numberOfPosts").value=items.numberOfPosts;
	});
	
	document.getElementById("numberOfPosts").addEventListener('input',function() {
		if(document.getElementById("numberOfPosts").value<0){
			document.getElementById("numberOfPosts").value=0;
			return;
		}
        chrome.storage.local.set({"numberOfPosts":document.getElementById("numberOfPosts").value});
    });
	
	chrome.storage.onChanged.addListener(function(changes, namespace) {
			for(key in changes){
				if(key=="numberOfPosts"){
					document.getElementById("numberOfPosts").value=changes[key].newValue;
				}
			}
      });
	
}

function syncLogContent(){
	chrome.storage.local.get({"logContent":"•log will be shown here"},function(items){
		document.getElementById("logElement").innerHTML=items.logContent;
	});
	
	chrome.storage.onChanged.addListener(function(changes, namespace) {
			for(key in changes){
				if(key=="logContent"){
					document.getElementById("logElement").innerHTML=changes[key].newValue;
				}
			}
      });
	
}

function syncProgressBar(){
	chrome.storage.local.get({"voteTabId":0,"voteObj":{"inReddit":false}},function(items){
		if(items.voteTabId!=0){
			document.getElementById("progressBar").setAttribute("aria-valuenow",Math.round((items.voteObj.howMuchDone)/(items.voteObj.howMuchVoteStart/100)));
			document.getElementById("progressBar").setAttribute("style","width:"+Math.round((items.voteObj.howMuchDone)/(items.voteObj.howMuchVoteStart/100))+"%");
		}else{
			document.getElementById("progressBar").setAttribute("style","width:0%");
		}
	});
	
	chrome.storage.onChanged.addListener(function(changes, namespace) {
			for(key in changes){
				if(key=="voteObj"){
					chrome.storage.local.get({"voteTabId":0,"voteObj":{"inReddit":false}},function(items){
						if(items.voteTabId!=0){
							document.getElementById("progressBar").setAttribute("aria-valuenow",Math.round((items.voteObj.howMuchDone)/(items.voteObj.howMuchVoteStart/100)));
							document.getElementById("progressBar").setAttribute("style","width:"+Math.round((items.voteObj.howMuchDone)/(items.voteObj.howMuchVoteStart/100))+"%");
						}else{
							document.getElementById("progressBar").setAttribute("style","width:0%");
						}
					});
				}
			}
      });
}




function addToLog(string1){
	chrome.storage.local.get({"logContent":""},function(items){
		chrome.storage.local.set({"logContent":items.logContent+"•"+string1+"\n"});
	});
}