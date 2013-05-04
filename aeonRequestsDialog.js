(function( $ ){
  var methods = {
    init : function( options ) {
      return this.each(function(){
        var $this = $(this),
             data = $this.data('aeonRequestsDialog');

        // If the plugin hasn't been initialized yet
        if ( ! data ) {
          var settings = $.extend( {
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

            //name of form for form processing
            'form': 'EADRequest',

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

            //jqote template for dialog
            'template':'<div style="display:none"><div id="aeon_request_dialog" title="<%= this.title %>" class="aeon_request">' +
                          '<form method="POST" action="<%= this.url %>" id="aeon_request_form">' +
                            '<input name="AeonForm" type="hidden" value="<%= this.AeonForm %>"/>' +
                            '<input name="RequestType" type="hidden" value="<%= this.RequestType %>" id="aeon_request_RequestType" />' +
                            '<% for (var x=0; x < this.globalFields.length; x++ ) { %>' +
                              '<input name="<%= this.globalFields[x].name %>" type="hidden" value="<%= this.globalFields[x].value %>" />' +
                            '<% } %>' +
                            '<% if ( this.header ) { %>' +
                              '<div class="aeon_request_header"><%= this.header %></div>' +
                            '<% } %>' +
                            '<div id="aeon_request_items"></div>' +
                            '<% if ( this.copyOption ) { %>' +
                              '<div class="copy_opt">' +
                                '<div id="aeon_request_copy_opt" class="request_inputs">' +
                                  '<input type="checkbox" id="aeon_request_copy" value="Yes"/>' +
                                '</div>' +
                                '<div class="requestDesc"><label for="aeon_request_copy"><span class="label"><%= this.copyLabel %></span></label></div>' +
                                '<% if ( this.copyMessage ) { %>' +
                                  '<div class="requestDesc"><%= this.copyMessage %></div>' +
                                '<% } %>' +
                              '</div>' +
                            '<% } %>' +
                            '<% if ( this.notes ) { %>' +
                              '<div class="notes">' +
                                '<% if ( this.notesMessage ) { %>' +
                                  '<label for="Notes"><span class="label"><%= this.notesMessage %></span></label><br/>' +
                                '<% } %>' +
                                '<textarea name="Notes" cols="60" rows="4"></textarea>' +
                              '</div>' +
                            '<% } %>' +
                            '<div class="rev_sched_opt">' +
                              '<input type="radio" name="UserReview" id="scheduled_date_radio" class="schedule_opt" value="No" checked="checked"/>' +
                            '</div>' +
                            '<div class="scheduled_date">' +
                              '<label for="scheduled_date_radio"><span class="label"><%= this.scheduledDateLabel %></span></label><br/>' +
                              '<input type="text" id="datepicker"/>' +
                            '</div>' +
                            '<div class="rev_sched_opt">' +
                              '<input type="radio" name="UserReview" id="user_review_radio" value="Yes" class="schedule_opt"/>' +
                            '</div>' +
                            '<div class="review disabled">' +
                              '<label for="user_review_radio"><%= this.userReviewLabel %></label>' +
                            '</div>' +
                            '<div class="buttons">' +
                              '<% if ( this.buttonsMessage ) { %>' +
                                '<div class="requestDesc"><%= this.buttonsMessage %></div>' +
                              '<% } %>' +
                              '<input name="SubmitButton" type="submit" value="Submit Request" id="dialog_submit_button" />' +
                              '<input type="reset" value="Cancel" id="dialog_reset_button" />' +
                            '</div>' +
                            '<% if ( this.footer ) { %>' +
                              '<div class="aeon_footer"><%= this.footer %></div>' +
                            '<% } %>' +
                          '</form>' +
                        '</div></div>',

            //jqote template for items
            'items_template':'<div>' +
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
            'items_attachpoint_selector': '#aeon_request_items',

            //dialog title
            'title': 'Confirm your request',

            //header message
            'header': '',

            //include notes?
            'notes': true,

            //notes message
            'notesMessage': 'Please include any notes that might help us identify the specific items requested or any other pertinent information:',

            //scheduled date label
            'scheduledDateLabel': 'Scheduled Date',

            //user review message
            'userReviewLabel': 'Keep this request saved in your account for later review. It will not be sent to Libraries staff for fulfilment.',

            //buttons message
            'buttonsMessage': '',

            //footer messgae
            'footer': '<i>* Requested items will be grouped by container in the Aeon system.</i>',

            //copy options
            'copyOption': false,
            'copyLabel': 'Requesting Duplication of Material',
            'copyMessage': '',

            //submit hook
            'onSubmit': function(){return true;},

            //selector of button used to show dialog
            'submitButtonSelector': '.aeon_submit',

            //checkbox selector
            'checkboxSelector': '.aeon_check',

            //initialize the dialog's events and widgets and other custom code
            initDialog: function (){
              $('#datepicker').datepicker({minDate:0}).val($.datepicker.formatDate('mm/dd/yy',new Date()));

              $('#aeon_request_copy').on( 'change.aeonRequestsDialog', function(){
                if ( this.checked ) {
                  $('#aeon_request_RequestType').val('Copy');
                } else {
                  $('#aeon_request_RequestType').val('Loan');
                }
              });

              $('.schedule_opt').on( 'change.aeonRequestsDialog', function() {
                if ( this.checked && this.value === 'Yes' ) {
                  $('#datepicker').prop('disabled','disabled');
                  $('.scheduled_date').addClass('disabled');
                  $('.review').removeClass('disabled');
                } else {
                  $('#datepicker').prop('disabled','');
                  $('.scheduled_date').removeClass('disabled');
                  $('.review').addClass('disabled');
                }
              });

              $('#dialog_reset_button').on('click.aeonRequestsDialog', function(){
                $('#aeon_request_dialog').dialog('close');
                settings.items[0].fields[0].label = 'new name';
                $this.data('aeonRequestsDialog', {settings:settings})
              });
            },

            destroyDialog: function (){
              $('#datepicker').datepicker('destroy');
            }

          }, options);

          $(settings.submitButtonSelector).on('click.aeonRequestsDialogMain', function (e) {
            e.preventDefault();
            e.stopPropagation();
            methods['show'].apply($this, []);
          });

          $(this).data('aeonRequestsDialog', {
            target : $this,
            settings: settings
          });

        }
      });
    },
    destroy : function() {
      return this.each(function(){
        var $this = $(this),
             data = $this.data('aeonRequestsDialog');

        $(window).off('.aeonRequestsDialogMain');
        $this.removeData('aeonRequestsDialog');
      })
    },
    _onSubmit: function(){
      return this.data('aeonRequestsDialog').settings.onSubmit();
    },
    show : function() {
      return this.each(function(){
        var $this = $(this),
             data = $this.data('aeonRequestsDialog');
        var settings = data.settings;

        //get data from form
        if ( settings.datasource === 'form' ) {

        }

        //expand templates
        $('#dialog_wrapper').jqotesub(settings.template, settings);
        $(settings.items_attachpoint_selector).jqotesub(settings.items_template,settings);

        //setup dialog TODO - settings for min/max width/height
        $('#aeon_request_dialog').dialog({modal:true, minWidth: 850,autoOpen:false,
                                         close: function(){ settings.destroyDialog(); $(window).off('.aeonRequestsDialog'); $('#aeon_request_dialog').dialog('destroy'); } });
        settings.initDialog();

        $('#aeon_request_dialog').dialog('open');
      });
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
