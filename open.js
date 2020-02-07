var generator = {

	setListeners: function() {

		$("#clientId, #descriptionLabel, #amountLabel").on("change keyup", function(e) {
            e.preventDefault();
            generator.getAllValues();
        });

        $("#currency, #buttonColor, #buttonShape, #buttonLabel").on("change", function(e) {
            e.preventDefault();
            generator.getAllValues();
        });

        $('#copyToClipboard').on('click', function(e) {
            e.preventDefault();
            generator.copyToClipboard('#codePreview');
        });


	},

	copyToClipboard: function(element) {

		var $temp = $("<input>");
	    $("body").append($temp);
	    $temp.val($(element).text()).select();
	    document.execCommand("copy");
	    $temp.remove();

	},

	getAllValues: function() {

		var clientId = $('#clientId').val();
		var descriptionLabel = $('#descriptionLabel').val();
		var amountLabel = $('#amountLabel').val();
        var currency = $('#currency').val();
        var buttonColor = $('#buttonColor').val();
        var buttonShape = $('#buttonShape').val();
        var buttonLabel = $('#buttonLabel').val();

        generator.renderCode(clientId,descriptionLabel,amountLabel,currency,buttonColor,buttonShape,buttonLabel);
        generator.renderButton(clientId,currency,buttonColor,buttonShape,buttonLabel);

	},

	renderCode: function(clientId,descriptionLabel,amountLabel,currency,buttonColor,buttonShape,buttonLabel) {

		$('#codePreview').empty();

		var code =	"<div style=\"text-align: center\"> " + descriptionLabel + ": <input type=\"text\" id=\"description\" placeholder=" + descriptionLabel + " value=\"\"></div>\n" + 
					"<div style=\"text-align: center\"> " + amountLabel + ": <input type=\"text\" id=\"amount\" placeholder=" + amountLabel + " value=\"\" > " + currency +"</div> \n" +
					"\n" +
					"<div id=\"paypal-button-container\"></div> \n" +
					"<script src=\"https://www.paypal.com/sdk/js?client-id=" + clientId + "&currency=" + currency + "\"></script>\n" +
					"\n" +
					"<script>\n" +
					"\n" +
					"paypal.Buttons({\n" +
					"\tstyle: {\n" +
					"\t\tcolor:  '" + buttonColor + "',\n" +
					"\t\tshape:  '" + buttonShape + "',\n" +
					"\t\tlabel:  '" + buttonLabel + "'\n" +
					"\t},\n" +
					"\tcreateOrder: function(data, actions) {\n" +
					"\t\treturn actions.order.create({\n" +
					"\t\t\tpurchase_units: [{\n" +
					"\t\t\t\tdescription: document.getElementById(\"description\").value,\n" +
					"\t\t\t\tamount: {\n" +
					"\t\t\t\t\tvalue: document.getElementById(\"amount\").value,\n" +
					"\t\t\t\t}\n" +
					"\t\t\t}]\n" +
					"\t\t});\n" +
					"\t},\n" +
					"\n" +
					"\tonApprove: function(data, actions) {\n" +
					"\t\treturn actions.order.capture().then(function(details) {\n" +
					"\t\t\talert('Transaction completed by ' + details.payer.name.given_name + '!');\n" +
					"\t\t});\n" +
					"\t}\n" +
					"\n" +    
					"}).render('#paypal-button-container');\n" +
					"\n" +
					"</script>";

		$('#codePreview').text(code);

	},

	renderButton: function(clientId,currency,buttonColor,buttonShape,buttonLabel) {

		$('#paypal-button-container').empty();

		var script = document.createElement('script');
		script.src = 'https://www.paypal.com/sdk/js?currency=' + currency + '&client-id=' + clientId;

		document.getElementById('paypal-button-container').appendChild(script); 

		script.onload = function () {
		    
			// Render the PayPal button into #paypal-button-container
	        paypal.Buttons({
	            
	            style: {
	                color:  buttonColor,
	                shape:  buttonShape,
	                label:  buttonLabel
	            },
	            // Set up the transaction
	            createOrder: function(data, actions) {
	                return actions.order.create({
	                    purchase_units: [{
	                        description:  document.getElementById("description").value,
	                        amount: {
	                            value: document.getElementById("amount").value
	                        }
	                    }]
	                });
	            },

	            // Finalize the transaction
	            onApprove: function(data, actions) {
	                return actions.order.capture().then(function(details) {
	                    // Show a success message to the buyer
	                    alert('Transaction completed by ' + details.payer.name.given_name + '!');
	                });
	            }


	        }).render('#paypal-button-container');

		};

	}
	
};

generator.setListeners();