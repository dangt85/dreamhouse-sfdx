({
	mortgageChange : function(component, event) {
        var principal = event.getParam("principal");
        var years = event.getParam("years");
        var rate = event.getParam("rate");
        var paymentAmount = event.getParam("paymentAmount");
        var paymentFrequency = event.getParam("paymentFrequency");

        var frequency;
        switch(paymentFrequency) {
            case 'Weekly':
                frequency = 52;
                break;
            case 'Rapid Weekly':
                frequency = 12 * 4;
                break;
            case 'Bi-Weekly':
                frequency = 52 / 2;
                break;
            case 'Rapid Bi-Weekly':
                frequency = 12 * 2;
                break;
            default:
                frequency = 12;
                break;
        }
        var paymentRate = rate / 100 / frequency;

	    var balance = principal;
    	var amortization = [];
        for (var y=0; y<years; y=y+1) {
            var interestY = 0;  //Interest payment for year y
            var principalY = 0; //Principal payment for year y
            for (var m=0; m<12; m=m+1) {
                var interestM = balance * paymentRate;       //Interest payment for month m
                var principalM = paymentAmount - interestM; //Principal payment for month m
                interestY = interestY + interestM;
                principalY = principalY + principalM;
                balance = balance - principalM;
            }
            amortization.push({principalY: Math.round(principalY), interestY: Math.round(interestY), balance: Math.round(balance)});
        }
        component.set("v.amortization", amortization);
	}
})