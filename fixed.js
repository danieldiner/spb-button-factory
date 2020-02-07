var generator = {

	setListeners: function() {

		$("#clientId, #description, #price, #shippingCost, #taxRate").on("change keyup", function(e) {
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
		var description = $('#description').val();
		var price = $('#price').val();
        var currency = $('#currency').val();
        var shippingCost = ($('#shippingCost').val().length === 0) ? 0 : $('#shippingCost').val();
        var taxRate = ($('#taxRate').val().length === 0) ? 0 : $('#taxRate').val();
        var buttonColor = $('#buttonColor').val();
        var buttonShape = $('#buttonShape').val();
        var buttonLabel = $('#buttonLabel').val();

        var tax = (taxRate === 0) ? 0 : (parseFloat(price) * (parseFloat(taxRate)/100));
        var priceTotal = parseFloat(price) + parseFloat(shippingCost) + tax;

        tax = Math.round(tax * 100) / 100;
        priceTotal = Math.round(priceTotal * 100) / 100;

        generator.renderCode(clientId,description,price,currency,shippingCost,tax,buttonColor,buttonShape,buttonLabel,priceTotal);
        generator.renderButton(clientId,description,price,currency,shippingCost,tax,buttonColor,buttonShape,buttonLabel,priceTotal);

	},

	renderCode: function(clientId,description,price,currency,shippingCost,tax,buttonColor,buttonShape,buttonLabel,priceTotal) {

		$('#codePreview').empty();

		var code =	"<div id=\"paypal-button-container\"></div> \n" +
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
					"\t\t\t\tdescription: '" + description + "',\n" +
					"\t\t\t\tamount: {\n" +
					"\t\t\t\t\tcurrency_code: '" + currency + "',\n" + 
					"\t\t\t\t\tvalue: '" + priceTotal + "',\n" +
					"\t\t\t\t\tbreakdown: {\n" +
					"\t\t\t\t\t\titem_total: {\n" +
					"\t\t\t\t\t\t\tcurrency_code: '" + currency + "',\n" +
					"\t\t\t\t\t\t\tvalue: '" + price + "'\n" +
					"\t\t\t\t\t\t},\n" +
					"\t\t\t\t\t\tshipping: {\n" +
					"\t\t\t\t\t\t\tcurrency_code: '" + currency + "',\n" +
					"\t\t\t\t\t\t\tvalue: '" + shippingCost + "'\n" +
					"\t\t\t\t\t\t},\n" +
					"\t\t\t\t\t\ttax_total: {\n" +
					"\t\t\t\t\t\t\tcurrency_code: '" + currency + "',\n" +
					"\t\t\t\t\t\t\tvalue: '" + tax + "'\n" +
					"\t\t\t\t\t\t}\n" +
					"\t\t\t\t\t}\n" +
					"\t\t\t\t},\n" +
					"\t\t\t\titems: [{\n" +
					"\t\t\t\t\tname: 'Hurley Hoodie',\n" +
					"\t\t\t\t\tunit_amount: {\n" +
					"\t\t\t\t\t\tcurrency_code: 'USD',\n" +
					"\t\t\t\t\t\tvalue: '198.00'\n" +
					"\t\t\t\t\t},\n" +
					"\t\t\t\t\tquantity: '1'\n" +
					"\t\t\t\t}]\n" +
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

	renderButton: function(clientId,description,price,currency,shippingCost,tax,buttonColor,buttonShape,buttonLabel,priceTotal) {

		$('#paypal-button-container').empty();

		var script = document.createElement('script');
		script.src = 'https://www.paypal.com/sdk/js?client-id=' + clientId + '&currency=' + currency;

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
	                        description:  description,
	                        amount: {
	                            currency_code:  currency,
	                            value: priceTotal,
	                            breakdown: {
	                              item_total: {
	                                currency_code: currency,
	                                value: price
	                              },
	                              shipping: {
	                                currency_code: currency,
	                                value: shippingCost
	                              },
	                              tax_total: {
	                                currency_code: currency,
	                                value: tax
	                              }
	                            }
	                        }, 
	                        items: [{
	                            name: 'Hurley Hoodie',
	                            unit_amount: {
	                              currency_code: currency,
	                              value: price,
	                            },
	                            quantity: '1'
	                        }]
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