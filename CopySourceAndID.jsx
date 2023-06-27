/*
This script copies the numbers from names of selected files to the Clipboard

Bridge 2013: compatibility with Windows and macOS

Bridge 2022 and earlier: compatibility with Windows, 
but you can change cmd command "clip" to "pbcopy" 
in line 27 for compatibility with macOS bash

Last modifed 21/06/2023
*/

#target bridge

const regexAFP = /(000_.{3,}).jpg/;

if(BridgeTalk.appName == 'bridge'){

    const bridgeVersion = Number((app.version.split('.'))[0]);

    if(bridgeVersion > 12){
        var copyResult = function(results){
            app.document.copyTextToClipboard(results); //Bridge 13 (2023) use API
        }
    } else {
        var copyResult = function(results){
            app.system('echo ' + results + ' | clip'); //Bridge 12 (2022) use cmd
        }
    }

    try{
        //create new menu command in Tools
        var copyCommand = MenuElement.create('command', '• Copy Source and ID', '-at the end of Tools')
        copyCommand.onSelect = function(){
            numbersToClipboard()
        }

        //create new menu command in contextual
        var copyCommandThumb = MenuElement.create('command', '• Copy Source and ID', 'after Thumbnail/Open')
        copyCommandThumb.onSelect = function(){
            numbersToClipboard()
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

                item = (thumbs[key].name).match(regexAFP)

                if (item != null){
                    fileList.push('AFP: ' + item[1]);
                }

            }

            idList = fileList//.toString().match(regex);

            if (idList == null){
                Window.alert('There are no numbers', 'Copy ID Numbers');
            } else {
                var cnfMessage = 'Would you like to get ' + idList.length + ' numbers?\n' + idList.join(", ");
                if (Window.confirm(cnfMessage, false, 'Copy ID Numbers')){
                    copyResult(idList.join("\n"));
                }
            }
            return;
        } 
        catch(e) {
            alert(e + ' ' + e.line);
        }
    }
}
