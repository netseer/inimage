(function(window, document, callback) {
    var version_needed = "1.7";
    var j, d;
    var loaded = false;
    if (!(j = window.jQuery) || version_needed > j.fn.jquery || callback(j)) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://code.jquery.com/jquery-1.7.1.min.js";
        script.onload = script.onreadystatechange = function() {
            if (!loaded && (!(d = this.readyState) || d == "loaded" || d == "complete")) {
                loaded = true;
                callback((j = window.jQuery).noConflict(1));
                j(script).remove();
            }
        };
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script);
    }
})(window, document, function($) {
    var close_button_image_orange = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACJElEQVQ4T2NkoBAwUqifAasBDg4MLAcOMPwFGv4fzQIWIP8PshiGAY83ZTaysnN4bFx7yDF91tlvIMX//zMwvtqauebv/7+fpXxnJQOFQIaDAYoBT1YmNLH//VHz/8c3xp88oqe27bngmDbz7Pdnq5LWsf94H/D37z+GLyxcS5XjlsfDDIEbEKqtzTapyfYs09P7OuwsTAy//vxj+MoteJKNnfUFy4fX/mxAlb/+/mf4ysT2YPm+O1bV666/ADkO2QWM06JsBHwdZQ5wvH2ux8TIyPAP5HYmRgZGYEj8+feP4TsLx/35hx8GNG66eQWo+R+GF0ACfaHaQv6WSvu53r7UY2NmAvvzz7//DJ+ZOR4sPPE8oHnnrcswzVgNAFrGeK/DdzPbi8febMwQB/4GOv0DD9/pazcP2YetZviOMxZAmm+0eGxkfv7cl+X/P6AXIKEM9A3DbyDnJx//iSVHb7p1HX3zBRbF8DAAqb1e77bp19NnPuxA74Gc/Y2d4wEjB/tnrk+fdEGOAQXiTz6B0w+eHYe7BDkQWS/W2C9jffIsBJR+/nBy35t14UUAD/OPJ7Hm6ruZ3703/gs09Asv7+HyLff9Djz48AFbGLBfLbVYzPDts9H0E28Cp5x9CQrt/6HaDEKNboa7fn3/+S14yaOQu1++vMKakKCCrKXa3MLdV7+CFIGjChQM3W4MXFtvMbAeeMAAthmfATCXoecDrOIU50YAf47pEaIgD9IAAAAASUVORK5CYII=";
    var close_button_image_grey = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAABbUlEQVQ4T2NkoBJgpJI5DEPIoNDQUObVq1f/RfY6NjGYPFavZeZkbuHmZJd+9fJd1qJFi46DFGdmZhrz8nHO/vr929Opk2b4ooctVoMKSvKPSYiJWX759u3u01fP4lj/sP6VlBJfwsvHo/L82bPjvT0TrYgyKDEx0UpSVmKxmIiI0sfPn+4xMzIyCAgIKr1+9fbeo1ePY+dPm3+MKINAitLT4yylZeQXi4iKKbOysjK8ev3q7qP7T2NnzpwJ9irRBsUBDZIVlV7Oxc0pD9L048f3R08evYicPx/TNSB5rGEUFwd0jbzkEn4ePqUvX74+ZGJi+M/Nw6vw6dOX+48fPo6GRQCyqzAMAkWxvIL0GSFhYYPP374+ePbqeQzH////RCVlF/Nycys/f/ny5ISeiRbEeI0xLy9rNys7q/jb1x+zFixYcBikCeRKYXGhSX9+/HozefI0T2IMAqvBk/hAvvhPtEGkZuYhlGlJ9RoAwBCLE0EoaUYAAAAASUVORK5CYII=";
    var close_button_image = close_button_image_grey;
    var runTimeout = 0;
    var netseer_opts = {};
    var resize_scroll_handled = false;
    var banners_counter = 0;
    var render_parameters = {};
    var render_script_loaded = false;
    var window_options;

    var default_opts =
            {
                "max_num_img": "3",
                "min_img_width": "200",
                "min_img_height": "200",
                "num_skipped_img": "0",
                "img_discovery_mode": "size",
                "open_mode": "header",
                "close_mode": "button",
                "open_timer": "0",
                "close_timer": "0",
                "animation_mode": "slide",
                "status": "enabled",
                "transparency": "80",
                "img_class_name": "",
                "img_blk_class_name": "",
                "oc_rate": "35%",
                "side_margin": "5",
                "header_size": "40",
                "browser_mode": "all",
                "taglink_id": null,
                "scroll_recalc": '',
                "req_id": ""
            };

    var IEVersion = navigator.appVersion.indexOf("MSIE");
    if (IEVersion > -1) {
        IEVersion = parseInt(navigator.appVersion.split("MSIE")[1]);
    } else {
        IEVersion = false;
    }

    function getIntOrZero(value) {
        return parseInt(value) || 0;
    }


    function isMobile() {
        if (navigator.userAgent.match(/Android/i)
                || navigator.userAgent.match(/webOS/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i)
                || navigator.userAgent.match(/BlackBerry/i)
                || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        }
        return false;
    }

    function consoleWarn(msg) {
        if (!IEVersion || IEVersion > 9) {
            console.warn(msg);
        }
    }

    function initEffectiveOptions() {
        for (var key in default_opts) {
            if (!netseer_opts[key]) {
                netseer_opts[key] = default_opts[key];
            }
        }

        for (var key in netseer_opts) {
            if (key === 'status') {
                continue;
            }
            var inline_var_name = "netseer_" + key;
            if (typeof window_options[inline_var_name] !== "undefined") {
                netseer_opts[key] = window_options[inline_var_name];
            }
        }

        if (netseer_opts.status !== 'enabled') {
            return;
        }

        if (!netseer_opts.taglink_id) {
            consoleWarn("Netseer 'taglink_id' option is absent in server configuration JSON. Exiting.");
            netseer_opts.status = 'disabled';
            return;
        }

        if (netseer_opts.open_mode === 'header' && !getIntOrZero(netseer_opts.header_size)) {
            consoleWarn("Netseer 'header' open_mode can be used only with positive 'header_size' option value. Will set open_mode to 'hover'.");
            netseer_opts.open_mode = 'hover';
        }

        if (netseer_opts.open_mode === 'header' && netseer_opts.animation_mode !== 'slide') {
            consoleWarn("Netseer 'header' open_mode can be used only with 'slide' animation_mode. Will set animation_mode to 'slide'.");
            netseer_opts.animation_mode = 'slide';
        }

        if (netseer_opts.animation_mode === 'flip') {
            netseer_opts.side_margin = 0;
            netseer_opts.transparency = 95;
        }
    }

    function getImagesToApply() {
        var images_locator = "";
        if (netseer_opts.img_class_name) {
            images_locator = "img." + netseer_opts.img_class_name;
        } else {
            images_locator = "img";
        }

        var images = $();
        var images_to_skip = netseer_opts.num_skipped_img;
        var locator_to_skip = ".nsinimgblk";

        if (netseer_opts.img_blk_class_name && $.trim(netseer_opts.img_blk_class_name)) {
            var classes_to_skip = netseer_opts.img_blk_class_name.split(",");
            for (var i=0; i<classes_to_skip.length; i++) {
                locator_to_skip = locator_to_skip + ", ." + $.trim(classes_to_skip[i]);
            }
        }

        $(images_locator).not(locator_to_skip).each(function() {
            if ($(this).width() < getIntOrZero(netseer_opts.min_img_width) || $(this).height() < getIntOrZero(netseer_opts.min_img_height)) {
                return;
            }

            if (images_to_skip > 0) {
                images_to_skip--;
                return;
            }

            images = images.add($(this));
            if (images.length >= netseer_opts.max_num_img) {
                return false;
            }
        });

        return images;
    }

    function getCloseButton(banner) {
        var close_btn;
        if (IEVersion && IEVersion < 8) {
            close_btn = $("<a href='#'>X</a>");
        } else {
            close_btn = $("<img src='"+close_button_image+"'>");
        }

        close_btn.css({
            'float': 'right',
            'position': (IEVersion && IEVersion < 7) ? 'static' : 'absolute',
            'cursor': 'pointer',
            'top': '0px',
            'right': '0px',
            'width': '16px',
            'height': '16px',
            'z-index': '20',
            'color': (IEVersion && IEVersion < 7) ? 'white' : 'black',
            'font-weight': 'bold',
            'text-decoration': 'none'
        }).click(function() {
            hideBanner(banner, true);
            return false;
        });
        return close_btn;
    }

    function getBannerContainer(banner) {
        var container = $("<div class='netseer_banner_container'></div>");

        var top = 0;
        var opacity = 1;
        var display = '';
        var width = '100%';

        if (netseer_opts.animation_mode === 'slide') {
            if (netseer_opts.open_mode === 'header') {
                top = (banner.height() - getIntOrZero(netseer_opts.header_size));
            } else {
                top = banner.height();
            }
        } else if (netseer_opts.animation_mode === 'fade' || netseer_opts.animation_mode === 'flip') {
            opacity = 0;
            display = 'none';
        } else if (netseer_opts.animation_mode === 'compress') {
            width = '0';
        }

        container.css({
            'background-color': 'transparent',
            'position': "relative",
            'top': top + 'px',
            'height': '100%',
            'display': display,
            width: width,
            opacity: opacity
        });

        if (netseer_opts.close_mode === 'button') {
            container.append(getCloseButton(banner));
        }

        container.append(getBannerBody(banner));

        return container;
    }

    function getBannerBody(banner) {
        var body = $("<div></div>");
        body.attr('id', "ad" + Math.random());

        body.addClass('netseer_banner_body');
        body.css({
            'background-color': 'transparent',
            'text-align': "center",
            'line-height': '2em',
            'height': '100%',
            'width': '100%',
            'overflow': 'hidden',
            'padding': "0px"
        });
        return body;
    }

    function positionBanner(banner) {
        var image = banner.prev();

        var position = image.position();
        var image_left = position.left;
        var image_top = position.top;
        var margin_top = getIntOrZero(image.css('marginTop'));
        var margin_left = getIntOrZero(image.css('marginLeft'));
        var padding_top = getIntOrZero(image.css('paddingTop'));
        var padding_left = getIntOrZero(image.css('paddingLeft'));
        var border_top = getIntOrZero(image.css('borderTopWidth'));
        var border_left = getIntOrZero(image.css('borderLeftWidth'));

        if (!margin_left) {
            margin_left = 0;
        }
        if (!margin_top) {
            margin_top = 0;
        }

        var actual_bottom = image_top + margin_top + border_top + padding_top + image.height();

        var actual_left = image_left + margin_left + border_left + padding_left + getIntOrZero(netseer_opts.side_margin);

        var banner_width = image.width() - getIntOrZero(netseer_opts.side_margin) * 2;
        var banner_full_height = 0;

        if (netseer_opts.animation_mode === 'flip') {
            banner_full_height = image.height();
        } else {
            banner_full_height = Math.round(image.height() * getIntOrZero(netseer_opts.oc_rate) / 100);
        }

        if (netseer_opts.open_mode === 'header') {
            var banner_height = getIntOrZero(netseer_opts.header_size);
        } else {
            var banner_height = banner_full_height;
        }

        banner.css({
            position: 'absolute',
            overflow: 'hidden',
            'background-color': 'transparent',
            'opacity': getIntOrZero(netseer_opts.transparency) / 100,
            zIndex: 10,
            top: (actual_bottom - banner_height) + "px",
            left: actual_left + "px",
            width: banner_width + "px",
            height: banner_height + "px"
        });

        banner.attr('data-fullHeight', banner_full_height);
        banner.attr('data-fullTop', actual_bottom - banner_full_height);
    }

    function setBannerHandlers(banner) {
        banner.hover(function() {
            clearInterval(banner.attr('data-timer'));
            banner.attr('data-timer', 0);
        }, function() {
            if (banner.attr('data-closeOnMouseLeave') == 1
                    || (netseer_opts.close_mode === 'hover' && netseer_opts.open_mode === 'header')) {
                var timer = setTimeout(function() {
                    hideBanner(banner);
                }, '2');
                banner.attr('data-timer', timer);
                banner.attr('data-closeOnMouseLeave', 0);
            }
        });

        if (netseer_opts.open_mode === 'fixed') {
            showBanner(banner);
        } else if (netseer_opts.open_mode === 'timer') {
            setTimeout(function() {
                showBanner(banner);
            }, getIntOrZero(netseer_opts.open_timer) * 1000);
        } else if (netseer_opts.open_mode === 'header') {
            banner.hover(function() {
                showBanner(banner);
            });
        } else if (netseer_opts.open_mode === 'hover') {
            banner.prev().mouseenter(function() {
                clearInterval(banner.attr('data-timer'));
                banner.attr('data-timer', 0);
                banner.attr('data-closeOnMouseLeave', 0);
                showBanner(banner);
            });
        }

        if (netseer_opts.close_mode === 'hover' && netseer_opts.open_mode !== 'header') {
            banner.prev().mouseleave(function() {
                if (banner.attr('data-status') === 'h') {
                    return;
                }
                var timer = setTimeout(function() {
                    hideBanner(banner);
                }, '2');
                banner.attr('data-timer', timer);
                banner.attr('data-closeOnMouseLeave', 1);
            });
        }
    }

    function addBanner(image) {
        var banner = $("<div></div>");
        banner.hide();

        banner.attr('id', "netseer_image_banner_" + banners_counter++);
        banner.addClass('netseer_image_banner');
        if (netseer_opts.open_mode === 'header') {
            banner.show();
        }
        banner.attr('data-status', 'h');
        image.after(banner);
        positionBanner(banner);
        banner.append(getBannerContainer(banner));
    }

    function showBanner(banner) {
        if (banner.attr('data-status') !== 'h') {
            return;
        }

        banner.show();
        banner.attr('data-status', 'p');

        if (netseer_opts.animation_mode === 'slide') {
            var target_css = {'top': "0px"};

            banner.css('height', banner.attr('data-fullHeight') + 'px');
            banner.css('top', banner.attr('data-fullTop') + 'px');
            if (netseer_opts.open_mode === 'header') {
                banner.find(".netseer_banner_container").css('top', (banner.height() - getIntOrZero(netseer_opts.header_size)) + 'px');
            }
        } else if (netseer_opts.animation_mode === 'fade' || netseer_opts.animation_mode === 'flip') {
            var target_css = {'opacity': 1};
        } else if (netseer_opts.animation_mode === 'compress') {
            var target_css = {'width': "100%"};
        }
        banner.find(".netseer_banner_container").show().animate(target_css, '500', function() {
            banner.attr('data-status', 's');
        });

        if (netseer_opts.close_mode === 'timer') {
            setTimeout(function() {
                hideBanner(banner);
            }, getIntOrZero(netseer_opts.close_timer) * 1000);
        }
    }

    function hideBanner(banner, by_user) {
        if (banner.attr('data-status') !== 's') {
            if (netseer_opts.close_mode === 'hover' && banner.attr('data-status') !== 'h') {
                setTimeout(function() {
                    hideBanner(banner, by_user);
                }, 250);
            }
            return;
        }

        banner.attr('data-status', 'p');
        var banner_height = 0;
        if (netseer_opts.animation_mode === 'slide') {
            if (netseer_opts.open_mode !== 'header' || by_user) {
                var top = banner.height();
            } else {
                var top = banner.height() - getIntOrZero(netseer_opts.header_size);
                var banner_height = getIntOrZero(netseer_opts.header_size);
            }
            var target_css = {'top': top + "px"};
        } else if (netseer_opts.animation_mode === 'fade' || netseer_opts.animation_mode === 'flip') {
            var target_css = {'opacity': 0};
        } else if (netseer_opts.animation_mode === 'compress') {
            var target_css = {'width': "0px"};
        }
        banner.find(".netseer_banner_container").animate(target_css, '500', function() {
            if (by_user) {
                banner.remove();
            } else if (!banner_height) {
                banner.hide();
            } else {
                var diff = banner.height() - banner_height;
                var top = getIntOrZero(banner.css('top')) + diff;
                banner.css('height', banner_height);
                banner.css('top', top);
                $(this).css('top', (banner.height() - getIntOrZero(netseer_opts.header_size)) + 'px');
            }
            banner.attr('data-status', 'h');
            banner.attr('data-closeOnMouseLeave', 0);
        });
    }

    function updateBanners() {
        $(".netseer_image_banner").each(function() {
            positionBanner($(this));
        });
    }

    function bindResizeAndScroll() {
        if (resize_scroll_handled) {
            return;
        }

        var resizeScrollTimeout;
        $(window).resize(function() {
            clearTimeout(resizeScrollTimeout);
            resizeScrollTimeout = setTimeout(updateBanners, 200);
        });

        if (netseer_opts.scroll_recalc === 'enabled') {
            $(window).scroll(function() {
                clearTimeout(resizeScrollTimeout);
                resizeScrollTimeout = setTimeout(updateBanners, 200);
            });
        }
    }

    function netseerApply() {
        if (runTimeout) {
            clearTimeout(runTimeout);
            runTimeout = 0;
        }

        $(".netseer_image_banner").remove();

        initEffectiveOptions();
        if (netseer_opts.status !== 'enabled') {
            return false;
        }

        if (netseer_opts.browser_mode !== "all" && isMobile()) {
            return false;
        }

        getImagesToApply().each(function() {
            addBanner($(this));
        });

        initRenderParameters();
        embedRenderScript();

        bindResizeAndScroll();

        if (IEVersion || IEVersion < 9) {
            setTimeout(updateBanners, 200);
        }
    }

    function getOptionsHost() {
        var host = "cl.netseer.com";
        var protocol = "https:" === window.location.protocol.toLowerCase() ? "https://" : "http://";
        if (window_options.netseer_endpoint) {
            host = window_options.netseer_endpoint;
        }

        return protocol + host;
    }

    function initServerOptionsAndRun() {
        if (typeof netseer_dynamic_stored_options !== "undefined") {
            window_options = netseer_dynamic_stored_options;
        } else {
            window_options = window;
        }

        if (typeof window_options['netseer_tag_id'] === "undefined") {
            consoleWarn("Netseer 'netseer_tag_id' option should be set. Exiting.");
            return false;
        }
        var tag_id = window_options['netseer_tag_id'];

        var page_url = top.location.href;
        if (typeof netseer_page_url !== "undefined") {
            page_url = netseer_page_url;
        }

        var config_url = getOptionsHost() + "/dsatserving2/servlet/InImageConf?tagid=" + tag_id + "&url=" + encodeURIComponent(page_url);
        var timeout = 3000;
        runTimeout = setTimeout(netseerApply, timeout+100);

        $.ajax({
            type: 'GET',
            dataType: "jsonp",
            crossDomain: true,
            url: config_url,
            jsonpCallback: "getNetseerOpts",
            timeout: timeout,
            success: function(){},
            error: function(){}
        })
        .done(function(data) {
            netseer_opts = data;
        })
        .fail(function() {
            consoleWarn("Netseer: can't load configuratin from server (" + config_url + "), will use defaults.");
        })
        .always(function() {
            if (runTimeout) {
                clearTimeout(runTimeout);
                runTimeout = 0;
                netseerApply();
            }
        });
    }

    ////*****************************////////
    // Functions ported from old script ///
    ////*****************************////////

    function getRenderScriptHost() {
        if (window_options.netseer_scriptendpoint) {
            return "http://" + window_options.netseer_scriptendpoint;
        }
        return "https:" === window.location.protocol.toString().toLowerCase() ? "https://ps.ns-cdn.com" : "http://ps.ns-cdn.com";
    }

    function processIframes() {
        $(".netseer_banner_body").each(function() {
            var banner_body = $(this);
            var banner = banner_body.parents('.netseer_image_banner');
            var currentScriptOptions = $.extend(true, {}, render_parameters);
            currentScriptOptions.netseer_append_location = banner_body.attr('id');
            currentScriptOptions.netseer_ad_height = banner.attr('data-fullHeight');
            currentScriptOptions.netseer_ad_width = banner.width();

            netseerMainFunction(currentScriptOptions);
            banner.find('iframe').load(function() {
                var my_banner = banner;
                setBannerHandlers(my_banner);
            });
        });
    }

    function embedRenderScript() {
        if (render_script_loaded) {
            processIframes();
            return;
        }
        var script_url = getRenderScriptHost() + "/dsatserving2/scripts/render.js";

        var script = document.createElement('script');
        script.src = script_url;
        script.type = 'text/javascript';
        script.async = true;
        var loaded = false;
        script.onload = script.onreadystatechange = function() {
            if (!loaded && (!(d = this.readyState) || d == "loaded" || d == "complete")) {
                loaded = true;
                processIframes();
            }
        };
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script);
    }

    function initRenderParameters() {
        var parameters_list = "netseer_cookie_matching netseer_image_size netseer_image_forced netseer_global_fparam netseer_query netseer_ad_frameborder netseer_ad_format netseer_page_url netseer_output_format netseer_language netseer_gl netseer_country netseer_region netseer_city netseer_hints netseer_safe netseer_encoding netseer_ad_output netseer_max_num_ads netseer_ad_channel netseer_contents netseer_adtest netseer_kw_type netseer_kw netseer_num_radlinks netseer_max_radlink_len netseer_rl_filtering netseer_rl_mode netseer_rt netseer_ad_type netseer_image_size netseer_skip netseer_page_location netseer_referrer_url netseer_ad_region netseer_ad_section netseer_bid netseer_cpa_choice netseer_cust_age netseer_cust_gender netseer_cust_interests netseer_cust_id netseer_cust_job netseer_cust_u_url netseer_sim netseer_color_bilboard netseer_banner_id netseer_network_id netseer_tracking_url netseer_tracking_url_encoded netseer_page_url_key netseer_search_current_url netseer_page_params netseer_page_url_base64 netseer_landing_page_type netseer_background_color netseer_click_target netseer_pixel_param1 netseer_pixel_param2 netseer_pixel_param3 netseer_pixel_id netseer_tag_id netseer_client_id netseer_creative_id netseer_auction_id netseer_slot_index netseer_imp_type netseer_ext_vid netseer_advs netseer_taglink_id netseer_segment netseer_iframe_buster netseer_search_param netseer_recirculation_sites netseer_fire_on_trigger netseer_redundant_params netseer_url_pattern netseer_theme_id netseer_imp_src netseer_endpoint netseer_ad_height netseer_ad_width netseer_page_url_key netseer_debug netseer_pixel_cpa netseer_search_term netseer_visitor_cookie netseer_cookie netseer_hints netseer_bing_formcode netseer_embed_external_pixels netseer_referrer_search_term netseer_referrer_domain netseer_concept_group_id netseer_ext_params netseer_url_suffix netseer_embed_style netseer_append netseer_pilot_id netseer_rule_id netseer_enforce_protocol netseer_log_type netseer_ad_position netseer_ad_url netseer_append_location netseer_bcpm netseer_cpc netseer_first_request_date netseer_ip netseer_last_modified_time netseer_lead_params netseer_num_ads netseer_org_error_handler netseer_pcpm netseer_user_id netseer_user_tgid netseer_page_tgid netseer_user_cgid netseer_page_cgid netseer_carrier_id netseer_lat netseer_long netseer_country netseer_city netseer_zip netseer_region netseer_dma netseer_device_type netseer_platform netseer_handset_id netseer_connection netseer_device_id netseer_site_id netseer_app_id netseer_site_name netseer_app_name netseer_ext_channel netseer_aud_segment netseer_demo netseer_inv_type netseer_page_image netseer_req_id netseer_ext_script netseer_seller_id"
                .split(" ");
        for (var i = 0; i < parameters_list.length; i++) {
            var value = null;
            if (typeof window_options[parameters_list[i]] !== "undefined") {
                value = window_options[parameters_list[i]];
            }
            render_parameters[parameters_list[i]] = value;
        }

        render_parameters.location = window.location;
        render_parameters.top = window.top;
        render_parameters.netseer_task = 'ad';
        render_parameters.netseer_taglink_id = netseer_opts.taglink_id;
        render_parameters.netseer_tag_id = null;
        if (netseer_opts.req_id) {
            render_parameters.netseer_req_id = netseer_opts.req_id;
        }
    }

    initServerOptionsAndRun();

    return false;
});
