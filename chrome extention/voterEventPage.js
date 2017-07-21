function startVoting(){
	//checks if this is reddit
	
	chrome.storage.local.get({"voteTabId":0,"numberOfPosts":10,"voteType":"upvote"},function(items){
		chrome.tabs.query({'active': true , 'lastFocusedWindow': true }, function (tabs) {
			var obj;
			var url=tabs[0].url;
			var arr=url.split("/");
			
			if(items.voteTabId!=0){
				addToLog("voting on something else (you can cancel it if you like)");
				return;
			}
			
			for(var y=0;y<1;y++){
				if(url.search("//www.reddit.com")==-1){
					obj={"inReddit":false};
					break;
				}
				
				if(url.search("//www.reddit.com/user/")!=-1&&arr.length<=7){	
					//you are on a user: arr[4]
					addToLog("voting on user: "+arr[4]);
					obj={"inReddit":true,"whereYouVote":"user"};
					break;
				}
				
				if(url.search("//www.reddit.com/r/")!=-1&&arr[5]=="comments"&&arr.length==9){
					//you are on a comment section title: arr[7]
					addToLog("voting the comments of the post: "+arr[7].replace(/_/g, " "));
					obj={"inReddit":true,"whereYouVote":"comment"};
					break;
				}
				
				if(arr.length<=7&&url.search("//www.reddit.com/r/")!=-1){
					//you are on a subreddit: arr[4]
					addToLog("voting on subreddit: "+arr[4]);
					obj={"inReddit":true,"whereYouVote":"subreddit"};
					break;
				}
				
				if(arr.length<=5&&url.search("//www.reddit.com/")!=-1){
					//main page
					addToLog("voting on your main page");
					obj={"inReddit":true,"whereYouVote":"subreddit"};
					break;
				}
		
				obj={"inReddit":false};
				break;
			}
			
			
			if(obj.inReddit==false){
				addToLog("please enter a subreddit, post, or a user's profile");
				return;
			}
			
			
			obj.howMuchVoteStart=items.numberOfPosts;
			obj.voteType=items.voteType;
			obj.howMuchDone=0;
			
			if(obj.whereYouVote=="comment"){
				chrome.storage.local.set({"voteTabId":tabs[0].id,"voteTabWindowId":tabs[0].windowId,"voteObj":obj});
				sendMessageToReddit({"message":"voteComment"});
				return;
			}
			//obj have:   inReddit(initial check)    howMuchVoteStart    voteType(upvote)     whereYouVote(subreddit)    howMuchDone
			
				chrome.tabs.create({"url":url},function(tab){
						//open the tab so the content script will run
						chrome.storage.local.set({"voteTabId":tab.id,"voteTabWindowId":tab.windowId,"voteObj":obj});
				});
			
			
		});
	});
}

function sendMessageToReddit(messageToSend){
	//send message to runOnReddit
	
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id , messageToSend,function(response) {
			//response from content script
			if(typeof response === "undefined"){
				//contentScriptDead();
			}else{
				if(response.message=="alive"){
					//contentScriptAlive();
				}
			}
		});
	});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
		if (request.message == "getId"){
			sendResponse({"id": sender.tab.id,"windowId": sender.tab.windowId});
		}
  });

chrome.tabs.onRemoved.addListener(
	function(tabId, removeInfo){
		chrome.storage.local.get({"voteTabId":0,"voteTabWindowId":0},function(items){
			if(tabId==items.voteTabId&&removeInfo.windowId==items.voteTabWindowId){
				chrome.storage.local.set({"voteTabId":0,"voteTabWindowId":0});
			}
		});
	});

function addToLog(string1){
	chrome.storage.local.get({"logContent":""},function(items){
		chrome.storage.local.set({"logContent":items.logContent+"•"+string1+"\n"});
	});
}













