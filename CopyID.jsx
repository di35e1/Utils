/*
This script copies the numbers from names of selected files to the Clipboard
Last modifed 20/06/2023
*/

#target bridge

const regex = /\d{3,}/g;

if(BridgeTalk.appName == 'bridge'){

    const bridgeVersion = Number((app.version.split('.'))[0]);

    if(bridgeVersion > 12){
        var copyResult = function(results){
            app.document.copyTextToClipboard(results); //Bridge 13 (2023) use API
        }
    } else {
        var copyResult = function(results){
            app.system('echo "' + results + '" | pbcopy'); //Bridge 12 (2022) use bash
        }
    }

    try{
        //var CopyID = new Object;
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
                        copyResult(idList.join(" "));
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
