"use strcit";

function TimeControl(timeUnitsCount) {
    var that = this;
    this.timeIndex = 0;
    this.timeMaxIndex = timeUnitsCount - 1;
    this.onTimeUnitChange;
    this.duration = 1500;
    this.play = false;

    this.playTime = function() {
        that.play = true;
        setTimeout( that.advanceTime, 0);
    };
    
    this.advanceTime = function() {
        if(that.play == true && that.timeIndex < that.timeMaxIndex) {
            that.timeIndex += 1;
            
            that.onTimeUnitChange();
            setTimeout(that.advanceTime, that.duration);
        }
        else
            clearTimeout(that.advanceTime);  
    };
    
    this.pauseTime = function() {
        that.play = false;
        clearTimeout(that.advanceTime);
    };
    
    this.nextTime = function() {
        if(that.timeIndex < that.timeMaxIndex)
        {
            that.timeIndex += 1;
            that.onTimeUnitChange();
        }
    };
    
    this.previousTime = function() {
        if(that.timeIndex > 0)
        {
            that.timeIndex -= 1;
            that.onTimeUnitChange();
        }
    };
    
    this.isMaxTime = function() {
        return that.timeIndex == that.timeMaxIndex;
    };
    
    this.isMinTime = function() {
        return that.timeIndex == 0;
    };
}


