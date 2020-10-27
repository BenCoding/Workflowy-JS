/// Chrome Code to retrieve all Tags and List in Bullet
javascript:(
	function tagIndex(separator){
		function toastMsg(str,ms,err){
			WF.showMessage("<b>"+str+"</b>",err);
			setTimeout(function(){WF.hideMessage()},ms)
		}
		function getCanonical(tag){
			var canName=tagMap[tag].canonicalName;
			return canName?canName:tag
		}
		function createIndex(tags){
			var s=separator?separator:" ";
			var tIndex='';
			for(i=0;i<tags.length;i++)tIndex+=s+getCanonical(tags[i]);
			return tIndex.slice(s.length)
		}
		function newTopBullet(str){WF.editGroup(
			function(){
				WF.createItem(WF.currentItem(),0);
				WF.setItemName(WF.focusedItem(),htmlEscapeTextForContent(str))})}

				var current=WF.currentItem();
				var tagCounts=current.isMainTreeRoot()?getRootDescendantTagCounts():current.getTagManager().descendantTagCounts;

				// if(!tagCounts)return void toastMsg("No tags found.",2e3,true);

				var tagMap=tagCounts.tagInfoMap;
				var tagNames=Object.keys(tagMap).sort();
				var childrenItems

				newTopBullet(
					createIndex(tagNames)
				)
			})(' | ');



/// Stack overflow tag
function getGlobalProperties(prefix) {
  var keyValues = [], global = window; // window for browser environments
  for (var prop in global) {
    if (prop.indexOf(prefix) == 0) // check the prefix
      keyValues.push(prop + "=" + global[prop]);
  }
  return keyValues.join('&'); // build the string
}