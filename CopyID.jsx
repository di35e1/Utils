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
                    Window.alert('There are no numbers');
                } else {
                    if (Window.confirm('Would you like to get ' + idList.length + ' numbers?\n' + idList.join(", ")) == true) {
                        app.system('echo "' + idList.join(" ") + '" | pbcopy');
                        //Bridge 2023 API: app.document.copyTextToClipboard(idList.join(" "));
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
