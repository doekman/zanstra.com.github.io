/*{
    name: "",
    description: "",
    afterPartyBar: null,
    restaurants: [{
        id: null,
        name: "",
        nrSeats: 16,
        nrIssuedCourses: [0,0,0],
        vegetarian: false //caters vegetarian
        // stats{nr, pct, clr }  (via getStats)
    }],
    groups: [{
        id: null,
        rev: 0,
        name: "",
        nrPersons: 1,
        vegetarian: false, //wants vegetarian
        issuedCourses: null // [id-a, id-b, id-c]
        --restaurants
    }],
    logs: [{
        id: null,
        date: new Date.toJSON(),
        line: "Initialized"
    }]
}*/
/// <reference path="utilities.js" />

var initTochtModel = function (tochtData, initial) {
    var data;

    //--| Tocht |---------------------------------------------------------------------------------
    var Tocht = {
        defaultItem: function (initial) {
            var name = initial.name || "";
            //console.info("Getting Tocht.defaultItem")
            return {
                name: name,
                description: format("# Culinaire Zwerftocht %1\n\nU wordt verwacht bij de restaurants volgens onderstaand tijdsschema:\n\n- Voorgerecht: 18:30\n- Hoofdgerechtt: 19:30\n- Nagerecht: 21:00\n- Borrel: 22:00\n\n\n\n\n- - -\nGeprint met [www.EcoFont.com](http://www.ecofont.com/en/products/green/font/download-the-ink-saving-font.html) (indien beschikbaar).", name),
                afterPartyBar: 'Leuke kroeg',
                restaurants: [],
                groups: [],
                logs: []
            };
        },
        getData: function () {
            return {
                name: data.name,
                description: data.description,
                afterPartyBar: data.afterPartyBar,
                nrRestaurants: data.restaurants.length,
                nrSeats: Restaurants.nrSeats(),
                nrGroups: data.groups.length,
                nrPersons: Groups.nrPersons()
            }
        },
        getCourseLabels: function () {
            return 'Voorgerecht,Hoofdgerecht,Nagerecht' + (data.afterPartyBar ? ',Borrel' : '');
        }
    };

    //--| Restaurant
    var restaurantFilter = function (rest, courseNr) {
        if (courseNr == 1 /*only main course in vergetarian filter*/ && rest.vegetarian) return rest.vegetarian;
        return true;
    };
    var Restaurant = {
        defaultItem: function (id) {
            return {
                id: typeof id == "number" ? id : null,
                name: "",
                nrSeats: 12,
                nrIssuedCourses: [0, 0, 0],
                vegetarian: true
            };
        }
    };
    var Restaurants = {
        defaultItem: function () {
            return [];
        },
        getDefaultEntry: function () {
            var res = Restaurant.defaultItem(nextId(data.restaurants));
            data.restaurants.push(res);
            return res;
        },
        getTestRestaurantNames: function () {
            return 'Test restaurant 1,Test restaurant 2,Test restaurant 3' + (data.afterPartyBar ? ',' + data.afterPartyBar : '');
        },
        findById: function (id) {
            var list = data.restaurants,
                index = indexOfId(list, id);
            return index == -1 ? null : list[index];
        },
        removeById: function (id) {
            var list = data.restaurants,
                index = indexOfId(list, id);
            if (index < 0) throw new Error("Restaurant not found");
            list.splice(index, 1);
        },
        resetCourses: function () {
            var list = data.restaurants;
            for (var i = 0; i < list.length; i++) {
                list[i].nrIssuedCourses = [0, 0, 0];
            }
        },
        recalculateCourses: function () {
            var list = data.restaurants
            ,   restaurantLookup = {}
            ,   groups = data.groups
            ,   restaurant
            ;
            //console.info("-=-=-=-=-=-=-=-=-=-=-=-=-=-=")
            for (var i = 0; i < list.length; i++) {
                restaurant = list[i];
                restaurant.nrIssuedCourses = [0, 0, 0]; //reset
                restaurantLookup[restaurant.id] = restaurant; //add to dictionary
                //console.info("Restaurant '%s' reset to: %s", restaurant.name, restaurant.nrIssuedCourses.join(','))
            }
            //console.info("______________________________")
            for (var groupNr = 0; groupNr < groups.length; groupNr++) {
                var group = groups[groupNr];
                //console.info("Group '%s' (%s persons) goes to: %s", group.name, group.nrPersons, (group.issuedCourses||[]).join(','));
                if (group.issuedCourses) {
                    for (var courseNr = 0; courseNr < 3; courseNr++) {
                        var courseId = group.issuedCourses[courseNr];
                        restaurant = restaurantLookup[courseId];
                        restaurant.nrIssuedCourses[courseNr] += group.nrPersons;
                        //console.info("- Restaurant '%s' (%s) updated to: %s", restaurant.name, restaurant.id, (restaurant.nrIssuedCourses||[]).join(','))
                    }
                }
                else {
                    // else part when re-issueing things
                    //console.info(". Group has no courses");
                }
            }
            
        },
        sort: function () {
            var nameSorter = alphaNumSorter(function (x) { return x.name || ""; });
            var list = data.restaurants;
            for(var i=0; i<list.length; i++) {
              var item = list[i];
              item.hasCourses = (item.nrIssuedCourses[0]+item.nrIssuedCourses[1]+item.nrIssuedCourses[2]) > 0;
            }
            return list.sort(nameSorter);
        },
        getMaxSeats: function () {
            var list = data.restaurants, maxSeats = -1;
            for (var i = 0; i < list.length; i++) {
                maxSeats = Math.max(maxSeats, list[i].nrSeats);
            }
            return maxSeats;
        },
        getMaxSeatsLeft: function () {
            var list = data.restaurants, maxSeatsLeft = [-1, -1, -1];
            for (var restaurantIndex = 0; restaurantIndex < list.length; restaurantIndex++) {
                var restaurant = list[restaurantIndex];
                for (var courseNr = 0; courseNr < 3; courseNr++) {
                    var nrSeatsLeft = restaurant.nrSeats - restaurant.nrIssuedCourses[courseNr];
                    maxSeatsLeft[courseNr] = Math.max(maxSeatsLeft[courseNr], nrSeatsLeft);
                }
            }
            return maxSeatsLeft;
        },
        getStats: function () {
            var colors = ",progress-bar-success,progress-bar-danger".split(',');
            var list = this.sort(), result = [], maxSeats = this.getMaxSeats();
            for (var i = 0; i < list.length; i++) {
                var rest = copy(list[i]);
                var courseLabels = Tocht.getCourseLabels().split(',');
                rest.stats = [];
                for (var j = 0; j < rest.nrIssuedCourses.length; j++) {
                    var nr = rest.nrIssuedCourses[j]
                    , st = { nr: nr, pctFilled: (nr / rest.nrSeats) * 100, pctRelative: (rest.nrSeats / maxSeats) * 100, clr: colors[j], course: courseLabels[j] }
                    ;
                    rest.stats.push(st);
                }
                result.push(rest);
            }
            return result;
        },
        validate: function (newItem) {
          var list = data.restaurants;
          if (!newItem.name) return "Een restaurant naam is verplicht.";
          if (newItem.nrSeats < 1) return "Het aantal plaatsen moet 1 of groter zijn.";
          for(var i=0; i<newItem.nrIssuedCourses.length; i++) {
            if (newItem.nrSeats < newItem.nrIssuedCourses[i]) {
              return "Het aantal plaatsen kan niet verder verlaagd worden, omdat er al plaatsingen zijn.";
            }
          }
          for(var i=0; i<list.length; i++) {
            var item = list[i];
            if (item.name.toLowerCase() == newItem.name.toLowerCase() && item.id != newItem.id) {
              return "De restaurant naam '"+newItem.name+"' bestaat al.";
            }
          }
          return;
        },
        nrSeats: function () {
            var nr = 0, list = data.restaurants;
            for (var i = 0; i < list.length; i++) {
                nr += list[i].nrSeats;
            }
            return nr;
        },
        nrIssuedCourses: function (pos) {
            var nr = 0, list = data.restaurants;
            for (var i = 0; i < list.length; i++) {
                nr += list[i].nrIssuedCourses[pos];
            }
            return nr;
        },
        findRandom: function (courseNr, nrSeatsNeeded, exclude, filter) {
            var rests = data.restaurants, candidates = [];
            for (var i = 0; i < rests.length; i++) {
                var rest = rests[i]
                ,   nrIssuedCourses = rest.nrIssuedCourses[courseNr]
                ,   seatsAvailable = rest.nrSeats - nrIssuedCourses
                ;
                if (seatsAvailable >= nrSeatsNeeded && indexOf2(exclude, rest) == -1 && filter(rest, courseNr)) {
                    candidates.push(rest);
                }
            }
            if (candidates.length == 0) {
                console.error("No candidates found: courseNr:%s, nrSeatsNeeded:%s,", courseNr, nrSeatsNeeded);
                return null;
            }
            //--| Naive methode; beter om eerst nog te filteren op leegste restaurants
            //var selectedIndex = getRandomInt(0, candidates.length - 1);
            //console.info("courseNr:%s, nrSeatsNeeded:%s, nrCandidates:%s, selectedIndex:%s", courseNr, nrSeatsNeeded, candidates.length, selectedIndex);
            //return candidates[selectedIndex];
            //--| Using weighted version (nr of free spots is favoured)
            var item = ar_randomItem(candidates, function(c) { return c.nrSeats - c.nrIssuedCourses[courseNr]; });
            if (item == null) throw new Error('Hmm, we should always find something here...');
            return item;
        },
        issueCourses: function (group, filter) {
            var foundRestaurants = [];
            for(var courseNr = 0; courseNr < 3; courseNr++) {
                var course = Restaurants.findRandom(courseNr, group.nrPersons, foundRestaurants, filter);
                if (!course) return;
                //Hier nog niet ophogen, pas als alles goed is...
                //course.nrIssuedCourses[courseNr] += group.nrPersons;
                foundRestaurants.push(course);
            }
            return ar_map(foundRestaurants, function(restaurant) { return restaurant.id});
        }
    };

    // Groep
    var Group = {
        defaultItem: function (id) {
            return {
                id: id || null,
                rev: 0,
                name: "",
                nrPersons: 1,
                wantsVegetarian: false,
                issuedCourses: null
            };
        },
        getTestGroup: function () {
            return { id: 0, rev: 0, name: 'Test group 123', nrPersons: 2, vegetarian: false };
        }
    };
    var Groups = {
        defaultItem: function () {
            return [];
        },
        getDefaultEntry: function () {
            var res = Group.defaultItem();
            return res;
        },
        canHaveEntries: function () {
            var nrRestaurants = data.restaurants.length;
            return nrRestaurants >= 3;
        },
        findEntry: function (id) {
            var list = data.groups;
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (item.id == id) return item;
            }
            return null;
        },
        reIssueRestaurants: function (id) {
            var list = data.groups;
            var entry = findById(list, id);
            if (entry) {
                var oldIssuedCourses = entry.issuedCourses;
                entry.issuedCourses = null;
                Restaurants.recalculateCourses();
                var issuedCourses = Restaurants.issueCourses(entry, restaurantFilter);
                if (!issuedCourses) {
                    // undo
                    entry.issuedCourses = oldIssuedCourses;
                    Restaurants.recalculateCourses();
                    return;
                }
                entry.issuedCourses = issuedCourses;
                Restaurants.recalculateCourses();
            }
            return entry;
        },
        changeNrPersons: function (item, newNrPersons) {
            if (typeof newNrPersons != "number" || newNrPersons < 1) {
                return "Aantal personen moet minimaal 1 zijn";
            }
            var nrPersonsDelta = newNrPersons - item.nrPersons;
            // check loop if it's possible
            for (var i = 0; i < 3; i++) {
                var restaurant = Restaurants.findById(item.issuedCourses[i]),
                    newIssuedCourses = restaurant.nrIssuedCourses[i] + nrPersonsDelta;
                if (newIssuedCourses <= 0) {
                  return "Aantal personen moet 1 of groter zijn";
                }
                else if (newIssuedCourses > restaurant.nrSeats) {
                    return "Er zijn geen meer plekken in het restaurant " + restaurant.name;
                }
            }
            // apply loop
            item.nrPersons = newNrPersons;
            Restaurants.recalculateCourses();
            return;
        },
        addEntry: function (group) {
            var list = data.groups
            ,   errorMessage;
            if (errorMessage = Groups.validate(group)) {
                return errorMessage;
            }
            if (!group.id) group.id = nextId(list);
            group.issuedCourses = Restaurants.issueCourses(group, restaurantFilter);
            if (group.issuedCourses) {
                // Now add group to list, and actually issue courses
                list.push(group);
                Restaurants.recalculateCourses();
                var x = group.issuedCourses;
                Logs.add(format("Assigned group %1 with %2 persons to restaurants %3, %4 and %5.", group.id, group.nrPersons, x[0], x[1], x[2]));
            }
            else {
                return "Er was een probleem met het verdelen van restaurants";
            }
        },
        removeEntry: function (group) {
            var list = data.groups,
                index = indexOfId(list, group.id);
            group = list[index];
            var removedEntry = list.splice(index, 1);
            Restaurants.recalculateCourses();
            return removedEntry;
        },
        resetGroups: function () {
            data.groups = Groups.defaultItem();
            Restaurants.resetCourses();
            Logs.add("Groups and Restaurant courses are reset.")
        },
        validate: function (newItem) {
          var list = data.groups;
          if (!newItem.name) return "Een groep naam is verplicht";
          for(var i=0; i<list.length; i++) {
            var item = list[i];
            if (item.name.toLowerCase() == newItem.name.toLowerCase() && item.id != newItem.id) {
              return "De groep naam bestaat al";
            }
          }
          if (typeof newItem.nrPersons != "number" || newItem.nrPersons < 1) {
              return "Aantal personen moet minimaal 1 zijn";
          }
          var maxGroupSize = Groups.maxGroupSize();
          if (newItem.nrPersons > maxGroupSize) {
              console.warn("Group size %s > max group size %s", newItem.nrPersons, maxGroupSize);
              return format("De groep is te groot (maximaal %1)", maxGroupSize);
          }
          
          return;
        },
        maxGroupSize: function() {
            var maxSeatsLeft = Restaurants.getMaxSeatsLeft()
            ,   maxGroupSize = ar_min(maxSeatsLeft)
            ;
            return maxGroupSize;
        },
        getPrintTicketData: function (ticketId) {
            var result = {
                tocht: { name: data.name, description: data.description },
                tickets: []
            };
            var createAndAddTicket = function (group, places) {
                var ticket = {
                    group: group,
                    gridWidth: 12 / (data.afterPartyBar ? 4 : 3),
                    restaurants: csv2({
                        name: places,
                        label: Tocht.getCourseLabels()
                    })
                };
                result.tickets.push(ticket);
            };
            if (ticketId) {
                var list = data.groups, group = findById(list, ticketId), places = [];
                for (var i = 0; i < group.issuedCourses.length; i++) {
                    var restaurant = findById(data.restaurants, group.issuedCourses[i]);
                    places.push(restaurant.name);
                }
                if (data.afterPartyBar) places.push(data.afterPartyBar);
                createAndAddTicket(group, places.join(','));
            }
            else {
                createAndAddTicket(Group.getTestGroup(), Restaurants.getTestRestaurantNames());
            }
            return result;
        },
        getGroups: function (fnFilter) {
            // return list of groups, with added data
            var res = [], list = data.groups;
            for (var i = 0; i < list.length; i++) {
                var entry = list[i];
                if (!fnFilter || fnFilter(entry)) {
                    var item = { id: entry.id, rev: entry.rev || 0, name: entry.name, nrPersons: entry.nrPersons, vegetarian: entry.vegetarian };
                    if (entry.issuedCourses) {
                        item.issuedCourses = entry.issuedCourses;
                        // map id to object
                        item.restaurants = [
                          Restaurants.findById(entry.issuedCourses[0]),
                          Restaurants.findById(entry.issuedCourses[1]),
                          Restaurants.findById(entry.issuedCourses[2])
                        ];
                    }
                    else {
                        item.restaurants = item.issuedCourses = null;
                    }
                    res.push(item);
                }
            }
            return res.sort(function (a, b) { return b.id - a.id });
        },
        nrPersons: function () {
            var result = 0, grps = data.groups;
            for (var i = 0; i < grps.length; i++) {
                result += grps[i].nrPersons;
            }
            return result;
        }
    };

    // Log
    var Log = {
        defaultItem: function (id) {
            return {
                id: id || null,
                date: new Date().toJSON(),
                line: ""
            };
        }
    };
    var Logs = {
        defaultItem: function () {
            return [];
        },
        add: function (line) {
            var item = Log.defaultItem(nextId(data.logs));
            item.line = line;
            data.logs.push(item);
        },
        getLines: function () {
            return {
                logs: data.logs.sort(function (a, b) {
                    return ascSorter(b.id, a.id);
                })
            };
        }
    };

    data = tochtData || Tocht.defaultItem(initial);
    Restaurants.recalculateCourses();

    var exports = {
        data: data,
        Tocht: Tocht,
        Restaurant: Restaurant,
        Restaurants: Restaurants,
        Group: Group,
        Groups: Groups,
        Log: Log,
        Logs: Logs
    };
    return exports;
}