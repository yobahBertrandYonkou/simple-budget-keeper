var DOM = {
    value: "value",
    desc: "description",
    type: "type",
    post: "post",
    addExp: "add-exp",
    addInc: "add-inc",
    totalInc: "total-income",
    totalExp: "total-expense",
    totalBudget: "budget-value"
}

var init = (function(){
    document.getElementById(DOM.desc).focus();
    
    var date = new Date();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "Setember", "October", "November", "December"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednessday", "Thursday", "Friday", "Saturday"];
    
    document.getElementById("title").textContent = days[date.getDay()] + ", " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
})();

var Expenses = function(id, type, description, value){
    this.id = id;
    this.type = type;
    this.description = description;
    this.value = value;
};

Expenses.prototype.percentage = function(){
    return Math.round((this.value / data.allTotals.inc) * 100);
}
    
var Income = function(id, type, description, value){
    this.id = id;
    this.type = type;
    this.description = description;
    this.value = value;
};
    
var data = {
    allTotals: {
        exp: 0,
        inc: 0
    },
    
    allItems: {
        exp: [],
        inc: []
    },
    
    totalBudget: function(){
        return this.allTotals.inc - this.allTotals.exp;
    }
};


var DeleteIncome = (function(){
    document.getElementById("income").addEventListener("click", function(event){
        var ID = event.target.parentNode.parentNode.id.split("-")[1];
        var itemArr = data.allItems.inc;
        
        //get index of item
        for(var i = 0; i < itemArr.length; i++){
            
            if(itemArr[i].id.toString() === ID){
                break;
            }
        }
        
        //updates total inc and total budget
        data.allTotals.inc -= itemArr[i].value;        
        
        //updates ui
        //updates total budget;
        if(data.totalBudget() > 0){
            document.getElementById(DOM.totalBudget).textContent = "+ " + segmentMaker(data.totalBudget().toFixed(2));
        }else if(data.totalBudget() < 0){
            document.getElementById(DOM.totalBudget).textContent = "- " + segmentMaker(Math.abs(data.totalBudget()).toFixed(2));
        }else{
            document.getElementById(DOM.totalBudget).textContent = data.totalBudget().toFixed(2);
        }
        
        //updates total income
        document.getElementById(DOM.totalInc).textContent = "+ " + segmentMaker(data.allTotals.inc.toFixed(2));
        
        //deletes item from item array and ui
        if(i < itemArr.length){
            itemArr.splice(i, 1);
            document.getElementById("income").removeChild(document.getElementById("income-" + ID));
        }     
        
    });
})();


var DeleteExpense = (function(){
    document.getElementById("expense").addEventListener("click", function(event){
        var ID = event.target.parentNode.parentNode.id.split("-")[1];
        
        var itemArr = data.allItems.exp;
        
        //get index of item
        for(var i = 0; i < itemArr.length; i++){
        
            if(itemArr[i].id.toString() === ID){
               break;
            }
        }
        
        //updates total exp and total budget
        data.allTotals.exp -= itemArr[i].value;        
        
        //updates ui
        //updates total budget;
        if(data.totalBudget() > 0){
            document.getElementById(DOM.totalBudget).textContent = "+ " + segmentMaker(data.totalBudget().toFixed(2));
        }else if(data.totalBudget() < 0){
            document.getElementById(DOM.totalBudget).textContent = "- " + segmentMaker(Math.abs(data.totalBudget()).toFixed(2));
        }else{
            document.getElementById(DOM.totalBudget).textContent = data.totalBudget().toFixed(2);
        }
        
        //updates total expenses
        document.getElementById(DOM.totalExp).textContent = "- " + segmentMaker(data.allTotals.exp.toFixed(2));
                
    
        
        //deletes item from item array and ui
        if(i < itemArr.length){
            itemArr.splice(i, 1);
            document.getElementById("expense").removeChild(document.getElementById("expense-" + ID));
        }     
    });
})();


var segmentMaker = function(value){
    var separated = value.split(".");
    var decimal = separated[1];
    var actual = separated[0];
    var i, j = 0, finalStr = "";
    var strLen = actual.length;
    var halfs = Math.floor(strLen / 3);
    
    if(strLen % 3 == 0){
        for(i = halfs; i > 0; i--){
            j += 3;
            finalStr = "," + actual.substr(-1*j, 3) + finalStr;
            j = finalStr.length - 1;
        }
        return finalStr.substr(1) + "." + decimal;
    }else{
        for(i = halfs; i > 0; i--){
            j += 3;
            finalStr = "," + actual.substr(-1*j, 3) + finalStr;
            j = finalStr.length - 1;
        }
        
        return actual.substr(0, strLen - (halfs * 3)) + finalStr + "." + decimal;
    }
};
    
var UIController = (function(){
    var post = document.getElementById(DOM.post);
    var id = -1;
    var item;
    var html;
    var dataItem;
    
    //get input function
    var getInput =  function(){
        return {
            value: document.getElementById(DOM.value).value,
            description: document.getElementById(DOM.desc).value,
            type: document.getElementById(DOM.type).value      
        }
    }
    
    //clear inout fields
    var clearFields = function(){
        document.getElementById(DOM.value).value = "";
        document.getElementById(DOM.desc).value = "";
    }
    
    
    //updates items on ui
    var itemUpdater =  function(type){
        if(type === "+"){
            dataItem = data.allItems.inc[data.allItems.inc.length - 1];
            html = '<div class = "inc-items" id = "income-%id%"> <div class = "item-desc left"> %desc%</div><div class = "inc-value right">+ %value%&nbsp<i title = "Delete item" class="far fa-times-circle" style = "font-size: small"></i></div></div>';
            
            html = html.replace("%id%", dataItem.id); 
            html = html.replace("%desc%", dataItem.description); 
            html = html.replace("%value%", segmentMaker(dataItem.value.toFixed(2)));
            
            document.getElementById(DOM.addInc).insertAdjacentHTML("afterend", html);
        } else {
            dataItem = data.allItems.exp[data.allItems.exp.length - 1];
            html = '<div  class = "exp-items" id = "expense-%id%"><div class = "item-desc left"> %desc%</div><div class = "exp-value right">- %value% <span class = "percentages">%percentage%</span>&nbsp<i title = "Delete item" class="far fa-times-circle" style = "font-size: small"></i></div></div>';
            
            html = html.replace("%id%", dataItem.id); 
            html = html.replace("%desc%", dataItem.description); 
            html = html.replace("%value%", segmentMaker(dataItem.value.toFixed(2)));
            html = html.replace("%value%", segmentMaker(dataItem.value.toFixed(2)));
            
            if(data.allTotals.inc === 0){
                html = html.replace("%percentage%", "--");
            }else{
                html = html.replace("%percentage%", dataItem.percentage() + "%");
            }
            
            document.getElementById(DOM.addExp).insertAdjacentHTML("afterend", html);
        }
    }
    
    var dataManipulator = function(input){
        //input validatetion
        if(input.description === "" || input.value === "") {
            alert("Please, fill all fields!");
        } else if (parseFloat(input.value <= 0)) { //value validation
            alert("Value cannot be zero or less!");
        } else {
            input.value = parseFloat(input.value); //converting value from string to float.
            
            //clearing field
            clearFields();
            
            //stores data
            if(input.type === "+") {
                //gets next id
                if(data.allItems.inc.length === 0) {
                    id = 0;
                } else {
                    id = data.allItems.inc[data.allItems.inc.length - 1].id + 1;
                }
                //adds item to data
                data.allItems.inc.push(new Income(id, input.type, input.description, input.value));
                
                 //calculates total income
                data.allTotals.inc += parseFloat(input.value);
                
                //updates total income
                document.getElementById(DOM.totalInc).textContent = "+ " + segmentMaker(data.allTotals.inc.toFixed(2));
                
                //update items
                itemUpdater(input.type);
                
            } else {
                //gets next id
                if(data.allItems.exp.length === 0){
                    id = 0;
                } else {
                    id = data.allItems.exp[data.allItems.exp.length - 1].id + 1;
                }
                //adds item to data
                data.allItems.exp.push(new Expenses(id, input.type, input.description, input.value));
                
                //calculates total expenditure
                data.allTotals.exp += parseFloat(input.value);
                
                //updates total expenses
                document.getElementById(DOM.totalExp).textContent = "- " + segmentMaker(data.allTotals.exp.toFixed(2));
                
                 //update items
                itemUpdater(input.type);
            }
        }
        //sets focus to description input box
        document.getElementById(DOM.desc).focus();
        
        //updates total budget;
        if(data.totalBudget() > 0){
            document.getElementById(DOM.totalBudget).textContent = "+ " + segmentMaker(data.totalBudget().toFixed(2));
        }else if(data.totalBudget() < 0){
            document.getElementById(DOM.totalBudget).textContent = "- " + segmentMaker(Math.abs(data.totalBudget()).toFixed(2));
        }else{
            document.getElementById(DOM.totalBudget).textContent = data.totalBudget().toFixed(2);
        }
    };
    
    //listen's for the post button press
    post.addEventListener("click", function(){
        dataManipulator(getInput());
        
    });
 
    //sets enter keypress event
    document.addEventListener("keypress", function(event){
        if(event.keyCode === 13){
            dataManipulator(getInput());
        }
    });
})();