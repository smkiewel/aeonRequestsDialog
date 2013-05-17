(function( $ ){
  "use strict";
  var methods = {
    init : function( options ) {
      var $this = this, data = this.data('aeonRequestsDialog'), settings;

      // If the plugin hasn't been initialized yet
      if ( ! data ) {
        settings = $.extend( {
          //dialog id
          'dialogId': 'aeon_request_dialog',

          'useDefaultBindings': true,

          'compressRequests': false,
          'compressRequestsField': 'ItemNumber',

          //aeon url
          'url': '',

          //'AeonForm' value holder
          //assume needed by dll?
          'AeonForm': 'EADRequest',

          //loan or copy
          'RequestType': 'Loan',

          //sets source of data for dialog
          //three possible values:
          //  1) form: use default form processing
          //  2) json: use default json processsing
          //  3) custom: provide custom data processing
          'datasource': 'form',

          //fields common to all requests
          'globalFields': [],

          //fields for individual items
          'itemFields': [],

          //items
          'items': [],

          //function to determine url for json response
          'json_url': null,

          //callback for json response
          'json_callback': null,

          //args to be passed as the content of the json request
          'json_content':null,

          'custom_callback': null,

          //jqote template for dialog
          'template':'<form method="POST" action="<%= this.url %>" class="aeon_request_form" target="_self" name="<%= this.AeonForm %>">' +
                        '<input name="AeonForm" type="hidden" value="<%= this.AeonForm %>"/>' +
                        '<input name="RequestType" type="hidden" value="<%= this.RequestType %>" />' +
                        '<input name="SubmitButton" value="Submit Request" type="hidden" />' +
                        '<% for (var x=0; x < this.globalFields.length; x++ ) { %>' +
                          '<input name="<%= this.globalFields[x].name %>" type="hidden" value="<%= this.globalFields[x].value %>" />' +
                        '<% } %>' +
                        '<% if ( this.header ) { %>' +
                          '<div class="aeon_request_header"><%= this.header %></div>' +
                        '<% } %>' +
                        '<div class="aeon_request_items"></div>' +
                        '<% if ( this.includeSimpleCopyOption ) { %>' +
                          '<div class="simple_copy_opt">' +
                            '<% if ( this.simpleCopyMessage ) { %>' +
                              '<div class="simple_copy_message message"><%= this.simpleCopyMessage %></div>' +
                            '<% } %>' +
                            '<div class="request_inputs">' +
                              '<input type="checkbox" class="copy_check" value="Yes"/>' +
                            '</div>' +
                            '<div class="requestDesc"><label for="aeon_request_copy"><span class="label"><%= this.simpleCopyLabel %></span></label></div>' +
                          '</div>' +
                        '<% } %>' +
                        '<% if ( this.includeAdvancedCopyOptions ) { %>' +
                          '<div class="advanced_copy_opt">' +
                            '<% if ( this.advancedCopyMessage ) { %>' +
                              '<div class="adv_copy_message message"><%= this.advancedCopyMessage %></div>' +
                            '<% } %>' +
                            '<div class="adv_copy_element">' +
                              '<label for="Format" class="label"><%= this.formatLabel %></label>' +
                              '<select name="Format" class="adv_copy_select">' +
                                '<% for ( var x=0; x < this.formatOptions.length; x++ ) { %>' +
                                  '<% var o = this.formatOptions[x]; %>' +
                                  '<% if ( typeof o === "object" ) { %>' +
                                    '<option value="<%= o.value %>"><%= o.label %></option>'+
                                  '<% } else { %>' +
                                    '<option><%= o %></option>'+
                                  '<% } %>' +
                                '<% } %>' +
                              '</select>' +
                            '</div>' +
                            '<div class="adv_copy_element">' +
                              '<label for="ServiceLevel" class="label"><%= this.serviceLevelLabel %></label>' +
                              '<select name="ServiceLevel" class="adv_copy_select">' +
                                '<% for ( var x=0; x < this.serviceLevelOptions.length; x++ ) { %>' +
                                  '<% var o = this.serviceLevelOptions[x]; %>' +
                                  '<% if ( typeof o === "object" ) { %>' +
                                    '<option value="<%= o.value %>"><%= o.label %></option>'+
                                  '<% } else { %>' +
                                    '<option><%= o %></option>'+
                                  '<% } %>' +
                                '<% } %>' +
                              '</select>' +
                            '</div>' +
                            '<div class="adv_copy_element">' +
                              '<label for="ShippingOption" class="label"><%= this.shippingOptionLabel %></label>' +
                              '<select name="ShippingOption" class="adv_copy_select">' +
                                '<% for ( var x=0; x < this.shippingOptions.length; x++ ) { %>' +
                                  '<% var o = this.shippingOptions[x]; %>' +
                                  '<% if ( typeof o === "object" ) { %>' +
                                    '<option value="<%= o.value %>"><%= o.label %></option>'+
                                  '<% } else { %>' +
                                    '<option><%= o %></option>'+
                                  '<% } %>' +
                                '<% } %>' +
                              '</select>' +
                            '</div>' +
                            '<div class="adv_copy_element">' +
                              '<label for="ForPublication" class="label"><%= this.forPublicationLabel %></label>' +
                              '<input name="ForPublication" type="checkbox" value="Yes">' +
                            '</div>' +
                          '</div>' +
                        '<% } %>' +
                        '<% if ( this.includeNotes ) { %>' +
                          '<div class="notes">' +
                            '<% if ( this.notesMessage ) { %>' +
                              '<label for="Notes" class="notes_message message"><%= this.notesMessage %></label><br/>' +
                            '<% } %>' +
                            '<textarea name="Notes" cols="60" rows="4"></textarea>' +
                          '</div>' +
                        '<% } %>' +
                        '<% if (this.includeScheduledDate) { %>' +
                          '<div class="scheduled_date_options">'+
                            '<% if ( this.scheduledDateMessage ) { %>' +
                              '<div class="scheduled_date_message message"><%= this.scheduledDateMessage %></div>' +
                            '<% } %>' +
                            '<div class="rev_sched_opt">' +
                              '<input type="radio" name="UserReview" class="schedule_opt scheduled_date_radio" value="No" checked="checked"/>' +
                            '</div>' +
                            '<div class="scheduled_date">' +
                              '<label for="scheduled_date_radio"><span class="label"><%= this.scheduledDateLabel %></span></label><br/>' +
                              '<input type="text" class="datepicker"  name="ScheduledDate"/>' +
                            '</div>' +
                            '<div class="rev_sched_opt">' +
                              '<input type="radio" name="UserReview" value="Yes" class="schedule_opt user_review_radio"/>' +
                            '</div>' +
                            '<div class="review disabled">' +
                              '<label for="user_review_radio"><%= this.userReviewLabel %></label>' +
                            '</div>' +
                          '</div>' +
                        '<% } %>' +
                        '<div class="buttons">' +
                          '<% if ( this.buttonsMessage ) { %>' +
                            '<div class="buttonMessage message"><%= this.buttonsMessage %></div>' +
                          '<% } %>' +
                          '<input type="submit" value="<%= this.submitButtonLabel %>" class="dialog_submit"/>' +
                          '<input type="reset" value="<%= this.cancelButtonLabel %>" class="dialog_cancel"/>' +
                        '</div>' +
                        '<% if ( this.footer ) { %>' +
                          '<div class="aeon_footer"><%= this.footer %></div>' +
                        '<% } %>' +
                      '</form>',

          //jqote template for items
          'items_template': '<div>' +
                              '<% for ( var x=0; x < this.items.length; x++ ) { %>' +
                                '<div class="requestItem" style="clear:both">' +
                                  '<div class="request_inputs">' +
                                    '<input type="checkbox" name="Request" value="<%= x %>" checked="checked"/>' + "\n" +
                                    '<% for ( var y=0; y < this.items[x].fields.length; y++ ){ %>' +
                                      '<input type="hidden" name="<%= this.items[x].fields[y].name %>_<%= x %>" value="<%= this.items[x].fields[y].value %>">' +
                                    '<% } %>' +
                                  '</div>' + "\n" +
                                  '<% for ( var y=0; y < this.items[x].fields.length; y++ ){ %>' +
                                    '<% if ( this.items[x].fields[y].label ) { %>' +
                                      '<div class="requestDesc"><span class="label"><%= this.items[x].fields[y].label %>:</span> <%= this.items[x].fields[y].value %></div>' +
                                    '<% } %>' +
                                  '<% } %>' +
                                '</div>' + "\n" +
                              '<% } %>' + "\n" +
                            '</div>',

          //selector for attachpoint of items
          'items_attachpoint_selector': '.aeon_request_items',

          //dialog title
          'title': 'Confirm your request',

          //header message
          'header': '',

          //include notes?
          'includeNotes': true,

          //notes message
          'notesMessage': 'Please include any notes that might help us identify the specific items requested or any other pertinent information:',

          'includeScheduledDate':true,

          'scheduledDateMessage':'',

          //scheduled date label
          'scheduledDateLabel': 'Scheduled Date',

          //user review message
          'userReviewLabel': 'Keep this request saved in your account for later review. It will not be sent to Libraries staff for fulfilment.',

          //buttons message
          'buttonsMessage': '',

          'submitButtonLabel':'Submit Request',
          'cancelButtonLabel': 'Cancel Request',

          //footer messgae
          'footer': '',

          //simple copy options
          'includeSimpleCopyOption': false,
          'simpleCopyLabel': 'Requesting Duplication of Material',
          'simpleCopyMessage': '',

          //advanced copy options
          'includeAdvancedCopyOptions':false,
          'advancedCopyMessage': '',
          'formatLabel': 'Format',
          'formatOptions': [ 'Photocopy', 'Scan (DVD/CD)', 'Scan (Electronic Delivery)' ],
          'serviceLevelLabel': 'Intended Use',
          'serviceLevelOptions':['Advertisement (Commercial)', 'Advertisement (PSA)', 'Educational Use', 'Government', 'Live Presentation', 'Museum Use', 'Non Profit', 'Personal Use', 'Preservation Use'],
          'shippingOptionLabel': 'Shipping Option',
          'shippingOptions': ['Download/FTP (User Provided)', 'Download/FTP (Institution Provided)', 'Pick up Onsite', 'Fed Ex (User Account)', 'UPS (User Account)', 'USPS (First Class)', 'USPS (Overseas)' ],
          'forPublicationLabel': 'For Publication',

          //selector of button used to show dialog
          'submitButtonSelector': '.aeon_submit',

          'minWidth': 750,

          //event hooks
          'createDialog': function(){return this;},
          'destroyDialog': function (){return this;},
          'onSubmit': function(){return true;},

          //id of form for form processing
          'form': 'EADRequest',

          //selector for checked items
          'checkedItemSelector':'input[name="Request"]:checked',


          'cleanValues': function(s){
            return s.replace(/^\s*/, "").replace(/\s*$/,'');
          },

          'stripUnchecked': true,

        }, options);

        if ( settings.includeAdvancedCopyOptions ) {
          settings.RequestType = 'Copy';
        }
        $(settings.submitButtonSelector).on('click.aeonRequestsDialogMain', function (e) {
          e.preventDefault();
          e.stopPropagation();
          methods.show.apply($this, null);
        });

        $(this).data('aeonRequestsDialog', {
          settings: settings
        });

        $('body').jqoteapp('<div style="display:none"><div id="<%= this.dialogId %>" title="<%= this.title %>" class="aeon_request"></div></div>',settings);
      } else {
        console.log( "aeonRequestsDialog already initialized" );
      }

      return this;
    },
    show : function() {
      var settings = this.data('aeonRequestsDialog').settings, $this = this;

      //get data from form
      if ( settings.datasource === 'form' ) {
        methods._processForm.apply(this,null);
        methods._showDialog.apply(this,null);
      }

      if ( settings.datasource === 'json' ) {
        $.getJSON(settings.json_url, settings.json_content,function(data){
          var o = settings.json_callback(data);
          if ( o ){
            methods.options.apply($this,[o]);
            methods._showDialog.apply($this,null);
          }
        });
      }

      if ( settings.datasource === 'custom') {
        var o = settings.custom_callback();
        if ( o ){
          methods.options.apply($this,[o]);
          methods._showDialog.apply($this,null);
        }
      }
    },
    _showDialog: function(){
      var settings = this.data('aeonRequestsDialog').settings,
        $this = this,
        $dialog = $('#'+ settings.dialogId),
        opts = {
          modal:true,
          autoOpen:false,
          close: function(){
            if ( settings.useDefaultBindings ) {
              methods._defaultDestroyDialog.apply($this,null);
            }
            settings.destroyDialog();
            $(window).off('.aeonRequestsDialog');
            $dialog.dialog('destroy');
            $dialog.html('');
          }
        },
        f = [ 'height','width'],
        f2 = [ 'min', 'max' ];

      $dialog.jqotesub(settings.template, settings);
      $('#' + settings.dialogId + " " + settings.items_attachpoint_selector).jqotesub(settings.items_template,settings);

      //setup dialog
      for (var x=0;x < 2; x++) {
        if (settings[f[x]]) {
          opts[f[x]] = settings[f[x]];
          continue;
        }
        for (var y=0;y<2;y++) {
          var s = f2[y] + f[x].charAt(0).toUpperCase() + f[x].slice(1);
          if (settings[s]) {
            opts[s] = settings[s];
          }
        }
      }
      $dialog.dialog(opts);
      if ( settings.useDefaultBindings ) {
        methods._defaultCreateDialog.apply(this,null);
      }
      settings.createDialog();
      $dialog.dialog('open');

      return this;
    },
    _defaultCreateDialog: function (){
      var $this = this;
      var settings = this.data('aeonRequestsDialog').settings;
      var idSelector = '#' + settings.dialogId;
      $( idSelector +  ' .datepicker').datepicker({minDate:0}).val($.datepicker.formatDate('mm/dd/yy',new Date()));

      if ( settings.includeSimpleCopyOption ) {
        $(idSelector + ' .copy_check').on( 'change.aeonRequestsDialog' + idSelector, function(){
          if ( this.checked ) {
            $( idSelector + ' input[name="RequestType"]').val('Copy');
          } else {
            $( idSelector + ' input[name="RequestType"]').val('Loan');
          }
        });
      }

      if ( settings.includeScheduledDate ) {
        $( idSelector + ' .schedule_opt').on( 'change.aeonRequestsDialog' + idSelector, function() {
          if ( this.checked && this.value === 'Yes' ) {
            $(idSelector + ' .datepicker').prop('disabled','disabled');
            $(idSelector + ' .scheduled_date').addClass('disabled');
            $(idSelector + ' .review').removeClass('disabled');
          } else {
            $(idSelector + ' .datepicker').prop('disabled','');
            $(idSelector + ' .scheduled_date').removeClass('disabled');
            $(idSelector + ' .review').addClass('disabled');
          }
        });
      }

      $(idSelector + ' .dialog_submit').on('click.aeonRequestsDialog' + idSelector,function(e){
        e.preventDefault();
        e.stopPropagation();
        if ( $(idSelector+' ' + settings.checkedItemSelector).length == 0 ) {
          return;
        }

        if ( !settings.onSubmit() ) {
          return;
        }

        $('div.ui-widget-overlay').remove();
        $('div.ui-dialog').css('display','none');

        if ( settings.stripUnchecked ) {
          methods._stripUnchecked.apply($this,null);
        }

        if ( settings.compressRequests ) {
          methods._compressRequests.apply($this,null);
        }

        $(idSelector+ ' .aeon_request_form').submit();
      });

      $( idSelector + ' .dialog_cancel').on('click.aeonRequestsDialog' + idSelector, function(){
        $(idSelector).dialog('close');
      });
    },
    _defaultDestroyDialog: function (){
      var settings = this.data('aeonRequestsDialog').settings;
      $('#' + settings.dialogId + ' .datepicker').datepicker('destroy');
      $(window).off('.aeonRequestsDialog#'+settings.dialogId);
    },
    '_processForm': function (){
      var settings = this.data('aeonRequestsDialog').settings;
      settings.items = [];
      $(settings.checkedItemSelector).each(function(){
        var id = $(this).val();
        var i = { 'fields': [] };
        for (var x=0;x<settings.itemFields.length;x++) {
          var f = {
            'name':settings.itemFields[x].name,
            'label':settings.itemFields[x].label,
            'value': settings.cleanValues(document.forms[settings.form][settings.itemFields[x].name + '_' + id ].value )
          };
          i.fields.push(f);
        }
        settings.items.push(i);
      });

      for( var x=0; x<settings.globalFields.length; x++){
        settings.globalFields[x].value = settings.cleanValues( document.forms[settings.form][settings.globalFields[x].name].value );
      }

      this.data('aeonRequestsDialog', { settings: settings });
    },
    _compressRequests: function(){
      var settings = this.data('aeonRequestsDialog').settings;
      var codes = {};
      var idSelector = '#'+settings.dialogId;
      var fieldName = settings.compressRequestsField;
      var requestsSelector = idSelector+' ' + settings.checkedItemSelector;
      var requests = $(requestsSelector);
      var newReqNum = requests.length;

      requests.each( function(){
        var requestNumber = $(this).val();
        var collapseFieldValue = $(idSelector + ' input[name="'+fieldName + '_' + requestNumber +'"]').val();
        if ( !codes[collapseFieldValue] ) {
          codes[collapseFieldValue] = new Array();
        }
        codes[collapseFieldValue].push(requestNumber);
      });

      for (var code in codes) {
        var requestNumbers = codes[code];
        if ( requestNumbers.length < 2 ) {
          continue;
        }

        var newRequest = {};
        for ( var x=0;x < settings.itemFields.length;x++) {
          var field = settings.itemFields[x].name;
          for (var y=0;y < requestNumbers.length; y++) {
            var key = requestNumbers[y];
            var oldField = $(idSelector + ' input[name="'+field + '_' + key +'"]');
            if (!oldField) {
              continue;
            }
            var oldVal = oldField.val();
            if (!newRequest[field]) {
              newRequest[field] = oldVal;
            } else if ( newRequest[field] != oldVal) {
              newRequest[field] += "; " + oldVal;
            }
            oldField.remove();
            $('input[name="Request"][value="' + key + '"]').remove();
          }
        }
        $('<input/>').prop('type','hidden').prop('name','Request').val(newReqNum).appendTo(idSelector+ ' .aeon_request_form' );
        for ( var field in newRequest ) {
          $('<input/>').prop('type','hidden').prop('name',field + '_' + newReqNum).val(newRequest[field]).appendTo(idSelector+ ' .aeon_request_form' );
        }
        newReqNum++;
      }
    },
    _stripUnchecked: function(){

    },
    options: function(){
      var settings = this.data('aeonRequestsDialog').settings;
      if (arguments.length === 0) {
        return settings;
      }

      else if (arguments.length === 1) {
        if (typeof arguments[0] === "object" ) {
          settings = $.extend(settings,arguments[0]);
        }
        else if (typeof arguments[0] === "string" ) {
          if ( undefined === settings[arguments[0]] ) {
            console.log("Unknown key sent to arguments.");
            return null;
          }
          return settings[arguments[0]];
        }
        else {
          console.log("Argument to options must be of type Object or String");
          return null;
        }
      }

      else if ( arguments.length === 2) {
        settings[arguments[0]] = arguments[1];
      }

      else {
        console.log("Illegal number of arguments sent to options.");
        return null;
      }

      this.data('aeonRequestsDialog', {settings:settings});
      return settings;
    },
    destroy : function() {
      var data = this.data('aeonRequestsDialog');

      $(window).off('.aeonRequestsDialogMain');
      $this.removeData('aeonRequestsDialog');
      return this;
    }
  };

  $.fn.aeonRequestsDialog = function( method ) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.aeonRequestDialog' );
      return null;
    }
  };
})( jQuery );
