({
    calculateMonthlyPayment : function(component, event, helper) {
    	helper.calculateMonthlyPayment(component, event);
	},
    recordUpdated : function(component) {
        var principal = component.get("v.property").Price__c;
        var downPayment = principal * 0.05;
        component.set("v.principal", principal);
        component.set("v.downPayment", downPayment);
	}
})