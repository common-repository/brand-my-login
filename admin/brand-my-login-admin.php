<?php

 // Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


// Load plugin menu in dashboard
add_action( 'admin_menu', 'bml_menu_func' );

// Enqueue scripts and styles to admin menu
add_action( 'admin_enqueue_scripts', 'bml_load_wp_media_files' );

// Display default admin notice
add_action('admin_notices', 'bml_add_settings_errors');


// Create WordPress admin menu
function bml_menu_func() {

	$parent_slug	= 'themes.php';
	$page_title		= 'Brand My Login';
	$menu_title		= 'Brand My Login';
	$capability		= 'customize';
	$menu_slug 		= SETTINGS_MENU_SLUG;
	$function			= 'bml_settings_page_func';

	add_submenu_page( $parent_slug, $page_title, $menu_title, $capability, $menu_slug, $function );

	// Update database
	add_action( 'admin_init', 'bml_settings_update' );

}


// Update database FUNCTION
// Create function to register plugin settings in the database
// action hooked in bml_menu_func()
function bml_settings_update() {
	register_setting( BML_OPTION_GROUP, BML_OPTION_NAME, array( 'sanitize_callback' => 'bml_validate_options' ) );
}


// Enqueue scripts and styles to admin menu FUNCTION
function bml_load_wp_media_files( $page ) {
	if( $page == 'appearance_page_brand_my_login_settings' ) {
		
		wp_enqueue_style( 'wp-color-picker' ); 
		
		// Enqueue WordPress media scripts
		wp_enqueue_media();
		
		// Enqueue custom script that will interact with wp.media
		wp_enqueue_script( 'bml_settings_page_script', plugins_url( '/js/settings-page.js' , __FILE__ ), array('jquery', 'wp-color-picker'), false, true );
		
		wp_enqueue_style( 'bml_settings_page_style', plugins_url( '/css/settings-style.css' , __FILE__ ) );

	}
}


// Display default admin notice FUNCTION
function bml_add_settings_errors() {
    settings_errors();
}


// Create WordPress plugin page
// passed to add_submenu_page(...) in bml_menu_func()
function bml_settings_page_func() {
?>

<div class="wrap">
	<h1><?php echo __( 'Brand My Login Settings', BML_DOMAIN ) ?></h1>
	<form method="post" action="options.php" class="settings">
		<?php
			settings_fields( BML_OPTION_GROUP ); 
			do_settings_sections( BML_OPTION_GROUP ); 
			
			$bml_settings = get_option( BML_OPTION_NAME );

			$logo_image_id	= $bml_settings['logo_image_id'];
			$logo_size			= $bml_settings['logo_size'];
			$bg_image_id		= $bml_settings['bg_image_id'];
			$bg_position		= $bml_settings['bg_position'];
			$accent_color		= $bml_settings['accent_color'];
			$form_border_width	= $bml_settings['form_border_width'];
			$form_border_radius	= $bml_settings['form_border_radius'];
			$logo_image_url	= wp_get_attachment_url( $logo_image_id );
			$bg_image_url		= wp_get_attachment_url( $bg_image_id );
			$logo_image_filename	= basename( wp_get_attachment_url( $logo_image_id ) );
			$bg_image_filename		= basename( wp_get_attachment_url( $bg_image_id ) );

		?>
	
		<table class="form-table">

			<tr valign="top">
				<th rowspan="2" scope="row" id="th-logo-image"><?php echo __( 'Logo Image', BML_DOMAIN ) ?>:</th>
				<td>
					<input type="hidden" class="bml-media-hidden-id" name="<?php echo BML_OPTION_NAME; ?>[logo_image_id]" id="bml-input-logo-image-id" value="<?php echo $logo_image_id; ?>"/>
					<span class="bml-media-url logo"><?php echo ( !empty($logo_image_id) ) ? $logo_image_filename : __( 'Default', BML_DOMAIN ); ?></span>
					<input type="button" class="bml-media-button button button-secondary" value="<?php esc_attr_e( 'Select Image', BML_DOMAIN ); ?>"/>
					<div class="preview-img logo" <?php echo ( !empty($logo_image_url) ? "style=\"background-image: url({$logo_image_url})\"" : "" ) ?> ></div>
					<a class="bml-button-default" onclick="bml_default_setting_logo(this)"><?php echo __( 'Remove', BML_DOMAIN ) ?></a>
				</td>
			</tr>
			<!--new-->
			<tr valign="top" id="bml-tr-logo-size">
				<td class="td-logo-size">
					<span class="label"><?php echo __( 'Logo Size', BML_DOMAIN ) ?>:</span>
					<input class="range" type="range" min="0" max="100" name="<?php echo BML_OPTION_NAME; ?>[logo_size]" value="<?php echo ( !empty( $logo_size ) ) ? $logo_size : '100' ; ?>" id="bml-input-logo-size">
					<span class="output-value"><span id="bml-output-logo-size-num"><?php echo ( !empty( $logo_size ) ) ? $logo_size : '100' ; ?></span>%</span>
				</td>
			</tr>

			<tr><td colspan="2"><hr></td></tr>

			<tr valign="top">
				<th rowspan="<?php echo ( !empty( $bg_image_id ) ) ? '2' : '1'; ?>" scope="row" id="th-bg-image"><?php echo __( 'Background Image', BML_DOMAIN ) ?>:</th>
				<td class="td-bg-image">
					<input type="hidden" class="bml-media-hidden-id" name="<?php echo BML_OPTION_NAME; ?>[bg_image_id]" id="bml-input-bg-image-id" value="<?php echo $bg_image_id; ?>"/>
					<span class="bml-media-url bg"><?php echo ( !empty($bg_image_id) ) ? $bg_image_filename : __( 'None', BML_DOMAIN ); ?></span>
					<input type="button" class="bml-media-button button button-secondary" value="<?php esc_attr_e( 'Select Image', BML_DOMAIN ); ?>"/>
					<div class="preview-img bg" <?php echo ( !empty($bg_image_url) ? "style=\"background-image: url({$bg_image_url})\"" : "" ) ?> ></div>
					<a class="bml-button-default" onclick="bml_default_setting_bg(this)"><?php echo __( 'Remove', BML_DOMAIN ) ?></a>
				</td>
			</tr>
			<tr valign="top" id="bml-tr-bg-position" <?php echo ( empty( $bg_image_id ) ) ? 'style="display:none;"' : ''; ?>>
				<td class="td-bg-position">
					<span class="label"><?php echo __( 'Background Position', BML_DOMAIN ) ?>:</span>
					<select id="bml-input-bg-position" name="<?php echo BML_OPTION_NAME; ?>[bg_position]">
						<option value=""><?php echo __( 'Default', BML_DOMAIN ) ?></option>
						<option value="top-left"			<?php selected( 'top-left', $bg_position ); ?> >Top Left</option>
						<option value="top-center"		<?php selected( 'top-center', $bg_position ); ?> >Top Center</option>
						<option value="top-right"			<?php selected( 'top-right', $bg_position ); ?> >Top Right</option>
						<option value="center-left"		<?php selected( 'center-left', $bg_position ); ?> >Center Left</option>
						<option value="center-center"	<?php selected( 'center-center', $bg_position ); ?> >Center Center</option>
						<option value="center-right"	<?php selected( 'center-right', $bg_position ); ?> >Center Right</option>
						<option value="bottom-left"		<?php selected( 'bottom-left', $bg_position ); ?> >Bottom Left</option>
						<option value="bottom-center"	<?php selected( 'bottom-center', $bg_position ); ?> >Bottom Center</option>
						<option value="bottom-right"	<?php selected( 'bottom-right', $bg_position ); ?> >Bottom Right</option>
					</select>
				</td>
			</tr>

			<tr><td colspan="2"><hr></td></tr>

			<tr valign="top">
				<th rowspan="<?php echo ( !empty( $accent_color ) ) ? '3' : '2'; ?>" scope="row" id="th-accent-color"><?php echo __( 'Accent Color', BML_DOMAIN ) ?>:</th>
				<td class="td-accent-color">
					<input type="text" class="color-field" id="bml-input-accent-color" name="<?php echo BML_OPTION_NAME; ?>[accent_color]" value="<?php echo $accent_color; ?>"/>
				</td>
			</tr>
			<tr valign="top" id="bml-tr-form-border" <?php echo ( empty( $accent_color ) ) ? 'style="display:none;"' : ''; ?>>
				<td class="td-form-border width">
					<span class="label"><?php echo __( 'Form Border Width', BML_DOMAIN ) ?>:</span>
					<input class="range" type="range" min="0" max="5" name="<?php echo BML_OPTION_NAME; ?>[form_border_width]" value="<?php echo ( !empty( $form_border_width ) ) ? $form_border_width : '0' ; ?>" id="bml-input-form-border-width">
					<span class="output-value"><span id="bml-output-form-border-width-num"><?php echo ( !empty( $form_border_width ) ) ? $form_border_width : '0' ; ?></span>px</span>
				</td>
			</tr>
			<tr valign="top">
				<td class="td-form-border radius">
					<span class="label"><?php echo __( 'Form Border Radius', BML_DOMAIN ) ?>:</span>
					<input class="range" type="range" min="0" max="25" name="<?php echo BML_OPTION_NAME; ?>[form_border_radius]" value="<?php echo ( !empty( $form_border_radius ) ) ? $form_border_radius : '0' ; ?>" id="bml-input-form-border-radius">
					<span class="output-value"><span id="bml-output-form-border-radius-num"><?php echo ( !empty( $form_border_radius ) ) ? $form_border_radius : '0' ; ?></span>px</span>
				</td>
			</tr>
			
		</table>
		<a class="bml-button-default" onclick="bml_default_settings_all()"><?php echo __( 'Remove all settings', BML_DOMAIN ) ?></a>
		<?php submit_button(); ?>
	</form>
	

	<div class="preview-login-page">
		<p style="font-size: 14px;"><strong><?php echo __( 'Login Page Preview', BML_DOMAIN ) ?>:</strong></p>
		<iframe src="<?php echo wp_login_url(); ?>" width="100%" onLoad="this.height = this.clientWidth * 0.5625" id="preview-login-page-iframe">
			<p><?php echo __( 'Your browser does not support iframes', BML_DOMAIN ) ?>.</p>
		</iframe>
		<p class="zoom-buttons">
			<a href="<?php echo wp_login_url(); ?>" target="_blank" rel="noopener noreferrer" style="text-decoration: none"><?php echo __( 'Visit login page', BML_DOMAIN ) ?></a>
			 | <?php echo __( 'Preview Size', BML_DOMAIN ) ?>: <span onclick="previewLoginPageZoom100(this)">100%</span><span onclick="previewLoginPageZoom169(this)" style="background-color: #fdfdfd; font-weight:500;">16:9</span>
		</p>
	</div>


</div>

<?php

}


// called when validating options fields
// passed to register_setting(...) in bml_settings_update()
function bml_validate_options( $fields ) { 
     
	$valid_fields = array();
    
	// Validate logo_image_id Field
	if ( empty($fields['logo_image_id']) || ctype_digit($fields['logo_image_id']) ){
		$valid_fields['logo_image_id'] = $fields['logo_image_id'];
	} else {
		$valid_fields['logo_image_id'] = get_option( BML_OPTION_NAME )['logo_image_id'];
	}
	
	// Validate logo_size Integer
	$logo_size = trim( $fields['logo_size'] );
	$logo_size = strip_tags( stripslashes( $logo_size ) );
	if ( ctype_digit($logo_size) && $logo_size >= 0 && $logo_size <= 100 ) {
		$valid_fields['logo_size'] = $logo_size;
	} else {
		$valid_fields['logo_size'] = get_option( BML_OPTION_NAME )['logo_size'];
	}

	// Validate bg_image_id Field
	if ( empty($fields['bg_image_id']) || ctype_digit($fields['bg_image_id']) ){
		$valid_fields['bg_image_id'] = $fields['bg_image_id'];
	} else {
		$valid_fields['bg_image_id'] = get_option( BML_OPTION_NAME )['bg_image_id'];
	}


	// Validate bg_position Field
	$bg_position = trim( $fields['bg_position'] );
	$valid_fields['bg_position'] = strip_tags( stripslashes( $bg_position ) );
	

	// Validate accent_color Color
	$accent_color = trim( $fields['accent_color'] );
	$accent_color = strip_tags( stripslashes( $accent_color ) );
	if ( !empty($accent_color) ) {
		if ( $accent_color[0] === '#' ){
			$accent_color = sanitize_hex_color( $accent_color );
		} else {
			$accent_color = sanitize_hex_color_no_hash( $accent_color );
			if ( !empty( $accent_color ) ){
				$accent_color = '#' . $accent_color;
			}
		}
		if ( !empty($accent_color) ) {
			$valid_fields['accent_color'] = $accent_color;
		} else {
			$valid_fields['accent_color'] = get_option( BML_OPTION_NAME )['accent_color'];
			add_settings_error( BML_SETTINGS_ERROR_SLUG_TITLE, 'accent-color', __( 'Accent color input value error', BML_DOMAIN ), 'error' );
		}
	} else {
		$valid_fields['accent_color'] = $accent_color;
	}


	// Validate form_border_width Integer
	$form_border_width = trim( $fields['form_border_width'] );
	$form_border_width = strip_tags( stripslashes( $form_border_width ) );
	if ( ctype_digit($form_border_width) && $form_border_width >= 0 && $form_border_width <= 5 ) {
		$valid_fields['form_border_width'] = $form_border_width;
	} else {
		$valid_fields['form_border_width'] = get_option( BML_OPTION_NAME )['form_border_width'];
	}


	// Validate form_border_radius Integer
	$form_border_radius = trim( $fields['form_border_radius'] );
	$form_border_radius = strip_tags( stripslashes( $form_border_radius ) );
	if ( ctype_digit($form_border_radius) && $form_border_radius >= 0 && $form_border_radius <= 25 ) {
		$valid_fields['form_border_radius'] = $form_border_radius;
	} else {
		$valid_fields['form_border_radius'] = get_option( BML_OPTION_NAME )['form_border_radius'];
	}
	
     
	return apply_filters( 'bml_validate_options', $valid_fields, $fields);
	
}
