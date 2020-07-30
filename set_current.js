module.exports = function(RED) {

    function multipleSetCurrent(self, file, slot, currentMode){
        for(var t=0; t<self.qtdSetCurrent; t++){
            var command_n={
                type: "AC_POWER_SOURCE_modular_V1_0",
                slot: parseInt(self.slot),
                method: "set_current",
                current_value: parseFloat(self.current_value_n[t]),
                get_output: {},
                compare: {}
            }
            if(!(slot === "begin" || slot === "end")){
                if(currentMode == "test"){
                    file.slots[slot].jig_test.push(command_n);
                }
                else{
                    file.slots[slot].jig_error.push(command_n);
                }
            }
            else{
                if(slot === "begin"){
                    file.slots[0].jig_test.push(command_n);
                }
                else{
                    file.slots[3].jig_test.push(command_n);
                }
            }
        }
        return file;
    }

    function SetCurrentNode(config) {
        RED.nodes.createNode(this, config);
        this.current_value = config.current_value;
        this.slot = config.slot;

        this.qtdSetCurrent = config.qtdSetCurrent;
        this.current_value_n = [];
        this.current_value_n.push(config.current_value1);
        this.current_value_n.push(config.current_value2);
        this.current_value_n.push(config.current_value3);
        this.current_value_n.push(config.current_value4);
        this.current_value_n.push(config.current_value5);
        this.current_value_n.push(config.current_value6);
        this.current_value_n.push(config.current_value7);
        this.current_value_n.push(config.current_value8);
        this.current_value_n.push(config.current_value9);
        this.current_value_n.push(config.current_value10);
        this.current_value_n.push(config.current_value11);
        this.current_value_n.push(config.current_value12);
        this.current_value_n.push(config.current_value13);
        this.current_value_n.push(config.current_value14);
        this.current_value_n.push(config.current_value15);
        this.current_value_n.push(config.current_value16);
        this.current_value_n.push(config.current_value17);
        this.current_value_n.push(config.current_value18);
        this.current_value_n.push(config.current_value19);
        this.current_value_n.push(config.current_value20);
        this.current_value_n.push(config.current_value21);
        this.current_value_n.push(config.current_value22);
        this.current_value_n.push(config.current_value23);
        this.current_value_n.push(config.current_value24);

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
                    file = multipleSetCurrent(node, file, slot, currentMode);
                }
                else{
                    file.slots[slot].jig_error.push(command);
                    file = multipleSetCurrent(node, file, slot, currentMode);
                }
            }
            else{
                if(slot === "begin"){
                    file.slots[0].jig_test.push(command);
                    file = multipleSetCurrent(node, file, slot, currentMode);
                }
                else{
                    file.slots[3].jig_test.push(command);
                    file = multipleSetCurrent(node, file, slot, currentMode);
                }
            }
            globalContext.set("exportFile", file);
            console.log(command);
            send(msg);
        });    
    }
    RED.nodes.registerType("set_current", SetCurrentNode);
};