/*
This script copies the Source String and numbers from names of selected files to the Clipboard

Bridge 2013: compatibility with Windows and macOS

Bridge 2022 and earlier: compatibility with Windows, 
but you can change cmd command "clip" to "pbcopy" 
in line 27 for compatibility with macOS bash

Last modifed 21/06/2023
*/

#target bridge

const regexAgencies = /ria-|RIA_|\bAP|\b000_|iStock-/
const regexAFP = /(000_.{3,}).jpg/
const regexDigits = /\d{3,}/


if(BridgeTalk.appName == 'bridge'){

    const bridgeVer = Number((app.version.split('.'))[0])

    if(bridgeVer > 12){
        var copyRes = function(results){
            app.document.copyTextToClipboard(results) //Bridge 13 (2023) use API
        }
    } else {
        var copyRes = function(results){
            app.system('echo "' + results + '" | pbcopy') //Bridge 12 (2022) use cmd
        }
    }

    try{
        //create new menu command in Tools
        var copyCmd = MenuElement.create('command', '• Copy Source and ID', '-at the end of Tools')
        copyCmd.onSelect = function(){
            sourseAndIdToClipboard()
        }

        //create new menu command in contextual
        var copyCmdThumb = MenuElement.create('command', '• Copy Source and ID', '-after Thumbnail/Open-')
        copyCmdThumb.onSelect = function(){
            sourseAndIdToClipboard()
            }
    }
    catch(e){
        alert(e + ' ' + e.line)
    }

    function sourseAndIdToClipboard(){
        var itemList_ = [] // empty list 

        try{
            var thumbs_ = app.document.selections
            var itemIndex = 0
            for (var key in thumbs_){
                itemIndex++
                agencies = (thumbs_[key].name).match(regexAgencies)

                if (agencies == '000_'){
                    item = (thumbs_[key].name.match(regexAFP))[1]
                    itemList_.push(itemIndex + '. AFP:  ' + item)
                } else if (agencies == 'AP'){
                    item = thumbs_[key].name.match(regexDigits)
                    itemList_.push(itemIndex + '. AP:  ' + item)
                } else if (agencies == "ria-" || agencies == "RIA_"){
                    item = thumbs_[key].name.match(regexDigits)
                    itemList_.push(itemIndex + '. RIA:  ' + item)
                } else if (agencies == "iStock-"){
                    item = thumbs_[key].name.match(regexDigits)
                    itemList_.push(itemIndex + '. iStock:  ' + item)
                } else {
                    item = thumbs_[key].name.replace(/["]/g, '\\"')
                    itemList_.push(itemIndex + '. Unknown:  ' + item)
                }

            }

            if (itemList_.length == 0){
                Window.alert('There are no items', 'Copy ID Numbers')
            } else {
                var cnfMessage_ = 'Would you like to get ' + itemList_.length + ' items?\n' + itemList_.join("\n")
                if (Window.confirm(cnfMessage_, false, 'Copy ID Numbers')){
                    copyRes(itemList_.join("\n"))
                }
            }
            return
        } 
        catch(e) {
            alert(e + ' ' + e.line)
        }
    }
}
