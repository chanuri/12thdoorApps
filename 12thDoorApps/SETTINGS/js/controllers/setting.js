angular
.module('mainApp', ['ngMaterial','directivelibrary','12thdirective','uiMicrokernel', 'ui.router','ui.sortable' ,'ngAnimate' ])

.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/main/tabone');

	$stateProvider
	
        // HOME STATES AND NESTED VIEWS ========================================

        .state('main', {
        	url: '/main',
        	templateUrl: 'setting_partials/main.html',
        	controller: 'ViewCtrl'
        })

        .state('main.one', {
        	url: '/tabone',
        	templateUrl: 'setting_partials/tabone.html',
        	controller: 'oneCtrl'
        })

        .state('main.two', {
        	url: '/tabtwo',
        	templateUrl: 'setting_partials/tabtwo.html',
        	controller: 'twoCtrl'
        })

        .state('main.three', {
        	url: '/tabthree',
        	templateUrl: 'setting_partials/tabthree.html', 
        	controller: 'threeCtrl'
        })

        .state('main.four', {
        	url: '/tabfour',
        	templateUrl: 'setting_partials/tabfour.html',
        	controller: 'taxctrl'
        })
        .state('main.five', {
        	url: '/tabfive',
        	templateUrl: 'setting_partials/tabfive.html',
        	controller:'templatectrl'
        })
        .state('main.six', {
        	url: '/tabsix',
        	templateUrl: 'setting_partials/tabsix.html'
        })
        .state('main.seven', {
        	url: '/tabseven',
        	templateUrl: 'setting_partials/tabseven.html'
        })
        .state('main.eight', {
        	url: '/tabeight',
        	templateUrl: 'setting_partials/tabeight.html'
        	
        })
        .state('main.nine', {
        	url: '/tabnine',
        	templateUrl: 'setting_partials/tabnine.html'
        })

    })

.controller('ViewCtrl', function ($scope,$state, $objectstore, $mdDialog, $rootScope, UploaderService, $window) {

	$scope.nikang = "divani";

	function defaultColors()
	{
		angular.element('#profile').css('background', '#34474E');
		angular.element('#preferences').css('background', '#34474E');
		angular.element('#userrs').css('background', '#34474E');
		angular.element('#taxes').css('background', '#34474E');
		angular.element('#templates').css('background', '#34474E');
		angular.element('#payments').css('background', '#34474E');
		angular.element('#languages').css('background', '#34474E');
		angular.element('#accounts').css('background', '#34474E');
		angular.element('#upgrades').css('background', '#34474E');
	}

	$scope.change_ref = function(sref, id)
	{
		defaultColors();
		$state.go(sref);
		angular.element('#'+id).css('background', '#00acc4');
	}

	
	$rootScope.Settings12thdoor= {

		profile : {
			CusFiel:[],
			
		},

		"preference" : 
		{
			"invoicepref":
			{
				prefix:"",
				editInvoice:false,
				deleteInvoice:false,
				allowPartialPayments:true,
				enableDisscounts:true,
				enableTaxes:true,
				enableshipping:true,
				displayshipaddress:false,
				pdfinvoiceattachment:true,
				notifyadminwheninvoiceviewed:true,
				copyadminallinvoices:true,
				enabletnkuemailforrecipt:true,
				enableremindersoverdueinvoices:true,
				ReminderDays:"",
				defaultComm:"",
				defaultNote:"",
				recurringInvoiceDefultAction:"",
				billdateindays:"",
				emailcustomeruponsavinginvoice:false,
				addstockcancelOrdeleteinvoiceincluCreditnote:true,
				includeaccountstatementwithinvoice:true,
				"CusFiel":new Array(),
				CheckedOfflinePayments:false

			},
			"estimatepref":
			{
				editestimate:false,
				deleteestimate:false,
				displayshiptoaddressestimate:false,
				sendpdfestimateAsattachment:true,
				nofifyadminwhenviewedOraccepted:true,
				copyadminforallestimate:true,
				emailcustomeruponsavingestimate:false,
				includeproductbrochurescustomeremail:true,
				allowPartialPayments:true,
				enableDisscounts:true,
				"CusFiel":[]
			},
			creditNotepref:
			{
				allowPartialPayments:true,
				enableDisscounts:true,
				editcreditNote:false,
				deletecreditNote:false,
				CusFiel:[]
			},
			paymentpref:
			{
				editpayments:false,
				deletepayments:false,
				CusFiel:[],
				PaymentMethod:[]

			},
			expensepref:
			{
				editExpense:false,
				deleteExpense:false,
				CusFiel:[],
				expensecategories:[],
				billingexpensesincludetax:true
			},
			productpref:
			{
				units:[],
				CusFiel:[],
				Productbrands:[],
				Productcategories:[]
			},
			inventorypref:
			{
				ReciptCusFiel:[],
				IssueCusFiel:[]
			},
			contactpref:
			{
				supplierCusFiel:[],
				customerCusFiel:[]
			},
			project:
			{
				edittimesheets:false,
				deletetimesheets:false,
				task:[]
			}

		},

		users : 
		{
			user:{},

			roles:[
			{
				appName : "invoice",
				appPermission : [
				{
					rolename : "admin",
					permission : {
						Add : false,
						View: false
					}
				},
				{
					rolename : "divani",
					permission : {
						invoiceAdd : false,
						invoiceView: true
					}
				}
				]
			},{
				appName : "Estimate",
				appPermission : [
				{
					rolename : "admin",
					permission : {
						invoiceAdd : false,
						invoiceView : false
					}
				},
				{
					rolename : "divani",
					permission : {
						invoiceAdd : false,
						invoiceView : true
					}
				}

				]
			}

			]
		},

		taxes :
		{
			individualtaxes:[],
			multipletaxgroup:[],

		},

		templates :
		{
			image:[]

		},

		payments :
		{


		},


		languages :
		{

		},

		accounts :
		{
			importdata:{},
			exportdata:{},
			canceldata:{}
		},

		upgrades :
		{

		}

	};


	console.log($rootScope.Settings12thdoor);
	
	
	$scope.submit = function() {
		console.log($rootScope.Settings12thdoor);	
		var client = $objectstore.getClient("Settings12thdoor");
		client.onComplete(function(data) {
				//$rootScope.Settings12thdoor=data;
				console.log(data);
				$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.body))
					.content('Successfully Saved.')
					.ariaLabel('Alert Dialog Demo')
					.ok('OK')
					.targetEvent(data)
					);
			});

		client.onError(function(data) {
			$mdDialog.show(
				$mdDialog.alert()
				.parent(angular.element(document.body))
				.content('There was an error saving the data.')
				.ariaLabel('Alert Dialog Demo')
				.ok('OK')
				.targetEvent(data)
				);

		});

		$rootScope.Settings12thdoor.uniqueRecord = "35";
		client.insert($rootScope.Settings12thdoor, {
			KeyProperty: "uniqueRecord"
		});

	}

	var client = $objectstore.getClient("Settings12thdoor");

	client.onGetMany(function(data) {
		if (data) {
			$rootScope.Settings12thdoor=data[0];
			console.log($rootScope.Settings12thdoor);
		}

	});
	client.getByFiltering("*");

})

.controller('oneCtrl', function ($scope,$state, $objectstore, $mdDialog, $rootScope, UploaderService, $window) {

	$scope.url={};	
	$scope.url.email="https://abccompany.12thdoor.com";

	$scope.submit = function() {
		console.log($rootScope.Settings12thdoor);	
		var client = $objectstore.getClient("Settings12thdoor");
		client.onComplete(function(data) {
				//$rootScope.Settings12thdoor=data;
				console.log(data);
				$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.body))
					.content('Successfully Saved.')
					.ariaLabel('Alert Dialog Demo')
					.ok('OK')
					.targetEvent(data)
					);
			});

		client.onError(function(data) {
			$mdDialog.show(
				$mdDialog.alert()
				.parent(angular.element(document.body))
				.content('There was an error saving the data.')
				.ariaLabel('Alert Dialog Demo')
				.ok('OK')
				.targetEvent(data)
				);

		});

		$rootScope.Settings12thdoor.uniqueRecord = "35";
		client.insert($rootScope.Settings12thdoor, {
			KeyProperty: "uniqueRecord"
		});

	}

	$scope.changeUrl= function(ev) {
		$mdDialog.show({
			controller: DialogprofilechangeUrlController,
			templateUrl: 'setting_partials/changeUrlProfile.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true
		})
		.then(function(answer) {

		}, function() {
			$scope.status = 'You cancelled the dialog.';
		});
	};

	function loadcusFieldsprofile(){
		$scope.cusFieldsprofile = $rootScope.Settings12thdoor.profile.CusFiel;
		console.log($scope.cusFieldsprofile);
	};

	$scope.addcusfieldsProfile= function(ev) {
		$mdDialog.show({
			controller: DialogprofileController,
			templateUrl: 'setting_partials/customdetailsforprofile.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true
		})
		.then(function(answer) {
			if(answer == true){
				loadcusFieldsprofile();
			}

		}, function() {
			$scope.status = 'You cancelled the dialog.';
		});
	};

	$scope.deleteprofilerow = function(cusFieldsprofile, index){  
		$rootScope.Settings12thdoor.profile.CusFiel.splice(index, 1);
	}

	$scope.editprofilecusFieldsrow = function(CusFieldsProfileedit, ev) {
		console.log(CusFieldsProfileedit);
		$mdDialog.show({
			controller: DialogEditprofilecusfieldsController,
			templateUrl: 'setting_partials/customdetailsforonetabedit.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			locals: { CusFieldsProfileedit: CusFieldsProfileedit },
			clickOutsideToClose:true
		})
		.then(function(answer) {
			if(answer == true){
				loadcusFieldsprofile();
			}

		}, function() {
			$scope.status = 'You cancelled the dialog.';
		});
	};

	//....................................................................

	function loadlogoimage(){
		$scope.imagelogoprofile = $rootScope.Settings12thdoor.profile.name;
		console.log($scope.imagelogoprofile);
	};

	$scope.uploadImage = function(ev) {
		$mdDialog.show({
			controller: DialogProfileUploadImageController,
			templateUrl: 'setting_partials/uploadImage.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true
		})
		.then(function(answer) {
			loadlogoimage();
		}, function() {
			$scope.status = 'You cancelled the dialog.';
		});
	};

	$scope.deletelogoimage = function(imagelogoprofile, index){  
		$rootScope.Settings12thdoor.profile.name.splice(index, 1);
	}

	var save=function(){
		$scope.imagearray = UploaderService.loadArray();
		if ($scope.imagearray.length > 0) {
			for (indexx = 0; indexx < $scope.imagearray.length; indexx++) {
				$uploader.upload("45.55.83.253","expenseimagesNew", $scope.imagearray[indexx]);//class expenseimagesNew
				$uploader.onSuccess(function(e,data){
				});
				$uploader.onError(function(e,data){       
					var toast = $mdToast.simple()
					.content('There was an error, please upload!')
					.action('OK')
					.highlightAction(false)
					.position("bottom right");
					$mdToast.show(toast).then(function() {
        //whatever
    });
				});       
			}
		};
		$scope.expense.UploadImages.val = UploaderService.loadBasicArray();
	}

})

.controller('twoCtrl', function ($scope,$state, $objectstore, $mdDialog, $rootScope, UploaderService, $window) {

	$scope.toggles = {};

	$scope.toggleOne = function($index){
		for (ind in $scope.accordians)
			if ($scope.toggles[ind] && ind != $index)
				$scope.toggles[ind] = false;

			if (!$scope.toggles[$index])
				$scope.toggles[$index] = true;
			else $scope.toggles[$index] = !$scope.toggles[$index];
		}

		//$rootScope.Settings12thdoor= {};

		$scope.submit = function() {
			console.log($rootScope.Settings12thdoor);	
			var client = $objectstore.getClient("Settings12thdoor");
			client.onComplete(function(data) {
				//$rootScope.Settings12thdoor=data;
				console.log(data);
				$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.body))
					.content('Successfully Saved.')
					.ariaLabel('Alert Dialog Demo')
					.ok('OK')
					.targetEvent(data)
					);
			});

			client.onError(function(data) {
				$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.body))
					.content('There was an error saving the data.')
					.ariaLabel('Alert Dialog Demo')
					.ok('OK')
					.targetEvent(data)
					);

			});

			$rootScope.Settings12thdoor.uniqueRecord = "35";
			client.insert($rootScope.Settings12thdoor, {
				KeyProperty: "uniqueRecord"
			});

		}

// Start customer fields for invoice...............................................................................................
function loadcusFieldsinvoice(){
	$scope.cusFieldsinvoice = $rootScope.Settings12thdoor.preference.invoicepref.CusFiel;
	console.log($rootScope.Settings12thdoor.preference.invoicepref.CusFiel);
};

$scope.addcusfieldsInvoice= function(ev) {
	$mdDialog.show({
		controller: DialogPrefInvoiceController,
		templateUrl: 'setting_partials/addcusfieldsInvoice.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		if(answer == true){
			loadcusFieldsinvoice();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.deleteinvoicecusfieldsrow = function(cusFieldsinvoice, index){  
	$rootScope.Settings12thdoor.preference.invoicepref.CusFiel.splice(index, 1);
}

$scope.editinvoicecusFieldsrow = function(CusFieldsinvoiceedit, ev) {

	console.log(CusFieldsinvoiceedit);
	$mdDialog.show({
		controller: DialogEditprefinvoicecusfieldsController,
		templateUrl: 'setting_partials/editinvoicecusFieldsrow.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { CusFieldsinvoiceedit: CusFieldsinvoiceedit },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		if(answer == true){
			console.log(answer);
			loadcusFieldsinvoice();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});

};

$scope.newinvoiceemail= function(ev) {
	$mdDialog.show({
		controller: DialogPrefInvoicenewinvoiceemailController,
		templateUrl: 'setting_partials/newinvoiceemail.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

//End customer fields for invoice...............................................................................................

// Start customer fields for ESTIMATE...............................................................................................

function loadcusFieldsestimate(){
	$scope.cusFieldsestimate = $rootScope.Settings12thdoor.preference.estimatepref.CusFiel;
	console.log($rootScope.Settings12thdoor.preference.estimatepref.CusFiel);
};

$scope.addcusfieldsEstimate= function(ev) {
	$mdDialog.show({
		controller: DialogPrefEstiController,
		templateUrl: 'setting_partials/addcusfieldsEstimate.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		if(answer == true){
			loadcusFieldsestimate();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.deleteestimatecusfieldsrow = function(cusFieldsestimate, index){  
	$rootScope.Settings12thdoor.preference.estimatepref.CusFiel.splice(index, 1);
}

$scope.editestimatecusFieldsrow = function(CusFieldsestimateedit, ev) {
	console.log(CusFieldsestimateedit);
	$mdDialog.show({
		controller: DialogEditprefEstimatecusfieldsController,
		templateUrl: 'setting_partials/editestimatecusFieldsrow.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { CusFieldsestimateedit: CusFieldsestimateedit },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		if(answer == true){
			loadcusFieldsestimate();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

//End  ESTIMATE...............................................................................................

// Start  PAYMENT.............................................................................................

function loadcusFieldspayment(){
	$scope.cusFieldspayment = $rootScope.Settings12thdoor.preference.paymentpref.CusFiel;
	console.log($rootScope.Settings12thdoor.preference.paymentpref.CusFiel);
};

$scope.addcusfieldsPayment= function(ev) {
	$mdDialog.show({
		controller: DialogPrefPayController,
		templateUrl: 'setting_partials/addcusfieldsPayment.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		if(answer == true){

			loadcusFieldspayment();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.deletepaymentcusfieldsrow = function(cusFieldspayment, index){  
	$rootScope.Settings12thdoor.preference.paymentpref.CusFiel.splice(index, 1);
}

$scope.editpaymentcusFieldsrow = function(CusFieldspaymentedit, ev) {
	console.log(CusFieldspaymentedit);
	$mdDialog.show({
		controller: DialogEditprefpaymentcusfieldsController,
		templateUrl: 'setting_partials/editpaymentcusFieldsrow.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { CusFieldspaymentedit: CusFieldspaymentedit },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		if(answer == true){
			loadcusFieldspayment();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};
//................................

function loadpaymentmethod(){
	$scope.paymentMethod = $rootScope.Settings12thdoor.preference.paymentpref.PaymentMethod;
	console.log($rootScope.Settings12thdoor.preference.paymentpref.PaymentMethod);
};

$scope.addPaymentmethod= function(ev) {
	$mdDialog.show({
		controller: DialogPrefPaycustomerMethodController,
		templateUrl: 'setting_partials/paymentmethodPayment.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		if(answer == true){
			loadpaymentmethod();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.deletepaymentmethodrow = function(paymentMethod, index){  
	$rootScope.Settings12thdoor.preference.paymentpref.PaymentMethod.splice(index, 1);
}

$scope.editpaymentmethodrow = function(paymentmethodedit, ev) {
	console.log(paymentmethodedit);
	$mdDialog.show({
		controller: DialogEditprefpaymentmethodController,
		templateUrl: 'setting_partials/editpaymentmethodrow.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { paymentmethodedit: paymentmethodedit },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		if(answer == true){
			loadpaymentmethod();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.inactivatepaymentmeth="Inactivate";

$scope.inactivatepaymentmethod = function(data){

	if(data.activate){
		data.activate = false;
		$scope.inactivatepaymentmeth="Activate";
	}else{
		data.activate = true;
		$scope.inactivatepaymentmeth="Inactivate";
	}
}

//End for PAYMENT................................................................................................

//Start for EXPENSE..............................................................................................

function loadexpensecate(){
	$scope.expensecategory = $rootScope.Settings12thdoor.preference.expensepref.expensecategories;
	console.log($rootScope.Settings12thdoor.preference.expensepref.expensecategories);
};

$scope.addexpensecategory= function(ev) {
	$mdDialog.show({
		controller: DialogPrefexpensecateController,
		templateUrl: 'setting_partials/ExpenseCategories.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		if(answer == true){
			loadexpensecate();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.deleteexpensecategory = function(expensecategory, index){  
	$rootScope.Settings12thdoor.preference.expensepref.expensecategories.splice(index, 1);
}

$scope.editexpensecategoryrow = function(expensecategoryedit, ev) {
	console.log(expensecategoryedit);
	$mdDialog.show({
		controller: DialogEditprefExpensecategoryController,
		templateUrl: 'setting_partials/editexpensecategoryrow.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { expensecategoryedit: expensecategoryedit },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		if(answer == true){
			loadexpensecate();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.inactivateexpense="Inactivate";

$scope.inaactivateexpenseee = function(data){

	if(data.activate){
		data.activate = false;
		$scope.inactivateexpense="Activate";
	}else{
		data.activate = true;
		$scope.inactivateexpense="Inactivate";
	}
}

//..........................

function loadcusFieldsexpense(){
	$scope.cusFieldsexpense = $rootScope.Settings12thdoor.preference.expensepref.CusFiel;
	console.log($rootScope.Settings12thdoor.preference.expensepref.CusFiel);
};

$scope.addcusfieldsExpense= function(ev) {
	$mdDialog.show({
		controller: DialogPrefcusfieldsExpenseController,
		templateUrl: 'setting_partials/addcusfieldsExpense.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		if(answer == true){

			loadcusFieldsexpense();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.deletcusfieldsexpense = function(cusFieldsexpense, index){  
	$rootScope.Settings12thdoor.preference.expensepref.CusFiel.splice(index, 1);
}

$scope.editcusFieldsexpenserow = function(cusFieldsexpenseedit, ev) {
	console.log(cusFieldsexpenseedit);
	$mdDialog.show({
		controller: DialogEditprefExpensecusfieldsController,
		templateUrl: 'setting_partials/editcusFieldsexpenserow.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { cusFieldsexpenseedit: cusFieldsexpenseedit },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		if(answer == true){
			loadcusFieldsexpense();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

//End EXPENSE................................................................................................

//Start customer fields for PRODUCT..............................................................................................

function loadunitsOfMeasure(){
	$scope.units = $rootScope.Settings12thdoor.preference.productpref.units;
	console.log($rootScope.Settings12thdoor.preference.productpref.units);
};

$scope.addUnits= function(ev) {
	$mdDialog.show({
		controller: DialogUnitsOfMeasureProductController,
		templateUrl: 'setting_partials/addunits.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		if(answer == true){

			loadunitsOfMeasure();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.deleteUnits = function(units, index){  
	$rootScope.Settings12thdoor.preference.productpref.units.splice(index, 1);
}

$scope.editunitsrow = function(unitsedit, ev) {
	console.log(unitsedit);
	$mdDialog.show({
		controller: DialogEditprefunitsOfMeasureController,
		templateUrl: 'setting_partials/editunitsOfMeasurerow.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { unitsedit: unitsedit },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		if(answer == true){
			loadunitsOfMeasure();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.inactivateUnitsOfMeasurelabel="Inactivate";

$scope.inactivateUnitsOfMeasure = function(data){

	if(data.activate){
		data.activate = false;
		$scope.inactivateUnitsOfMeasurelabel="Activate";
	}else{
		data.activate = true;
		$scope.inactivateUnitsOfMeasurelabel="Inactivate";
	}
}

//..........................................

function loadproductbrand(){
	$scope.productBrand = $rootScope.Settings12thdoor.preference.productpref.Productbrands;
	console.log($rootScope.Settings12thdoor.preference.productpref.Productbrands);
};

$scope.addProductbrand= function(ev) {
	$mdDialog.show({
		controller: DialogProductbrandProductController,
		templateUrl: 'setting_partials/addproductbrand.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		if(answer == true){

			loadproductbrand();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.deleteproductBrand = function(productBrand, index){  
	$rootScope.Settings12thdoor.preference.productpref.Productbrands.splice(index, 1);
}

$scope.editproductBrandrow = function(productBrandedit, ev) {
	console.log(productBrandedit);
	$mdDialog.show({
		controller: DialogEditprefProductBrandController,
		templateUrl: 'setting_partials/editproductBrandrow.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { productBrandedit: productBrandedit },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		if(answer == true){
			loadproductbrand();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.inactivateproductbrandlabel="Inactivate";

$scope.inactivateproductbrand = function(data){

	if(data.activate){
		data.activate = false;
		$scope.inactivateproductbrandlabel="Activate";
	}else{
		data.activate = true;
		$scope.inactivateproductbrandlabel="Inactivate";
	}
}
//..............................

function loadProductcategory(){
	$scope.addProductcate = $rootScope.Settings12thdoor.preference.productpref.Productcategories;
	console.log($rootScope.Settings12thdoor.preference.productpref.Productcategories);
};

$scope.addProductcategory= function(ev) {
	$mdDialog.show({
		controller: DialogProductcategoryProductController,
		templateUrl: 'setting_partials/addProductcategory.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		if(answer == true){
			loadProductcategory();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.deleteProductcaterow = function(addProductcate, index){  
	$rootScope.Settings12thdoor.preference.productpref.Productcategories.splice(index, 1);
}

$scope.editProductcaterow = function(addProductcateedit, ev) {
	console.log(addProductcateedit);
	$mdDialog.show({
		controller: DialogEditprefProductcateController,
		templateUrl: 'setting_partials/editProductcaterow.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { addProductcateedit: addProductcateedit },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		if(answer == true){
			loadProductcategory();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.inactivateproductcatelabel="Inactivate";

$scope.inactivateproductcate = function(data){

	if(data.activate){
		data.activate = false;
		$scope.inactivateproductcatelabel="Activate";
	}else{
		data.activate = true;
		$scope.inactivateproductcatelabel="Inactivate";
	}
}



//..............................

function loadcusFieldsproduct(){
	$scope.cusFieldsproduct = $rootScope.Settings12thdoor.preference.productpref.CusFiel;
	console.log($rootScope.Settings12thdoor.preference.productpref.CusFiel);
};

$scope.addcusfieldsProduct= function(ev) {
	$mdDialog.show({
		controller: DialogPrefcusfieldsProductController,
		templateUrl: 'setting_partials/addcusfieldsProduct.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		if(answer == true){
			loadcusFieldsproduct();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.deletcusfieldsexpense = function(cusFieldsproduct, index){  
	$rootScope.Settings12thdoor.preference.productpref.CusFiel.splice(index, 1);
}

$scope.editcusFieldsproductrow = function(cusFieldproductedit, ev) {
	console.log(cusFieldproductedit);
	$mdDialog.show({
		controller: DialogEditprefProductcusfieldsController,
		templateUrl: 'setting_partials/editcusFieldsproductrow.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { cusFieldproductedit: cusFieldproductedit },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		if(answer == true){
			loadcusFieldsproduct();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};
//End PRODUCT................................................................................................

//Start INVENTORY............................................................................................

function loadreciptcusFieldsinventory(){
	$scope.reciptcusFieldsinventory = $rootScope.Settings12thdoor.preference.inventorypref.ReciptCusFiel;
	console.log($rootScope.Settings12thdoor.preference.inventorypref.ReciptCusFiel);
};

$scope.addreciptcusfieldsInventory= function(ev) {
	$mdDialog.show({
		controller: DialogPrefReceiptcusfieldsInventoryController,
		templateUrl: 'setting_partials/addReciptcusfieldsInventory.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		if(answer == true){

			loadreciptcusFieldsinventory();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.deletreciptcusfieldsinventory = function(reciptcusFieldsinventory, index){  
	$rootScope.Settings12thdoor.preference.inventorypref.ReciptCusFiel.splice(index, 1);
}

$scope.editreciptcusFieldsinventoryrow = function(reciptcusFieldInventoryedit, ev) {
	console.log(reciptcusFieldInventoryedit);
	$mdDialog.show({
		controller: DialogEditprefReciptcusfieldsController,
		templateUrl: 'setting_partials/editreciptcusfieldsInventory.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { reciptcusFieldInventoryedit: reciptcusFieldInventoryedit },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		if(answer == true){
			loadcusFieldsinventory();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};
//..................................................

function loadissuescusFieldsinventory(){
	$scope.issuescusFieldsinventory = $rootScope.Settings12thdoor.preference.inventorypref.IssueCusFiel;
	console.log($rootScope.Settings12thdoor.preference.inventorypref.IssueCusFiel);
};

$scope.addissuescusfieldsInventory= function(ev) {
	$mdDialog.show({
		controller: DialogPrefIssuecusfieldsInventoryController,
		templateUrl: 'setting_partials/addIssuecusfieldsInventory.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		if(answer == true){

			loadissuescusFieldsinventory();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.deletissuecusfieldsinventory = function(issuescusFieldsinventory, index){  
	$rootScope.Settings12thdoor.preference.inventorypref.IssueCusFiel.splice(index, 1);
}

$scope.editissuecusFieldsinventoryrow = function(issuecusFieldInventoryedit, ev) {
	console.log(issuecusFieldInventoryedit);
	$mdDialog.show({
		controller: DialogEditprefIssuecusfieldsController,
		templateUrl: 'setting_partials/editissuecusfieldsInventory.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { issuecusFieldInventoryedit: issuecusFieldInventoryedit },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		if(answer == true){
			loadissuescusFieldsinventory();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};
//End INVENTORY................................................................................................

//Start CONTACT................................................................................................

function loadcustomercusFieldscontact(){
	$scope.customercusFieldscontact = $rootScope.Settings12thdoor.preference.contactpref.customerCusFiel;
	console.log($rootScope.Settings12thdoor.preference.contactpref.customerCusFiel);
};

$scope.addcustomercusfieldsContact= function(ev) {
	$mdDialog.show({
		controller: DialogPrefcustomercusfieldsContactController,
		templateUrl: 'setting_partials/addcustomercusfieldsContact.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		if(answer == true){

			loadcustomercusFieldscontact();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.deletcustomercusfieldscontact = function(customercusFieldscontact, index){  
	$rootScope.Settings12thdoor.preference.contactpref.customerCusFiel.splice(index, 1);
}

$scope.editcustomercusFieldscontactrow = function(customercusFieldcontactedit, ev) {
	console.log(customercusFieldcontactedit);
	$mdDialog.show({
		controller: DialogEditprefContactcustomercusfieldsController,
		templateUrl: 'setting_partials/editcustomercusFieldscontactrow.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { customercusFieldcontactedit: customercusFieldcontactedit },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		if(answer == true){
			loadcusFieldscontact();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

//..........................................


function loadsuppliercusFieldscontact(){
	$scope.suppliercusFieldscontact = $rootScope.Settings12thdoor.preference.contactpref.supplierCusFiel;
	console.log($rootScope.Settings12thdoor.preference.contactpref.supplierCusFiel);
};

$scope.addsuppliercusfieldsContact= function(ev) {
	$mdDialog.show({
		controller: DialogPrefsuppliercusfieldsContactController,
		templateUrl: 'setting_partials/addsuppliercusfieldsContact.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		if(answer == true){

			loadsuppliercusFieldscontact();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.deletsuppliercusfieldscontact = function(suppliercusFieldscontact, index){  
	$rootScope.Settings12thdoor.preference.contactpref.supplierCusFiel.splice(index, 1);
}

$scope.editsuppliercusFieldscontactrow = function(suppliercusFieldcontactedit, ev) {
	console.log(suppliercusFieldcontactedit);
	$mdDialog.show({
		controller: DialogEditprefContactsuppliercusfieldsController,
		templateUrl: 'setting_partials/editsuppliercusFieldscontactrow.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { suppliercusFieldcontactedit: suppliercusFieldcontactedit },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		if(answer == true){
			loadsuppliercusFieldscontact();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};
//End CONTACT................................................................................................

//Start PROJECT..............................................................................................

function loadtaskProject(){
	$scope.taskProject = $rootScope.Settings12thdoor.preference.project.task;
	console.log($rootScope.Settings12thdoor.preference.project.task);
};

$scope.addtaskProject= function(ev) {
	$mdDialog.show({
		controller: DialogPreftaskProjectController,
		templateUrl: 'setting_partials/addtaskProject.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		if(answer == true){
			
			loadtaskProject();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.deletetaskProject = function(taskProject, index){  
	$rootScope.Settings12thdoor.preference.project.task.splice(index, 1);
}

$scope.edittaskProjectrow = function(taskProjectedit, ev) {
	console.log(taskProjectedit);
	$mdDialog.show({
		controller: DialogEditpreftaskProjectController,
		templateUrl: 'setting_partials/edittaskProjectrow.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { taskProjectedit: taskProjectedit },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		if(answer == true){
			loadtaskProject();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

//End PROJECT................................................................................................

		//tabs details 
		$scope.accordians=[
		{title: 'Invoice', url: 'setting_partials/invoice.html', spritePosition: '-228px'},
		{title:'Estimate',url: 'setting_partials/estimate.html', spritePosition: '-114px'},
		{title:'Credit Note',url: 'setting_partials/CreditNote.html', spritePosition: '-76px'},
		{title:'Payments',url: 'setting_partials/payment.html', spritePosition: '-266px'},
		{title:'Expense',url: 'setting_partials/expense.html', spritePosition: '-190px'},
		{title:'Product',url: 'setting_partials/product.html', spritePosition: '-304px'},
		{title:'Inventory',url: 'setting_partials/inventory.html', spritePosition: '-418px'},
		{title:'Contact',url: 'setting_partials/contact.html', spritePosition: '-38px'},
		{title:'Project',url: 'setting_partials/project.html', spritePosition: '-342px'},
		{title:'360view',url: 'setting_partials/360view.html', spritePosition: '0px'},
		{title:'File Manager',url: 'setting_partials/FileManager.html', spritePosition: '-152px'}
		];


	})

.controller('threeCtrl', function ($scope,$state, $objectstore, $mdDialog, $rootScope, $window) {

	$scope.submit = function() {
		console.log($rootScope.Settings12thdoor);	
		var client = $objectstore.getClient("Settings12thdoor");
		client.onComplete(function(data) {
			console.log(data);
			$mdDialog.show(
				$mdDialog.alert()
				.parent(angular.element(document.body))
				.content('Successfully Saved.')
				.ariaLabel('Alert Dialog Demo')
				.ok('OK')
				.targetEvent(data)
				);
		});

		client.onError(function(data) {
			$mdDialog.show(
				$mdDialog.alert()
				.parent(angular.element(document.body))
				.content('There was an error saving the data.')
				.ariaLabel('Alert Dialog Demo')
				.ok('OK')
				.targetEvent(data)
				);

		});

		$rootScope.Settings12thdoor.uniqueRecord = "35";
		client.insert($rootScope.Settings12thdoor, {
			KeyProperty: "uniqueRecord"
		});

	}


	$scope.user = function(ev) {
		$mdDialog.show({
			controller: DialogusersController,
			templateUrl: 'setting_partials/user.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true
		})
		.then(function(answer) {
			if(answer==true){

			}

		}, function() {
			$scope.status = 'You cancelled the dialog.';
		});
	};


	function loadRoles(){
		$scope.loadRoless = $rootScope.Settings12thdoor.users.roles;
		console.log($rootScope.Settings12thdoor.users.roles);
	};

	$scope.deleteRoles = function(loadRoless, index){  
		$rootScope.Settings12thdoor.users.roles.splice(index, 1);
	}

	$scope.roles = function(ev) {
		$mdDialog.show({
			controller: DialogrolesController,
			templateUrl: 'setting_partials/roles.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true
		})
		.then(function(answer) {
			if (answer==true) {
				loadRoles();
			};
		}, function() {
			$scope.status = 'You cancelled the dialog.';
		});
	};

})

.controller('taxctrl', function ($scope,$state, $objectstore, $mdDialog, $rootScope, $window) {

	

	$scope.submit = function() {
		console.log($rootScope.Settings12thdoor);	
		var client = $objectstore.getClient("Settings12thdoor");
		client.onComplete(function(data) {
			console.log(data);
			$mdDialog.show(
				$mdDialog.alert()
				.parent(angular.element(document.body))
				.content('Successfully Saved.')
				.ariaLabel('Alert Dialog Demo')
				.ok('OK')
				.targetEvent(data)
				);
		});

		client.onError(function(data) {
			$mdDialog.show(
				$mdDialog.alert()
				.parent(angular.element(document.body))
				.content('There was an error saving the data.')
				.ariaLabel('Alert Dialog Demo')
				.ok('OK')
				.targetEvent(data)
				);

		});

		$rootScope.Settings12thdoor.uniqueRecord = "35";
		client.insert($rootScope.Settings12thdoor, {
			KeyProperty: "uniqueRecord"
		});

	}


	function loadindividualtaxes(){
		$scope.individualtaxes= $rootScope.Settings12thdoor.taxes.individualtaxes;
		console.log($rootScope.Settings12thdoor.taxes.individualtaxes);
	};

	$scope.addindividualtaxes= function(ev) {
		$mdDialog.show({
			controller: DialogindividualtaxController,
			templateUrl: 'setting_partials/individualTaxes.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true
		})
		.then(function(answer) {

			if(answer == true){
				
				loadindividualtaxes();
			}

		}, function() {
			$scope.status = 'You cancelled the dialog.';
		});
	};

	$scope.deletindividualtaxes = function(individualtaxes, index){  
		$rootScope.Settings12thdoor.taxes.individualtaxes.splice(index, 1);
	}

	$scope.editindividualtaxesrow = function(individualtaxesedit, ev) {
		console.log(individualtaxesedit);
		$mdDialog.show({
			controller: DialogEditTaxindividualtaxesController,
			templateUrl: 'setting_partials/editindividualtaxesrow.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			locals: { individualtaxesedit: individualtaxesedit },
			clickOutsideToClose:true
		})
		.then(function(answer) {
			if(answer == true){
				loadindividualtaxes();
			}

		}, function() {
			$scope.status = 'You cancelled the dialog.';
		});
	};

	$scope.inactivateindividual="Inactivate";

	$scope.inactivateindividualtaxes = function(data){

		if(data.activate){
			data.activate = false;
			$scope.inactivateindividual="Activate";
		}else{
			data.activate = true;
			$scope.inactivateindividual="Inactivate";
		}
	}
//....................................................

function loadmultipletaxgroup(){
	$scope.multipletaxgroup = $rootScope.Settings12thdoor.taxes.multipletaxgroup;
	console.log($rootScope.Settings12thdoor.taxes.multipletaxgroup);
};

$scope.addmultipletaxgroup= function(ev) {
	$mdDialog.show({
		controller: DialogmultipletaxgroupController,
		templateUrl: 'setting_partials/multipletaxgroup.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		
		if(answer == true){

			loadmultipletaxgroup();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.deletmultipletaxgroup = function(multipletaxgroup, index){  
	$rootScope.Settings12thdoor.taxes.multipletaxgroup.splice(index, 1);
}

$scope.editmultipletaxgrouprow = function(multipletaxgroupedit, ev) {
	console.log(multipletaxgroupedit);
	$mdDialog.show({
		controller: DialogEditTaxmultipletaxgroupController,
		templateUrl: 'setting_partials/editmultipletaxgrouprow.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { multipletaxgroupedit: multipletaxgroupedit },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		if(answer == true){
			loadindividualtaxes();
		}

	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.inactivatemultiple="Inactivate";

$scope.inactivatemultipletax = function(data){

	if(data.activate){
		data.activate = false;
		$scope.inactivatemultiple="Activate";
	}else{
		data.activate = true;
		$scope.inactivatemultiple="Inactivate";
	}
}

$scope.sortableOptions = {
	containment: '#sortable-container'
};



})

.controller('templatectrl', function ($scope,$state, $objectstore, $mdDialog, $rootScope, $window) {

	$scope.activetemplateinactivate1="Activate";
	$scope.activetemplate1=function(){

		if($scope.activetemplateinactivate1=="Activate"){
			var element = document.getElementById("SearchCardSub");
			element.setAttribute("class", "tintImage");
			$scope.activetemplateinactivate1="Inactivate";
		}
		else{
			var element = document.getElementById("SearchCardSub");
			element.setAttribute("class", "");
			$scope.activetemplateinactivate1="Activate";
		}
	}

	$scope.activetemplateinactivate2="Activate";
	$scope.activetemplate2=function(){

		if($scope.activetemplateinactivate2=="Activate"){
			var element = document.getElementById("SearchCardSub1");
			element.setAttribute("class", "tintImage");
			$scope.activetemplateinactivate2="Inactivate";
		}
		else{
			var element = document.getElementById("SearchCardSub1");
			element.setAttribute("class", "");
			$scope.activetemplateinactivate2="Activate";
		}
	}

	$scope.activetemplateinactivate3="Activate";
	$scope.activetemplate3=function(){

		if($scope.activetemplateinactivate3=="Activate"){
			var element = document.getElementById("SearchCardSub2");
			element.setAttribute("class", "tintImage");
			$scope.activetemplateinactivate3="Inactivate";
		}
		else{
			var element = document.getElementById("SearchCardSub2");
			element.setAttribute("class", "");
			$scope.activetemplateinactivate3="Activate";
		}
	}

});

function DialogprofilechangeUrlController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {
	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

}

function DialogprofileController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	}

	$scope.submit = function() {
		$rootScope.Settings12thdoor.profile.CusFiel.push({
			name:$scope.profname,
			value:$scope.profvalue

		})

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.profile.CusFiel);
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};


};

function DialogEditprofilecusfieldsController($scope, $mdDialog, $objectstore, $mdToast, CusFieldsProfileedit ,$rootScope) {

	$scope.Settings12thdoor=angular.copy(CusFieldsProfileedit);
	console.log($scope.Settings12thdoor);
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.profile.CusFiel.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.profile.CusFiel.push(obj);
		console.log($scope.Settings12thdoor);
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};

function DialogPrefInvoiceController($scope, $mdDialog, $objectstore, $mdToast, $rootScope, dataToPass) {

	if (!$rootScope.Settings12thdoor.preference.invoicepref.CusFiel)
		$rootScope.Settings12thdoor.preference.invoicepref.CusFiel = [];

	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function() {
		//var number = Math.random();
		//console.log(Math.random());
		
		$rootScope.Settings12thdoor.preference.invoicepref.CusFiel.push({
		//	id:number,
			name:$scope.name
		})
		
		$mdDialog.hide();
		console.log($scope.invoiceCusfields);
	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

};

function DialogEditprefinvoicecusfieldsController($scope, $mdDialog, $objectstore, $mdToast,$rootScope,CusFieldsinvoiceedit) {

	$scope.Settings12thdoor=angular.copy(CusFieldsinvoiceedit);
	console.log($scope.Settings12thdoor);
	console.log(CusFieldsinvoiceedit);
	
	$scope.submit = function(obj) {

		for (var i = 0; i < $rootScope.Settings12thdoor.preference.invoicepref.CusFiel.length; i++)
			if ($rootScope.Settings12thdoor.preference.invoicepref.CusFiel[i].id && $rootScope.Settings12thdoor.preference.invoicepref.CusFiel[i].id === obj.id) { 
				$rootScope.Settings12thdoor.preference.invoicepref.CusFiel.splice(i, 1);
				$rootScope.Settings12thdoor.preference.invoicepref.CusFiel.push(obj);
				break;
			}

			$mdDialog.hide();
		}

		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

	};

	function DialogPrefInvoicenewinvoiceemailController($scope , $mdDialog, $objectstore, $mdToast, $rootScope) {

		$scope.readonly = false;
		$scope.selectedItem = null;
		$scope.searchText = null;
		$scope.querySearch = querySearch;
		$scope.customers = loadCustomers();
		$scope.selectedCustomers = [];
		$scope.selectedcustomercc=[];

    /**
     * Search for vegetables.
     */

     function loadCustomers() {
     	var names = [
     	{
     		'name': 'Sam',
     		'type': 'Brassica'
     	},
     	{
     		'name': 'Ann',
     		'type': 'Brassica'
     	},
     	{
     		'name': 'Vishal',
     		'type': 'Umbelliferous'
     	},
     	{
     		'name': 'John',
     		'type': 'Composite'
     	},
     	{
     		'name': 'Lavish',
     		'type': 'Goosefoot'
     	}
     	];
     	return names.map(function (cus) {
     		cus._lowername = cus.name.toLowerCase();
     		cus._lowertype = cus.type.toLowerCase();
     		return cus;
     	});
     }

     function querySearch (query) {
     	var results = query ? $scope.customers.filter(createFilterFor(query)) : [];
     	return results;
     }
    /**
     * Create filter function for a query string
     */
     function createFilterFor(query) {
     	var lowercaseQuery = angular.lowercase(query);
     	return function filterFn(customer) {
     		return (customer._lowername.indexOf(lowercaseQuery) === 0) ||
     		(customer._lowertype.indexOf(lowercaseQuery) === 0);
     	};
     }

     $scope.hide = function() {
     	$mdDialog.hide();
     };

     $scope.cancel = function() {
     	$mdDialog.cancel();
     };

 };

 function DialogPrefEstiController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};
	
	$rootScope.Settings12thdoor.preference.estimatepref.CusFiel = [];
	$scope.submit = function() {
		$rootScope.Settings12thdoor.preference.estimatepref.CusFiel.push({
			name:$scope.ename
		})
		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.preference.estimatepref.CusFiel);
	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};

function DialogEditprefEstimatecusfieldsController($scope, $mdDialog, $objectstore, $mdToast,$rootScope, CusFieldsestimateedit) {

	$scope.Settings12thdoor=angular.copy(CusFieldsestimateedit);
	console.log($scope.Settings12thdoor);
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.preference.estimatepref.CusFiel.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.preference.estimatepref.CusFiel.push(obj);
		console.log($scope.Settings12thdoor)
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};

function DialogPrefPayController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {

	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function() {
		$rootScope.Settings12thdoor.preference.paymentpref.CusFiel.push({
			name:$scope.pname
		})
		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.preference.paymentpref.CusFiel);
	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

};

function DialogEditprefpaymentcusfieldsController($scope, $mdDialog, $objectstore, $mdToast,$rootScope,CusFieldspaymentedit ) {

	$scope.Settings12thdoor=angular.copy(CusFieldspaymentedit);
	console.log($scope.Settings12thdoor);
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.preference.paymentpref.CusFiel.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.preference.paymentpref.CusFiel.push(obj);
		console.log($scope.Settings12thdoor)
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};

function DialogPrefPaycustomerMethodController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {
	
	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function() {
		$rootScope.Settings12thdoor.preference.paymentpref.PaymentMethod.push({
			paymentmethod:$scope.paymentmethod,
			activate:true
		})

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.preference.paymentpref.PaymentMethod);

	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

};

function DialogEditprefpaymentmethodController($scope, $mdDialog, $objectstore, $mdToast,$rootScope,paymentmethodedit ) {

	$scope.Settings12thdoor=angular.copy(paymentmethodedit);
	console.log($scope.Settings12thdoor);
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.preference.paymentpref.PaymentMethod.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.preference.paymentpref.PaymentMethod.push(obj);
		console.log($scope.Settings12thdoor)
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};

function DialogPrefexpensecateController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {

	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function() {
		$rootScope.Settings12thdoor.preference.expensepref.expensecategories.push({
			category:$scope.category,
			activate:true

		})

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.preference.expensepref.expensecategories);

	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

};

function DialogEditprefExpensecategoryController($scope, $mdDialog, $objectstore, $mdToast,$rootScope,expensecategoryedit ) {

	$scope.Settings12thdoor=angular.copy(expensecategoryedit);
	console.log($scope.Settings12thdoor);
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.preference.expensepref.expensecategories.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.preference.expensepref.expensecategories.push(obj);
		console.log($scope.Settings12thdoor)
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};

function DialogPrefcusfieldsExpenseController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {

	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function() {
		$rootScope.Settings12thdoor.preference.expensepref.CusFiel.push({
			name:$scope.expname,
			value:$scope.expvalue
		})

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.preference.expensepref.CusFiel);

	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

};

function DialogEditprefExpensecusfieldsController($scope, $mdDialog, $objectstore, $mdToast,$rootScope,cusFieldsexpenseedit ) {

	$scope.Settings12thdoor=angular.copy(cusFieldsexpenseedit);
	console.log($scope.Settings12thdoor);
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.preference.expensepref.CusFiel.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.preference.expensepref.CusFiel.push(obj);
		console.log($scope.Settings12thdoor)
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};

function DialogUnitsOfMeasureProductController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {

	$scope.submit = function() {
		$rootScope.Settings12thdoor.preference.productpref.units.push({
			unitsOfMeasurement:$scope.unitsOfMeasurement,
			activate:true
		})

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.preference.productpref.units);

	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

}

function DialogEditprefunitsOfMeasureController($scope, $mdDialog, $objectstore, $mdToast,$rootScope, unitsedit) {

	$scope.Settings12thdoor=angular.copy(unitsedit);
	console.log($scope.Settings12thdoor);
	

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.preference.productpref.units.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.preference.productpref.units.push(obj);
		console.log($scope.Settings12thdoor)
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};

function DialogProductbrandProductController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {
	
	$scope.submit = function() {
		$rootScope.Settings12thdoor.preference.productpref.Productbrands.push({
			productbrand:$scope.productbrand,
			activate:true
		})

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.preference.productpref.Productbrands);

	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

};

function DialogEditprefProductBrandController($scope, $mdDialog, $objectstore, $mdToast,$rootScope,productBrandedit ) {

	$scope.Settings12thdoor=angular.copy(productBrandedit);
	console.log($scope.Settings12thdoor);
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.preference.productpref.Productbrands.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.preference.productpref.Productbrands.push(obj);
		console.log($scope.Settings12thdoor)
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};
function DialogProductcategoryProductController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function() {
		$rootScope.Settings12thdoor.preference.productpref.Productcategories.push({
			productcategory:$scope.productcategory,
			activate:true
		})

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.preference.productpref.Productcategories);

	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

};

function DialogEditprefProductcateController($scope, $mdDialog, $objectstore, $mdToast,$rootScope,addProductcateedit ) {

	$scope.Settings12thdoor=angular.copy(addProductcateedit);
	console.log($scope.Settings12thdoor);
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.preference.productpref.Productcategories.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.preference.productpref.Productcategories.push(obj);
		console.log($scope.Settings12thdoor)
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};

function DialogPrefcusfieldsProductController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function() {
		$rootScope.Settings12thdoor.preference.productpref.CusFiel.push({
			name:$scope.prname,
			value:$scope.prvalue
		})

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.preference.productpref.CusFiel);

	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

};

function DialogEditprefProductcusfieldsController($scope, $mdDialog, $objectstore, $mdToast,$rootScope,cusFieldproductedit ) {

	$scope.Settings12thdoor=angular.copy(cusFieldproductedit);
	console.log($scope.Settings12thdoor);
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.preference.productpref.CusFiel.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.preference.productpref.CusFiel.push(obj);
		console.log($scope.Settings12thdoor)
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};

function DialogPrefReceiptcusfieldsInventoryController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function() {
		$rootScope.Settings12thdoor.preference.inventorypref.ReciptCusFiel.push({
			name:$scope.inrname
		})

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.preference.inventorypref.ReciptCusFiel);

	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

};

function DialogEditprefReciptcusfieldsController($scope, $mdDialog, $objectstore, $mdToast,$rootScope,reciptcusFieldInventoryedit ) {

	$scope.Settings12thdoor=angular.copy(reciptcusFieldInventoryedit);
	console.log($scope.Settings12thdoor);
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.preference.inventorypref.ReciptCusFiel.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.preference.inventorypref.ReciptCusFiel.push(obj);
		console.log($scope.Settings12thdoor)
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};

function DialogPrefIssuecusfieldsInventoryController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function() {
		$rootScope.Settings12thdoor.preference.inventorypref.IssueCusFiel.push({
			name:$scope.ininame
		})

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.preference.inventorypref.IssueCusFiel);

	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

};

function DialogEditprefIssuecusfieldsController($scope, $mdDialog, $objectstore, $mdToast,$rootScope,issuecusFieldInventoryedit ) {

	$scope.Settings12thdoor=angular.copy(issuecusFieldInventoryedit);
	console.log($scope.Settings12thdoor);
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.preference.inventorypref.IssueCusFiel.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.preference.inventorypref.IssueCusFiel.push(obj);
		console.log($scope.Settings12thdoor)
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};

function DialogPrefsuppliercusfieldsContactController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {

	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function() {
		$rootScope.Settings12thdoor.preference.contactpref.supplierCusFiel.push({
			name:$scope.cosupname
		})

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.preference.contactpref.supplierCusFiel);

	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

};

function DialogEditprefContactsuppliercusfieldsController($scope, $mdDialog, $objectstore, $mdToast,$rootScope,suppliercusFieldcontactedit ) {

	$scope.Settings12thdoor=angular.copy(suppliercusFieldcontactedit);
	console.log($scope.Settings12thdoor);
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.preference.contactpref.supplierCusFiel.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.preference.contactpref.supplierCusFiel.push(obj);
		console.log($scope.Settings12thdoor)
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};

function DialogPrefcustomercusfieldsContactController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {

	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function() {
		$rootScope.Settings12thdoor.preference.contactpref.customerCusFiel.push({
			name:$scope.cocustomername
		})

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.preference.contactpref.customerCusFiel);

	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

};

function DialogEditprefContactcustomercusfieldsController($scope, $mdDialog, $objectstore, $mdToast,$rootScope,customercusFieldcontactedit ) {

	$scope.Settings12thdoor=angular.copy(customercusFieldcontactedit);
	console.log($scope.Settings12thdoor);
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.preference.contactpref.customerCusFiel.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.preference.contactpref.customerCusFiel.push(obj);
		console.log($scope.Settings12thdoor)
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};

function DialogPreftaskProjectController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {

	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function() {
		$rootScope.Settings12thdoor.preference.project.task.push({
			task:$scope.task,
			rate:$scope.hourlyrate
		})

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.preference.project.task);

	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

};

function DialogEditpreftaskProjectController($scope, $mdDialog, $objectstore, $mdToast,$rootScope,taskProjectedit) {

	$scope.Settings12thdoor=angular.copy(taskProjectedit);
	console.log($scope.Settings12thdoor);
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.preference.project.task.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.preference.project.task.push(obj);
		console.log($scope.Settings12thdoor)
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};

function DialogusersController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

};

function DialogrolesController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {

	$scope.submit = function() {
		$rootScope.Settings12thdoor.users.roles.push({
			roleName:$scope.roleName,
			add:$scope.add,
			view:$scope.view,
			edit:$scope.edit,
			cancel:$scope.cancel,
			delete:$scope.delete,
		});

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.users.roles);
	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

};

function DialogindividualtaxController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {

	$scope.submit = function() {
		$rootScope.Settings12thdoor.taxes.individualtaxes.push({
			taxname:$scope.taxname,
			rate:$scope.rate,
			activate:true,
			compound:$scope.compound,
			type:"individualtaxes"
		})

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.taxes.individualtaxes);

	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	//when selected compund checkbox
	//$scope.whenSelectedCopund=false;
	// $scope.selectedCompound= function(data){
	// 	console.log(data);
	// 	if(data=="true"){
	// 		alert('a');
	// 		$scope.whenSelectedCopund=true;
	// 	}
	// };

};

function DialogEditTaxindividualtaxesController($scope, $mdDialog, $objectstore, $mdToast,$rootScope,individualtaxesedit ) {

	$scope.Settings12thdoor=angular.copy(individualtaxesedit);
	console.log($scope.Settings12thdoor);
	//Start toast ctrl
	$scope.toastPosition = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.taxes.individualtaxes.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.taxes.individualtaxes.push(obj);
		console.log($scope.Settings12thdoor)
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};


function DialogmultipletaxgroupController($scope, $mdDialog, $objectstore, $mdToast, $rootScope) {

	$rootScope.individualtaxes= $rootScope.Settings12thdoor.taxes.individualtaxes;
	console.log($rootScope.individualtaxes);

	$scope.individualtaxes = new Array();

	function loadselctedindivitax(){
		$scope.loadselctedtax=$scope.individualtaxes;
		console.log($scope.individualtaxes);
	} 
	
	$scope.selcetedtax=function(tax){
		// console.log(typeof($scope.individualtax));
		$scope.individualtaxes.push(tax);
		loadselctedindivitax();
	}

	$scope.deleteselecttax = function(loadselctedtax, index){  
		$scope.individualtaxes.splice(index, 1);
	}

	$scope.submit = function() {

		$rootScope.Settings12thdoor.taxes.multipletaxgroup.push({
			taxname:$scope.taxname,
			individualtaxes:$scope.individualtaxes,
			activate:true,
			compound:$scope.compound,
			type:"multipletaxgroup"
		})

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.taxes.multipletaxgroup);

	};

	$scope.sortableOptions = {
		containment: '#sortable-container'
	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

};

function DialogEditTaxmultipletaxgroupController($scope, $mdDialog, $objectstore, $mdToast,$rootScope, multipletaxgroupedit) {
	

	$scope.Settings12thdoor=angular.copy(multipletaxgroupedit);
	console.log($scope.Settings12thdoor);

	$rootScope.individualtaxes= $rootScope.Settings12thdoor.taxes.individualtaxes;

	function loadselctedindivitax(){
		//$scope.Settings12thdoor.individualtaxes=$scope.loadtax;
		$scope.loadtax=$rootScope.Settings12thdoor.taxes.individualtaxes;
		console.log($scope.loadtax);
		console.log($rootScope.Settings12thdoor.taxes.individualtaxes);
	} 
	
	$scope.selcetedtax=function(tax){
		// console.log(typeof($scope.individualtax));
		$rootScope.Settings12thdoor.taxes.individualtaxes.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.taxes.individualtaxes.push(tax);
		console.log(tax);
		
		loadselctedindivitax();
	}

	$scope.deleteselecttax = function(loadselctedtax, index){ 
		$scope.Settings12thdoor.individualtaxes.splice(index, 1);
	}

	$scope.getToastPosition = function() 
	{
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};

	$scope.submit = function(obj) {
		$rootScope.Settings12thdoor.taxes.multipletaxgroup.splice($scope.Settings12thdoor,1);
		$rootScope.Settings12thdoor.taxes.multipletaxgroup.push(obj);
		console.log($scope.Settings12thdoor)
		$mdDialog.hide();
	}

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
};

function DialogProfileUploadImageController($scope, $mdDialog, $objectstore, $mdToast,$rootScope, UploaderService) {

	

	$scope.submit = function() {
		$rootScope.Settings12thdoor.profile.name = UploaderService.loadBasicArray();

		$mdDialog.hide();
		console.log($rootScope.Settings12thdoor.profile.name);

	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
}

