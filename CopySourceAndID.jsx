/*
This script copies the Source String and numbers from names of selected files to the Clipboard

Bridge 2013: compatibility with Windows and macOS

Bridge 2022 and earlier: compatibility with macOS, 
but you can change cmd command "pbcopy" to "clip" 
in line 27 for compatibility with macOS bash

Last modifed 28/06/2023
*/

#target bridge

const regexAgencies = /\bria|\bRIA|\bAP|\b000_|\bi[sS]tock|\b[sS]putnik/
const regexAFP = /(000_.{3,}).jpg/
const regexDigits = /\d{3,}/


if(BridgeTalk.appName == 'bridge'){

    const bridgeVer = Number((app.version.split('.'))[0])
    const availableAPI = bridgeVer > 12

    if(availableAPI){
        var copyRes = function(results){
            app.document.copyTextToClipboard(results) //Bridge 13 (2023) use API
        }
    } else {
        var copyRes = function(results){
            app.system('echo "' + results + '" | pbcopy') //Bridge 12 (2022) use bash
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
        var itemList_ = [] 

        try{
            var thumbs_ = app.document.selections
            var itemIndex = 0

            for (var key in thumbs_){
                itemIndex++
                item = thumbs_[key].name
                agency = String(item.match(regexAgencies)).toLowerCase()

                if (agency == '000_'){
                    itemId = (item.match(regexAFP))[1]
                    itemList_.push(itemIndex + '. AFP:  ' + itemId)

                } else if (agency == 'ap'){
                    itemId = item.match(regexDigits)
                    itemList_.push(itemIndex + '. AP:  ' + itemId)

                } else if (agency == "ria" || agency == 'sputnik'){
                    itemId = item.match(regexDigits)
                    itemList_.push(itemIndex + '. RIA:  ' + itemId)

                } else if (agency == "istock"){
                    itemId = item.match(regexDigits)
                    itemList_.push(itemIndex + '. iStock:  ' + itemId)

                } else {
                    itemId = item.replace(/["]/g, '\\"') //Quotedform
                    itemList_.push(itemIndex + '. Unknown:  ' + itemId)
                }

            }

            if (itemList_.length == 0){
                Window.alert('There are no items', 'Copy Source and ID...')
            } else {
                var cnfMessage_ = 'Would you like to get ' + itemList_.length + ' items?\n' + itemList_.join("\n")
                if (Window.confirm(cnfMessage_, false, 'Copy Source and ID...')){
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
