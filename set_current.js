module.exports = function(RED) {

    function SetCurrentNode(config) {
        RED.nodes.createNode(this, config);
        this.current_value = config.current_value;
        this.slot = config.slot;
        var node = this;

        node.on('input', function(msg, send, done) {
            var globalContext = node.context().global;
            var exportMode = globalContext.get("exportMode");
            var currentMode = globalContext.get("currentMode");
            var command = {
                type: "AC_POWER_SOURCE_modular_V1_0",
                slot: parseInt(node.slot),
                method: "set_current",
                current_value: parseFloat(node.current_value),
                get_output: {},
                compare: {}
            };
            var file = globalContext.get("exportFile");
            var slot = globalContext.get("slot");
            if(!(slot === "begin" || slot === "end")){
                if(currentMode == "test"){
                    file.slots[slot].jig_test.push(command);
                }
                else{
                    file.slots[slot].jig_error.push(command);
                }
            }
            else{
                if(slot === "begin"){
                    file.slots[0].jig_test.push(command);
                    // file.begin.push(command);
                }
                else{
                    file.slots[3].jig_test.push(command);
                    // file.end.push(command);
                }
            }
            globalContext.set("exportFile", file);
            console.log(command);
            send(msg);
        });    
    }
    RED.nodes.registerType("set_current", SetCurrentNode);
};