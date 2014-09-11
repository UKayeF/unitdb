"use strict";!function(){for(var a,b=function(){},c=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],d=c.length,e=window.console=window.console||{};d--;)a=c[d],e[a]||(e[a]=b)}();var unitDb=function(){var a=function(a,c){var d=b(a,c);return angular.bootstrap(document,[a]),d},b=function(a,b){var c=angular.module(a,["ngRoute","ngSanitize","angular-underscore"]);return c.config(["$routeProvider",function(a){a.when("/",{controller:"homeCtrl",templateUrl:"views/home.html"}).when("/:ids",{controller:"compareCtrl",templateUrl:"views/compare.html"}).otherwise({templateUrl:"404.html"})}]),c.provider("data",unitDb.services.dataProvider),c.config(["dataProvider",function(a){if(!b)throw"need unit data!";a.setIndex(b)}]),angular.forEach(unitDb.filters,function(a,b){c.filter(b,a)}),angular.forEach(unitDb.directives,function(a,b){c.directive(b,a)}),angular.forEach(unitDb.controllers,function(a,b){c.controller(b,a)}),c};return{start:a}}();unitDb.DpsCalculator={next:null,canCalculate:function(){return!1},_dps:function(){},rateInverse:function(a){return Math.round(10/a.RateOfFire)/10},dps:function(a){return this.canCalculate(a)?this._dps(a):this.next&&this.next.dps?this.next.dps(a):void 0}},unitDb.DefaultDpsCalculator=angular.extend({},unitDb.DpsCalculator,{canCalculate:function(){return!0},_dps:function(a){var b=1,c={"/projectiles/TIFFragmentationSensorShell01/TIFFragmentationSensorShell01_proj.bp":4,"/projectiles/SIFThunthoArtilleryShell01/SIFThunthoArtilleryShell01_proj.bp":5};return a.ProjectileId&&(b=c[a.ProjectileId]||1),b*a.Damage*a.MuzzleSalvoSize/unitDb.DpsCalculator.rateInverse(a)}}),unitDb.BeamDpsCalculator=angular.extend({},unitDb.DpsCalculator,{next:unitDb.DefaultDpsCalculator,canCalculate:function(a){return a.BeamLifetime},_dps:function(a){return a.Damage*a.BeamLifetime*(a.BeamCollisionDelay||1)*10/unitDb.DpsCalculator.rateInverse(a)}}),unitDb.ContinousBeamDpsCalculator=angular.extend({},unitDb.DpsCalculator,{next:unitDb.BeamDpsCalculator,canCalculate:function(a){return a.ContinuousBeam},_dps:function(a){return 10*a.Damage/(0===a.BeamCollisionDelay?1:2)}}),unitDb.DoTDpsCalculator=angular.extend({},unitDb.DpsCalculator,{next:unitDb.ContinousBeamDpsCalculator,canCalculate:function(a){return a.DoTPulses},_dps:function(a){var b=unitDb.DefaultDpsCalculator._dps(a);return(b+a.Damage*a.DoTPulses*a.MuzzleSalvoSize)/unitDb.DpsCalculator.rateInverse(a)}}),unitDb.dpsCalculator=unitDb.DoTDpsCalculator,unitDb.UnitDecorator=function(a){var b={RULEUC_Engineer:"Build",RULEUC_Commander:"Build",RULEUMT_Amphibious:"Land",RULEUC_MilitaryVehicle:"Land",RULEUC_MilitaryAircraft:"Air",RULEUC_MilitarySub:"Naval",RULEUC_MilitaryShip:"Naval",RULEUC_Weapon:"Base",RULEUC_Sensor:"Base",RULEUC_Factory:"Base",RULEUC_Resource:"Base",RULEUC_MiscSupport:"Base",RULEUC_CounterMeasure:"Base"},c={RULEUTL_Basic:"T1",RULEUTL_Advanced:"T2",RULEUTL_Secret:"T3",RULEUTL_Experimental:"TX",TECH1:"T1",TECH2:"T2",TECH3:"T3",EXPERIMENTAL:"EXP"},d=function(a){var b=_.intersection(a.Categories,_.keys(c));return 1===b.length?c[b[0]]:""},e=function(){return(this.name?this.name+": ":"")+("EXP"===this.tech?"":this.tech+" ")+this.description},f=function(a){var b=a.ManualFire?1:a.ProjectilesPerOnFire,c=a.ProjectilesPerOnFire?a.RateOfFire:1/a.RateOfFire,d=a.RackSalvoChargeTime,e=1/c+d,f=a.Damage;return{shots:b,cycle:e,damage:f}},g=function(a){var b=f(a);return b.shots+" shot"+(b.shots>1?"s":"")+" / "+(1===b.cycle?"":Math.round(10*b.cycle)/10)+" sec"},h=function(a){return unitDb.dpsCalculator.dps(a)},i={id:a.Id,name:a.General.UnitName,description:a.Description,faction:a.General.FactionName,classification:b[a.General.Classification],tech:d(a),strategicIcon:a.StrategicIconName,icon:a.General.Icon||"",order:a.BuildIconSortPriority||1e3,fullName:e,fireCycle:g};for(var j in a.Weapon)_.extend(a.Weapon[j],{dps:h(a.Weapon[j])});return _.extend(i,a)},unitDb.services={dataProvider:function(){var a=[];this.setIndex=function(b){a=b},this.$get=[function(){return{items:_.map(a,function(a){return unitDb.UnitDecorator(a)}),contenders:[]}}]}},unitDb.filters={unsafe:["$sce",function(a){return function(b){return a.trustAsHtml(b)}}],"if":function(){return function(a,b){return b?a:void 0}},flatten:function(){return function(a){var b="<br/> ";return angular.isArray(a)?a.join(b):angular.isObject(a)?_.map(a,function(a,b){return angular.isObject(a)?void 0:b+(a===!0?"":": "+a)}).join(b):a}},time:function(){return function(a){function b(a){return("00"+a).slice(-2)}return Math.floor(a%3600/60)+":"+b(Math.floor(a%3600%60))}},round:function(){return function(a,b){var c=Math.pow(10,b||0);return Math.round((a||0)*c)/c}},shorten:function(){return function(a){return a>1e9-1?a/1e9+"G":a>1e6-1?a/1e6+"M":a>999?a/1e3+"k":a}}},unitDb.directives={thumb:[function(){return{restrict:"E",replace:!0,templateUrl:"views/thumb.html",scope:{item:"=content",click:"&"}}}],unit:[function(){return{restrict:"E",replace:!0,templateUrl:"views/unit.html",scope:{item:"=content"}}}]},unitDb.controllers={homeCtrl:["$scope","data",function(a,b){a.factions=[],a.kinds=[],a.tech=[],a.index=b.items,a.contenders=b.contenders;var c=function(a,b){var c=a.indexOf(b);c>=0?a=a.splice(c,1):a.push(b)},d=function(a,b){return a.indexOf(b)>=0};a.toggleFaction=function(b){c(a.factions,b)},a.factionSelected=function(b){return d(a.factions,b)},a.toggleKind=function(b){c(a.kinds,b)},a.kindSelected=function(b){return d(a.kinds,b)},a.toggleTech=function(b){c(a.tech,b)},a.techSelected=function(b){return d(a.tech,b)},a.compare=function(a){a.selected=!a.selected;var c=b.contenders.indexOf(a.id);-1===c?b.contenders.push(a.id):b.contenders.splice(c,1)},a.clear=function(){for(var a in b.items)b.items[a].selected&&(b.items[a].selected=!1);b.contenders=[]},a.strain=function(b){return(0===a.factions.length||d(a.factions,b.faction))&&(0===a.kinds.length||d(a.kinds,b.classification))&&(0===a.tech.length||d(a.tech,b.tech))}}],compareCtrl:["$scope","$routeParams","data",function(a,b,c){var d=b.ids.split(",");a.contenders=_.sortBy(_.filter(c.items,function(a){return _.contains(d,a.id)}),function(a){return d.indexOf(a.id)})}]};