rasm.service("$contactNotes",["$mdDialog",function($mdDialog){
	this.viewNotes = function(obj,className,keyID){
		 $mdDialog.show({
            templateUrl: 'contact_partial/contactNotes.html',
            controller: noteCtrl,
            locals : {
            	object : obj,
            	clsName : className,
            	keyID : keyID
            }
        })
	}
}]);


function noteCtrl($scope,object,$mdDialog,$objectstore,clsName,keyID){
	$scope.noteArr = [];
	$scope.noteArr = object.notes;

	$scope.closeDialog = function(){
		$mdDialog.hide();
	}
	$scope.addNewNote = function(){
        object.customerid = object.customerid.toString();
		var result = document.getElementById("noteTxt").scrollHeight;
        var height = angular.element(result);

        var name  ="name" + ( object.notes.length + 1 ).toString();
		object.notes.push({
            note : $scope.newNote,
            height : height[0] + 'px;',
            editable : false,
            idName : name            
        })

        var noteClient = $objectstore.getClient(clsName);
        noteClient.onComplete(function(data){
        	console.log("successfully added");
        	$scope.newNote = "";
        });
        noteClient.onError(function(data){
        	console.log("error adding new note")
        });
        noteClient.insert(object,{ KeyProperty: keyID})
	}

	$scope.saveEditedNote = function(item){
        object.customerid = object.customerid.toString();
		var result = document.getElementById(item.idName).scrollHeight;
        var height = angular.element(result);

        item.height = height[0] + 'px;';
		item.editable = false;
		var noteClient = $objectstore.getClient(clsName);
        noteClient.onComplete(function(data){
        	console.log("successfully added edited one "); 
        });
        noteClient.onError(function(data){
        	console.log("error adding new note")
        	item.editable = true;
        });
        noteClient.insert(object,{ KeyProperty: keyID})
	}

	$scope.deleteNote = function(index,item){
		object.notes.splice(index, 1);
        object.customerid = object.customerid.toString();
		var noteClient = $objectstore.getClient(clsName);
        noteClient.onComplete(function(data){
        	console.log("successfully Delete one"); 
        });
        noteClient.onError(function(data){
        	console.log("error adding new note")
        	object.notes.splice(index, 0, item);
        });
        noteClient.insert(object,{ KeyProperty: keyID})
	}
}

rasm.service("$SupliertNotes",["$mdDialog",function($mdDialog){
    this.viewSuplierNotes = function(obj,className,keyID){
         $mdDialog.show({
            templateUrl: 'contact_partial/contactNotes.html',
            controller: supCtrl,
            locals : {
                object : obj,
                clsName : className,
                keyID : keyID
            }
        })
    }
}]);

function supCtrl($scope,object,$mdDialog,$objectstore,clsName,keyID){
    $scope.noteArr = [];
    $scope.noteArr = object.notes;
    
    $scope.closeDialog = function(){
        $mdDialog.hide();
    }
    $scope.addNewNote = function(){
        object.supplierid = object.supplierid.toString();
        var result = document.getElementById("noteTxt").scrollHeight;
        var height = angular.element(result);

        var name  ="name" + ( object.notes.length + 1 ).toString();
        object.notes.push({
            note : $scope.newNote,
            height : height[0] + 'px;',
            editable : false,
            idName : name            
        })

        var noteClient = $objectstore.getClient(clsName);
        noteClient.onComplete(function(data){
            console.log("successfully added");
            $scope.newNote = "";
        });
        noteClient.onError(function(data){
            console.log("error adding new note")
        });
        noteClient.insert(object,{ KeyProperty: keyID})
    }

    $scope.saveEditedNote = function(item){
        object.supplierid = object.supplierid.toString();
        var result = document.getElementById(item.idName).scrollHeight;
        var height = angular.element(result);

        item.height = height[0] + 'px;';
        item.editable = false;
        var noteClient = $objectstore.getClient(clsName);
        noteClient.onComplete(function(data){
            console.log("successfully added edited one "); 
        });
        noteClient.onError(function(data){
            console.log("error adding new note")
            item.editable = true;
        });
        noteClient.insert(object,{ KeyProperty: keyID})
    }

    $scope.deleteNote = function(index,item){
        object.notes.splice(index, 1);
        object.supplierid = object.supplierid.toString();
        var noteClient = $objectstore.getClient(clsName);
        noteClient.onComplete(function(data){
            console.log("successfully Delete one"); 
        });
        noteClient.onError(function(data){
            console.log("error adding new note")
            object.notes.splice(index, 0, item);
        });
        noteClient.insert(object,{ KeyProperty: keyID})
    }
}