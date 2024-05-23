(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @name 'Hugo Tags Filter'
 * @version 1.2.2
 * @license MIT  
 * @author PointyFar 
 */

var HugoTagsFilter = function () {
  function HugoTagsFilter(config) {
    _classCallCheck(this, HugoTagsFilter);

    var defaultFilters = [{
      name: 'tag',
      prefix: 'tft-',
      buttonClass: 'tft-button',
      allSelector: '#tfSelectAllTags',
      attrName: 'data-tags'
    }, {
      name: 'section',
      prefix: 'tfs-',
      buttonClass: 'tfs-button',
      allSelector: '#tfSelectAllSections',
      attrName: 'data-section'
    }];

    this.FILTERS = config && config.filters ? config.filters : defaultFilters;
    this.showItemClass = config && config.showItemClass ? config.showItemClass : "tf-show";
    this.showToggleLabelClass = config && config.showToggleLabelClass ? config.showToggleLabelClass : "tf-show";
    this.activeButtonClass = config && config.activeButtonClass ? config.activeButtonClass : "active";
    this.filterItemClass = config && config.filterItemClass ? config.filterItemClass : "tf-filter-item";
    this.counterSelector = config && config.counterSelector ? config.counterSelector : "selectedItemCount";

    this.populateCount = config && config.populateCount ? config.populateCount : false;
    this.setDisabledButtonClass = config && config.setDisabledButtonClass ? config.setDisabledButtonClass : false;

    this.filterItems = document.getElementsByClassName(this.filterItemClass);
    this.selectedItemCount = 0;

    this.filterValues = {};

    for (var i = 0; i < this.FILTERS.length; i++) {
      this.FILTERS[i]['buttonTotal'] = document.getElementsByClassName(this.FILTERS[i]['buttonClass']).length;
      this.FILTERS[i]['selected'] = [];
      this.FILTERS[i]['values'] = [];
      var fv = document.getElementsByClassName(this.FILTERS[i]['buttonClass']);

      /**      
      * Build index of all filter values and their counts      
      */
      this.filterValues[this.FILTERS[i]['name']] = [];
      for (var j = 0; j < fv.length; j++) {
        var v = fv[j].id.replace(this.FILTERS[i]["prefix"], '');
        this.filterValues[this.FILTERS[i]['name']][v] = { count: 0, selected: 0 };
      }
    }
    // actually initialize the counts...
    this.filterValues = this.initFilterCount(this.filterValues, true);

    // this.showCheck(this.FILTERS[0]['name']);
    for (var i = 0; i < this.FILTERS.length; i++) {
      this.showCheck(this.FILTERS[i]['name'], false);

      var checkbox = document.querySelector(this.FILTERS[i]['conditionToggleSelector']);
      var andLabel = document.getElementById(checkbox.id + "And");
      var orLabel = document.getElementById(checkbox.id + "Or");

      if (checkbox.checked && andLabel) {
        this.addClassIfMissing(andLabel, this.showToggleLabelClass);
      }
      if (!checkbox.checked && orLabel) {
        this.addClassIfMissing(orLabel, this.showToggleLabelClass);
      }
    }
  }

  _createClass(HugoTagsFilter, [{
    key: 'initFilterCount',
    value: function initFilterCount(fvc, isInitial) {

      /**    
       * Initialise count = selected
       */
      if (isInitial) {
        for (var k in fvc) {
          for (var x = 0; x < this.filterItems.length; x++) {
            var attrs = this.getAttrs(k, this.filterItems[x]);
            for (var l = 0; l < attrs.length; l++) {
              fvc[k][attrs[l]].count++;
              fvc[k][attrs[l]].selected++;
            }
          }
        }
      } else {
        var showing = document.getElementsByClassName(this.showItemClass);
        for (var k in fvc) {
          for (var k2 in fvc[k]) {
            fvc[k][k2].selected = 0;
          }
        }
        for (var l = 0; l < showing.length; l++) {
          for (k in fvc) {
            var attrs = this.getAttrs(k, showing[l]);
            for (var m = 0; m < attrs.length; m++) {
              fvc[k][attrs[m]].selected++;
            }
          }
        }
      }

      return fvc;
    }
  }, {
    key: 'populateCounters',
    value: function populateCounters(fvc) {

      if (this.populateCount) {
        for (var i = 0; i < this.FILTERS.length; i++) {
          var fname = this.FILTERS[i]['name'];
          var cp = this.FILTERS[i]['countPrefix'];
          var sp = this.FILTERS[i]['selectedPrefix'];

          if (cp || sp) {
            for (var k in fvc[fname]) {
              if (cp) {
                var cel = document.getElementById('' + cp + k);
                cel.textContent = fvc[fname][k].count;
              }
              if (sp) {
                var sel = document.getElementById('' + sp + k);
                sel.textContent = fvc[fname][k].selected;
                if (this.setDisabledButtonClass) {
                  if (sel.textContent == 0) {
                    this.addClassIfMissing(document.getElementById(this.FILTERS[i]['prefix'] + k), this.setDisabledButtonClass);
                  } else {
                    this.delClassIfPresent(document.getElementById(this.FILTERS[i]['prefix'] + k), this.setDisabledButtonClass);
                  }
                }
              }
            }
          }
        }
      }
    }

    /**  
     * getAttrs - returns an array of data-attr attributes of an element elem
     */

  }, {
    key: 'getAttrs',
    value: function getAttrs(attr, elem) {
      return elem.getAttribute('data-' + attr).split(" ").filter(function (el) {
        return el.length > 0;
      });
    }
  }, {
    key: 'showAll',
    value: function showAll(filter) {
      for (var i = 0; i < this.FILTERS.length; i++) {
        if (filter) {
          if (this.FILTERS[i]['name'] === filter) {
            this.FILTERS[i]['selected'] = [];
          }
        } else {
          this.FILTERS[i]['selected'] = [];
        }
      }
      this.showCheck(filter);
    }
  }, {
    key: 'checkFilter',
    value: function checkFilter(tag, tagType) {

      /* Selects clicked button.*/
      var selectedBtn = document.querySelector('#' + tagType + tag);

      for (var i = 0; i < this.FILTERS.length; i++) {
        if (this.FILTERS[i]['prefix'] === tagType) {
          var index = this.FILTERS[i]['selected'].indexOf(tag);
          if (index >= 0) {
            /* already selected, deselect tag */
            this.FILTERS[i]['selected'].splice(index, 1);
            this.delClassIfPresent(selectedBtn, this.activeButtonClass);
          } else {
            /* add tag to selected list */
            this.FILTERS[i]['selected'].push(tag);
            this.addClassIfMissing(selectedBtn, this.activeButtonClass);
          }
          this.delClassIfPresent(document.querySelector(this.FILTERS[i]['allSelector']), this.activeButtonClass);
          this.showCheck(this.FILTERS[i]['name']);
        }
      }
    }

    /**
    * showCheck - Applies "show" class to items containing selected tags
    */

  }, {
    key: 'showCheck',
    value: function showCheck(filter, isInitial) {

      /* If no tags/licenses selected, or all tags selected, SHOW ALL and DESELECT ALL BUTTONS. */
      for (var i = 0; i < this.FILTERS.length; i++) {
        if (this.FILTERS[i]['name'] === filter) {
          if (this.FILTERS[i]['selected'].length === 0 || this.FILTERS[i]['selected'].length === this.FILTERS[i]['buttonTotal']) {
            var iBtns = document.getElementsByClassName(this.FILTERS[i]['buttonClass']);
            for (var j = 0; j < iBtns.length; j++) {
              this.delClassIfPresent(iBtns[j], this.activeButtonClass);
            }
            this.addClassIfMissing(document.querySelector(this.FILTERS[i]['allSelector']), this.activeButtonClass);
            this.FILTERS[i]['selected'] = [];
          }
        }
      }

      this.selectedItemCount = 0;

      for (var i = 0; i < this.filterItems.length; i++) {
        /* First remove "show" class */
        this.delClassIfPresent(this.filterItems[i], this.showItemClass);

        var visibility = 0;
        /* show item only if visibility is true for all filters */
        for (var j = 0; j < this.FILTERS.length; j++) {
          /* TODO: find better name for 'filterAnd' */
          if (this.FILTERS[j]['filterAnd']) {
            /* Have switch, and enabled */
            /* If no selection => select all */
            var selected = this.FILTERS[j]['selected'];
            if (this.FILTERS[j]['selected'].length === 0) {
              selected = [];

              var fv = document.getElementsByClassName(this.FILTERS[j]['buttonClass']);
              for (var k = 0; k < fv.length; k++) {
                var v = fv[k].id.replace(this.FILTERS[j]["prefix"], '');
                selected.push(v);
              }
            }
            if (this.checkVisibilityAnd(selected, this.filterItems[i].getAttribute(this.FILTERS[j]['attrName']))) {
              visibility++;
            }
          } else {
            if (this.checkVisibility(this.FILTERS[j]['selected'], this.filterItems[i].getAttribute(this.FILTERS[j]['attrName']))) {
              visibility++;
            }
          }
        }
        /* Then check if "show" class should be applied */
        if (visibility === this.FILTERS.length) {
          if (!this.filterItems[i].classList.contains(this.showItemClass)) {
            this.selectedItemCount++;
            this.addClassIfMissing(this.filterItems[i], this.showItemClass);
          }
        }
      }

      if (document.getElementById(this.counterSelector)) {
        document.getElementById(this.counterSelector).textContent = '' + this.selectedItemCount;
      }

      this.checkButtonCounts(isInitial);
    }
  }, {
    key: 'checkButtonCounts',
    value: function checkButtonCounts(isInitial) {
      this.filterValues = this.initFilterCount(this.filterValues, isInitial);
      this.populateCounters(this.filterValues);
    }

    /**
    * checkVisibility - Tests if attribute is included in list.
    */

  }, {
    key: 'checkVisibility',
    value: function checkVisibility(list, dataAttr) {
      /* Returns TRUE if list is empty or attribute is in list */
      if (list.length > 0) {
        for (var v = 0; v < list.length; v++) {
          var arr = dataAttr.split(" ").filter(function (el) {
            return el.length > 0;
          });
          if (arr.indexOf(list[v]) >= 0) {
            return true;
          }
        }
        return false;
      } else {
        return true;
      }
    }
    /**
    * checkVisibilityAnd - Tests if attributes are included in list.
    */

  }, {
    key: 'checkVisibilityAnd',
    value: function checkVisibilityAnd(list, dataAttr) {
      /* Returns TRUE if list is empty or all attributes in list */
      var found = 0;
      if (list.length > 0) {
        for (var v = 0; v < list.length; v++) {
          var arr = dataAttr.split(" ").filter(function (el) {
            return el.length > 0;
          });
          if (arr.indexOf(list[v]) >= 0) {
            found++;
          }
        }
        return found === list.length;
      } else {
        return true;
      }
    }
  }, {
    key: 'addClassIfMissing',
    value: function addClassIfMissing(el, cn) {
      if (!el.classList.contains(cn)) {
        el.classList.add(cn);
      }
    }
  }, {
    key: 'delClassIfPresent',
    value: function delClassIfPresent(el, cn) {
      if (el.classList.contains(cn)) {
        el.classList.remove(cn);
      }
    }

    /* 2-REC: "AND" filtering */

  }, {
    key: 'toggleSwitch',
    value: function toggleSwitch(checkbox, filter) {
      for (var i = 0; i < this.FILTERS.length; i++) {
        if (filter) {
          if (this.FILTERS[i]['name'] === filter) {
            this.FILTERS[i]['filterAnd'] = checkbox.checked;
            this.updateSwitchLabels(checkbox);
          }
        } else {
          this.FILTERS[i]['filterAnd'] = checkbox.checked;
          this.updateSwitchLabels(checkbox);
        }
      }
      this.showCheck(filter);
    }
  }, {
    key: 'updateSwitchLabels',
    value: function updateSwitchLabels(checkbox) {
      var switchId = checkbox.id;

      /* TODO(2-REC): Add "And"+"Or" labels as global parameters for HTF (e.g.: "andSuffix"+"orSuffix") */
      var andLabel = document.getElementById(switchId + "And");
      var orLabel = document.getElementById(switchId + "Or");
      if (checkbox.checked) {
        if (andLabel) {
          this.addClassIfMissing(andLabel, this.activeButtonClass);
          this.addClassIfMissing(andLabel, this.showToggleLabelClass);
        }
        if (orLabel) {
          this.delClassIfPresent(orLabel, this.activeButtonClass);
          this.delClassIfPresent(orLabel, this.showToggleLabelClass);
        }
      } else {
        if (andLabel) {
          this.delClassIfPresent(andLabel, this.activeButtonClass);
          this.delClassIfPresent(andLabel, this.showToggleLabelClass);
        }
        if (orLabel) {
          this.addClassIfMissing(orLabel, this.activeButtonClass);
          this.addClassIfMissing(orLabel, this.showToggleLabelClass);
        }
      }
    }
  }]);

  return HugoTagsFilter;
}();

window['HugoTagsFilter'] = HugoTagsFilter;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaHVnb3RhZ3NmaWx0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQTs7Ozs7OztJQU9NLGM7QUFDSiwwQkFBWSxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCLFFBQUksaUJBQWlCLENBQ25CO0FBQ0UsWUFBTSxLQURSO0FBRUUsY0FBUSxNQUZWO0FBR0UsbUJBQWEsWUFIZjtBQUlFLG1CQUFhLGtCQUpmO0FBS0UsZ0JBQVU7QUFMWixLQURtQixFQVFuQjtBQUNFLFlBQU0sU0FEUjtBQUVFLGNBQVEsTUFGVjtBQUdFLG1CQUFhLFlBSGY7QUFJRSxtQkFBYSxzQkFKZjtBQUtFLGdCQUFVO0FBTFosS0FSbUIsQ0FBckI7O0FBaUJBLFNBQUssT0FBTCxHQUFnQixVQUFVLE9BQU8sT0FBbEIsR0FBNkIsT0FBTyxPQUFwQyxHQUE4QyxjQUE3RDtBQUNBLFNBQUssYUFBTCxHQUFzQixVQUFVLE9BQU8sYUFBbEIsR0FBbUMsT0FBTyxhQUExQyxHQUEwRCxTQUEvRTtBQUNBLFNBQUssb0JBQUwsR0FBNkIsVUFBVSxPQUFPLG9CQUFsQixHQUEwQyxPQUFPLG9CQUFqRCxHQUF3RSxTQUFwRztBQUNBLFNBQUssaUJBQUwsR0FBMEIsVUFBVSxPQUFPLGlCQUFsQixHQUF1QyxPQUFPLGlCQUE5QyxHQUFrRSxRQUEzRjtBQUNBLFNBQUssZUFBTCxHQUF3QixVQUFVLE9BQU8sZUFBbEIsR0FBcUMsT0FBTyxlQUE1QyxHQUE4RCxnQkFBckY7QUFDQSxTQUFLLGVBQUwsR0FBd0IsVUFBVSxPQUFPLGVBQWxCLEdBQXFDLE9BQU8sZUFBNUMsR0FBOEQsbUJBQXJGOztBQUVBLFNBQUssYUFBTCxHQUFzQixVQUFVLE9BQU8sYUFBbEIsR0FBbUMsT0FBTyxhQUExQyxHQUEwRCxLQUEvRTtBQUNBLFNBQUssc0JBQUwsR0FBK0IsVUFBVSxPQUFPLHNCQUFsQixHQUE0QyxPQUFPLHNC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LE9BQUosRUFBYTtBQUNYLGVBQUssaUJBQUwsQ0FBdUIsT0FBdkIsRUFBZ0MsS0FBSyxpQkFBckM7QUFDQSxlQUFLLGlCQUFMLENBQXVCLE9BQXZCLEVBQWdDLEtBQUssb0JBQXJDO0FBQ0Q7QUFDRjtBQUNGOzs7Ozs7QUFHSCxPQUFPLGdCQUFQLElBQTJCLGNBQTNCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBAbmFtZSAnSHVnbyBUYWdzIEZpbHRlcidcbiAqIEB2ZXJzaW9uIDEuMi4yXG4gKiBAbGljZW5zZSBNSVQgIFxuICogQGF1dGhvciBQb2ludHlGYXIgXG4gKi8gXG5cbmNsYXNzIEh1Z29UYWdzRmlsdGVyIHtcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgdmFyIGRlZmF1bHRGaWx0ZXJzID0gW1xuICAgICAge1xuICAgICAgICBuYW1lOiAndGFnJyxcbiAgICAgICAgcHJlZml4OiAndGZ0LScsXG4gICAgICAgIGJ1dHRvbkNsYXNzOiAndGZ0LWJ1dHRvbicsXG4gICAgICAgIGFsbFNlbGVjdG9yOiAnI3RmU2VsZWN0QWxsVGFncycsXG4gICAgICAgIGF0dHJOYW1lOiAnZGF0YS10YWdzJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3NlY3Rpb24nLFxuICAgICAgICBwcmVmaXg6ICd0ZnMtJyxcbiAgICAgICAgYnV0dG9uQ2xhc3M6ICd0ZnMtYnV0dG9uJyxcbiAgICAgICAgYWxsU2VsZWN0b3I6ICcjdGZTZWxlY3RBbGxTZWN0aW9ucycsXG4gICAgICAgIGF0dHJOYW1lOiAnZGF0YS1zZWN0aW9uJ1xuICAgICAgfVxuICAgIF1cbiAgICBcbiAgICB0aGlzLkZJTFRFUlMgPSAoY29uZmlnICYmIGNvbmZpZy5maWx0ZXJzKSA/IGNvbmZpZy5maWx0ZXJzIDogZGVmYXVsdEZpbHRlcnM7XG4gICAgdGhpcy5zaG93SXRlbUNsYXNzID0gKGNvbmZpZyAmJiBjb25maWcuc2hvd0l0ZW1DbGFzcykgPyBjb25maWcuc2hvd0l0ZW1DbGFzcyA6IFwidGYtc2hvd1wiO1xuICAgIHRoaXMuc2hvd1RvZ2dsZUxhYmVsQ2xhc3MgPSAoY29uZmlnICYmIGNvbmZpZy5zaG93VG9nZ2xlTGFiZWxDbGFzcykgPyBjb25maWcuc2hvd1RvZ2dsZUxhYmVsQ2xhc3MgOiBcInRmLXNob3dcIjtcbiAgICB0aGlzLmFjdGl2ZUJ1dHRvbkNsYXNzID0gKGNvbmZpZyAmJiBjb25maWcuYWN0aXZlQnV0dG9uQ2xhc3MpID8gY29uZmlnLmFjdGl2ZUJ1dHRvbkNsYXNzIDogXCJhY3RpdmVcIjtcbiAgICB0aGlzLmZpbHRlckl0ZW1DbGFzcyA9IChjb25maWcgJiYgY29uZmlnLmZpbHRlckl0ZW1DbGFzcykgPyBjb25maWcuZmlsdGVySXRlbUNsYXNzIDogXCJ0Zi1maWx0ZXItaXRlbVwiO1xuICAgIHRoaXMuY291bnRlclNlbGVjdG9yID0gKGNvbmZpZyAmJiBjb25maWcuY291bnRlclNlbGVjdG9yKSA/IGNvbmZpZy5jb3VudGVyU2VsZWN0b3IgOiBcInNlbGVjdGVkSXRlbUNvdW50XCI7XG4gICAgXG4gICAgdGhpcy5wb3B1bGF0ZUNvdW50ID0gKGNvbmZpZyAmJiBjb25maWcucG9wdWxhdGVDb3VudCkgPyBjb25maWcucG9wdWxhdGVDb3VudCA6IGZhbHNlO1xuICAgIHRoaXMuc2V0RGlzYWJsZWRCdXR0b25DbGFzcyA9IChjb25maWcgJiYgY29uZmlnLnNldERpc2FibGVkQnV0dG9uQ2xhc3MpID8gY29uZmlnLnNldERpc2FibGVkQnV0dG9uQ2xhc3MgOiBmYWxzZTtcbiAgICBcbiAgICBcbiAgICB0aGlzLmZpbHRlckl0ZW1zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLmZpbHRlckl0ZW1DbGFzcyk7XG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1Db3VudCA9IDA7XG4gICAgXG4gICAgdGhpcy5maWx0ZXJWYWx1ZXMgPSB7fTtcbiAgICBcbiAgICBmb3IoIHZhciBpID0gMDsgaSA8IHRoaXMuRklMVEVSUy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5GSUxURVJTW2ldWydidXR0b25Ub3RhbCddID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLkZJTFRFUlNbaV1bJ2J1dHRvbkNsYXNzJ10pLmxlbmd0aDtcbiAgICAgIHRoaXMuRklMVEVSU1tpXVsnc2VsZWN0ZWQnXSA9IFtdO1xuICAgICAgdGhpcy5GSUxURVJTW2ldWyd2YWx1ZXMnXSA9IFtdO1xuICAgICAgdmFyIGZ2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLkZJTFRFUlNbaV1bJ2J1dHRvbkNsYXNzJ10pO1xuICAgICAgXG4gICAgICAvKiogICAgICBcbiAgICAgICogQnVpbGQgaW5kZXggb2YgYWxsIGZpbHRlciB2YWx1ZXMgYW5kIHRoZWlyIGNvdW50cyAgICAgIFxuICAgICAgKi8gICAgICAgXG4gICAgICB0aGlzLmZpbHRlclZhbHVlc1t0aGlzLkZJTFRFUlNbaV1bJ25hbWUnXV0gPSBbXTsgXG4gICAgICBmb3IoIHZhciBqID0gMDsgaiA8IGZ2Lmxlbmd0aDsgaisrICl7XG4gICAgICAgIHZhciB2ID0gZnZbal0uaWQucmVwbGFjZSh0aGlzLkZJTFRFUlNbaV1bXCJwcmVmaXhcIl0sICcnKTtcbiAgICAgICAgdGhpcy5maWx0ZXJWYWx1ZXNbdGhpcy5GSUxURVJTW2ldWyduYW1lJ11dW3ZdID0ge2NvdW50OjAsIHNlbGVjdGVkOjB9O1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBhY3R1YWxseSBpbml0aWFsaXplIHRoZSBjb3VudHMuLi5cbiAgICB0aGlzLmZpbHRlclZhbHVlcyA9IHRoaXMuaW5pdEZpbHRlckNvdW50KHRoaXMuZmlsdGVyVmFsdWVzLCB0cnVlKTtcblxuICAgIC8vIHRoaXMuc2hvd0NoZWNrKHRoaXMuRklMVEVSU1swXVsnbmFtZSddKTtcbiAgICBmb3IoIHZhciBpID0gMDsgaSA8IHRoaXMuRklMVEVSUy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5zaG93Q2hlY2sodGhpcy5GSUxURVJTW2ldWyduYW1lJ10sIGZhbHNlKTtcbiAgICAgIFxuICAgICAgY29uc3QgY2hlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuRklMVEVSU1tpXVsnY29uZGl0aW9uVG9nZ2xlU2VsZWN0b3InXSk7XG4gICAgICBjb25zdCBhbmRMYWJlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKChjaGVja2JveC5pZCArIFwiQW5kXCIpKTtcbiAgICAgIGNvbnN0IG9yTGFiZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgoY2hlY2tib3guaWQgKyBcIk9yXCIpKTtcblxuICAgICAgaWYoY2hlY2tib3guY2hlY2tlZCAmJiBhbmRMYWJlbCl7XG4gICAgICAgIHRoaXMuYWRkQ2xhc3NJZk1pc3NpbmcoYW5kTGFiZWwsIHRoaXMuc2hvd1RvZ2dsZUxhYmVsQ2xhc3MpXG4gICAgICB9XG4gICAgICBpZighY2hlY2tib3guY2hlY2tlZCAmJiBvckxhYmVsKXtcbiAgICAgICAgdGhpcy5hZGRDbGFzc0lmTWlzc2luZyhvckxhYmVsLCB0aGlzLnNob3dUb2dnbGVMYWJlbENsYXNzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgaW5pdEZpbHRlckNvdW50KGZ2YywgaXNJbml0aWFsKXtcbiAgICBcbiAgICAvKiogICAgXG4gICAgICogSW5pdGlhbGlzZSBjb3VudCA9IHNlbGVjdGVkXG4gICAgICovICAgICBcbiAgICBpZihpc0luaXRpYWwpIHtcbiAgICAgIGZvciggdmFyIGsgaW4gZnZjICkge1xuICAgICAgICBmb3IoIHZhciB4ID0gMDsgeCA8IHRoaXMuZmlsdGVySXRlbXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLmdldEF0dHJzKGssIHRoaXMuZmlsdGVySXRlbXNbeF0pO1xuICAgICAgICAgIGZvcih2YXIgbCA9IDA7IGwgPGF0dHJzLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICBmdmNba11bYXR0cnNbbF1dLmNvdW50Kys7XG4gICAgICAgICAgICBmdmNba11bYXR0cnNbbF1dLnNlbGVjdGVkKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzaG93aW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLnNob3dJdGVtQ2xhc3MpO1xuICAgICAgZm9yKCB2YXIgayBpbiBmdmMgKSB7XG4gICAgICAgIGZvciggdmFyIGsyIGluIGZ2Y1trXSApe1xuICAgICAgICAgIGZ2Y1trXVtrMl0uc2VsZWN0ZWQgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IodmFyIGwgPSAwOyBsIDwgc2hvd2luZy5sZW5ndGg7IGwrKykge1xuICAgICAgICBmb3IoIGsgaW4gZnZjICl7XG4gICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5nZXRBdHRycyhrLCBzaG93aW5nW2xdKTtcbiAgICAgICAgICBmb3IodmFyIG0gPSAwOyBtIDwgYXR0cnMubGVuZ3RoOyBtKyspIHtcbiAgICAgICAgICAgIGZ2Y1trXVthdHRyc1ttXV0uc2VsZWN0ZWQrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZnZjO1xuICB9XG4gIFxuICBwb3B1bGF0ZUNvdW50ZXJzKGZ2Yyl7XG5cbiAgICBpZih0aGlzLnBvcHVsYXRlQ291bnQpIHtcbiAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgdGhpcy5GSUxURVJTLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBmbmFtZSA9IHRoaXMuRklMVEVSU1tpXVsnbmFtZSddO1xuICAgICAgICB2YXIgY3AgPSB0aGlzLkZJTFRFUlNbaV1bJ2NvdW50UHJlZml4J107XG4gICAgICAgIHZhciBzcCA9IHRoaXMuRklMVEVSU1tpXVsnc2VsZWN0ZWRQcmVmaXgnXTtcbiAgICAgICAgXG4gICAgICAgIGlmKCBjcCB8fCBzcCApIHtcbiAgICAgICAgICBmb3IoIHZhciBrIGluIGZ2Y1tmbmFtZV0gKXtcbiAgICAgICAgICAgIGlmKGNwKSB7XG4gICAgICAgICAgICAgIHZhciBjZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgJHtjcH0ke2t9YClcbiAgICAgICAgICAgICAgICAgIGNlbC50ZXh0Q29udGVudCA9IGZ2Y1tmbmFtZV1ba10uY291bnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihzcCkge1xuICAgICAgICAgICAgICB2YXIgc2VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7c3B9JHtrfWApXG4gICAgICAgICAgICAgICAgICBzZWwudGV4dENvbnRlbnQgPSBmdmNbZm5hbWVdW2tdLnNlbGVjdGVkO1xuICAgICAgICAgICAgICBpZih0aGlzLnNldERpc2FibGVkQnV0dG9uQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICBpZiggc2VsLnRleHRDb250ZW50ID09IDApIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2xhc3NJZk1pc3NpbmcoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5GSUxURVJTW2ldWydwcmVmaXgnXStrKSwgdGhpcy5zZXREaXNhYmxlZEJ1dHRvbkNsYXNzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdGhpcy5kZWxDbGFzc0lmUHJlc2VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLkZJTFRFUlNbaV1bJ3ByZWZpeCddK2spLCB0aGlzLnNldERpc2FibGVkQnV0dG9uQ2xhc3MpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBcbiAgLyoqICBcbiAgICogZ2V0QXR0cnMgLSByZXR1cm5zIGFuIGFycmF5IG9mIGRhdGEtYXR0ciBhdHRyaWJ1dGVzIG9mIGFuIGVsZW1lbnQgZWxlbVxuICAgKi8gICBcbiAgZ2V0QXR0cnMoYXR0ciwgZWxlbSkge1xuICAgIHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS0nKyBhdHRyIClcbiAgICAgICAgICAgICAgLnNwbGl0KFwiIFwiKVxuICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwubGVuZ3RoID4gMFxuICAgICAgICAgICAgICB9KTtcbiAgfVxuICBcbiAgc2hvd0FsbChmaWx0ZXIpIHtcbiAgICBmb3IoIHZhciBpID0gMDsgaSA8IHRoaXMuRklMVEVSUy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYoZmlsdGVyKSB7XG4gICAgICAgIGlmKHRoaXMuRklMVEVSU1tpXVsnbmFtZSddID09PSBmaWx0ZXIpIHtcbiAgICAgICAgICB0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10gPSBbXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5GSUxURVJTW2ldWydzZWxlY3RlZCddID0gW107XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc2hvd0NoZWNrKGZpbHRlcilcbiAgfVxuICBcbiAgY2hlY2tGaWx0ZXIodGFnLCB0YWdUeXBlKSB7XG4gICAgXG4gICAgLyogU2VsZWN0cyBjbGlja2VkIGJ1dHRvbi4qLyAgIFxuICAgIHZhciBzZWxlY3RlZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke3RhZ1R5cGV9JHt0YWd9YCk7XG4gICAgXG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdGhpcy5GSUxURVJTLmxlbmd0aDsgaSsrICkge1xuICAgICAgaWYgKCB0aGlzLkZJTFRFUlNbaV1bJ3ByZWZpeCddID09PSB0YWdUeXBlICkge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10uaW5kZXhPZih0YWcpO1xuICAgICAgICBpZiAoIGluZGV4ID49IDAgKSB7XG4gICAgICAgICAgLyogYWxyZWFkeSBzZWxlY3RlZCwgZGVzZWxlY3QgdGFnICovXG4gICAgICAgICAgdGhpcy5GSUxURVJTW2ldWydzZWxlY3RlZCddLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgdGhpcy5kZWxDbGFzc0lmUHJlc2VudChzZWxlY3RlZEJ0biwgdGhpcy5hY3RpdmVCdXR0b25DbGFzcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLyogYWRkIHRhZyB0byBzZWxlY3RlZCBsaXN0ICovXG4gICAgICAgICAgdGhpcy5GSUxURVJTW2ldWydzZWxlY3RlZCddLnB1c2godGFnKTtcbiAgICAgICAgICB0aGlzLmFkZENsYXNzSWZNaXNzaW5nKHNlbGVjdGVkQnRuLCB0aGlzLmFjdGl2ZUJ1dHRvbkNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlbENsYXNzSWZQcmVzZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5GSUxURVJTW2ldWydhbGxTZWxlY3RvciddKSwgdGhpcy5hY3RpdmVCdXR0b25DbGFzcyk7XG4gICAgICAgIHRoaXMuc2hvd0NoZWNrKHRoaXMuRklMVEVSU1tpXVsnbmFtZSddKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIC8qKlxuICAqIHNob3dDaGVjayAtIEFwcGxpZXMgXCJzaG93XCIgY2xhc3MgdG8gaXRlbXMgY29udGFpbmluZyBzZWxlY3RlZCB0YWdzXG4gICovIFxuICBzaG93Q2hlY2soZmlsdGVyLCBpc0luaXRpYWwpIHtcbiAgXG4gICAgLyogSWYgbm8gdGFncy9saWNlbnNlcyBzZWxlY3RlZCwgb3IgYWxsIHRhZ3Mgc2VsZWN0ZWQsIFNIT1cgQUxMIGFuZCBERVNFTEVDVCBBTEwgQlVUVE9OUy4gKi8gICBcbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB0aGlzLkZJTFRFUlMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBpZiggdGhpcy5GSUxURVJTW2ldWyduYW1lJ10gPT09IGZpbHRlciApIHtcbiAgICAgICAgaWYoICh0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10ubGVuZ3RoID09PSAwKSB8fCBcbiAgICAgICAgICAgICh0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10ubGVuZ3RoID09PSB0aGlzLkZJTFRFUlNbaV1bJ2J1dHRvblRvdGFsJ10pICkgXG4gICAgICAgIHsgIFxuICAgICAgICAgIHZhciBpQnRucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5GSUxURVJTW2ldWydidXR0b25DbGFzcyddKTtcbiAgICAgICAgICBmb3IgKCB2YXIgaiA9IDA7IGogPCBpQnRucy5sZW5ndGg7IGorKyApIHtcbiAgICAgICAgICAgIHRoaXMuZGVsQ2xhc3NJZlByZXNlbnQoaUJ0bnNbal0sIHRoaXMuYWN0aXZlQnV0dG9uQ2xhc3MpXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYWRkQ2xhc3NJZk1pc3NpbmcoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLkZJTFRFUlNbaV1bJ2FsbFNlbGVjdG9yJ10pLCB0aGlzLmFjdGl2ZUJ1dHRvbkNsYXNzKVxuICAgICAgICAgIHRoaXMuRklMVEVSU1tpXVsnc2VsZWN0ZWQnXSA9IFtdO1xuICAgICAgICB9XG4gICAgICB9IFxuICAgIH1cbiAgICBcbiAgICB0aGlzLnNlbGVjdGVkSXRlbUNvdW50PTA7XG4gICAgXG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdGhpcy5maWx0ZXJJdGVtcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIC8qIEZpcnN0IHJlbW92ZSBcInNob3dcIiBjbGFzcyAqL1xuICAgICAgdGhpcy5kZWxDbGFzc0lmUHJlc2VudCh0aGlzLmZpbHRlckl0ZW1zW2ldLCB0aGlzLnNob3dJdGVtQ2xhc3MpO1xuICAgICAgXG4gICAgICB2YXIgdmlzaWJpbGl0eSA9IDA7XG4gICAgICAvKiBzaG93IGl0ZW0gb25seSBpZiB2aXNpYmlsaXR5IGlzIHRydWUgZm9yIGFsbCBmaWx0ZXJzICovXG4gICAgICBmb3IgKCB2YXIgaiA9IDA7IGogPCB0aGlzLkZJTFRFUlMubGVuZ3RoOyBqKysgKSB7XG4gICAgICAgIC8qIFRPRE86IGZpbmQgYmV0dGVyIG5hbWUgZm9yICdmaWx0ZXJBbmQnICovXG4gICAgICAgIGlmICh0aGlzLkZJTFRFUlNbal1bJ2ZpbHRlckFuZCddKSB7XG4gICAgICAgICAgLyogSGF2ZSBzd2l0Y2gsIGFuZCBlbmFibGVkICovXG4gICAgICAgICAgLyogSWYgbm8gc2VsZWN0aW9uID0+IHNlbGVjdCBhbGwgKi9cbiAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSB0aGlzLkZJTFRFUlNbal1bJ3NlbGVjdGVkJ107XG4gICAgICAgICAgaWYgKHRoaXMuRklMVEVSU1tqXVsnc2VsZWN0ZWQnXS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHNlbGVjdGVkID0gW107XG5cbiAgICAgICAgICAgIHZhciBmdiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5GSUxURVJTW2pdWydidXR0b25DbGFzcyddKTtcbiAgICAgICAgICAgIGZvciggdmFyIGsgPSAwOyBrIDwgZnYubGVuZ3RoOyBrKysgKXtcbiAgICAgICAgICAgICAgdmFyIHYgPSBmdltrXS5pZC5yZXBsYWNlKHRoaXMuRklMVEVSU1tqXVtcInByZWZpeFwiXSwgJycpO1xuICAgICAgICAgICAgICBzZWxlY3RlZC5wdXNoKHYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIHRoaXMuY2hlY2tWaXNpYmlsaXR5QW5kKHNlbGVjdGVkLCB0aGlzLmZpbHRlckl0ZW1zW2ldLmdldEF0dHJpYnV0ZSh0aGlzLkZJTFRFUlNbal1bJ2F0dHJOYW1lJ10pKSApIHtcbiAgICAgICAgICAgIHZpc2liaWxpdHkrKztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCB0aGlzLmNoZWNrVmlzaWJpbGl0eSh0aGlzLkZJTFRFUlNbal1bJ3NlbGVjdGVkJ10sIHRoaXMuZmlsdGVySXRlbXNbaV0uZ2V0QXR0cmlidXRlKHRoaXMuRklMVEVSU1tqXVsnYXR0ck5hbWUnXSkpICkge1xuICAgICAgICAgICAgdmlzaWJpbGl0eSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLyogVGhlbiBjaGVjayBpZiBcInNob3dcIiBjbGFzcyBzaG91bGQgYmUgYXBwbGllZCAqL1xuICAgICAgaWYgKCB2aXNpYmlsaXR5ID09PSB0aGlzLkZJTFRFUlMubGVuZ3RoICkge1xuICAgICAgICBpZiAoICF0aGlzLmZpbHRlckl0ZW1zW2ldLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLnNob3dJdGVtQ2xhc3MpICkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtQ291bnQrKztcbiAgICAgICAgICB0aGlzLmFkZENsYXNzSWZNaXNzaW5nKHRoaXMuZmlsdGVySXRlbXNbaV0sIHRoaXMuc2hvd0l0ZW1DbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb3VudGVyU2VsZWN0b3IpKSB7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvdW50ZXJTZWxlY3RvcikudGV4dENvbnRlbnQ9YCR7dGhpcy5zZWxlY3RlZEl0ZW1Db3VudH1gO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLmNoZWNrQnV0dG9uQ291bnRzKGlzSW5pdGlhbClcbiAgICBcbiAgfVxuICBcbiAgY2hlY2tCdXR0b25Db3VudHMoaXNJbml0aWFsKXtcbiAgICB0aGlzLmZpbHRlclZhbHVlcyA9IHRoaXMuaW5pdEZpbHRlckNvdW50KHRoaXMuZmlsdGVyVmFsdWVzLCBpc0luaXRpYWwpO1xuICAgIHRoaXMucG9wdWxhdGVDb3VudGVycyh0aGlzLmZpbHRlclZhbHVlcyk7XG5cbiAgfVxuICBcbiAgXG4gIC8qKlxuICAqIGNoZWNrVmlzaWJpbGl0eSAtIFRlc3RzIGlmIGF0dHJpYnV0ZSBpcyBpbmNsdWRlZCBpbiBsaXN0LlxuICAqLyBcbiAgY2hlY2tWaXNpYmlsaXR5KGxpc3QsIGRhdGFBdHRyKSB7XG4gICAgLyogUmV0dXJucyBUUlVFIGlmIGxpc3QgaXMgZW1wdHkgb3IgYXR0cmlidXRlIGlzIGluIGxpc3QgKi8gICBcbiAgICBpZiAobGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IodmFyIHYgPSAwOyB2IDwgbGlzdC5sZW5ndGg7IHYrKyl7XG4gICAgICAgIHZhciBhcnIgPSBkYXRhQXR0ci5zcGxpdChcIiBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihlbCl7cmV0dXJuIGVsLmxlbmd0aCA+IDB9KTtcbiAgICAgICAgaWYoYXJyLmluZGV4T2YobGlzdFt2XSkgPj0wICkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZSBcbiAgICB9XG4gIH1cbiAgLyoqXG4gICogY2hlY2tWaXNpYmlsaXR5QW5kIC0gVGVzdHMgaWYgYXR0cmlidXRlcyBhcmUgaW5jbHVkZWQgaW4gbGlzdC5cbiAgKi8gXG4gIGNoZWNrVmlzaWJpbGl0eUFuZChsaXN0LCBkYXRhQXR0cikge1xuICAgIC8qIFJldHVybnMgVFJVRSBpZiBsaXN0IGlzIGVtcHR5IG9yIGFsbCBhdHRyaWJ1dGVzIGluIGxpc3QgKi8gICBcbiAgICB2YXIgZm91bmQgPSAwO1xuICAgIGlmIChsaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgIGZvcih2YXIgdiA9IDA7IHYgPCBsaXN0Lmxlbmd0aDsgdisrKXtcbiAgICAgICAgdmFyIGFyciA9IGRhdGFBdHRyLnNwbGl0KFwiIFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKGVsKXtyZXR1cm4gZWwubGVuZ3RoID4gMH0pO1xuICAgICAgICBpZihhcnIuaW5kZXhPZihsaXN0W3ZdKSA+PTAgKSB7XG4gICAgICAgICAgZm91bmQrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIChmb3VuZCA9PT0gbGlzdC5sZW5ndGgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlIFxuICAgIH1cbiAgfVxuICBhZGRDbGFzc0lmTWlzc2luZyhlbCwgY24pIHtcbiAgICBpZighZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNuKSkge1xuICAgICAgZWwuY2xhc3NMaXN0LmFkZChjbik7XG4gICAgfSBcbiAgfVxuICBcbiAgZGVsQ2xhc3NJZlByZXNlbnQoZWwsIGNuKSB7XG4gICAgaWYoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNuKSkge1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbilcbiAgICB9IFxuICB9XG5cbiAgLyogMi1SRUM6IFwiQU5EXCIgZmlsdGVyaW5nICovXG4gIHRvZ2dsZVN3aXRjaChjaGVja2JveCwgZmlsdGVyKSB7XG4gICAgZm9yKCB2YXIgaSA9IDA7IGkgPCB0aGlzLkZJTFRFUlMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmKGZpbHRlcikge1xuICAgICAgICBpZih0aGlzLkZJTFRFUlNbaV1bJ25hbWUnXSA9PT0gZmlsdGVyKSB7XG4gICAgICAgICAgdGhpcy5GSUxURVJTW2ldWydmaWx0ZXJBbmQnXSA9IGNoZWNrYm94LmNoZWNrZWQ7XG4gICAgICAgICAgdGhpcy51cGRhdGVTd2l0Y2hMYWJlbHMoY2hlY2tib3gpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLkZJTFRFUlNbaV1bJ2ZpbHRlckFuZCddID0gY2hlY2tib3guY2hlY2tlZDtcbiAgICAgICAgdGhpcy51cGRhdGVTd2l0Y2hMYWJlbHMoY2hlY2tib3gpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNob3dDaGVjayhmaWx0ZXIpXG4gIH1cblxuICB1cGRhdGVTd2l0Y2hMYWJlbHMoY2hlY2tib3gpIHtcbiAgICB2YXIgc3dpdGNoSWQgPSBjaGVja2JveC5pZDtcblxuICAgIC8qIFRPRE8oMi1SRUMpOiBBZGQgXCJBbmRcIitcIk9yXCIgbGFiZWxzIGFzIGdsb2JhbCBwYXJhbWV0ZXJzIGZvciBIVEYgKGUuZy46IFwiYW5kU3VmZml4XCIrXCJvclN1ZmZpeFwiKSAqL1xuICAgIHZhciBhbmRMYWJlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKChzd2l0Y2hJZCArIFwiQW5kXCIpKTtcbiAgICB2YXIgb3JMYWJlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKChzd2l0Y2hJZCArIFwiT3JcIikpO1xuICAgIGlmKGNoZWNrYm94LmNoZWNrZWQpe1xuICAgICAgaWYgKGFuZExhYmVsKSB7XG4gICAgICAgIHRoaXMuYWRkQ2xhc3NJZk1pc3NpbmcoYW5kTGFiZWwsIHRoaXMuYWN0aXZlQnV0dG9uQ2xhc3MpO1xuICAgICAgICB0aGlzLmFkZENsYXNzSWZNaXNzaW5nKGFuZExhYmVsLCB0aGlzLnNob3dUb2dnbGVMYWJlbENsYXNzKVxuICAgICAgfVxuICAgICAgaWYgKG9yTGFiZWwpIHtcbiAgICAgICAgdGhpcy5kZWxDbGFzc0lmUHJlc2VudChvckxhYmVsLCB0aGlzLmFjdGl2ZUJ1dHRvbkNsYXNzKTtcbiAgICAgICAgdGhpcy5kZWxDbGFzc0lmUHJlc2VudChvckxhYmVsLCB0aGlzLnNob3dUb2dnbGVMYWJlbENsYXNzKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYW5kTGFiZWwpIHtcbiAgICAgICAgdGhpcy5kZWxDbGFzc0lmUHJlc2VudChhbmRMYWJlbCwgdGhpcy5hY3RpdmVCdXR0b25DbGFzcyk7XG4gICAgICAgIHRoaXMuZGVsQ2xhc3NJZlByZXNlbnQoYW5kTGFiZWwsIHRoaXMuc2hvd1RvZ2dsZUxhYmVsQ2xhc3MpXG4gICAgICB9XG4gICAgICBpZiAob3JMYWJlbCkge1xuICAgICAgICB0aGlzLmFkZENsYXNzSWZNaXNzaW5nKG9yTGFiZWwsIHRoaXMuYWN0aXZlQnV0dG9uQ2xhc3MpO1xuICAgICAgICB0aGlzLmFkZENsYXNzSWZNaXNzaW5nKG9yTGFiZWwsIHRoaXMuc2hvd1RvZ2dsZUxhYmVsQ2xhc3MpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbndpbmRvd1snSHVnb1RhZ3NGaWx0ZXInXSA9IEh1Z29UYWdzRmlsdGVyO1xuIl19
