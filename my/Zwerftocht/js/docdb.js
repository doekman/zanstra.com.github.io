// Document database
// properties: id, name, type, id

(function (global) {
    var LOCAL_STORAGE_KEY = "DOEKMAN_DDB",
        defaultType,
        currentId,
        currentDoc,
       supports_html5_storage = function() {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
       },
       listEntries = function () {
           var data = localStorage.getItem(LOCAL_STORAGE_KEY) || "[]";
           var items = JSON.parse(data), result = [];
           for (var i = 0; i < items.length; i++) {
               if (items[i].type == defaultType) result.push(items[i]);
           }
           return items;

       },
       saveEntries = function (entries) {
           var data = JSON.stringify(entries);
           localStorage.setItem(LOCAL_STORAGE_KEY, data);
       },
       documentKey = function () {
           return LOCAL_STORAGE_KEY + "$" + currentId;
       },
       ddb = {
           init: function(type) {
               if (!supports_html5_storage()) {
                   return false;
               }
               defaultType = type;
               currentId = null;
           },
           /***| Directory methods |***/
           defaultType: function() {
               return defaultType;
           },
           list: function () {
               // array of {id:1, "name":"name", "type":"type"}
               return listEntries(defaultType);
           },
           save: function (entry) {
               var items = listEntries(), dbEntry, maxId = -1;
               if (typeof entry == "string") entry = { name: entry, type: defaultType };
               if (entry) {
                   for (var i = 0; i < items.length; i++) {
                       var item = items[i];
                       if (item.id == entry.id) dbEntry = item;
                       if (item.id > maxId) maxId = item.id;
                   }
               }
               if (!dbEntry) {
                   dbEntry = { id: maxId + 1 };
                   items.push(dbEntry);
               }
               dbEntry.name = entry.name;
               dbEntry.type = entry.type;
               saveEntries(items);
           },
           remove: function (entry) {
               var items = listEntries(), index = -1;
               for (var i = 0; i < items.length; i++) {
                   if (items[i].id == entry.id) index = i;
               }
               if (index < 0) throw new Error("Item not found");
               ddb.removeDoc(entry.id);
               items.splice(index, 1);
               saveEntries(items);
           },
           exists: function (name) {
             var entries = listEntries();
             for(var i=0; i<entries.length; i++) {
               if (entries[i].name == name) return true;
             }
             return false;
           },
           rename: function(newName) {
             var entries = listEntries();
             for(var i=0; i<entries.length; i++) {
               var entry = entries[i];
               if (entry.id == currentId) {
                 entry.name = newName;
                 saveEntries(entries);
                 return;
               }
             }
             throw new Error("Rename failed, can't find old item (id:"+currentId+")");
           },
           /***| Document mode |************/
           openDoc: function (id) {
               currentId = id;
               return ddb.currentDoc();
           },
           currentDoc: function () {
             var key = documentKey()
             ,   data = localStorage.getItem(key);
               if (data) {
                   currentDoc = JSON.parse(data);
                   return currentDoc;
               }
               console.warn("Current document '%s' does not exist yet", key)
               return null;
           },
           saveDoc: function (newDoc) {
               var data = JSON.stringify(newDoc || currentDoc);
               localStorage.setItem(documentKey(), data);
           },
           removeDoc: function (id) {
               currentId = id;
               localStorage.removeItem(documentKey());
               currentId = null;
           }
         }
    ;
    // Export
    global.ddb = ddb;
})(window);