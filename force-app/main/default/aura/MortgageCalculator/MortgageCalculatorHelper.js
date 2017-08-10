({
	calculateMonthlyPayment : function(component, event) {
        // 1. Calculate payment
        var principal = component.get("v.principal");
        var downPayment;
        if($A.util.isUndefined(component.get("v.downPayment")) || $A.util.isEmpty(component.get("v.downPayment"))) {
            downPayment = principal * 0.05;
            event.stopPropagation();
            component.set('v.downPayment', downPayment);
        } else {
            downPayment = component.get("v.downPayment");
        }
        
        var years = component.get("v.years");
        var rate = component.get("v.rate");
        var paymentFrequency = component.get('v.paymentFrequency');
        if (rate && rate > 0) {
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

            var downPercent = (downPayment * 100) / principal;
            component.set('v.downPercent', downPercent / 100);

            // ref: https://www.cmhc-schl.gc.ca/en/co/moloin/moloin_005.cfm

            var cmhcPremium = principal * 0.045; // default to non-traditional down payment

            $A.util.removeClass(component.find('downPayment'), 'slds-has-error');
            if(downPercent >= 35) {
                cmhcPremium = principal * 0.006;
            } else if (downPercent >= 25 && downPercent < 35) {
                cmhcPremium = principal * 0.017;
            } else if (downPercent >= 20 && downPercent < 25) {
                cmhcPremium = principal * 0.024;
            } else if (downPercent >= 15 && downPercent < 20) {
                cmhcPremium = principal * 0.028;
            } else if (downPercent >= 10 && downPercent < 15) {
                cmhcPremium = principal * 0.031;
            } else if (downPercent >= 5 && downPercent < 10) {
                cmhcPremium = principal * 0.04;
            } else {
                $A.util.addClass(component.find('downPayment'), 'slds-has-error');
            }

            if(downPercent >= 20)
                $A.util.addClass(component.find('cmhcPremium'), 'slds-text-color_error');

            component.set('v.cmhcPremium', cmhcPremium);

            principal = (principal + cmhcPremium) - downPayment;

            var paymentAmount = principal * paymentRate / (1 - (Math.pow(1/(1 + paymentRate), years * frequency)));
            component.set("v.paymentAmount", paymentAmount);
    
            // 2. Fire event with new mortgage data
            var mortgageChangeEvent = $A.get("e.c:MortgageChange");
            mortgageChangeEvent.setParams({"principal": principal,
                             "years": years,
                             "rate": rate,
                             "paymentAmount": paymentAmount,
                             "paymentFrequency": paymentFrequency});
            mortgageChangeEvent.fire();
        }
	}
})