/*
This script copies the numbers from names of selected files to the Clipboard

Bridge 2013: compatibility with Windows and macOS

Bridge 2022 and earlier: compatibility with macOS, 
but you can change bash command "pbcopy" to "clip" 
in line 27 for compatibility with Windows cmd

Last modifed 26/06/2023
*/

#target bridge

const REGEX = /\d{3,25}/
const regexAgencies = /ria|RIA|AP|000_|i[sS]tock|[gG]etty[iI]mages|[sS]putnik/
const regexAFP = /(000_\w{3,10}).jp/

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
        var extendedCopyCommand = MenuElement.create('command', '• Copy Source and ID...', 'at the end of Tools')
        extendedCopyCommand.onSelect = function(){
            sourseAndIdToClipboard()
        }

        //create new menu command in contextual
        var extendedCopyCommandThumb = MenuElement.create('command', '• Copy Source and ID...', 'after Thumbnail/Open-')
        extendedCopyCommandThumb.onSelect = function(){
            sourseAndIdToClipboard()
            }
    }
    catch(e){
        alert(e + ' ' + e.line)
    }

    function numbersToClipboard(){
        var idList = []
        var idNumber
        var idAFP
        var cnfMessage

        try{
            var thumbs = app.document.selections
            for (var key in thumbs){
                idNumber = (thumbs[key].name).match(REGEX)
                if (idNumber == '000'){ // forexample 000_******.jpg
                    idAFP = idNumber.input.match(regexAFP)
                    if (idAFP) idList.push(idAFP[1])
                } else {
                    if (idNumber) idList.push(idNumber.toString())
                }
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

    function sourseAndIdToClipboard(){
        var itemList_ = [] 
        var itemIndex = 0
        var itemId
        var item

        try{
            var thumbs_ = app.document.selections

            for (var key in thumbs_){
                itemIndex++
                item = thumbs_[key].name
                agency = String(item.match(regexAgencies)).toLowerCase()

                if (agency == '000_'){
                    itemId = (item.match(regexAFP))
                    if (itemId) itemList_.push(itemIndex + '. AFP:  ' + itemId[1])

                } else if (agency == 'ap'){
                    itemId = item.match(REGEX)
                    if (itemId) itemList_.push(itemIndex + '. AP:  ' + itemId)

                } else if (agency == "ria" || agency == 'sputnik'){
                    itemId = item.match(REGEX)
                    if (itemId) itemList_.push(itemIndex + '. RIA:  ' + itemId)

                } else if (agency == "istock"){
                    itemId = item.match(REGEX)
                    if (itemId) itemList_.push(itemIndex + '. iStock:  ' + itemId)

                } else if (agency == "gettyimages"){
                    itemId = item.match(REGEX)
                    if (itemId) itemList_.push(itemIndex + '. Getty:  ' + itemId)
                        
                } else {
                    itemId = item.replace(/["]/g, '\\"') //Quotedform
                    if (itemId) itemList_.push(itemIndex + '. Unknown:  ' + itemId)
                }
            }

            if (itemList_.length == 0){
                Window.alert('There are no items to copy', 'Copy Source and ID...')
            } else if (itemList_.length < 26) {
                var cnfMessage_ = 'Would you like to get ' + itemList_.length + ' items?\n' + itemList_.join("\n")
                if (Window.confirm(cnfMessage_, false, 'Copy Source and ID...')){
                    copyResult(itemList_.join("\n"))
                }
            } else {
                var cnfMessage_ = 'Would you like to get ' + itemList_.length + ' items?\n' + itemList_.slice(0,22).join("\n") + '\n...\n' + itemList_.slice(-1)
                if (Window.confirm(cnfMessage_, false, 'Copy Source and ID...')){
                    copyResult(itemList_.join("\n"))
                }
            }
            return
        } 
        catch(e) {
            alert(e + ' ' + e.line)
        }
    }
}
