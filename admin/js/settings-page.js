jQuery('select#bml-input-bg-position').on('change', refresh_preview_login_page);


var colorPickerOptions = {
    defaultColor: false,
    change: refresh_preview_login_page_color_changed,
    clear: refresh_preview_login_page_color_cleared,
    hide: true,
    palettes: true
};
jQuery('.color-field').wpColorPicker(colorPickerOptions);


jQuery(window).on('load', function($) {
    
    previewIFrameDOM = jQuery("iframe#preview-login-page-iframe").contents();
    
    previewIFrameDOM.find("input[type='submit']").on('click', function(event){
        event.preventDefault();
    });

    previewIFrameDOM.find('a').removeAttr('href');
    previewIFrameDOM.find('a').css('cursor', 'pointer');

    previewIFrameDOM.find('.login h1 a').attr('title', '');
    
    previewIFrameDOM.find('body').prepend('<style type="text/css"> * {-webkit-transition: 200ms;-moz-transition: 200ms;-o-transition: 200ms;transition:200ms;}</style>');

    previewIFrameDOM.find('body').css('transition', '0.2s ease-in-out');
    previewIFrameDOM.find('body').css('transform', 'scale(0.4)');
    previewIFrameDOM.find('div#login').css('transform', 'translateY(-20%)');
    previewIFrameDOM.find('.login h1 a').css('transition', '0.2s ease-in-out');
    
});

var slider_logo_size = document.getElementById("bml-input-logo-size");
var output_logo_size = document.getElementById("bml-output-logo-size-num");
slider_logo_size.oninput = function() {
    output_logo_size.innerHTML = this.value;
    refresh_preview_login_page();
}

var slider_border_width = document.getElementById("bml-input-form-border-width");
var output_border_width = document.getElementById("bml-output-form-border-width-num");
slider_border_width.oninput = function() {
    output_border_width.innerHTML = this.value;
    refresh_preview_login_page();
}

var slider_border_radius = document.getElementById("bml-input-form-border-radius");
var output_border_radius = document.getElementById("bml-output-form-border-radius-num");
slider_border_radius.oninput = function() {
    output_border_radius.innerHTML = this.value;
    refresh_preview_login_page();
}


/**
 * Functions
 */

jQuery(document).ready( function($) {

    var gk_media_init = function(input_hidden_selector, output_text_selector, input_button_selector)  {
        var clicked_button = false;
        
        jQuery(output_text_selector).each(function(index, element) {
            var button = jQuery(element).next(input_button_selector);
            button.click(function (event) {
                event.preventDefault();
                clicked_button = jQuery(this);
    
                // check for media manager instance
                if(wp.media.frames.gk_frame) {
                    wp.media.frames.gk_frame.open();
                    return;
                }
                // configuration of the media manager new instance
                wp.media.frames.gk_frame = wp.media({
                    title: 'Select image',
                    multiple: false,
                    library: {
                        type: 'image'
                    }
                });
    
                // Function used for the image selection and media manager closing
                var gk_media_set_image = function() {
                    var selection = wp.media.frames.gk_frame.state().get('selection');
    
                    // no selection
                    if (!selection) {
                        return;
                    }
    
                    // iterate through selected elements
                    selection.each(function(attachment) {
                        var filename = attachment.attributes.filename;
                        var url = attachment.attributes.url;
                        var id = attachment['id'];
                        clicked_button.siblings(input_hidden_selector).val(id);
                        clicked_button.siblings(output_text_selector).html(filename);

                        clicked_button.siblings('.preview-img').css("background-image", 'url(' + url + ')');

                        // show bg-position row
                        if ( clicked_button.siblings('input.bml-media-hidden-id').attr('id') == 'bml-input-logo-image-id' ) {
                            jQuery('#bml-tr-logo-size').show();
                            jQuery('#th-logo-image').attr("rowspan", "2");
                        }

                        // show bg-position row
                        if ( clicked_button.siblings('input.bml-media-hidden-id').attr('id') == 'bml-input-bg-image-id' ) {
                            jQuery('#bml-tr-bg-position').show();
                            jQuery('#th-bg-image').attr("rowspan", "2");
                        }
                        
                        refresh_preview_login_page();
                    });

                };
    
                // closing event for media manger
                //wp.media.frames.gk_frame.on('close', gk_media_set_image);

                // image selection event
                wp.media.frames.gk_frame.on('select', gk_media_set_image);

                wp.media.frames.gk_frame.on('open',function() {
                    // On open, get the id from the hidden input
                    // and select the appropiate images in the media manager
                    var selection =  wp.media.frames.gk_frame.state().get('selection');
                    id = clicked_button.siblings(input_hidden_selector).val().split(',');
                    attachment = wp.media.attachment(id);
                    attachment.fetch();
                    selection.add( attachment ? [ attachment ] : [] );
                    
                });

                // showing media manager
                wp.media.frames.gk_frame.open();
            });
        });
    };

    gk_media_init('.bml-media-hidden-id', '.bml-media-url', '.bml-media-button');
});



var bml_default_setting_logo = function(link_clicked){
    jQuery(link_clicked).siblings('.bml-media-hidden-id').val('');
    jQuery(link_clicked).siblings('.bml-media-url').html('Default');
    jQuery(link_clicked).siblings('.preview-img').css("background-image", '');
    if ( jQuery(link_clicked).siblings('.bml-media-hidden-id').attr('id') === 'bml-input-logo-image-id' ) {
        // jQuery('#bml-tr-logo-size').hide();
        jQuery('#bml-output-logo-size-num').html('100');
        // jQuery('#th-logo-image').attr("rowspan", "1");
        jQuery('input#bml-input-logo-size').val('100');
    }
    refresh_preview_login_page();
};


var bml_default_setting_bg = function(link_clicked){
    jQuery(link_clicked).siblings('.bml-media-hidden-id').val('');
    jQuery(link_clicked).siblings('.bml-media-url').html('None');
    jQuery(link_clicked).siblings('.preview-img').css("background-image", '');
    jQuery('#bml-input-bg-position').val('');

    jQuery('#bml-tr-bg-position').hide();
    jQuery('#th-bg-image').attr("rowspan", "1");
    
    refresh_preview_login_page();
};


var bml_default_settings_all = function(){
    jQuery('.bml-media-hidden-id').val('');
    jQuery('.bml-media-url.logo').html('Default');
    jQuery('.bml-media-url.bg').html('None');
    jQuery('.preview-img').css("background-image", '');

    jQuery('input#bml-input-logo-size').val('100');
    jQuery('#bml-output-logo-size-num').html('100');
    // jQuery('#th-logo-image').attr("rowspan", "1");

    jQuery('#bml-input-bg-position').val('');
    jQuery('#bml-tr-bg-position').hide();
    jQuery('#th-bg-image').attr("rowspan", "1");
    jQuery('#bml-input-accent-color').val('');
    jQuery('.button.wp-color-result').css('background-color', '');
    jQuery('#bml-input-form-border-width').val('0');
    jQuery('#bml-output-form-border-width-num').html('0');
    jQuery('#bml-tr-form-border').hide();
    jQuery('#th-accent-color').attr("rowspan", "2");
    jQuery('#bml-input-form-border-radius').val('0');
    jQuery('#bml-output-form-border-radius-num').html('0');
    refresh_preview_login_page();
};




/**
* preview-login-page
*/

function previewLoginPageZoom100(buttonElement){
    jQuery(buttonElement).siblings().css('background-color', '');
    jQuery(buttonElement).css('background-color', '#fdfdfd');
    jQuery(buttonElement).siblings().css('font-weight', '');
    jQuery(buttonElement).css('font-weight', '600');

    previewIFrame = document.getElementById("preview-login-page-iframe");

    previewIFrameDOM = jQuery(previewIFrame).contents();
    previewIFrameDOM.find('body').css('transform', '');
    previewIFrameDOM.find('div#login').css('transform', '');

    previewIFrameDOM.find('div#login').on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function(event) {
        previewIFrame.height = previewIFrame.contentWindow.document.body.scrollHeight;
    });
    
}

function previewLoginPageZoom169(buttonElement){
    jQuery(buttonElement).siblings().css('background-color', '');
    jQuery(buttonElement).css('background-color', '#fdfdfd');
    jQuery(buttonElement).siblings().css('font-weight', '');
    jQuery(buttonElement).css('font-weight', '600');

    previewIFrame = document.getElementById("preview-login-page-iframe");

    previewIFrameDOM = jQuery(previewIFrame).contents();
    previewIFrameDOM.find('body').css('transform', 'scale(0.4)');
    previewIFrameDOM.find('div#login').css('transform', 'translateY(-20%)');

    previewIFrameDOM.find('div#login').on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function(event) {  
        previewIFrame.height = previewIFrame.clientWidth * 0.5625;
    });
    
}





/**
* Refresh Preview Functions
*/

// main function
function refresh_preview_login_page(){
    previewIFrameDOM = jQuery("iframe#preview-login-page-iframe").contents();

    previewStyleTag = getPreviewStyleTag();
    
    previewIFrameDOM.find('head').find('style#bml-style').remove();
    previewIFrameDOM.find('head').append(previewStyleTag);

    noticeNotSaved();
}


function refresh_preview_login_page_color_changed(){

    jQuery('#th-accent-color').attr("rowspan", "3");

    jQuery('#bml-tr-form-border').show();

    refresh_preview_login_page()

}


function refresh_preview_login_page_color_cleared(){

    jQuery('#bml-input-form-border-width').val('0');
    jQuery('#bml-output-form-border-width-num').html('0');

    jQuery('#bml-tr-form-border').hide();
    jQuery('#th-accent-color').attr("rowspan", "2");

    refresh_preview_login_page()

}


function noticeNotSaved(){

    if( jQuery('#bml-notice-warning-not-saved').length == 0 ){

        noticeWarningTag = "";
        noticeWarningTag += "<div class=\"notice notice-warning\" style=\"display:none\" id=\"bml-notice-warning-not-saved\">";
        noticeWarningTag += "<p>Settings changed and haven't been saved.</p>";
        noticeWarningTag += "</div>";

        jQuery('input#submit').before(noticeWarningTag);
        jQuery('div#bml-notice-warning-not-saved').slideDown();

    }

}


function getPreviewStyleTag(){
    styleTag = "";
    
    logo_image_id = jQuery('input#bml-input-logo-image-id').val();
    logo_size = jQuery('input#bml-input-logo-size').val();
    logo_size_scale = (+logo_size / 100).toFixed(2);

    bg_image_id = jQuery('input#bml-input-bg-image-id').val();
    bg_position = jQuery("#bml-input-bg-position").val();

    if ( logo_image_id ) {
        logo_image_url_css = jQuery('input#bml-input-logo-image-id').siblings('.preview-img').css("background-image");
    } else {
        logo_image_url_css = false;
    }

    if ( bg_image_id ) {
        bg_image_url_css = jQuery('input#bml-input-bg-image-id').siblings('.preview-img').css("background-image");
    } else {
        bg_image_url_css = false;
    }

    if (bg_position){
        bg_position_arr = bg_position.split('-');
    }


    accent_color_wp_color_result_button = jQuery('input#bml-input-accent-color').parent().parent().siblings('button.button.wp-color-result');

    if (  accent_color_wp_color_result_button.attr('style') ) {
        accent_color = accent_color_wp_color_result_button.css("background-color");
    } else {
        accent_color = false;
    }

    form_border_width = jQuery("#bml-input-form-border-width").val();

    form_border_radius = jQuery("#bml-input-form-border-radius").val();


    // styleTag Generating
    styleTag += "<style id=\"bml-style\" type=\"text/css\">";


    if ( bg_image_url_css) {
        styleTag += "body.login {";
        
        if (bg_position){
            styleTag += "background-position: " + bg_position_arr[0] + " " + bg_position_arr[1] + ";";
        }
            styleTag += "background-image: " + bg_image_url_css + ";";
            styleTag += "background-attachment: fixed;";
            styleTag += "background-size: cover;";
            styleTag += "background-repeat: no-repeat;";
        styleTag += "}";
    }

    if ( ( accent_color && form_border_width != "0" ) || logo_image_url_css ){
        styleTag += "#login h1 a, .login h1 a {";
            styleTag += "width: 100%;"
        styleTag += "}";
    }

    if ( accent_color && form_border_width != "0" ){        

        styleTag += "#login h1 a:focus, .login h1 a:focus {";
            styleTag += "box-shadow: none;"
        styleTag += "}";

        styleTag += "#login h1, .login h1,";
        styleTag += "body.login div#login p#nav,";
        styleTag += "body.login div#login p#backtoblog {";
            styleTag += "background-color: #fff;";
            styleTag += "padding: 8px 16px;";
        styleTag += "}";

        styleTag += "#login h1 a, .login h1 a {";
            styleTag += "box-sizing: border-box;";
            styleTag += "margin: 0 auto;";
            styleTag += "padding: 42px 0;";
            styleTag += "background-position: center;";
        styleTag += "}";

        styleTag += "body.login div#login form#loginform,";
        styleTag += "body.login div#login form#registerform,";
        styleTag += "body.login div#login form#lostpasswordform{";
            styleTag += "margin-top: 0;";
        styleTag += "}";

        styleTag += "body.login div#login p#nav,";
        styleTag += "body.login div#login p#backtoblog {";
            styleTag += "margin: 0;";
            styleTag += "padding: 8px 24px;";
        styleTag += "}";

        styleTag += "body.login div#login p#backtoblog{";
            styleTag += "padding-bottom: 20px;";
        styleTag += "}";

        styleTag += "body.login-action-register div#login {";
            styleTag += "padding-top: 4%;";
        styleTag += "}";

    }
    
    if ( logo_size_scale !== "undefined" ) {
        styleTag += "#login h1 a, .login h1 a {";
            styleTag += "-webkit-transform: scale(" + logo_size_scale + ");";
            styleTag += "-ms-transform: scale(" + logo_size_scale + ");";
            styleTag += "transform: scale(" + logo_size_scale + ");"; 
        styleTag += "}";
    }

    if ( logo_image_url_css ) {
        styleTag += "#login h1 a, .login h1 a {";
            styleTag += "background-image: " + logo_image_url_css + ";";
            styleTag += "background-position: center;";
            styleTag += "background-size: contain;";
        styleTag += "}";
    }
        

    if ( accent_color ) {

        if ( form_border_width != "0" ) {

            styleTag += "#login h1, .login h1,";
            styleTag += "body.login div#login form#loginform,";
            styleTag += "body.login div#login form#registerform,";
            styleTag += "body.login div#login p#nav,";
            styleTag += "body.login div#login p#backtoblog,";
            styleTag += "body.login div#login p.message,";
            styleTag += "body.login div#login form#lostpasswordform{";
                styleTag += "border: solid " + accent_color + ";";
                styleTag += "border-width: " + form_border_width + "px;";
            styleTag += "}";

            styleTag += "body.login div#login #login_error,";
            styleTag += "body.login div#login .message,";
            styleTag += "body.login div#login .success{";
                styleTag += "margin-bottom: 0;";
                styleTag += "border-right: " + form_border_width + "px solid " + accent_color + ";";
                styleTag += "border-left-width: " + form_border_width + "px;";
            styleTag += "}";
            
            styleTag += "#login h1, .login h1 {";
                styleTag += "border-bottom-width: 0;";
            styleTag += "}";

            styleTag += "body.login div#login form#loginform,";
            styleTag += "body.login div#login form#registerform,";
            styleTag += "body.login div#login p#nav,";
            styleTag += "body.login div#login p.message,";
            styleTag += "body.login div#login form#lostpasswordform{";
                styleTag += "border-top-width: 0;";
                styleTag += "border-bottom-width: 0;";
            styleTag += "}";

            styleTag += "body.login div#login p#backtoblog{";
                styleTag += "border-top-width: 0;";
            styleTag += "}";

            styleTag += "body.login div#login p.message{";
                styleTag += "margin-bottom: 0;";
            styleTag += "}";

        }
    
        

        styleTag += "body.login div#login p.submit input#wp-submit{";
            styleTag += "background: " + accent_color + ";";
            styleTag += "border-width: 0;";
            styleTag += "box-shadow: none;";
            styleTag += "text-shadow: 0 -1px 1px rgba(0, 0, 0, 0.15), 1px 0 1px rgba(0, 0, 0, 0.15), 0 1px 1px rgba(0, 0, 0, 0.15), -1px 0 1px rgba(0, 0, 0, 0.15);";
        styleTag += "}";

        styleTag += "body.login div#login input:focus {";
            styleTag += "border-color: " + accent_color + ";";
            styleTag += "box-shadow: none;";
        styleTag += "}";

        styleTag += "body.login div#login input#rememberme:checked:before{";
            styleTag += "color: " + accent_color + ";";
        styleTag += "}";

        styleTag += "body.login div#login p#backtoblog a:hover,";
        styleTag += "body.login div#login p#nav a:hover,";
        styleTag += ".login h1 a:hover {";
            styleTag += "color: " + accent_color + ";";
        styleTag += "}";

        styleTag += "body.login div#login p#backtoblog a:focus,";
        styleTag += "body.login div#login p#nav a:focus {";
            styleTag += "box-shadow: 0 0 0 1px " + accent_color + ", 0 0 2px 1px " + accent_color + ";";
        styleTag += "}";
    }


    if ( form_border_radius != "0" ) {

		if ( form_border_width != "0" && accent_color ) {
			
			styleTag += "#login h1, .login h1 {";
				styleTag += "border-top-right-radius: " + form_border_radius + "px;";
				styleTag += "border-top-left-radius: " + form_border_radius + "px;";
            styleTag += "}";

			styleTag += "body.login div#login p#backtoblog{";
				styleTag += "border-bottom-right-radius: " + form_border_radius + "px;";
				styleTag += "border-bottom-left-radius: " + form_border_radius + "px;";
            styleTag += "}";

        } else {

			styleTag += ".login form{";
				styleTag += "border-radius: " + form_border_radius + "px;";
            styleTag += "}";

        }
	
    }


    styleTag += '</style>';
    
    return styleTag;
	
}
