rasm.service('$objectstoreAccess', ['$objectstore', '$auth', '$mdDialog'
	, function ($objectstore, $auth, $mdDialog) {
		this.LoadAllDetails = function (namespace, callback) {
			var client = $objectstore.getClient(namespace);
			client.onGetMany(function (data) {
				// return data; //cannot return in asynchronous function 
				callback(data);
			});
			client.onError(function (data) {
				$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.body))
					.title('This is embarracing')
					.content('There was error while retreving the data.')
					.ariaLabel('Alert Dialog Demo')
					.ok('OK')
					.targetEvent(data)
				);
			});
			client.getByFiltering("*");
		};
		this.LoadOneDetails = function (namespace, key, callback) {
			var client = $objectstore.getClient(namespace);
			client.onGetOne(function (data) {
				callback(data);
			});
			client.onError(function (data) {
				$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.body))
					.title('This is embarracing')
					.content('There was error while retreving the record.')
					.ariaLabel('Alert Dialog Demo')
					.ok('OK')
					.targetEvent(data)
				);
			});
			client.getByKey(key);
		}
	}
]);

rasm.factory('$EditUploadData',function($rootScope){
	$rootScope.UploadData = [];
	return{
		PutData:function(arr){
			$rootScope.UploadData = angular.copy(arr);
		},
		LoadData:function(){
			return $rootScope.UploadData;
		}
	}
});
rasm.service('$DownloadPdf',function(){
	this.GetPdf = function(obj){
		obj = hasNull(obj); 

		console.log(obj);
		var FullTags = "";
		if (obj.tags.length > 0) {
			for (i = 0; i < obj.tags.length; i++) {
				FullTags = FullTags + ' ' + obj.tags[i]
			}
		};
		
		var doc = new jsPDF();
		doc.setFillColor(182, 182, 182);
		doc.rect(20, 13, 80, 10, 'F');
		doc.setFontSize(18);
		doc.text(40, 20, 'USD ' + obj.totalUSD + '.00');
		doc.setFontSize(14);
		doc.text(20, 30, 'Expense No');
		doc.setFontSize(14);
		doc.text(60, 30, obj.expense_code);
		doc.setFontSize(14);
		doc.text(20, 40, 'Expense Date');
		doc.setFontSize(14);
		doc.text(60, 40, obj.date);
		doc.setFontSize(14);
		doc.text(20, 50, 'Category');
		doc.setFontSize(14);
		doc.text(60, 50, obj.Category);
		doc.setFontSize(14);
		doc.text(20, 60, 'Description');
		doc.setFontSize(14);
		doc.text(60, 60, obj.description);
		doc.setFontSize(14);
		doc.text(20, 70, 'Amount');
		doc.setFontSize(14);
		doc.text(60, 70, obj.Amount);
		doc.setFontSize(14);
		doc.text(20, 80, 'Tax');
		doc.setFontSize(14);
		doc.text(60, 80, obj.Tax);
		doc.setFontSize(14);
		doc.text(20, 90, 'Supplier');
		doc.setFontSize(14);
		doc.text(60, 90, obj.Vendor);
		doc.setFontSize(14);
		doc.text(20, 100, 'Reference');
		doc.setFontSize(14);
		doc.text(60, 100, obj.Reference);
		doc.setFontSize(14);
		doc.text(20, 110, 'Status');
		doc.setFontSize(14);
		doc.text(60, 110, obj.Status);
		doc.setFontSize(14);
		doc.text(20, 120, 'Due Date');
		doc.setFontSize(14);
		doc.text(60, 120, obj.Duedate);
		doc.setFontSize(14);
		doc.text(20, 130, 'Assign To');
		doc.setFontSize(14);
		doc.text(60, 130, obj.Assigncustomer);
		doc.setFontSize(14);
		doc.text(20, 140, 'Billable');
		doc.setFontSize(14);
		doc.text(60, 140, obj.Billable);
		doc.setFontSize(14);
		doc.text(20, 150, 'Tags');
		doc.setFontSize(14);
		doc.text(60, 150, FullTags);		 
		doc.save('' + obj.expense_code + '.pdf');
	}


	this.GetPdfWithAttachment  = function(obj,img){
		obj = hasNull(obj); 

		console.log(obj);
		console.log(img)
		var FullTags = "";
		if (obj.tags.length > 0) {
			for (i = 0; i < obj.tags.length; i++) {
				FullTags = FullTags + ' ' + obj.tags[i]
			}
		};
		
		var doc = new jsPDF();
		doc.setFillColor(182, 182, 182);
		doc.rect(20, 13, 80, 10, 'F');
		doc.setFontSize(18);
		doc.text(40, 20, 'USD ' + obj.totalUSD + '.00');
		doc.setFontSize(14);
		doc.text(20, 30, 'Expense No');
		doc.setFontSize(14);
		doc.text(60, 30, obj.expense_code);
		doc.setFontSize(14);
		doc.text(20, 40, 'Expense Date');
		doc.setFontSize(14);
		doc.text(60, 40, obj.date);
		doc.setFontSize(14);
		doc.text(20, 50, 'Category');
		doc.setFontSize(14);
		doc.text(60, 50, obj.Category);
		doc.setFontSize(14);
		doc.text(20, 60, 'Description');
		doc.setFontSize(14);
		doc.text(60, 60, obj.description);
		doc.setFontSize(14);
		doc.text(20, 70, 'Amount');
		doc.setFontSize(14);
		doc.text(60, 70, obj.Amount);
		doc.setFontSize(14);
		doc.text(20, 80, 'Tax');
		doc.setFontSize(14);
		doc.text(60, 80, obj.Tax);
		doc.setFontSize(14);
		doc.text(20, 90, 'Supplier');
		doc.setFontSize(14);
		doc.text(60, 90, obj.Vendor);
		doc.setFontSize(14);
		doc.text(20, 100, 'Reference');
		doc.setFontSize(14);
		doc.text(60, 100, obj.Reference);
		doc.setFontSize(14);
		doc.text(20, 110, 'Status');
		doc.setFontSize(14);
		doc.text(60, 110, obj.Status);
		doc.setFontSize(14);
		doc.text(20, 120, 'Due Date');
		doc.setFontSize(14);
		doc.text(60, 120, obj.Duedate);
		doc.setFontSize(14);
		doc.text(20, 130, 'Assign To');
		doc.setFontSize(14);
		doc.text(60, 130, obj.Assigncustomer);
		doc.setFontSize(14);
		doc.text(20, 140, 'Billable');
		doc.setFontSize(14);
		doc.text(60, 140, obj.Billable);
		doc.setFontSize(14);
		doc.text(20, 150, 'Tags');
		doc.setFontSize(14);
		doc.text(60, 150, FullTags);

		doc.addPage();

		var imgData;

		if (img) {
			if (img.FileName.split('.').pop() == 'jpg' || img.FileName.split('.').pop() == 'jpeg'  ) {
			imgData = 'data:application/jpeg;base64,' + img.Body;
			doc.addImage(imgData, 'JPEG', 15, 40, 180, 160);

			}else if (img.FileName.split('.').pop() == 'png') {};{
				imgData = 'data:application/png;base64,' + img.Body;
				doc.addImage(imgData, 'PNG', 15, 40, 180, 160);
			}	
		};

			 
		doc.save('' + obj.expense_code + '.pdf');
	}
})

function hasNull(target) {
    for (var member in target) {
    	if (target[member] != null)
       	   target[member] = target[member].toString();
        if (target[member] == null)
           target[member] = "";
    }
  return target;
}