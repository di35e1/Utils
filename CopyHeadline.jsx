/*
This script copies the numbers from names of selected files to the Clipboard
or saves Result.txt от Desktop with filenames and some metada from jpg

Compatibility with Windows and macOS

Last modifed 24/08/2023
*/

#target bridge
const REGEX = /\d{3,25}/


if(BridgeTalk.appName == 'bridge'){

    const bridgeVer = Number((app.version.split('.'))[0])
    const availableAPI = bridgeVer > 12

    if(availableAPI){
        var copyResult = function(results){
            app.document.copyTextToClipboard(results) //Bridge 13 (2023) use API
        }
    } else {
        var copyResult = function(results){
            app.system('echo "' + results + '" | pbcopy') //Bridge 12 (2022) use bash
        }
    }

    var saveResult = function(results){
            app.system('echo "' + results + '" > ~/Desktop/Result.txt') // use bash
        }

    try{
        //create new menu command in Tools
        var copyCommand = MenuElement.create('command', '• Copy ID numbers', '-at the end of Tools')
        copyCommand.onSelect = function(){
            numbersToClipboard()
        }

        //create new menu command in contextual
        var copyCommandThumb = MenuElement.create('command', '• Copy ID numbers', '-after Thumbnail/Open')
        copyCommandThumb.onSelect = function(){
            numbersToClipboard()
            }
    }
    catch(e){
        alert(e + ' ' + e.line)
    }

    try{
        //create new menu command in Tools
        var extendedCopyCommand = MenuElement.create('command', '• Copy Filename + Headline', 'at the end of Tools')
        extendedCopyCommand.onSelect = function(){
            filenameAndTitleToClipboard()
        }

        //create new menu command in contextual
        var extendedCopyCommandThumb = MenuElement.create('command', '• Copy Filename + Headline', 'after Thumbnail/Open-')
        extendedCopyCommandThumb.onSelect = function(){
            filenameAndTitleToClipboard()
            }
    }
    catch(e){
        alert(e + ' ' + e.line)
    }

    function numbersToClipboard(){
        var idList = []
        var idNumber
        var cnfMessage

        try{
            var thumbs = app.document.selections
            for (var key in thumbs){
                idNumber = (thumbs[key].name).match(REGEX)
                if (idNumber) idList.push(idNumber.toString())
            }

            if (idList.length == 0){
                Window.alert('There are no numbers to copy')
            } else {
                cnfMessage = 'Would you like to get ' + idList.length + ' numbers?\n' + idList.join(", ")
                if (Window.confirm(cnfMessage)){
                    copyResult(idList.join(","))
                }
            }
            return
        } 
        catch(e) {
            alert(e + ' ' + e.line)
        }
    }

    function filenameAndTitleToClipboard(){
        var itemList_ = [] 
        var itemIndex = 0
        var itemId
        var item

        try{
            var thumbs_ = app.document.selections

            for (var key in thumbs_){
                item = thumbs_[key].name
                md = thumbs_[key].metadata

                txt_title = md.read("http://ns.adobe.com/photoshop/1.0/", "photoshop:Headline")
                txt_author = md.read("http://purl.org/dc/elements/1.1/", "dc:creator")
                //txt_description = md.read("http://purl.org/dc/elements/1.1/", "dc:description")

                itemId = item.replace(/["]/g, '\\"') //Quotedform
                if (itemId) itemList_.push(itemId + ' - ' + txt_title + '. ' + txt_author + '\n')
            }

            if (itemList_.length == 0){
                Window.alert('There are no items to copy', 'Save Filename + Headline...')
            } else if (itemList_.length < 15) {
                var cnfMessage_ = 'Would you like to save Result.txt with ' + itemList_.length + ' items?\n' + itemList_.join("\n")
                if (Window.confirm(cnfMessage_, false, 'Save Filename + Headline...')){
                    saveResult(itemList_.join("\n"))
                }
            } else {
                var cnfMessage_ = 'Would you like to save Result.txt with ' + itemList_.length + ' items?\n' + itemList_.slice(0,22).join("\n") + '\n...\n' + itemList_.slice(-1)
                if (Window.confirm(cnfMessage_, false, 'Save Filename + Headline...')){
                    saveResult(itemList_.join("\n"))
                }
            }
            return
        } 
        catch(e) {
            alert(e + ' ' + e.line)
        }
    }
}
