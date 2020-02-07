var generator = {

	setListeners: function() {

		$("#clientId, #description, #price, #shippingCost, #taxRate").on("change keyup", function(e) {
            e.preventDefault();
            generator.getAllValues();
        });

        $("#buttonColor, #buttonShape, #buttonLabel").on("change", function(e) {
            e.preventDefault();
            generator.getAllValues();
        });

        $("#item-options").on("change", function(e) {
            e.preventDefault();
            generator.getAllValues();
        });

        $("#currency").on("change", function(e) {
            e.preventDefault();
            generator.itemsChanged();
        });

        $('#copyToClipboard').on('click', function(e) {
            e.preventDefault();
            generator.copyToClipboard('#codePreview');
        });

        $('#add-another-option').on('click', function(e) {
            e.preventDefault();
            generator.addAnotherOption();
        });

        $('#itemsQuantity').on('change', function(e) {
            e.preventDefault();
            this.checked ? $('#quantity-section, #quantity-options').removeClass('hidden') : $('#quantity-section, #quantity-options').addClass('hidden');
            generator.quantityChanged();
        });

        $("#quantity").on("change keyup", function(e) {
            e.preventDefault();
            generator.quantityChanged();
        });

        generator.optionsListener();

	},

	optionsListener: function() {

		$(".items-name, .items-price").on("change", function(e) {
            e.preventDefault();
            generator.itemsChanged();
        });

	},

	addAnotherOption: function() {

		var currentNumberItems = $('#items-section > div').length;

		var newItem =	'<div class="col-md-8">' +
			            	'<div class="form-group col-md-6 items-name"><input type="text" value="Option ' + (currentNumberItems + 1) + '" id="items-name-' + (currentNumberItems + 1) + '"></div>' +
			            	'<div class="form-group col-md-6 items-price"><input type="text" value="" id="items-price-' + (currentNumberItems + 1) + '"></div>' +
			          	'</div>';

		$('#items-section').append(newItem);

		generator.optionsListener();

		generator.itemsChanged();

	},

	itemsChanged: function() {

		$('#item-options').empty();

		var currency = $('#currency').val();

		var currentNumberItems = $('#items-section > div').length;

		for (var i = 1; i < (currentNumberItems + 1); i++) {

			var optionName = $('#items-name-' + (i)).val();
			var optionPrice = $('#items-price-' + (i)).val();

			var optionValue = optionName + ' $' + optionPrice + ' ' + currency;

			var option = '<option value="' + optionValue + '" price="' + optionPrice + '">' + optionValue + '</option>';

			$('#item-options').append(option);
		}

		generator.getAllValues();


	},

	quantityChanged: function() {

		$('#quantity-options').empty();

		var currentNumberQuantities = parseInt($('#quantity').val());

		for (var i = 1; i < (currentNumberQuantities + 1); i++) {

			var option = '<option value="' + i + '">' + i + '</option>';

			$('#quantity-options').append(option);
		}

		generator.getAllValues();

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

        var currency = $('#currency').val();
        var shippingCost = ($('#shippingCost').val().length === 0) ? 0 : $('#shippingCost').val();
        var taxRate = ($('#taxRate').val().length === 0) ? 0 : $('#taxRate').val();
        var buttonColor = $('#buttonColor').val();
        var buttonShape = $('#buttonShape').val();
        var buttonLabel = $('#buttonLabel').val();

        var itemsContainer = generator.getItemsContainer();
        var quantityContainer = generator.getQuantityContainer();

        generator.renderCode(clientId,description,currency,shippingCost,taxRate,buttonColor,buttonShape,buttonLabel,itemsContainer,quantityContainer);
        generator.renderButton(clientId,description,currency,shippingCost,taxRate,buttonColor,buttonShape,buttonLabel);

	},

	getItemsContainer: function() {

		var itemsOptions = '';
		
		var currency = $('#currency').val();

		var currentNumberItems = $('#items-section > div').length;

		for (var i = 1; i < (currentNumberItems + 1); i++) {

			var optionName = $('#items-name-' + (i)).val();
			var optionPrice = $('#items-price-' + (i)).val();

			var optionValue = optionName + ' $' + optionPrice + ' ' + currency;

			var option = '\t\t\t<option value="' + optionValue + '" price="' + optionPrice + '">' + optionValue + '</option>\n';

			itemsOptions += option;
		}

		var itemsContainer = 	"\t<div>\n" + 
								"\t\t<p>Payment Options</p>\n" + 
							    "\t\t<select id=\"item-options\">\n" + 
							    itemsOptions + 
							    "\t\t</select>\n" + 
							    "\t</div>\n\n";



		return itemsContainer;

	},

	getQuantityContainer: function() {

		var quantityContainer = '';

		if ($("#itemsQuantity").prop("checked")) {

			var quantityOptions = '';

			var currentNumberQuantities = parseInt($('#quantity').val());

			for (var i = 1; i < (currentNumberQuantities + 1); i++) {

				var option = '\t\t\t<option value="' + i + '">' + i + '</option>\n';

				quantityOptions += option;
			}
		
			quantityContainer =	"\t<div>\n" + 
									"\t\t<p>Select Quantity</p>\n" + 
								    "\t\t<select id=\"quantity-options\">\n" + 
								    quantityOptions + 
								    "\t\t</select>\n" + 
								    "\t\t<div id=\"paypal-button-container\"></div>\n" + 
								    "\t</div>\n\n";

		}



		return quantityContainer;

	},

	renderCode: function(clientId,description,currency,shippingCost,taxRate,buttonColor,buttonShape,buttonLabel,itemsContainer,quantityContainer) {

		$('#codePreview').empty();

		var quantityIsChecked = $("#itemsQuantity").prop("checked");

		var quantityOptionsCode = "";
		var selectedQuantityCode = "";
		var selectedQuantityValue = "1";
		var priceTotalCode = "var priceTotal = selectedItemPrice + parseFloat(" + shippingCost + ") + tax;\n";

		var itemTotalCode = "selectedItemPrice \n";
		var taxItemGroup = "selectedItemPrice";

		if (quantityIsChecked) {
			quantityOptionsCode =	"\t\t\t\tvar quantityOptions = document.getElementById(\"quantity-options\");\n";
			selectedQuantityCode =	"\t\t\t\tvar selectedQuantity = parseInt(quantityOptions.options[quantityOptions.selectedIndex].value);\n";
			selectedQuantityValue = "selectedQuantity";
			priceTotalCode = "var priceTotal = selectedQuantity * selectedItemPrice + parseFloat(" + shippingCost + ") + tax;\n";
			itemTotalCode = "selectedQuantity * selectedItemPrice";
			taxItemGroup = "selectedQuantity * selectedItemPrice";
		}

		var code =	"<body>\n" + 
					itemsContainer + 
					quantityContainer +
					"\t<script src=\"https://www.paypal.com/sdk/js?client-id=" + clientId + "&currency=" + currency + "\"></script>\n" +
					"\n" +
					"\t<div id=\"paypal-button-container\"></div>\n" +
					"\t<script>\n" +
					"\n" +
					"\tpaypal.Buttons({\n" +
					"\t\tstyle: {\n" +
					"\t\t\tcolor:  '" + buttonColor + "',\n" +
					"\t\t\tshape:  '" + buttonShape + "',\n" +
					"\t\t\tlabel:  '" + buttonLabel + "'\n" +
					"\t\t},\n" +
					"\t\tcreateOrder: function(data, actions) {\n" +
					"\n" +
					"\t\t\t\tvar itemsOptions = document.getElementById(\"item-options\");\n" +
				    "\t\t\t\tvar selectedItemDescription = itemsOptions.options[itemsOptions.selectedIndex].value;\n" +
				    "\t\t\t\tvar selectedItemPrice = parseFloat(itemsOptions.options[itemsOptions.selectedIndex].getAttribute(\"price\"));\n" +
				    "\n" +
				    quantityOptionsCode + 
				    selectedQuantityCode +
				    "\n" +
					"\t\t\t\tvar tax = (" + taxRate + " === 0) ? 0 : (" + taxItemGroup + " * (parseFloat(" + taxRate + ")/100));\n" +
					"\t\t\t\t" + priceTotalCode +
					"\n" +
        			"\t\t\t\ttax = Math.round(tax * 100) / 100;\n" +
        			"\t\t\t\tpriceTotal = Math.round(priceTotal * 100) / 100;\n" +
					"\n" +
					"\t\t\treturn actions.order.create({\n" +
					"\n" +
					"\t\t\t\tpurchase_units: [{\n" +
					"\t\t\t\t\tdescription: '" + description + "',\n" +
					"\t\t\t\t\tamount: {\n" +
					"\t\t\t\t\t\tcurrency_code: '" + currency + "',\n" + 
					"\t\t\t\t\t\tvalue: priceTotal ,\n" +
					"\t\t\t\t\t\tbreakdown: {\n" +
					"\t\t\t\t\t\t\titem_total: {\n" +
					"\t\t\t\t\t\t\t\tcurrency_code: '" + currency + "',\n" +
					"\t\t\t\t\t\t\t\tvalue: " + itemTotalCode + "\n" +
					"\t\t\t\t\t\t\t},\n" +
					"\t\t\t\t\t\t\tshipping: {\n" +
					"\t\t\t\t\t\t\t\tcurrency_code: '" + currency + "',\n" +
					"\t\t\t\t\t\t\t\tvalue: '" + shippingCost + "'\n" +
					"\t\t\t\t\t\t\t},\n" +
					"\t\t\t\t\t\t\ttax_total: {\n" +
					"\t\t\t\t\t\t\t\tcurrency_code: '" + currency + "',\n" +
					"\t\t\t\t\t\t\t\tvalue: tax\n" +
					"\t\t\t\t\t\t\t}\n" +
					"\t\t\t\t\t\t}\n" +
					"\t\t\t\t\t},\n" +
					"\t\t\t\t\titems: [{\n" +
					"\t\t\t\t\t\tname: selectedItemDescription,\n" +
					"\t\t\t\t\t\tunit_amount: {\n" +
					"\t\t\t\t\t\t\tcurrency_code: '" + currency + "',\n" +
					"\t\t\t\t\t\t\tvalue: selectedItemPrice\n" +
					"\t\t\t\t\t\t},\n" +
					"\t\t\t\t\t\tquantity: " + selectedQuantityValue + "\n" +
					"\t\t\t\t\t}]\n" +
					"\t\t\t\t}]\n" +
					"\t\t\t});\n" +
					"\t\t},\n" +
					"\n" +
					"\t\tonApprove: function(data, actions) {\n" +
					"\t\t\treturn actions.order.capture().then(function(details) {\n" +
					"\t\t\t\talert('Transaction completed by ' + details.payer.name.given_name + '!');\n" +
					"\t\t\t});\n" +
					"\t\t}\n" +
					"\n" +    
					"\t}).render('#paypal-button-container');\n" +
					"\n" +
					"\t</script>\n" +
					"</body>";

		$('#codePreview').text(code);

	},

	renderButton: function(clientId,description,currency,shippingCost,taxRate,buttonColor,buttonShape,buttonLabel) {

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

	            createOrder: function(data, actions) {

	            	var quantityIsChecked = $("#itemsQuantity").prop("checked");

	            	var itemsOptions = document.getElementById("item-options");
					var selectedItemDescription = itemsOptions.options[itemsOptions.selectedIndex].value;
					var selectedItemPrice = parseFloat(itemsOptions.options[itemsOptions.selectedIndex].getAttribute("price"));

					var selectedQuantity = 1;

					var tax = (taxRate === 0) ? 0 : (selectedItemPrice * (parseFloat(taxRate)/100));
					var priceTotal = selectedItemPrice + parseFloat(shippingCost) + tax;

					if (quantityIsChecked) {
						var quantityOptions = document.getElementById("quantity-options");
						selectedQuantity = parseInt(quantityOptions.options[quantityOptions.selectedIndex].value);
						tax = (taxRate === 0) ? 0 : (selectedQuantity * selectedItemPrice * (parseFloat(taxRate)/100));
						priceTotal = selectedQuantity * selectedItemPrice + parseFloat(shippingCost) + tax;
					}

					tax = Math.round(tax * 100) / 100;
					priceTotal = Math.round(priceTotal * 100) / 100;

					return actions.order.create({						

						purchase_units: [{
							description: 'Prueba',
							amount: {
								currency_code: currency,
								value: priceTotal,
								breakdown: {
									item_total: {
										currency_code: currency,
										value: selectedQuantity * selectedItemPrice 
									},
									shipping: {
										currency_code: currency,
										value: parseFloat(shippingCost)
									},
									tax_total: {
										currency_code: currency,
										value: tax
									}
								}
							},
							items: [{
								name: selectedItemDescription,
								unit_amount: {
									currency_code: currency,
									value: selectedItemPrice
								},
								quantity: selectedQuantity
							}]
						}]
					});
				},

				onApprove: function(data, actions) {
					return actions.order.capture().then(function(details) {
						alert('Transaction completed by ' + details.payer.name.given_name + '!');
					});
				}

			}).render('#paypal-button-container');

		};

	}
	
};

generator.setListeners();