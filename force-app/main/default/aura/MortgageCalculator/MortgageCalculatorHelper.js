({
	calculateMonthlyPayment : function(component) {
        // 1. Calculate monthly payment
        var principal = component.get("v.principal");
        var downPayment = component.get("v.downPayment");
        var years = component.get("v.years");
        var rate = component.get("v.rate");
        if (rate && rate > 0) {
            var monthlyRate = rate / 100 / 12;

            var downPercent = (downPayment * 100) / principal;

            // consider https://www.cmhc-schl.gc.ca/en/co/moloin/moloin_005.cfm

            // console.log('principal', principal);

            principal -= downPayment;

            // console.log('principal', principal);

            if(downPercent >= 35) {
                principal += principal * 0.006;
            } else if (downPercent >= 25 && downPercent < 35) {
                principal += principal * 0.017;
            } else if (downPercent >= 20 && downPercent < 25) {
                principal += principal * 0.024;
            } else if (downPercent >= 15 && downPercent < 20) {
                principal += principal * 0.028;
            } else if (downPercent >= 10 && downPercent < 15) {
                principal += principal * 0.031;
            } else if (downPercent >= 5 && downPercent < 10) {
                principal += principal * 0.04;
            } else {
                $A.util.toggleClass(component.get('v.downPayment'), 'slds-has-error');
            }

            // console.log('principal', principal);

            var monthlyPayment = principal * monthlyRate / (1 - (Math.pow(1/(1 + monthlyRate), years * 12)));
            component.set("v.monthlyPayment", monthlyPayment);
    
            // 2. Fire event with new mortgage data
            var event = $A.get("e.c:MortgageChange");
            event.setParams({"principal": principal,
                             "years": years,
                             "rate": rate,
                             "monthlyPayment": monthlyPayment});
            event.fire();
        }
	}
})