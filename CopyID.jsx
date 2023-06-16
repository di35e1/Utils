/*
This script copies the numbers from names of selected files to the Clipboard
Last modifed 16/06/2023
*/

const regex = /\d{3,}/g;

if(BridgeTalk.appName == 'bridge'){
    try{
        var CopyID = new Object;
        var ftcpID = MenuElement.create('command', '+ Copy ID numbers', 'after Thumbnail/Open', this.menuID);

        ftcpID.onSelect = function(){
            numbersToClipboard();
            }

        function numbersToClipboard(){
            try{
                var thumbs = app.document.selections;
                var fileList = []
                for (var key in thumbs) {
                        fileList.push(thumbs[key].name);
                }
                
                idList = fileList.toString().match(regex);
                if (idList == null){
                    alert('There are no numbers');
                } else {
                    if (confirm('Would you like to get ' + idList.length + ' numbers?', (idList.join(", ")) + '\n\n') == true) {
                        app.system('echo "' + idList.join(" ") + '" | pbcopy');
                    }
                }
                
                return;
                }

            catch(e){
                alert(e + e.line);
                }
            }
        }
    catch(e){
        alert(e + ' ' + e.line);
        }
    }
