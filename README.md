# aeonRequestsDialog

## Summary

aeonRequestsDialog is a highly configurable jQuery plugin that displays a
confirmation dialog for requests in the Aeon system. It contains a template that
is both highly configurable and completely overridable. It also provides some
convenience functionality like combining requests, automatically parsing form
data, or adding advanced copy options. aeonRequestsDialog uses jQueryUI for
display elements and the jqote2 javascript template library (included in zip for
convenience) for the templates.

aeonRequestsDialog has three primary modes of operation, determined by the
datasource property, which define how the data the dialog requires is acquired.
The three modes are 'form', which reads values from an html form; 'json', which
uses ajax to fetch a json object; and 'custom', which relies on the developer
to provide the data directly. Each mode is described in more detail below. The
dialog can have both regular item fields, as well as global fields that apply
to all items in a request, e.g. 'Site'.

## Basic Installation

1.  Determine which type of datasource you wish to use and make the necessary
    preparations. See below for more details.

2.  Unpack the zip file and copy aeonRequestsDialog.min.js and
    jquery.jqote2.min.js to the location you wish to serve javascript files
    from, then copy aeonRequestsDialog.css to the location you wish to serve css
    files from.

3.  Add necessary stylesheets and code libraries. I recommend using CDNs where
    available.

    In the head of your document, add

        <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/themes/smoothness/jquery-ui.css" />
        <link rel="stylesheet" href="path/to/aeonRequestsDialog.css" />

    At the end of the body, add

        <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
        <script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js"></script>
        <script src="path/to/jquery.jqote2.min.js"></script>
        <script src="path/to/aeonRequestsDialog.min.js"></script>

4.  Configure settings and startup dialog. This will create the dialog and bind
    the show action to the button.

        var settings = { ... };
        $('#id_of_submit_button').aeonRequestsDialog(settings);

    Most settings have reasonable defaults, but be sure and set 'url', which is
    the the url to the Aeon DLL. Other mandatory settings can be found in the
    individual mode section.

## Modes

### Form

Form mode is the default mode of operation. It gathers data from an html form
and prepares it for use by the dialog. Specifically, it gathers data from a form
that matches the EADRequest form designed for the Aeon system. The plugin
assumes the following default form structure:

    <form id="EADRequest" name="EADRequest" url="url_to_aeon_dll" method="POST">
      <!-- global fields that apply to all requests -->
      <input type="hidden" name="globalField1" value="globalValue1"/>
      <input type="hidden" name="globalField2" value="globalValue2"/>
      ...
      <input type="hidden" name="globalFieldLast" value="globalValueLast"/>

      <!-- item 1 -->
      <input name="Request" value="some_unique_identifier" type="checkbox" id="Request_some_unique_identifier" />
      <input type="hidden" name="itemField1_some_unique_identifier" value="itemField1Value" />
      <input type="hidden" name="itemField2_some_unique_identifier" value="itemField2Value" />
      ...
      <input type="hidden" name="itemFieldLast_some_unique_identifier" value="itemFieldLastValue" />
      <label for="Request_some_unique_identifier">Item1 Label</label>

      <!-- item 2 -->
      <input name="Request" value="some_unique_identifier" type="checkbox" id="Request_some_unique_identifier2" />
      <input type="hidden" name="itemField1_some_unique_identifier2" value="itemField1Value" />
      <input type="hidden" name="itemField2_some_unique_identifier2" value="itemField2Value" />
      ...
      <input type="hidden" name="itemFieldLast_some_unique_identifier2" value="itemFieldLastValue" />
      <label for="Request_some_unique_identifier2">Item2 Label</label>

      <input type="submit" id="aeon_submit" class="aeon_submit" value="Submit Request" />
    </form>


When configuring the dialog for use with forms, be sure and check the following:

* You MUST, at a minimum, provide the list of item fields to be processed, using
  the itemFields setting. This setting takes an array of objects in the
  following form:

        ...
        itemFields: [
          {
            'name': 'FieldName1',
            'label': 'FieldLabel1'
          },
          {
            'name': 'FieldName2',
            'label': 'FieldLabel2'
          },
          ...
        ],
        ...

  'name' refers to name attribute of the hidden form element minus the unique
  identifier, e.g. 'ItemTitle' would refer to the input with a name like
  'ItemTitle_0'.

  'label' refers to the label that will be displayed on the dialog. If you do
  not provide a label, that field will not be displayed on the dialog, but it
  WILL still be submitted to the Aeon system.

* In addition, you may specify a number of global fields that apply to every
  request, e.g. 'Site' or 'Location'. These fields will be read from the hidden
  fields at the top of the form, but you can also supply default values when you
  define the fields, like so:

        ...
        globalFields: [
          {
            'name': 'GlobalField1'
          },
          {
            'name': 'GlobalField2',
            'value': 'defaultValue'
          }
        ],
        ...

* The submit button in the form should be the button used when initializing the
  plugin.

* If the id of your form differs, be sure and set the 'form' attribute to your
  form id.

* If you have renamed the checkboxes on the form, be sure and set
  'checkedItemSelector' to the appropriate new selector. E.g., if you changed
  your checkboxes to 'NewRequestName', 'checkedItemSelector' should be set to
  'input[name="NewRequestName"]:checked'. Note the ':checked' - the processing
  assumes the result of calling $(checkedItemSelector) will only
  contain requests to include.

### JSON

JSON processing assumes that the data will be accessed through a JSON object
acquired through an ajax call. When configuring the dialog for use with JSON,
be sure and check the following:

* 'datasource' must be set to 'json'

* 'json_url' must be set to the url to access the JSON. Query parameters should
  be included in the 'json_content' field.

* 'json_callback' must be set to a function that will transform the result of
  the json call into the expected data format and return that object. The
  returned object must conform to the following format:

        {
          globalFields: [
            {
              'name': 'GlobalField1',
              'value': 'GlobalValue1'
            },
            {
              'name': 'GlobalField2',
              'value': 'GlobalValue2'
            },
            ...
          ],
          items : [
            {
              'name': 'FieldName1',
              'label': 'FieldLabel1',
              'value': 'FieldValue1',
            },
            {
              'name': 'FieldName2',
              'label': 'FieldLabel2',
              'value': 'FieldValue2',
            },
            ...
          ]
        }

  As with form processing, if 'label' is omitted, the field will not be
  displayed but will be included in form submission.

  If a null (or other 'falsey') value is returned from this function, the dialog
  will not be shown.

* 'json_content' holds any additional query args needed to be passed to
  'json_url' and is a key-value object, e.g.:

        {
          'isAeon': 1,
          'showJSON': 1
        }

### Custom

Custom processing is an advanced mode for users for whom the form and json
processing is inadequate. It allows users to define their own datasource
completely, whether the data's ultimate source is a static object on the page,
the result of some function calls, or another, more exotic method. This is
accomplished by defining a callback to get the data. This function must return
an object in the same format as required from the json processing above, and,
like json processing, if the returned object is a null, the dialog is not
displayed.

If you need custom processing, be sure and set the following:

* 'datasource' needs to be set to 'custom'

* 'custom_callback' - function that fetches, builds, or otherwise readies the
  data for use by the dialog. Must return an object in the following format:

        {
          globalFields: [
            {
              'name': 'GlobalField1',
              'value': 'GlobalValue1'
            },
            {
              'name': 'GlobalField2',
              'value': 'GlobalValue2'
            },
            ...
          ],
          items : [
            {
              'name': 'FieldName1',
              'label': 'FieldLabel1',
              'value': 'FieldValue1',
            },
            {
              'name': 'FieldName2',
              'label': 'FieldLabel2',
              'value': 'FieldValue2',
            },
            ...
          ]
        }

  As with form processing, if 'label' is omitted, the field will not be
  displayed but will be included in form submission.

  If a null (or other 'falsey') value is returned from this function, the dialog
  will not be shown.

## UI and Behavior extras

This plugin has some extra behaviors and UI elements available for use.

* Notes field: by default, a textarea for notes is added with a customizable
  message. To disable, set 'includeNotes' to false. To customize the message,
  set 'notesMessage' to the desired message.

* Scheduled date: by default, a radio group is added to the dialog for
  scheduling the date of desired request fulfillment or for saving in the user's
  Aeon account. This includes a jQueryUI datepicker for choosing the date. The
  message for the option of choosing a date can be set with
  'scheduledDateMessage', and the message for user review can be set with
  'userReviewMessage'. To disable, set 'includeScheduledDate' to false.

* Simple copy options: adds a checkbox and a message to the dialog that allows
  for toggling the RequestType between 'Loan' and 'Copy'. To enable, set
  'includeSimpleCopyOptions' to true. To customize the checkbox label, set
  'simpleCopyLabel'. To add an explanatory or other message above the checkbox,
  set 'simpleCopyMessage'.

* Advanced copy options: adds a series of options to more granularly define
  what is desired in the copy. It will automatically set the RequestType to
  'Copy' and add select boxes and labels for Format, ServiceLevel, and
  ShippingOptions, as well as a checkbox and label for ForPublication. To
  enable, set 'includeAdvancedCopyOptions' to true.

  Each select has a default set of options that can be overriden in two ways:
  1.  Array of strings. Each string will be set as the value and label of the
      option, like so:

            <option>string</option>
  2.  Array of objects, each object containing a 'label' and a 'value' field.
      The label field will be the displayed value and the 'value' field will
      be set as the 'value' attribute:

            <option value="value">label</option>

  Additionally, each of these has a default label to be displayed to the left
  of the select that is overrideable by setting, e.g., 'formatLabel'.

  Finally, a message can be added before the selects by setting
  'advancedCopyMessage'.

* Clean values: performs string substitution on the values obtained during
  form processing ONLY. By default, this performs a head and tail trim. To
  customize, set 'clean_values' to the function that will perform the clean.

* Compress requests: compresses requests on a given field, to minimize the
  number of requests that appear in the Aeon system. E.g. if a user wants to
  request multiple items from a box with the same barcode, it would be useful
  to combine all of those requests into one. To enable this feature, set
  'compressRequests' to true and set 'compressRequestsField' to the field that
  should be the one to collapse on, which defaults to 'ItemNumber'. When enabled,
  the dialog will concatenate the different values for a given field into a
  new instance of that field, separated by '; '. For example, consider
  a request for the following items:

        ItemNumber: 1
        ItemTitle: Title1
        ItemSubTitle: SubTitle

        ItemNumber: 1
        ItemTitle: Title1-2
        ItemSubTitle: SubTitle

        ItemNumber: 2
        ItemTitle: Title2
        ItemSubTitle: SubTitle2

  These would produce the following requests in Aeon:

        ItemNumber: 1
        ItemTitle: Title1; Title1-2
        ItemSubTitle: SubTitle

        ItemNumber: 2
        ItemTitle: Title2
        ItemSubTitle: SubTitle2

## Customization

### Look
To update the look, you can set any or all of the labels and messages, which
include: title, header, footer, and a message above the buttons, along with the
other labels discussed above.

In addition, you can set the minWidth, width, maxWidth, minHeight, height, and
maxHeight properties of the dialog. Only minWidth has a default, which is 750px.
Width will take precedence over min or max, and the same goes for height.

More advanced customization can be had by providing new templates the items
display or the whole dialog itself. These new templates must be jqote2
templates, so view those [docs](http://aefxx.com/jquery-plugins/jqote2/) to see
the templating syntax.

If you wish to override the templates, I highly recommend you use the embedding
method described in the jqote2 docs and that you set the option to the selector
for the template. E.g.

    <script type="text/x-jqote2-template" id="template">
      My new template
    </script>

    ...

    template: '#template'

If you override the default template, you will need to provide your own event
binding as well as prevent the default bindings from occuring. To do this, see
'Behavior' section below.

If you change the class of the div used to contain the items, be sure and set
'items_attachpoint_selector' to the appropriate selector.

### Behavior
To customize behavior, three event hooks have been added: createDialog,
destroyDialog, and onSubmit.

* createDialog is called after the call to $().dialog but before the dialog is
  shown. It is intended as a place to wire up custom UI elements or perform any
  other pre-show processing.

* destroyDialog is called before the dialog is destroyed, to allow for the
  unbinding of events and destruction of custom UI elements, as well as any
  post-cancel processing that needs to occur.

* onSubmit is called after the user hits the submit button on the dialog to send
  the request to Aeon. If this method returns false, submission does not occur.

If the default behavior of the UI elements is undesireable, you can prevent its
implementation by setting 'useDefaultBindings' to false. Beware: setting this to
false will prevent ALL default UI bindings, so you will have to provide your own
outside the plugin. This is primarily intended for those users who are
completely replacing the default template.

## API

### Methods

All methods are called using the default jQuery style. E.g.:

    $('#id_of_submit_button').aeonRequestsDialog('show');
    $('#id_of_submit_button').aeonRequestsDialog('options',options);

* show: shows the dialog. Generally no need to call directly, as the plugin
  binds the submit button to this action

* options:
  1. with no arguments: returns the options object containing dialog settings
  2. with one string argument: returns the option named by the given argument
  3. with an object argument: extends the options object with the passed
     arguments then returns it
  4. with two string arguments: sets the option given in the first argument to
     the value given in the second argument, then returns options

* destroy: destroys the plugin

### Options

* 'dialogId': id of the main dialog div. If putting more than one dialog on a
  page, be sure and set this to something other than default on second dialog.

  default: 'aeon_request_dialog'

* 'submitButtonSelector': selector of button used to show dialog

  default: '.aeon_submit',

* 'useDefaultBindings': setup default bindings. Set to false if completely
  replacing template.

  default: true

* 'compressRequests': set to true to compress requests on a given field

  default: false

* 'compressRequestsField': field to compress on

  default: 'ItemNumber'

* 'url': url to Aeon DLL

* 'AeonForm': argument passed to Aeon DLL for processing on their side

  default: 'EADRequest'

* 'RequestType': whether copy or loan.

  default: 'Loan'

* 'datasource': sets source of data for dialog. Values:
  1. form: use default form processing
  2. json: use default json processsing
  3. custom: provide custom data processing

  default: form

* 'globalFields': fields common to all requests

  default: []

* 'itemFields': fields for individual items

  default: []

* 'items': items to be requested

  default: []

* 'json_url': url to json

  default: null

* 'json_callback': callback for json response to process into correct format

  default: null

* 'json_content': args to be passed as the content of the json request

  default: null

* 'custom_callback': function used in custom processing to provide the data

  default: null

* 'items_attachpoint_selector': selector for attachpoint of items

  default: '.aeon_request_items'

* 'title': dialog title

  default: 'Confirm your request'

* 'header': header message

  default: ''

* 'includeNotes': include the notes field

  default: true

* 'notesMessage': message to be displayed about notes textarea

  default: 'Please include any notes that might help us identify the specific items requested or any other pertinent information:'

* 'includeScheduledDate': include the scheduled date ui elements

  default: true

* 'scheduledDateLabel': label for the scheduled date option

  default: 'Scheduled Date'


* 'userReviewLabel': label for the user review option

  default: 'Keep this request saved in your account for later review. It will not be sent to Libraries staff for fulfilment.'

* 'buttonsMessage': message to be displayed above the submit and cancel buttons

  default: ''

* 'footer': footer message

  default: '<i>* Requested items will be grouped by container in the Aeon system.</i>'

* 'includeSimpleCopyOption': include the simple copy options

  default: false

* 'simpleCopyLabel': label for simple copy checkbox

  default: 'Requesting Duplication of Material'

* 'simpleCopyMessage': message to be displayed above copy check

  default: ''

* 'includeAdvancedCopyOptions': include the advanced copy options

  default: false

* 'advancedCopyMessage': message to be displayed above copy options

  default: ''

* 'formatLabel': label for Format select

  default: 'Format'

* 'formatOptions': options for Format select

  default: [ 'Photocopy', 'Scan (DVD/CD)', 'Scan (Electronic Delivery)' ]

* 'serviceLevelLabel': label for ServiceLevel select

  default: 'Intended Use'

* 'serviceLevelOptions': options for ServiceLevel select

  default: ['Advertisement (Commercial)', 'Advertisement (PSA)', 'Educational Use', 'Government', 'Live Presentation', 'Museum Use', 'Non Profit', 'Personal Use', 'Preservation Use']

* 'shippingOptionLabel': label for ShippingOption select

  default: 'Shipping Option'

* 'shippingOptions': options for ShippingOption select

  default: ['Download/FTP (User Provided)', 'Download/FTP (Institution Provided)', 'Pick up Onsite', 'Fed Ex (User Account)', 'UPS (User Account)', 'USPS (First Class)', 'USPS (Overseas)' ]

* 'forPublicationLabel': label for ForPublication checkbox

  default: 'For Publication'

* 'minWidth': minimum width of dialog

  default: 750

* 'width': width of dialog

* 'maxWidth': max width of dialog

* 'minHeight': minimum height of dialog

* 'height': height of dialog

* 'maxHeight': max height of dialog

* 'createDialog': event hook for dialog creation

  default: function(){return this;}

* 'destroyDialog': event hook for dialog destruction

  default: function (){return this;}

* 'onSubmit': event hook for form submission

  default: function(){return true;},

* 'form': id of form for form processing

  default: 'EADRequest'

* 'checkedItemSelector': selector for checked items

  default: 'input[name="Request"]:checked',

* 'cleanValues': function used during form processing to clean values from form

  default:

        function(s){
          return s.replace(/(^\s*)|(\s*$)/g, "").replace(/(\n|\t)/g, '');
        }

* 'template': jqote template for dialog

  default:

        '<form method="POST" action="<%= this.url %>" class="aeon_request_form" target="_self" name="<%= this.AeonForm %>">' +
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
              '<div class="request_inputs">' +
                '<input type="checkbox" class="copy_check" value="Yes"/>' +
              '</div>' +
              '<div class="requestDesc"><label for="aeon_request_copy"><span class="label"><%= this.simpleCopyLabel %></span></label></div>' +
              '<% if ( this.simpleCopyMessage ) { %>' +
                '<div class="requestDesc"><%= this.simpleCopyMessage %></div>' +
              '<% } %>' +
            '</div>' +
          '<% } %>' +
          '<% if ( this.includeAdvancedCopyOptions ) { %>' +
            '<div class="advanced_copy_opt">' +
              '<div class="adv_copy_message"><%= this.advancedCopyMessage %></div>' +
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
                '<label for="Notes"><span class="label"><%= this.notesMessage %></span></label><br/>' +
              '<% } %>' +
              '<textarea name="Notes" cols="60" rows="4"></textarea>' +
            '</div>' +
          '<% } %>' +
          '<% if (this.includeScheduledDate) { %>' +
            '<div class="rev_sched_opt">' +
              '<input type="radio" name="UserReview" id="scheduled_date_radio" class="schedule_opt" value="No" checked="checked"/>' +
            '</div>' +
            '<div class="scheduled_date">' +
              '<label for="scheduled_date_radio"><span class="label"><%= this.scheduledDateLabel %></span></label><br/>' +
              '<input type="text" class="datepicker"  name="ScheduledDate"/>' +
            '</div>' +
            '<div class="rev_sched_opt">' +
              '<input type="radio" name="UserReview" id="user_review_radio" value="Yes" class="schedule_opt"/>' +
            '</div>' +
            '<div class="review disabled">' +
              '<label for="user_review_radio"><%= this.userReviewLabel %></label>' +
            '</div>' +
          '<% } %>' +
          '<div class="buttons">' +
            '<% if ( this.buttonsMessage ) { %>' +
              '<div class="buttonMessage"><%= this.buttonsMessage %></div>' +
            '<% } %>' +
            '<input type="submit" value="Submit Request" class="dialog_submit"/>' +
            '<input type="reset" value="Cancel" class="dialog_cancel"/>' +
          '</div>' +
          '<% if ( this.footer ) { %>' +
            '<div class="aeon_footer"><%= this.footer %></div>' +
          '<% } %>' +
        '</form>'

* 'items_template': jqote template for items

  default:

        '<div>' +
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
        '</div>'

