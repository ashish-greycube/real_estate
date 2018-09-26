
/**
 * Tuna Signup Form Wizard
 * @type Javascript Class
 */

var tunaWizard = {
    stepCount: 0,
    slider: null,
    /**
     * Resize for Responsive
     */
    setResponsive: function() {
        var self = this;
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        windowHeight = windowHeight > 360 ? windowHeight : 360;
        var tunaContainer = $(".tuna-signup-container");
        var tunaLeft = $(".tuna-signup-left");
        var tunaRight = $(".tuna-signup-right");

        if (windowWidth >= 768) {
            tunaContainer.add(tunaLeft).add(tunaRight).innerHeight(windowHeight);
        } else {
            tunaContainer.add(tunaLeft).add(tunaRight).css("height", "auto");
        }


        if (windowHeight < 400) {
            $(".button-container").css("bottom", "50px");
        }

    },
    /**
     * Change Step
     * @param int currentStep
     * @param int nextStep
     * @returns {void|Boolean}
     */
    changeStep: function(currentStep, nextStep) {
        var self = this;

        if (nextStep <= 0 && nextStep > 4) {
            return false;
        }

        //Validations
        if (nextStep === 2) {
            if ($("#tn_name").val().trim() === "") {
                self.setInputError($("#tn_name"));
                return;
            }
        }
        if (nextStep === 3) {
            if ($("#tn_email").val().trim() === "" || !self.isEmail($("#tn_email").val().trim())) {
                self.setInputError($("#tn_email"));
                return;
            }
        }

        if (nextStep === 4) {
            if ($("#tn_phone").val().trim() === "" || $("#tn_phone").val().trim().length < 13) {
                self.setInputError($("#tn_phone"));
                return;
            }
        }
        if (nextStep === 5) {

        }

        //Change Step
        if (nextStep > currentStep) {
            $(".step-active").removeClass("step-active").addClass("step-hide");
        } else {
            $(".step-active").removeClass("step-active");
        }

        var nextStepEl = $(".step[data-step-id='" + nextStep + "']");
        nextStepEl.removeClass("step-hide").addClass("step-active");

        //Focus Input
        window.setTimeout(function() {
            if (nextStep !== self.stepCount) {
                nextStepEl.find("input").focus();
            }
        }, 500);

        var stepCountsEl = $(".steps-count");
        if (nextStep === self.stepCount) {
            console.log('inside transfer')
            stepCountsEl.html("Confirmer");
            $(".button-container").hide();
            var stepConfirm = $(".step-confirm");
            stepConfirm.find("input[name='name']").val($("#tn_name").val());
            stepConfirm.find("input[name='email']").val($("#tn_email").val());
            stepConfirm.find("input[name='phone']").val($("#tn_phone").val());
            stepConfirm.find("input[name='remark']").val($("#tn_remark").val());
        }

        //Current Step Number update
        stepCountsEl.find("span.step-current").text(nextStep);

        //Hide prevButton if we are in first step
        var prevStepEl = $(".prevStep");
        if (nextStep === 1) {
            prevStepEl.hide();
        } else {
            prevStepEl.css("display", "inline-block");
        }
    },
    /**
     * Show Validation Message
     * @param HtmlElement el
     * @returns void
     */
    setInputError: function(el) {
        el.addClass("input-error");
        el.parents(".step").find(".help-info").hide();
        el.parents(".step").find(".help-error").show();
    },
    /**
     * Check email is valid or not
     * @param String value
     * @returns Boolean
     */
    isEmail: function(value) {
        value = value.toLowerCase();
        var reg = new RegExp(/^[a-z]{1}[\d\w\.-]+@[\d\w-]{1,}\.[\w]{2,3}(\.\w{2})?$/);
        return reg.test(value);
    },
    /**
     * Executes Signup Wizard
     * @returns void
     */
    start: function() {
        var self = this;
        /**
         * Testimonial Slider - Uses bxslider jquery plugin
         */
        self.slider = $('.tuna-slider').bxSlider({
            controls: false, // Left and Right Arrows
            auto: true, // Slides will automatically transition
            mode: 'horizontal', // horizontal,vertical,fade
            pager: true, // true, a pager will be added
            speed: 500, // Slide transition duration (in ms)
            pause: 5000 // The amount of time (in ms) between each auto transition
        });

        //Jquery Uniform Plugin
        $(".tuna-signup-container input[type='checkbox'],.tuna-signup-container input[type='radio'], .select").uniform();

        //Jquery Mask Plugin
        $('.tuna-signup-container input[name="phone"],.tuna-signup-container input[name="tn_phone"]').mask('000 000 00 00');

        // Focuses on name input, when page loaded
        window.setTimeout(function() {
            $("#tn_name").focus();
        }, 500);

        // Responsive
        self.setResponsive();
        $(window).resize(function() {
            self.setResponsive();
        });

        // Steps Count
        self.stepCount = $(".tuna-steps .step").length;
        $(".step-count").text(self.stepCount);

        // Next Step
        $(".nextStep").on("click", function() {
            var currentStep = $(".step-active").attr("data-step-id")
            var nextStep = parseFloat(currentStep) + 1;
            self.changeStep(currentStep, nextStep);
        });

        // Prev Step
        $(".prevStep").on("click", function() {
            var currentStep = $(".step-active").attr("data-step-id")
            var nextStep = parseFloat(currentStep) - 1;
            self.changeStep(currentStep, nextStep);
        });

        // Confirm Details - Show Input
        var stepConfirm = $(".step-confirm");
        stepConfirm.find(".input-container a.editInput").on("click", function() {
            $(this).parent().find("input").focus();
        });

        // Confirm Details - Show Password
        stepConfirm.find(".input-container a.showPass").on("mousedown", function() {
            $(this).parent().find("input").attr("type", "text");
        }).mouseup(function() {
            $(this).parent().find("input").attr("type", "password");
        });

        stepConfirm.find(".input-container input").on("focus", function() {
            $(this).parent().find("a").hide();
        });

        stepConfirm.find(".input-container input").on("focusout", function() {
            if (!$(this).hasClass("confirm-input-error")) {
                $(this).parent().find("a").show();
            }
        })

        stepConfirm.find("select").on('shown.bs.select', function(e) {
            $(this).parents(".form-group").find("a.editInput").hide();
        }).on('hidden.bs.select', function(e) {
            $(this).parents(".form-group").find("a.editInput").show();
        });

        //Press Enter and go to nextStep
        $(".step input").not(".step-confirm input").on("keypress", function(e) {
            if (e.keyCode === 13) {
                $(".nextStep").click();
            }
        });

        var signupForm = $("form[name='signupForm']");
        //Press Enter and submit form
        signupForm.find("input").on("keypress", function(e) {
            if (e.keyCode === 13) {
                signupForm.submit();
            }
        });

        //Finish Button
        $(".finishBtn").on("click", function() {
            signupForm.submit();
        })

        // Form Submit
        signupForm.on("submit", function(e) {

            e.preventDefault();

            $(this).find(".confirm-input-error").removeClass("confirm-input-error");

            var nameInput = $(this).find("input[name='name']");
            if (nameInput.val().trim() === "") {
                nameInput.addClass("confirm-input-error").focus();
                return;
            }

            var emailInput = $(this).find("input[name='email']");
            if (emailInput.val().trim() === "" || !self.isEmail(emailInput.val().trim())) {
                emailInput.addClass("confirm-input-error").focus();
                return;
            }

            var phoneInput = $(this).find("input[name='phone']");
            if (phoneInput.val().trim() === "" || phoneInput.val().trim().length < 13) {
                phoneInput.addClass("confirm-input-error").focus();
                return;
            }
            
            var remarkInput = $(this).find("input[name='remark']");




            swal({
                title: null,
                text: "<img class='tuna_loading' src='images/loading.svg'/> Saving...",
                html: true,
                showConfirmButton: false
            });

 
            //Send form to generate lead
            frappe.call({
                method: 'real_estate.api.generate_lead',
                args: {
                    name: nameInput.val(),
                    email: emailInput.val(),
                    phone: phoneInput.val(),
                    for_property: getQueryVariable('for_property')||'',
                    note: remarkInput.val()
                },
                callback: function (r) {
                    console.log(r)
                    if (r.message) {
                        data = r.message
                        if (data.slice(0,4)=='LEAD') {
                            swal({
                                title: "Merci",
                                text: "Vos informations ont été soumises avec succès!",
                                type: "success",
                                confirmButtonText: "Ok"
                            });
                        } else {
                            swal({
                                title: "Error!",
                                text: result.msg,
                                type: "error",
                                confirmButtonText: "Ok"
                            });
                        }
                    }
                }
            });


        });


    },
}


/**
 * Material Input 
 * @returns object
 */
$.fn.materialInput = function() {

    var label;
    var el = this;

    el.find('input.formInput').keydown(function(e) {
        el.setLabel(e.target);
        el.checkFocused(e.target);
    });

    el.find('input.formInput').focusout(function(e) {
        el.setLabel(e.target);
        el.checkUnFocused(e.target);
    });

    this.setLabel = function(target) {
        label = el.find('label[for=' + target.id + ']');
    };

    this.getLabel = function() {
        return label;
    };

    this.checkFocused = function(target) {
        el.getLabel().addClass('active', '');
        $(target).removeClass("input-error");
        $(target).next().hide();
        $(target).parent().find(".info").show();
    };

    this.checkUnFocused = function(target) {
        if ($(target).val().length === 0) {
            el.getLabel().removeClass('active');
        }
    };
};
// start greycube
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}
// end greycube

$(document).ready(function() {

    /**
     * Page Loader
     * If you remove loader, you can delete .tuna-loader-container element from Html, and delete this two rows.
     */
    $(".tuna-loader-container").fadeOut("slow");
    $(".tuna-signup-container").show();


    /**
     * Material Inputs
     * Makes, inputs in selected element material design.
     */
    $(".tuna-steps").materialInput();


    $(".selectpicker").selectpicker();

    /**
     * Tuna Signup Form Wizard
     * Let's Start
     */
    tunaWizard.start();
// start greycube
    var for_property=getQueryVariable('for_property')
    $("p#for_property").text(for_property)
// end greycube
});
