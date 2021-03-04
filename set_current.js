module.exports = function(RED) {

    var mapeamentoNode;

    function SetCurrentNode(config) {
        RED.nodes.createNode(this, config);
        this.mapeamento = config.mapeamento;
        this.type_mode = config.type_mode;
        this.c_select = config.c_select;
        this.IA = config.IA;
        this.IB = config.IB;
        this.IC = config.IC;
        this.IA_value = config.IA_value;
        this.IB_value = config.IB_value;
        this.IC_value = config.IC_value;
        this.IA_value_solo = config.IA_value_solo;
        this.IB_value_solo = config.IB_value_solo;
        this.IC_value_solo = config.IC_value_solo;


        var node = this;
        mapeamentoNode = RED.nodes.getNode(this.mapeamento);

        node.on('input', function(msg, send, done) {
            var globalContext = node.context().global;
            var exportMode = globalContext.get("exportMode");
            var currentMode = globalContext.get("currentMode");

            if(node.type_mode === 'mono'){

                var current_value;
                if(node.c_select === 'IA'){ current_value = node.IA_value_solo === "" ? 0 : parseFloat(node.IA_value_solo); }
                if(node.c_select === 'IB'){ current_value = node.IB_value_solo === "" ? 0 : parseFloat(node.IB_value_solo); }
                if(node.c_select === 'IC'){ current_value = node.IC_value_solo === "" ? 0 : parseFloat(node.IC_value_solo); }

                var mono_command = {
                    type: "AC_power_source_virtual_V1_0", 
                    slot: parseInt(mapeamentoNode.slot),
                    method: "set_current_mono",
                    compare:{},
                    phase_select:0,
                    current_value: current_value,
                    IA: node.IA,
                    IB: node.IB,
                    IC: node.IC
                };
                command = mono_command;
               
            }else {

                var tri_command = {
                    type: "AC_power_source_virtual_V1_0",
                    slot: parseInt(mapeamentoNode.slot),
                    method: "set_current_tri",
                    compare:{},
                    current_A: node.IA_value === "" ? 0 : parseFloat( node.IA_value),
                    current_B: node.IB_value === "" ? 0 : parseFloat( node.IB_value),
                    current_C: node.IC_value === "" ? 0 : parseFloat( node.IC_value),
                    IA: node.IA,
                    IB: node.IB,
                    IC: node.IC,
                };
                command = tri_command;

            }

            var file = globalContext.get("exportFile");
            var slot = globalContext.get("slot");
            if (!(slot === "begin" || slot === "end")) {
                if (currentMode == "test") {
                    file.slots[slot].jig_test.push(command);
                } else {
                    file.slots[slot].jig_error.push(command);
                }
            } else {
                if (slot === "begin") {
                    file.slots[0].jig_test.push(command);
                } else {
                    file.slots[3].jig_test.push(command);
                }
            }
            globalContext.set("exportFile", file);
            send(msg);
        });
    }
    RED.nodes.registerType("set_current", SetCurrentNode);
};