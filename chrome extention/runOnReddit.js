start();
setInterval(angelAuto,300);

function start(){
	chrome.runtime.sendMessage({"message": "getId"}, function(response) {
		chrome.storage.local.get({"voteTabId":0,"voteObj":{"inReddit":false}},function(items){

			if(response.id==items.voteTabId&&items.voteObj.inReddit==true){
				//this is the real deal
				
				var obj=items.voteObj;
				
				var table=document.getElementById("siteTable");
				if(obj.whereYouVote=="comment"){//comments section instead
					table=document.getElementsByClassName("sitetable nestedlisting")[0];
				}
				
				if(table==null||table==undefined){
					addToLog("there isn't a list of posts here").
					return;
				}
				var arrowContainers=table.getElementsByClassName("midcol");
				if(arrowContainers.length==0){
					addToLog("there is nothing to vote on here").
					return;
				}
				document.getElementsByTagName("head")[0].getElementsByTagName("title")[0].innerHTML="Voting- "+Math.round((obj.howMuchDone)/(obj.howMuchVoteStart/100))+"%";
				
				var howMuchLeft=obj.howMuchVoteStart-obj.howMuchDone;
				
				for(var i=0;i<arrowContainers.length;i++){
					if(howMuchLeft<=0){
						break;
					}
					var voteArrow;
					
					if(obj.voteType=="upvote"){
						voteArrow=arrowContainers[i].getElementsByClassName("arrow up");
					}
					if(obj.voteType=="cancel vote"){
						voteArrow=arrowContainers[i].getElementsByClassName("arrow upmod");
						if(voteArrow.length==0){
							voteArrow=arrowContainers[i].getElementsByClassName("arrow downmod");
						}
					}
					if(obj.voteType=="downvote"){
						voteArrow=arrowContainers[i].getElementsByClassName("arrow down");
					}
					if(voteArrow.length!=0){
						if((voteArrow[0].getAttribute("class")).search("archived")==-1){
							voteArrow[0].click();
						}
						//setTimeout(function(){voteArrow[0].click();},100);
					}
					obj.howMuchDone++;
					howMuchLeft--;
				}
				
				document.getElementsByTagName("head")[0].getElementsByTagName("title")[0].innerHTML="Voting- "+Math.round((obj.howMuchDone)/(obj.howMuchVoteStart/100))+"%";
				
				chrome.storage.local.set({"voteObj":obj},function(){
					if(howMuchLeft<=0){
						addToLog("Done!");
						chrome.storage.local.set({"voteTabId":0,"voteTabWindowId":0});
						return;
					}
					
					var next;
					if(obj.whereYouVote=="user"||obj.whereYouVote=="subreddit"){
						next=document.querySelectorAll('[rel="nofollow next"]');
						if(next.length==0){
							addToLog("not enough posts here");
							chrome.storage.local.set({"voteTabId":0,"voteTabWindowId":0});
							return;
						}
					}
					
					if(obj.whereYouVote=="comment"){
						addToLog("not enough comments here");
						chrome.storage.local.set({"voteTabId":0,"voteTabWindowId":0});
						return;
					}
					console.log("here");
					if(obj.whereYouVote=="user"||obj.whereYouVote=="subreddit"){
						next=document.querySelectorAll('[rel="nofollow next"]');
						setTimeout(function(){next[0].click();},50);
					}
				});
			}
		});
	});
}


function angelAuto(){
	chrome.storage.local.get({"angelType":"mortal"},function(items){
		if(items.angelType=="mortal"){
			return;
		}
		
		var arr;
		if(items.angelType=="angel"){
			arr=document.getElementsByClassName("arrow up");
		}
		if(items.angelType=="devil"){
			arr=document.getElementsByClassName("arrow down");
		}
		
		for(var i=0;i<arr.length;i++){
			if((arr[i].getAttribute("class")).search("archived")==-1){
				
				setTimeout(function(arrow){arrow.click();},i*0.2,arr[i]);
			}
		}
	});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
		if (request.message == "voteComment"){
			start();
		}
  });

function addToLog(string1){
	chrome.storage.local.get({"logContent":""},function(items){
		chrome.storage.local.set({"logContent":items.logContent+"•"+string1+"\n"});
	});
}
