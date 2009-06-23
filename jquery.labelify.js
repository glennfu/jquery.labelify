/**
 * jQuery.labelify - Display in-textbox hints
 * Stuart Langridge, http://www.kryogenix.org/
 * Released into the public domain
 * Date: 25 June 2008
 * Last update: 23 June 2009
 * @author Stuart Langridge
 * @author Garrett LeSage
 * @author Glenn Sidney
 * @version 2.0.1
 */

/**
 * Defaults to taking the in-field label from the field's title attribute
 * @example jQuery("input").labelify();
 * @param {object|string} [settings] optional parameters to pass
 * @config {string} [text] "title" to use the field's title attribute (default),
 *                         "label" to use its <label> (for="fieldid" must be specified)
 * @config {string} [labeledClass] class applied to the field when it has label text
 *
 * @example jQuery('input').labelify('hasLabel'); // return true if the field has a label
 */
jQuery.fn.labelify = function(settings) {
  // if the element has a label, return true when 'hasLabel' is passed as an arg
  if (typeof settings === 'string' && settings === 'hasLabel') {
    return jQuery(this).data('hasLabel');
  }

  settings = jQuery.extend({
    text: 'title',
    labeledClass: ''
  }, settings);

  // Compatibility with version 1.3 and prior (double-ls)
  if (settings.labelledClass) { settings.labeledClass = settings.labelledClass; }

  var showLabel, hideLabel,
      lookups, lookup,
      $labelified_elements;

  lookups = {
    title: function(input) {
      return jQuery(input).attr('title');
    },
    label: function(input) {
      return jQuery("label[for=" + input.id +"]").text();
    }
  };

  $labelified_elements = jQuery(this);

  showLabel = function(el){
    jQuery(el).addClass(settings.labeledClass).data('hasLabel', true);
    el.value = jQuery(el).data("label");
  };
  hideLabel = function(el){
    el.value = el.defaultValue;
    jQuery(el).removeClass(settings.labeledClass).data('hasLabel', false);
  };

  return jQuery(this).each(function() {
    var $item = jQuery(this),
        removeValuesOnExit;

    if (typeof settings.text === 'string') {
      lookup = lookups[settings.text]; // what if not there?
    } else {
      lookup = settings.text; // what if not a fn?
    }

    // bail if lookup isn't a function or if it returns undefined
    if (typeof lookup !== "function" || !lookup(this)) { return; }

    $item.bind('focus.label',function() {
      if (this.value === jQuery(this).data("label")) { hideLabel(this); }
    }).bind('blur.label',function(){
      if (this.value === this.defaultValue) { showLabel(this); }
    }).data('label',lookup(this).replace(/\n/g,'')); // strip label's newlines
    
    removeValuesOnExit = function() {
      $labelified_elements.each(function(){
        if (this.value === jQuery(this).data("label")) { hideLabel(this); }
      });
    };
    
    $item.parents("form").submit(removeValuesOnExit);
    jQuery(window).unload(removeValuesOnExit);
    
    if (this.value !== this.defaultValue) {
      // user started typing; don't overwrite his/her text!
      return;
    }

    // set the defaults
    showLabel(this);
  });
};
