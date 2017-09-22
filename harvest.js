

var harvestMod ={
    run: function(creep, sources) {
        
        if(creep.memory.primarySource == [null]){
            
        }
        var sources = creep.room.find(sources); 
        for(var s in sources) {
            var source = sources[s];
            //console.log('sources:', sources)
            var harvestCode = creep.harvest(source);
            //console.log('HarvestCode: ', harvestCode);
            if(harvestCode == ERR_NOT_ENOUGH_RESOURCES){
                //console.log('Not enough resources Moving on');
                continue;
            }
            if(harvestCode == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            break;
        }
    }
}

module.exports = harvestMod;