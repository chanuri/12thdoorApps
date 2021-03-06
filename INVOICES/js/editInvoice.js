app.controller('editCtrl', function($scope, $mdDialog, $objectstore, $window, $rootScope,$auth, invoiceDetails, $stateParams, InvoiceService, $filter, $state, $location, UploaderService, MultipleDudtesService) {
       
        $scope.editInvoiceB = false;
        $scope.saveInvoiceB = false;
        $scope.systemMessage = [];
        
        $scope.payterm = true;
        $scope.ShoweditNo = true;
        $scope.showCopyNo = false;
        $scope.Settings = {};
        $scope.AllTaxes = [];
        $scope.individualTax = [];
        $scope.UnitOfMeasure = [];
        $scope.CusFields = [];
        $scope.roles = [];
        $scope.permission = [];
        $scope.AddProd = false;

       
         $scope.userName =$auth.getSession().Name;
        

        for (var i = $rootScope.invoiceArray.length - 1; i >= 0; i--) {
            $rootScope.selctedName = $rootScope.invoiceArray[i].Name;
            $scope.bADD = $rootScope.invoiceArray[i].billingAddress;
            $scope.sADD = $rootScope.invoiceArray[i].shippingAddress;
            
            $scope.termtype = $rootScope.invoiceArray[i].termtype;
            if($rootScope.invoiceArray[i].termtype != "multipleDueDates"){
                 $scope.duedate = new Date($rootScope.invoiceArray[i].duedate);
            }
           
            $scope.Startdate = new Date($rootScope.invoiceArray[i].Startdate)
            for (var x = $rootScope.invoiceArray[i].invoiceProducts.length - 1; x >= 0; x--) {
                
                InvoiceService.setTempArr({
                                Productname: $rootScope.invoiceArray[i].invoiceProducts[x].Productname,
                                price: $rootScope.invoiceArray[i].invoiceProducts[x].price,
                                quantity: $rootScope.invoiceArray[i].invoiceProducts[x].quantity,
                                ProductUnit: $rootScope.invoiceArray[i].invoiceProducts[x].ProductUnit,
                                discount: $rootScope.invoiceArray[i].invoiceProducts[x].discount,
                                tax: $rootScope.invoiceArray[i].invoiceProducts[x].tax,
                                olp: $rootScope.invoiceArray[i].invoiceProducts[x].olp,
                                amount: $rootScope.invoiceArray[i].invoiceProducts[x].amount,
                                status:$rootScope.invoiceArray[i].invoiceProducts[x].status,
                             });
            }
        }

         for (var i = $rootScope.customerNames.length - 1; i >= 0; i--) {
            if($rootScope.customerNames[i].display == $rootScope.selctedName){
                $rootScope.customerNames[i].BillingAddress = $scope.bADD
                console.log($rootScope.customerNames[i].BillingAddress);
                $rootScope.customerNames[i].ShippingAddress = $scope.sADD
            }
                
            }
        var client = $objectstore.getClient("Settings12thdoor");
        client.onGetMany(function(data) {
            if (data) {
                $scope.Settings = data;
                for (var i = $scope.Settings.length - 1; i >= 0; i--) {
                    $scope.com = $scope.Settings[i].preference.invoicepref.defaultComm;
                    $scope.note = $scope.Settings[i].preference.invoicepref.defaultNote;
                    $scope.paymentTerm = $scope.Settings[i].preference.invoicepref.defaultPaymentTerms;
                    $scope.dis = $scope.Settings[i].preference.invoicepref.disscountItemsOption;
                    $scope.ShippingCharges = $scope.Settings[i].preference.invoicepref.enableshipping;
                    $scope.partialPayment = $scope.Settings[i].preference.invoicepref.allowPartialPayments;
                    $scope.ShowDiscount = $scope.Settings[i].preference.invoicepref.enableDisscounts;
                    $scope.ShowShipAddress = $scope.Settings[i].preference.invoicepref.displayshipaddress;
                    $scope.ShowTaxes = $scope.Settings[i].preference.invoicepref.enableTaxes;
                    $scope.offlinePayments = $scope.Settings[i].preference.invoicepref.offlinePayments;
                    $scope.EmailPermission = $scope.Settings[i].preference.invoicepref.copyadminallinvoices;
                    $scope.mail = $scope.Settings[i].profile.adminEmail;
                    $scope.BaseCurrency = $scope.Settings[i].profile.baseCurrency;

                    for (var z = $scope.Settings[i].users.roles.length - 1; z >= 0; z--) {
                        $scope.roles.push($scope.Settings[i].users.roles[z].rolename);
                        $scope.permission.push($scope.Settings[i].users.roles[z]);
                    };

                    $scope.cusF = $scope.Settings[i].preference.invoicepref.CusFiel

                    for (var x = $scope.Settings[i].taxes.individualtaxes.length - 1; x >= 0; x--) {
                        $scope.individualTax.push($scope.Settings[i].taxes.individualtaxes[x]);
                    };
                    for (var y = $scope.Settings[i].taxes.multipletaxgroup.length - 1; y >= 0; y--) {
                        $scope.individualTax.push($scope.Settings[i].taxes.multipletaxgroup[y]);
                    };

                    for (var z = $scope.Settings[i].preference.productpref.units.length - 1; z >= 0; z--) {
                        $scope.UnitOfMeasure.push($scope.Settings[i].preference.productpref.units[z])
                    };

                    $scope.paymentMethod = [];

                    for (var x = $scope.Settings[i].preference.paymentpref.PaymentMethod.length - 1; x >= 0; x--) {
                        $scope.paymentMethod.push({
                            paymentmethod: $scope.Settings[i].preference.paymentpref.PaymentMethod[x].paymentmethod,
                            paymentType: $scope.Settings[i].preference.paymentpref.PaymentMethod[x].paymentType,
                            activate: $scope.Settings[i].preference.paymentpref.PaymentMethod[x].activate
                        })
                    };
                    for (var y = $scope.Settings[i].payments.length - 1; y >= 0; y--) {
                        $scope.paymentMethod.push({
                            paymentmethod: $scope.Settings[i].payments[y].name,
                            paymentType: $scope.Settings[i].payments[y].paymentType,
                            activate: $scope.Settings[i].payments[y].activate
                        })
                    };
                };
            }

            if ($scope.EmailPermission == true) {
                $scope.TDinvoice.adminEmail = $scope.mail;
            }
            $scope.TDinvoice.comments = $scope.com;
            $scope.TDinvoice.notes = $scope.note;
            $scope.TDinvoice.termtype = $scope.paymentTerm;
            $scope.TDinvoice.baseCurrency = $scope.BaseCurrency;
            $scope.TDinvoice.DiplayShipiingAddress = $scope.ShowShipAddress;
            $scope.TDinvoice.allowPartialPayments = $scope.partialPayment;
            $scope.AllTaxes = $scope.individualTax;
            $scope.UOM = $scope.UnitOfMeasure;
            $scope.CusFields = $scope.cusF;
            $scope.Displaydiscount = $scope.ShowDiscount;
        });
        client.onError(function(data) {});
        client.getByFiltering("*");


        for (var i = 0; i <= $rootScope.invoiceArray.length - 1;  i++) {
            for (var x = 0; x <= $rootScope.invoiceArray[i].MultiDueDAtesArr.length - 1; x++) {
                if ($rootScope.invoiceArray[i].MultiDueDAtesArr[x].paymentStatus == "Draft") {
                    $scope.showSave = true;
                    $scope.AddProd = true;
                     $scope.payterm = false;
                }
                 if ($state.current.name == 'edit'){
                    $scope.AddProd = true;
                     if ($rootScope.invoiceArray[i].MultiDueDAtesArr[x].paymentStatus == "Paid") {
                        $scope.AddProd = false;
                     }else if($rootScope.invoiceArray[i].MultiDueDAtesArr[x].paymentStatus == "Partially Paid"){
                        $scope.AddProd = false;
                     }else if($rootScope.invoiceArray[i].MultiDueDAtesArr[x].paymentStatus == "overdue"){
                        $scope.AddProd = false;
                     }
                    }
            }
        };

        if ($state.current.name == 'copy') {
            $scope.saveInvoiceB = true;
             $scope.ShoweditNo = false;
            $scope.showCopyNo = true;
            $scope.AddProd = true;
            $scope.payterm = false;
            //$rootScope.invoiceArray[0].invoiceRefNo = $scope.refNo;
        } else if ($state.current.name == 'estimateInvoice') {
            $scope.saveInvoiceB = true;
        } else {
            $scope.editInvoiceB = true;
                    }

//--------------------------------EDIT----------------------------------------------------------------------------
        $scope.edit = function(updatedForm) {
            if(updatedForm.invoiceNo == "-999"){
                updatedForm.invoiceNo = updatedForm.invoiceRefNo.toString();  
            }else{
              updatedForm.invoiceNo = updatedForm.invoiceNo.toString();  
            }
            
            for (var x = updatedForm.MultiDueDAtesArr.length - 1; x >= 0; x--) {
                console.log(updatedForm.MultiDueDAtesArr[x])
                $scope.status = updatedForm.MultiDueDAtesArr[x].paymentStatus;
            }
            console.log($scope.status)
            if ($scope.status == "Draft") {

                var client = $objectstore.getClient("invoice12thdoorDraft");
                updatedForm.total = $rootScope.total;
                updatedForm.finalamount = $scope.famount;
                updatedForm.Startdate = $scope.Startdate;
                //updatedForm.termtype = $scope.termtype;
                updatedForm.duedate = $scope.duedate;
                updatedForm.OfflinePaymentDetails = $scope.OfflinePaymentDetails;
                $scope.systemMessage.push({
                    text: "Invoice Edited by"+ $scope.userName,
                    done: false,
                    date: new Date(),
                    type:"Auto",
                    RefID:updatedForm.invoiceRefNo

                });
                for (var i = $scope.systemMessage.length - 1; i >= 0; i--) {
                    updatedForm.commentsAndHistory.push($scope.systemMessage[i]);
                };
                client.onComplete(function(data) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .title('')
                        .content('invoice Successfully Saved')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                        .targetEvent(data)
                    );
                });
                client.onError(function(data) {});
                client.insert(updatedForm, {
                    KeyProperty: "invoiceNo"
                });
            } else if ($scope.status == "Cancelled") {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('Alert')
                    .content('You Cannot edit a cancelled invoice')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                );
            } else if ($scope.status == "Deleted") {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('Alert')
                    .content('You Cannot edit a deleted invoice')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                );
            } else {
                var client = $objectstore.getClient("invoice12thdoor");
                //updatedForm.invoiceProducts = $rootScope.showprodArray.val;
                updatedForm.total = $rootScope.total;
                updatedForm.finalamount = $scope.famount;
                updatedForm.Startdate = $scope.Startdate;
                updatedForm.duedate = $scope.duedate;
                $scope.systemMessage.push({
                    text: "Invoice Edited by"+ $scope.userName,
                    done: false,
                    date: new Date(),
                    type:"Auto",
                    RefID:updatedForm.invoiceRefNo
                });
                for (var i = $scope.systemMessage.length - 1; i >= 0; i--) {
                    updatedForm.commentsAndHistory.push($scope.systemMessage[i]);
                };
                client.onComplete(function(data) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .title('')
                        .content('invoice Successfully Saved')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                        .targetEvent(data)
                    );
                    $rootScope.invoiceArray.splice(0, 1);
                    invoiceDetails.setArray(updatedForm);
                    $state.go('view', {
                        'invoiceno': updatedForm.invoiceRefNo
                    });
                });
                client.onError(function(data) {
                    mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .title('')
                        .content('error updating')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                        .targetEvent(data)
                    );
                });
                console.log(updatedForm)
                client.insert(updatedForm, {
                    KeyProperty: "invoiceNo"
                });
            }
        }
        $scope.calAMount = function(data) {
            $scope.Amount = 0;
            $scope.Amount = (((data.price * data.quantity) - ((data.price * data.quantity) * data.discount / 100)) + ((data.price * data.quantity)) * data.tax / 100);
            return $scope.Amount;
        }

        $scope.ss = [];
        $scope.getPayement = function(pay) {
            for (var i = $scope.paymentMethod.length - 1; i >= 0; i--) {
                if (pay == $scope.paymentMethod[i].paymentmethod) {
                    $scope.ss.push({
                        sc: $scope.paymentMethod[i].paymentmethod,
                        dd: $scope.paymentMethod[i].paymentType
                    })
                    if ($scope.paymentMethod[i].paymentType == "Offline") {
                        $scope.OfflinePaymentDetails = $scope.offlinePayments;
                    }
                }
            };
        }
        $scope.calculatetotal = function(data) {
            $rootScope.total = 0;
            angular.forEach(data.invoiceProducts, function(tdIinvoice) {
                $rootScope.total += (tdIinvoice.price * tdIinvoice.quantity);
            })
            return $rootScope.total;
        };
        $scope.finaldiscount = function(data) {
            $scope.finalDisc = 0;

            $scope.finalDisc = parseFloat(($scope.salesTax + $rootScope.total) * data.fdiscount / 100)
            return $scope.finalDisc;
            }
        $scope.CalculateTax = function() {
           $scope.salesTax = 0;
        for (var i = $rootScope.taxArr1.length - 1; i >= 0; i--) {
            $scope.salesTax += parseFloat($rootScope.taxArr1[i].salesTax);
        }
        return $scope.salesTax;

        }
        $rootScope.famount = 0;
        $scope.finalamount = function(data) {
            $rootScope.famount = 0;
            $rootScope.famount = parseFloat($rootScope.total - $scope.finalDisc) + parseFloat($scope.salesTax) + parseFloat(data.shipping);
            return $rootScope.famount;
        };

        $scope.InvoiceDetails = [];
        var client = $objectstore.getClient("domainClassAttributes");
        client.onGetMany(function(data) {
            if (data) {
                $scope.InvoiceDetails = data;
                for (var i = $scope.InvoiceDetails.length - 1; i >= 0; i--) {
                    $scope.ID = $scope.InvoiceDetails[i].maxCount;
                };
                $scope.maxID = parseInt($scope.ID) + 1;
                $scope.refNo = $scope.maxID.toString();
            }
        });
        client.getByFiltering("select maxCount from domainClassAttributes where class='invoice12thdoor'");

        $scope.savetoInvoices = function(obj) {
            var confirm = $mdDialog.confirm()
                .parent(angular.element(document.body))
                .title('')
                .content('Are You Sure You Want To save it?')
                .ok('Save')
                .cancel('Cancel')
                .targetEvent(obj);
            $mdDialog.show(confirm).then(function() {
                var draftdelete = $objectstore.getClient("invoice12thdoorDraft");
                obj.OfflinePaymentDetails = $scope.OfflinePaymentDetails;
                obj.termtype = $scope.termtype;
                obj.duedate = $scope.duedate;
                obj.cardOpen = false;
                obj.favourite = false;
                obj.favouriteStarNo = 1;
                obj.DeleteStatus = false;
                obj.invoiceRefNo = $scope.refNo;
                obj.total = $rootScope.total;
                obj.taxAmounts = [];
                obj.taxAmounts = $rootScope.taxArr1;
            
            obj.finalamount = $scope.famount;
                draftdelete.onComplete(function(data) {
                    if (obj.termtype != "multipleDueDates") {
                        obj.MultiDueDAtesArr = [{
                            DueDate: $scope.TDinvoice.duedate,
                            Percentage: "0",
                            dueDateprice: $scope.famount,
                            paymentStatus: 'Unpaid',
                            balance: $scope.famount
                        }];
                    } else {
                        obj.MultiDueDAtesArr = $rootScope.dateArray.value;
                    }
                    obj.commentsAndHistory = [];
                    obj.commentsAndHistory.push({
                        done: false,
                        text: "Invoice created by"+ $scope.userName,
                        date: new Date(),
                        type:"Auto",
                        RefID:$scope.refNo
                    });
                    obj.invoiceRefNo = $scope.refNo;
                    for (var x = obj.MultiDueDAtesArr.length - 1; x >= 0; x--) {

                        if (obj.MultiDueDAtesArr[x].paymentStatus == "Draft") {}
                    }
                    obj.OfflinePaymentDetails = $scope.OfflinePaymentDetails;
                    var newInsert = $objectstore.getClient("invoice12thdoor");
                    newInsert.onComplete(function(data) {
                        $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .title('')
                            .content('invoice Successfully Saved')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            .targetEvent(data)
                        );
                        $state.go('view', {'invoiceNo': $scope.refNo},{reload: true});
                    });
                    newInsert.onError(function(data) {
                        $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .title('Sorry')
                            .content('Error saving invoice')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            .targetEvent(data)
                        );
                    });
                    obj.invoiceNo = "-999";
                    newInsert.insert(obj, {KeyProperty: "invoiceNo"});
                });
                draftdelete.onError(function(data) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .content('Error Deleting from Draft')
                        .ariaLabel('')
                        .ok('OK')
                        .targetEvent(data)
                    );
                });
                // draftdelete.deleteSingle(obj.invoiceNo.toString(), "invoiceNo");
                draftdelete.deleteSingle({ "invoiceNo":obj.invoiceNo.toString() }, "invoiceNo");
            }, function() {
                $mdDialog.hide();
            });
        }

        $scope.viewSavedProducts = function(obj) {
            $mdDialog.show({
                templateUrl: 'Invoicepartials/showproduct.html',
                controller: 'showproductCtrl',
                locals: {
                    item: obj
                }
            });
        }
//---------------------------------------------------------------------------------------------------------------------
$scope.MultiDuDates = function(data) {
            $scope.showdate = true;
           $scope.TDinvoice.termtype = "multipleDueDates";
            $scope.TDinvoice.duedate = null;
            $scope.showPercentage = false;
            $rootScope.showmsg = false;

            $mdDialog.show({
                templateUrl: 'Invoicepartials/MultipleDuedates.html',
                controller: function addMultipleDueDates($scope, $mdDialog) {
                    $scope.minDate = new Date();
                    $scope.aDatearr = {
                        val: []
                    };
            
                    $scope.newfamount = angular.copy($rootScope.famount)
                    $scope.editDueDates = false;
                    $scope.DueDateprice = 0;
                    $scope.showEditButton = false;
                    $scope.editMultipleDuedates = [];
                     for (var i = $rootScope.invoiceArray.length - 1; i >= 0; i--) {
                              $scope.editMultipleDuedates = angular.copy($rootScope.invoiceArray[i].MultiDueDAtesArr);
                        }
                    // $scope.editMultipleDuedates = angular.copy($rootScope.dateArray.val)
                       $scope.editMultipleDuedates = $scope.editMultipleDuedates.sort(function(a,b){
                        return new Date(a.DueDate) - new Date(b.DueDate)
                        })
                        
                    $scope.testarr = [{
                        duedate: '',
                        percentage: '',
                        duDatePrice: '',
                        paymentStatus: 'Unpaid',
                        balance: $scope.newfamount,
                        count: 1,
                        uniqueKey: 'checkfocus1'
                    }];

                    $scope.AddDueDates = function() {
                        $scope.calc = 0;
                        $rootScope.checkArr = [];
                        $rootScope.checkArr = angular.copy($scope.testarr);
                        for (var i = $scope.testarr.length - 1; i >= 0; i--) {
                            $scope.calc += parseFloat($scope.testarr[i].percentage);
                            MultipleDudtesService.calDateArray({
                                DueDate: $scope.testarr[i].duedate,
                                Percentage: $scope.testarr[i].percentage,
                                dueDateprice: $scope.testarr[i].duDatePrice,
                                paymentStatus: "Unpaid",
                                balance: $scope.testarr[i].duDatePrice,
                                count: $scope.testarr[i].count
                            });
                        };

                        if ($scope.calc == 100) {
                            $mdDialog.hide();
                        }
                    }

                    $scope.addItem = function() {
                        $scope.arrr = [];
                        $scope.perCount = 0;
                        $scope.focus = 0;
                        for (i = 0; i <= $scope.testarr.length - 1; i++) {
                            $scope.perCount += parseInt($scope.testarr[i].percentage);
                            var numbers = parseInt($scope.testarr[i].count) + 1;
                            $scope.focus = 'checkfocus' + (parseInt($scope.testarr[i].count) + 1).toString();
                        };
                        if ($scope.perCount >= 100) {} else if ($scope.perCount < 100) {
                            $scope.testarr.push({
                                duedate: '',
                                percentage: '',
                                duDatePrice: '',
                                paymentStatus: 'Unpaid',
                                balance: parseFloat($rootScope.famount - $scope.newfamount),
                                count: numbers,
                                uniqueKey: $scope.focus

                            });
                        }
                    };

                    $scope.addEditDueDates = function(index) {
                        $scope.arrr = [];
                        $scope.perCount = 0;
                        $scope.focus = 0;
                        for (i = 0; i <= $scope.editMultipleDuedates.length - 1; i++) {
                            $scope.perCount += parseInt($scope.editMultipleDuedates[i].Percentage);
                            var numbers = parseInt($scope.editMultipleDuedates[i].count) + 1;
                            $scope.focus = 'checkfocus' + (parseInt($scope.editMultipleDuedates[i].count) + 1).toString();
                        };
                        if ($scope.perCount >= 100) {

                        } else if ($scope.perCount < 100) {
                            $scope.editMultipleDuedates.push({
                                DueDate: '',
                                Percentage: '',
                                dueDateprice: '',
                                paymentStatus: 'Unpaid',
                                balance: $scope.DueDateprice,
                                count: numbers,
                                uniqueKey: $scope.focus
                            });
                        }
                    }

                    $scope.removeeditArray = function(cc,index) {
                        var tt = index + 1;
                        if($scope.editMultipleDuedates.length > 1){
                         $scope.editMultipleDuedates.splice($scope.editMultipleDuedates.indexOf(cc), 1);   

                         if($scope.editMultipleDuedates.length >= tt){
                            $scope.deletedP = parseInt($scope.editMultipleDuedates[index].Percentage) +parseInt(cc.Percentage);
                                $scope.editMultipleDuedates[index] = {
                                DueDate: $scope.editMultipleDuedates[index].DueDate,
                                Percentage: $scope.deletedP,
                                dueDateprice: parseFloat($scope.editMultipleDuedates[index].dueDateprice+cc.dueDateprice),
                                balance: parseFloat($scope.editMultipleDuedates[index].balance+cc.balance),
                                count: $scope.editMultipleDuedates[index].count,
                                paymentStatus: $scope.editMultipleDuedates[index].paymentStatus,
                                uniqueKey: $scope.editMultipleDuedates[index].uniqueKey
                            }
                        }else if($scope.editMultipleDuedates.length < tt){
                            $scope.deletedP = parseInt($scope.editMultipleDuedates[index-1].Percentage) +parseInt(cc.Percentage);
                            $scope.editMultipleDuedates[index-1] = {
                                DueDate: $scope.editMultipleDuedates[index-1].DueDate,
                                Percentage: $scope.deletedP,
                                dueDateprice: parseFloat($scope.editMultipleDuedates[index-1].dueDateprice+cc.dueDateprice),
                                balance: parseFloat($scope.editMultipleDuedates[index-1].balance+cc.balance),
                                count: $scope.editMultipleDuedates[index-1].count,
                                paymentStatus: $scope.editMultipleDuedates[index-1].paymentStatus,
                                uniqueKey: $scope.editMultipleDuedates[index-1].uniqueKey
                            }
                        }

                        }
                        $scope.editDueDates = true;
                    };

                    $scope.removeItem = function(cc, index) {
                        $scope.testarr.splice($scope.testarr.indexOf(cc), 1);
                    };
                    $scope.cancel = function() {
                        $scope.showdate = false;
                        $mdDialog.cancel();
                    }
                    $scope.duecost = 0;

                    $scope.DueAmount = function(cn, index) {
                        $scope.showPercentage = false;
                        $scope.cal = 0;
                        for (var i = $scope.testarr.length - 1; i >= 0; i--) {
                            $scope.showPercentage = false;
                            $scope.cal += parseFloat($scope.testarr[i].percentage);

                            if ($scope.cal > 100) {
                                $scope.showPercentage = true;
                            }
                        }
                        $scope.newfamount = (parseFloat($rootScope.total * cn.percentage) / 100);
                        $scope.testarr[index] = {
                            duedate: cn.duedate,
                            percentage: cn.percentage,
                            duDatePrice: $scope.newfamount,
                            balance: $scope.newfamount,
                            count: cn.count,
                            uniqueKey: cn.uniqueKey
                        }
                        $focus(cn.uniqueKey);
                    }

                    $scope.EditDueAmount = function(cn, index) {
                        $scope.showPercentage = false;
                        $scope.cal = 0;
                
                        $scope.newfamount = (parseFloat($rootScope.famount * cn.Percentage) / 100);
                        $scope.editMultipleDuedates[index] = {
                            DueDate: cn.DueDate,
                            Percentage: cn.Percentage,
                            dueDateprice: $scope.newfamount,
                            balance: $scope.newfamount,
                            count: cn.count,
                            paymentStatus: 'Unpaid',
                            uniqueKey: cn.uniqueKey
                        }
                        $focus(cn.uniqueKey);
                    }

                    $scope.UpdateDueDates = function() {
                        $scope.calc = 0;
                        $rootScope.checkArr = [];
                        $rootScope.checkArr = angular.copy($scope.editMultipleDuedates);
                        $scope.oldPercentage = 0;

                        for (var i = $rootScope.dateArray.val.length - 1; i >= 0; i--) {
                            $rootScope.dateArray.val.splice($rootScope.dateArray.val.indexOf($rootScope.dateArray.val[i]),1)
                        }
                        $rootScope.dateArray.val = $scope.editMultipleDuedates;
                        $mdDialog.hide();
                    }
                }
            })
        
    }
//---------------Deelete Product---------------------------------------------------------------------------------------------
        $scope.deleteEditproduct = function(name, index) {
            for (var i = $rootScope.invoiceArray[0].MultiDueDAtesArr.length - 1; i >= 0; i--) {
            $scope.ttt = $rootScope.invoiceArray[0].MultiDueDAtesArr[i].paymentStatus;
            }
            if($state.current.name == 'edit'){
               if( $scope.ttt== "Paid"){
                 $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('Warning')
                    .content('Since you have done a payment to this invoice you cannot delete this nvoice')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                );
               }else{
                InvoiceService.ReverseEditTax(name, index);
                $rootScope.invoiceArray[0].invoiceProducts.splice($rootScope.invoiceArray[0].invoiceProducts.indexOf(name), 1);
                
                console.log($rootScope.getTax)
                $scope.CalculateTax();
               }
           }else{
            InvoiceService.ReverseEditTax(name, index);
            $rootScope.invoiceArray[0].invoiceProducts.splice($rootScope.invoiceArray[0].invoiceProducts.indexOf(name), 1);
            
            console.log($rootScope.getTax)
            $scope.CalculateTax();
           }

            
        }
//--------------add product --------------------------------------------------------------------------------------------
        $scope.addProductArray = function(ev, arr) {
            $rootScope.termType = angular.copy($scope.TDinvoice.termtype);
            $rootScope.taxType = angular.copy($scope.AllTaxes);
            $rootScope.AllUnitOfMeasures = angular.copy($scope.UOM)
            $rootScope.Showdiscount = angular.copy($scope.Displaydiscount);
            $rootScope.discounts = angular.copy($scope.dis);
            $rootScope.DisplayTaxes = angular.copy($scope.ShowTaxes);
            if ($rootScope.Showdiscount == true) {
                if ($rootScope.discounts == "Individual Items") {
                    $rootScope.displayDiscountLine = true;
                }
            }

            $mdDialog.show({
                templateUrl: 'Invoicepartials/addproduct.html',
                targetEvent: ev,
                controller: function editProductController($scope, $mdDialog) {
                    $scope.prducatsAdd = {};
                    $scope.prod = {};
                    $scope.promoItems = [];
                    $scope.taxType = [];
                    $scope.AllUnitOfMeasures = [];

                    $scope.addproductToarray = function(item, ev) {
                            $scope.promoItems[0] = {
                                productName: $scope.SproductName,
                                price: $scope.Sprice,
                                tax: $scope.Stax,
                                ProductUnit: $scope.SProductUnit,
                                qty: $scope.Sqty,
                                discount: $scope.discount,
                                olp: $scope.olp,
                                status: $scope.Sstatus
                            }
                            for (var i = $scope.promoItems.length - 1; i >= 0; i--) {

                                if ($scope.promoItems[i].productName == null) {
                                 $scope.showProduct = true;
                            } else if ($scope.promoItems[i].qty == null) {
                                $scope.showProduct = true;
                            } else if ($scope.promoItems[i].ProductUnit == null) {
                                 $scope.showProduct = true;

                            }else if ($scope.promoItems[i].ProductUnit == "") {
                                 $scope.showProduct = true;

                            }else if ($scope.promoItems[i].price == null) {
                                 $scope.showProduct = true;

                                } else {
                                    InvoiceService.setTempArr({
                                        Productname: $scope.promoItems[i].productName,
                                        price: $scope.promoItems[i].price,
                                        quantity: $scope.promoItems[i].qty,
                                        ProductUnit: $scope.promoItems[i].ProductUnit,
                                        discount: $scope.promoItems[i].discount,
                                        tax: $scope.promoItems[i].tax,
                                        olp: $scope.promoItems[i].olp,
                                        amount: $scope.Amount,
                                        status: $scope.promoItems[i].status,
                                    });

                                    if( $rootScope.termType){
                                    if($rootScope.termType == "multipleDueDates"){
                                    $scope.UpdateDates();
                                    } 
                                }

                                    if ($scope.promoItems[i].status == 'notavailable') {
                                        var confirm = $mdDialog.confirm()
                                            .title('Would you like to save this product for future use?')
                                            .content('')
                                            .ariaLabel('Lucky day')
                                            .targetEvent(ev)
                                            .ok('save')
                                            .cancel('cancel');
                                        $mdDialog.show(confirm).then(function(item) {
                                            for (var i = $scope.promoItems.length - 1; i >= 0; i--) {
                                                $scope.prod.Productname = $scope.promoItems[i].productName;
                                                $scope.prod.productprice = $scope.promoItems[i].price;
                                                $scope.prod.ProductUnit = $scope.promoItems[i].ProductUnit;
                                                $scope.prod.producttax = $scope.promoItems[i].tax;

                                                $scope.FirstLetters = $scope.promoItems[i].productName.substring(0, 3).toUpperCase();
                                                if ($scope.product.length > 0) {
                                                    $scope.PatternExsist = false;
                                                    $scope.MaxID = 0;
                                                    for (y = 0; y <= $scope.product.length - 1; y++) {
                                                        if ($scope.product[y].ProductCode.substring(0, 3) === $scope.FirstLetters) {
                                                            $scope.CurrendID = $scope.product[y].ProductCodeID;
                                                            if ($scope.CurrendID > $scope.MaxID) {
                                                                $scope.MaxID = $scope.CurrendID;
                                                            };
                                                            $scope.PatternExsist = true;
                                                        };
                                                    }
                                                    if (!$scope.PatternExsist) {
                                                        $scope.prod.ProductCode = $scope.FirstLetters + '-0001';
                                                        $scope.prod.ProductCodeID = 1;
                                                    } else if ($scope.PatternExsist) {
                                                        $scope.GetMaxNumber($scope.prod, $scope.FirstLetters, $scope.MaxID)
                                                    }
                                                } else {
                                                    $scope.prod.ProductCode = $scope.FirstLetters + '-0001';
                                                    $scope.prod.ProductCodeID = 1;
                                                }
                                            }

                                            $scope.GetMaxNumber = function(obj, name, MaxID) {
                                                $scope.FinalNumber = MaxID + 1;
                                                $scope.FinalNumberLength = $scope.FinalNumber.toString().length;
                                                $scope.Zerros = "";
                                                for (i = 0; i < 4 - $scope.FinalNumberLength; i++) {
                                                    var str = "0";
                                                    $scope.Zerros = $scope.Zerros + str;
                                                }
                                                $scope.Zerros = $scope.Zerros + $scope.FinalNumber.toString();
                                                obj.ProductCodeID = $scope.FinalNumber;
                                                obj.ProductCode = name + '-' + $scope.Zerros;
                                            }

                                            $scope.prod.ProductCategory = "Product";
                                            $scope.prod.progressshow = "false"
                                            $scope.prod.favouriteStar = false;
                                            $scope.prod.favouriteStarNo = 1;
                                            $scope.prod.tags = [];
                                            $scope.prod.todaydate = new Date();
                                            $scope.prod.UploadImages = {
                                                val: []
                                            };
                                            $scope.prod.UploadBrochure = {
                                                val: []
                                            };
                                            var client = $objectstore.getClient("product12thdoor");
                                            client.onComplete(function(data) {
                                                $mdDialog.show(
                                                    $mdDialog.alert()
                                                    .parent(angular.element(document.body))
                                                    .title('')
                                                    .content('product Successfully Saved')
                                                    .ariaLabel('Alert Dialog Demo')
                                                    .ok('OK')
                                                    .targetEvent(data)
                                                );
                                            });
                                            client.onError(function(data) {
                                                $mdDialog.show(
                                                    $mdDialog.alert()
                                                    .parent(angular.element(document.body))
                                                    .title('Sorry')
                                                    .content('Error saving product')
                                                    .ariaLabel('Alert Dialog Demo')
                                                    .ok('OK')
                                                    .targetEvent(data)
                                                );
                                            });
                                            $scope.prod.product_code = "-999";
                                            client.insert([$scope.prod], {
                                                KeyProperty: "product_code"
                                            });
                                        }, function() {});
                                    }
                                    for (var i = $rootScope.editProdArray.val.length - 1; i >= 0; i--) {
                                        $rootScope.invoiceArray[0].invoiceProducts.push($rootScope.editProdArray.val[i]);
                                        for (var i = $rootScope.calTax.length - 1; i >= 0; i--) {
                                            $rootScope.getTax.push($rootScope.calTax[i])
                                        };

                                    };
                                    console.log($rootScope.invoiceArray)
                                    $mdDialog.hide();
                                }
                            }
                        }

                        $scope.UpdateDates = function(){
                        $scope.updateDate = [];
                        $scope.newfamount = 0;
                         $scope.calc = 0;
                        $rootScope.checkArr = [];
                       
                        for (var i = $rootScope.invoiceArray.length - 1; i >= 0; i--) {
                             $scope.updateDate = angular.copy($rootScope.invoiceArray[i].MultiDueDAtesArr);
                              $rootScope.checkArr = angular.copy($rootScope.invoiceArray[i].MultiDueDAtesArr);
                        }
                       
                        for (var i = $rootScope.dateArray.val.length - 1; i >= 0; i--) {
                            $scope.calculatetotal($rootScope.dateArray.val[i]);
                            //$rootScope.dateArray.val.splice($rootScope.dateArray.val.indexOf($rootScope.dateArray.val[i]),1)
                        }
                        
                        for (var i = $scope.updateDate.length - 1; i >= 0; i--) {
                            $scope.newfamount = parseFloat(($rootScope.total +$scope.Amount)  * $scope.updateDate[i].Percentage) / 100;
                               MultipleDudtesService.calDateArray({
                                        DueDate: $scope.updateDate[i].DueDate,
                                        Percentage: $scope.updateDate[i].Percentage,
                                        dueDateprice: $scope.newfamount,
                                        paymentStatus: $scope.updateDate[i].paymentStatus,
                                        balance:$scope.newfamount,
                                        count: $scope.updateDate[i].count
                                    });
                        }   

                    }

                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    }

                    $scope.promoItems.push({
                        productName: '',
                        price: '',
                        tax: '',
                        ProductUnit: '',
                        qty: '',
                        discount: '',
                        olp: '',
                        status: ''
                    });
                    $scope.TaxDisabled = false;
                    $scope.setSelectedClient = function(package) {
                        $scope.promoItems.tax = 0;
                        $scope.discount = 0;

                        for (var i = 0; i < $scope.product.length; i++) {

                            if ($scope.product[i].Productname.toLowerCase() === package.toLowerCase()) {
                                $scope.SproductName = package;
                                $scope.Sprice = $scope.product[i].productprice;
                                $scope.SProductUnit = $scope.product[i].ProductUnit;
                                $scope.Sqty = $scope.qty;
                                $scope.Solp = $scope.olp;
                                $scope.Stax = $scope.product[i].producttax;
                                $scope.Sstatus = "available"
                                $scope.promoItems.splice(0, 1)
                                $scope.promoItems.push({
                                    productName: package,
                                    price: $scope.product[i].productprice,
                                    tax: $scope.product[i].producttax,
                                    ProductUnit: $scope.product[i].ProductUnit,
                                    qty: $scope.qty,
                                    discount: $scope.discount,
                                    olp: $scope.olp,
                                    status: "available"
                                });
                                $scope.TaxDisabled = false;
                                break;
                            } else if ($scope.product[i].Productname.toLowerCase() != package.toLowerCase()) {
                                $scope.SproductName = package;
                                $scope.Sprice = $scope.productPrice;
                                $scope.SProductUnit = $scope.promoItems.ProductUnit;
                                $scope.Sqty = $scope.qty;
                                $scope.Solp = $scope.olp;
                                $scope.Stax = $scope.Ptax;
                                $scope.Sstatus = "notavailable"
                                $scope.promoItems.splice(0, 1)
                                $scope.promoItems.push({
                                    productName: '',
                                    price: '',
                                    tax: '',
                                    qty: '',
                                    discount: '',
                                    ProductUnit: "each",
                                    olp: '',
                                    status: "notavailable"
                                });
                                $scope.TaxDisabled = false;
                            }
                        }
                    };

                    $scope.setprice = function(pd) {
                        $scope.Sprice = pd.price;
                    }
                    $scope.setTax = function(pDis) {
                        for (var i = $rootScope.taxType.length - 1; i >= 0; i--) {
                            if ($rootScope.taxType[i].taxname == pDis.tax.taxname) {
                                $scope.Ptax = ({
                                    taxname: $rootScope.taxType[i].taxname,
                                    activate: $rootScope.taxType[i].activate,
                                    compound: $rootScope.taxType[i].compound,
                                    rate: $rootScope.taxType[i].rate,
                                    type: $rootScope.taxType[i].type,
                                    individualtaxes: $rootScope.taxType[i].individualtaxes
                                });
                            }
                        };
                        $scope.Stax = $scope.Ptax;
                    }
                    $scope.setUOM = function(pUOM) {
                        $scope.SProductUnit = pUOM.ProductUnit;
                    }

                    var client = $objectstore.getClient("product12thdoor");
                    client.onGetMany(function(data) {
                        if (data) {
                            $scope.product = data;
                        }
                    });
                    client.getByFiltering("*");

                    //Uses auto complete to get the product details 
                    $rootScope.proload = loadpro();
                    $rootScope.selectedItemm = null;
                    $rootScope.searchTextt = null;
                    $rootScope.querySearchh = querySearchh;

                    function querySearchh(query) {
                        $scope.enter = function(keyEvent) {
                            if (keyEvent.which === 13) {
                                if ($rootScope.selectedItemm === null) {
                                    $rootScope.selectedItemm = query;
                                } else {}
                            }
                        }
                        $rootScope.results = [];
                        for (i = 0, len = $rootScope.proName.length; i < len; ++i) {
                            if ($rootScope.proName[i].dis.indexOf(query) != -1) {
                                $rootScope.results.push($rootScope.proName[i]);
                            }
                        }
                        return $rootScope.results;
                    }
                    $rootScope.proName = [];

                    function loadpro() {
                        var client = $objectstore.getClient("product12thdoor");
                        client.onGetMany(function(data) {
                            if (data) {
                                for (i = 0, len = data.length; i < len; ++i) {
                                    $rootScope.proName.push({
                                        dis: data[i].Productname.toLowerCase(),
                                        valuep: data[i]
                                    });
                                }
                            }
                        });
                        client.onError(function(data) {});
                        client.getByFiltering("*");
                    }
                    //calculate the invoice amount for each product
                    $scope.calAMount = function() {
                        $scope.Amount = 0;
                        $scope.Amount = $scope.Sprice * $scope.Sqty;
                        return $scope.Amount;
                    }
                }
            })
        }
        $scope.getTotal = 0;
        $rootScope.getTax = [];
        $scope.groupTax = [];
        $scope.calTotal = 0;

        $scope.TDinvoice = [];
        var client = $objectstore.getClient("invoice12thdoor");
        client.onGetMany(function(data) {
            if (data) {
                for (var i = data.length - 1; i >= 0; i--) {
                    data[i].invoiceNo = parseInt(data[i].invoiceNo);
                    $scope.TDinvoice.push(data[i]);
                };
            }
        });
        client.onError(function(data) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .content('There was an error retreving the data.')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent(data)
            );
        });
        client.getByFiltering("*");


//---------------Autocomplete to retrieve clients ----------------------------------------------------------------------
    $rootScope.self = this;
    $rootScope.self.tenants = loadAll();
    
     $rootScope.searchText = null;
    $rootScope.self.querySearch = querySearch;

    function querySearch(query) {
        //Custom Filter
      $rootScope.results = [];
      for (i = 0, len = $rootScope.customerNames.length; i < len; ++i) {
            if ($rootScope.customerNames[i].display.indexOf(query.toLowerCase()) != -1) {
               $rootScope.results.push($rootScope.customerNames[i]);
            }
         }
      return $rootScope.results;
    }
    $scope.customerNames = [];

    function loadAll() {

      var client = $objectstore.getClient("contact12thdoor");
      client.onGetMany(function(data) {
        if (data) {
        $rootScope.customerNames = [];
               for (i = 0, len = data.length; i < len; ++i) {
                  $rootScope.customerNames.push({
                     display: data[i].Name.toLowerCase(),
                     value: data[i],
                     BillingAddress: data[i].baddress.street + ', ' + data[i].baddress.city + ', ' + data[i].baddress.zip + ', ' + data[i].baddress.state + ', ' + data[i].baddress.country,
                     ShippingAddress: data[i].saddress.s_street + ', ' + data[i].saddress.s_city + ', ' + data[i].saddress.s_zip + ', ' + data[i].saddress.s_state + ', ' +
                        data[i].saddress.s_country
                  });
               }
        }
      });
      client.onError(function(data) {});
      client.getByFiltering("*");
    }

//----------------------save Invoice (when copy an invoice)--------------------------------------------------------------------------------    
        $scope.saveInvoice = function(updatedForm) {
            $rootScope.invoiceArray.splice(updatedForm, 1);
            invoiceDetails.setArray(updatedForm);
            updatedForm.OfflinePaymentDetails = $scope.OfflinePaymentDetails;
            updatedForm.termtype = $scope.termtype;
            updatedForm.duedate = $scope.duedate;
            updatedForm.taxAmounts = [];
            updatedForm.taxAmounts = $rootScope.taxArr1;

            $scope.imagearray = UploaderService.loadArray();
            if ($scope.imagearray.length > 0) {
                for (indexx = 0; indexx < $scope.imagearray.length; indexx++) {
                    $uploader.upload("45.55.83.253", "invoiceUploades", $scope.imagearray[indexx]);
                    $uploader.onSuccess(function(e, data) {
                        var toast = $mdToast.simple()
                            .content('Successfully uploaded!')
                            .action('OK')
                            .highlightAction(false)
                            .position("bottom right");
                        $mdToast.show(toast).then(function() {});
                    });
                    $uploader.onError(function(e, data) {
                        var toast = $mdToast.simple()
                            .content('There was an error, please upload!')
                            .action('OK')
                            .highlightAction(false)
                            .position("bottom right");
                        $mdToast.show(toast).then(function() {});
                    });
                }
            };
             $scope.multi = [];
            $scope.tt = [{
                DueDate: updatedForm.duedate,
                Percentage: "0",
                dueDateprice: $scope.famount,
                paymentStatus: 'Unpaid',
                balance: $scope.famount
            }];
            for (var i = updatedForm.MultiDueDAtesArr.length - 1; i >= 0; i--) {
                 $scope.multi.push({
                    DueDate: updatedForm.MultiDueDAtesArr[i].DueDate,
                    Percentage: updatedForm.MultiDueDAtesArr[i].Percentage,
                    dueDateprice: updatedForm.MultiDueDAtesArr[i].dueDateprice,
                    paymentStatus: 'Unpaid',
                    balance: updatedForm.MultiDueDAtesArr[i].dueDateprice
                 })
            }
            var client = $objectstore.getClient("invoice12thdoor");
            updatedForm.invoiceRefNo = $scope.refNo;
            updatedForm.total = $rootScope.total;
            updatedForm.cardOpen = false;
            updatedForm.favourite = false;
            updatedForm.favouriteStarNo = 1;
            updatedForm.DeleteStatus = false;
            updatedForm.finalamount = $scope.famount;
             updatedForm.commentsAndHistory = [];
            updatedForm.commentsAndHistory.push({
                done: false,
                text: "Invoice created by"+ $scope.userName,
                date: new Date(),
                type:"Auto",
                RefID:$scope.refNo
            });
            updatedForm.discountAmount = $scope.finalDisc;
            updatedForm.salesTaxAmount = $scope.salesTax;
            updatedForm.otherTaxAmount = $scope.otherTax;
            updatedForm.status = "Unpaid";
            updatedForm.favourite = false;
            updatedForm.favouriteStarNo = 1;
            updatedForm.UploadImages = {
                val: []
            };

            if (updatedForm.termtype != "multipleDueDates") {
                updatedForm.MultiDueDAtesArr = $scope.tt
            } else {
                updatedForm.MultiDueDAtesArr = $scope.multi;
            }

            updatedForm.UploadImages.val = UploaderService.loadBasicArray();
            client.onComplete(function(data) {
                $state.go('view', {
                    'invoiceno': $scope.refNo
                });
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('')
                    .content('invoice Successfully Saved')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent(data)
                );
            });

            updatedForm.invoiceNo = "-999";
            client.insert(updatedForm, {KeyProperty: "invoiceNo"});

            client.onError(function(data) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('Sorry')
                    .content('Error saving invoice')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent(data)
                );
            });
        }
//--------------------------------------------------------------------------------------------------------------------
        $scope.cancelinvoice = function(obj, ev) {
            if ($state.current.name == 'copy') {
                var confirm = $mdDialog.confirm()
                    .title('Would you like save this to draft?')
                    .content('')
                    .ariaLabel('Lucky day')
                    .targetEvent(ev)
                    .ok('save')
                    .cancel('clear');
                $mdDialog.show(confirm).then(function() {

                    var client = $objectstore.getClient("invoice12thdoorDraft");
                    obj.invoiceProducts = $rootScope.testArray.val;
                    obj.total = $rootScope.total;
                    obj.finalamount = $scope.famount;
                    obj.status = "Draft";

                    client.onComplete(function(data) {
                        $state.go('settings.invoice_app');
                        $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .title('')
                            .content('invoice Saved to drafts')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            .targetEvent(data)
                        );
                    });
                    client.onError(function(data) {
                        $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .title('Sorry')
                            .content('Error saving drafts')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            .targetEvent(data)
                        );
                    });
                   
                    obj.invoiceNo = "-999";
                    client.insert([obj], {
                        KeyProperty: "invoiceNo"
                    });
                }, function() {
                    $rootScope.invoiceArray.splice(obj, 1);
                    $state.go('settings.invoice_app');
                });
            } else {
                $state.go('view', {
                    'invoiceno': obj.invoiceRefNo
                });
            }
        }
    });
    app.controller('estimateCtrl', function($scope, $mdDialog, $objectstore,$auth, $window, $stateParams, $rootScope, invoiceDetails, InvoiceService, $filter, $state, $location, UploaderService, MultipleDudtesService) {

        $scope.editInvoiceB = false;
        $scope.saveInvoiceB = true;

        var client = $objectstore.getClient("invoice12thdoor");
        client.onGetMany(function(data) {
            if (data) {
                for (var i = data.length - 1; i >= 0; i--) {
                    data[i].invoiceNo = parseInt(data[i].invoiceNo);
                    $scope.TDinvoice.push(data[i]);

                    if ($stateParams.cusName == data[i].Name) {
                        invoiceDetails.removeArray(data[i], 1);
                        invoiceDetails.setArray(data[i]);
                    }
                };
            }
        });
        client.onError(function(data) {});
        client.getByFiltering("*");
    })