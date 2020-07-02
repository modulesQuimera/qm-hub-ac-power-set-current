module.exports = function(RED) {

    function SetCurrentNode(config) {
        RED.nodes.createNode(this, config);
        var node = this
        node.current_value = config.current_value

        node.on('input', function(msg, send, done) {
            var globalContext = node.context().global;
            var exportMode = globalContext.get("exportMode");
            var currentMode = globalContext.get("currentMode");
            var command = {
                type: "AC_POWER_SOURCE_modular_V1.0",
                slot: 1,
                method: "set_current",
                current_value: parseFloat(node.current_value) 
            }
            var file = globalContext.get("exportFile")
            var slot = globalContext.get("slot");
            if(currentMode == "test"){file.slots[slot].jig_test.push(command)}
            else{file.slots[slot].jig_error.push(command)}
            globalContext.set("exportFile", file);
            // node.status({fill:"green", shape:"dot", text:"done"}); 
            msg.payload = command
            send(msg)
        });
            
    }
    RED.nodes.registerType("set_current", SetCurrentNode);
}