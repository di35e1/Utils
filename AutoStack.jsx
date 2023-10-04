
#target bridge

if( BridgeTalk.appName == "bridge" ) {
    AutoStack = MenuElement.create("command", "• Auto Stack", '-after Thumbnail/Open-');
}

AutoStack.onSelect = function () {
    stackEm();
}

function stackEm(){

    app.document.sorts = [{ name:"name",type:"string", reverse:false}];
    var jpgs = Folder(app.document.presentationPath).getFiles ("*.jpg");
    app.document.deselectAll();

    for(var a in jpgs){
        var Name = decodeURI(jpgs[a].name).replace(/\.[^\.]+$/, '');
        var stacks = Folder(app.document.presentationPath).getFiles(Name+".*");
        if(stacks.length < 2) continue;
        for(var z in stacks){ app.document.select(new Thumbnail(stacks[z]));}
        StackFiles();
        app.document.deselectAll();
    }

    function StackFiles(){
        app.document.chooseMenuItem('submenu/Stack');
        app.document.chooseMenuItem('StackGroup');
    }
}
