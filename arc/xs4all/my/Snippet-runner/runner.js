function evil(code) {
    return eval(code);
}

(function(){
"use strict";

    function noCache(path) {
        return path + "?v=" + Math.random();
    }

    function parseNewDb(text) {
        var db = [], endOfMatch, matches, rxHeader = /^\/{3}([a-z]+)\/(.*)$/gim;
        while ((matches = rxHeader.exec(text)) != null) {
            db.push( { part:matches[1], title:matches[2], text:"" } );
            if (endOfMatch) {
                db[db.length - 2].text = text.substring(endOfMatch + 1, matches.index);
            }
            endOfMatch = rxHeader.lastIndex;
        }
        if (db.length > 1) {
            db[db.length - 1].text = text.substring(endOfMatch + 1);
        }
        return db;
    }
    
    function loadForm(db) {
        var headerCode = "", footerCode = "", listSelector = "#snippet-items", lastGroup;
        db.forEach(function(item, index) {
            switch(item.part) {
            case "header":
                $("#snippet-title").html(item.title);
                $("#snippet-code").data("header", item.text);
                break;
            case "footer":
                $("#snippet-code").data("footer", item.text);
                break;
            case "group":
                if (!lastGroup) {
                    listSelector += " optgroup:last";
                }
                lastGroup = document.createElement("optgroup");
                lastGroup.label = item.title;
                $("#snippet-items").append(lastGroup);
                break;
            case "item":
                var option = document.createElement("option");
                $(option).html(item.title).val(item.text);
                $(lastGroup || listSelector).append(option);
                break;
            default:
                console.error("Unrecognized part '%s' with title '%s'");
                break;
            }            
        });
    }
    
    function loadSnippet(filePath) {
        $("#snippet-items").find("*").remove(); //clear entries
        $("#snippet-items")[0].selectedIndex = -1;
        $.get(noCache(filePath), function(data) {
            var db = parseNewDb(data);
            loadForm(db);
            $("#button-next").click();
        }, 'text');
    }
    
    function bindForm() {
        var editor = ace.edit("snippet-editor");
        editor.setTheme("ace/theme/textmate");
        editor.getSession().setMode("ace/mode/javascript");
        editor.renderer.setShowGutter(false);
        editor.$blockScrolling = Infinity;
                
        function showExample(event) {
            var snippetCode = $("#snippet-code"), code = $(this).val();
            if (event.shiftKey)
                code = snippetCode.data('header') + code + snippetCode.data('footer')
            //snippetCode.val(code);
            //https://ace.c9.io/#nav=api&api=editor
            editor.setValue(code);
            editor.clearSelection();
        }
        $("#snippet-items").click(showExample).change(showExample);
        $("#button-next").click(function() {
            var select = $("#snippet-items")[0];
            if (select.selectedIndex < select.options.length - 1) {
                select.selectedIndex += 1;
                $(select).focus().change();
            } 
            else console.info("No more next entries");
        });
        $("#button-previous").click(function() {
            var select = $("#snippet-items")[0];
            if (select.selectedIndex > 0) {
                select.selectedIndex -= 1;
                $(select).focus().change();
            }
            else console.info("No more previous entries");
        });
        $("#button-run").click(function(event) {
            var snippetCode = $("#snippet-code");
            var code = snippetCode.data("header") + editor.getValue() /*snippetCode.val()*/ + snippetCode.data("footer");
            evil(code);
            $("#snippet-items").focus();
        });
        $("#snippet-library").change(function() {
            var snippet = $(this).val();
            var bookmark = snippet.replace(/^.*\b(.+)\.js$/, '$1');
            location.hash = "#" + bookmark;
            loadSnippet(snippet);
        }).change();
    }
    
    $(function() {
        var snippetsPath = 'snippets/';
        $.get(noCache(snippetsPath + '/index.json'), function(data) {
            var library = typeof data == "string" ? JSON.parse(data) : data; //with dataType='json', it's parsed automatic
            var asdf = -1;
            library.forEach(function(item, index) {
                var option = document.createElement("option");
                $(option).html(item[1]).val(snippetsPath + item[0]);
                var bookmark = location.hash.substr(1);
                if (bookmark && item[0].indexOf(bookmark) != -1) option.selected = true;
                $("#snippet-library").append(option);
            });
            bindForm();
        }, 'json');
    });
    
})();

