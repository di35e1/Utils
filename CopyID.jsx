/*
This script copies the numbers from names of selected files to the Clipboard

Bridge 2013: compatibility with Windows and macOS

Bridge 2022 and earlier: compatibility with macOS, 
but you can change bash command "pbcopy" to "clip" 
in line 27 for compatibility with Windows cmd

Last modifed 21/06/2023
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
        var ftcpID = MenuElement.create('command', '+ Copy ID numbers', 'after Thumbnail/Open', this.menuID);
        ftcpID.onSelect = function(){
            numbersToClipboard();
            }
    }
    catch(e){
        alert(e + ' ' + e.line);
    }

    function numbersToClipboard(){
        var fileList = [];
        var idList = [];

        try{
            var thumbs = app.document.selections;
            for (var key in thumbs){
                fileList.push(thumbs[key].name);
            }

            idList = fileList.toString().match(regex);

            if (idList == null){
                Window.alert('There are no numbers');
            } else {
                var cnfMessage = 'Would you like to get ' + idList.length + ' numbers?\n' + idList.join(", ");
                if (Window.confirm(cnfMessage)){
                    copyResult(idList.join(" "));
                }
            }
            return;
        } 
        catch(e) {
            alert(e + ' ' + e.line);
        }
    }
}
