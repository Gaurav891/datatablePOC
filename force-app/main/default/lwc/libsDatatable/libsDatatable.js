import LightningDatatable from "lightning/datatable"; //import dataTable because this gonna extends
import picklist from "./picklist.html";

export default class LibsDatatable extends LightningDatatable  {

    static customTypes = {
        pickList: {
          template: picklist, //template which define how the Cell UI looks
          standardCellLayout: false,
          typeAttributes: ['name','label','placeholder','readonly','options','recordID'] // values of all these attributes is defined from the 
                                                                              //other place where the customTypes Picklist is used
                                                                              //as column defination. 
        }


}
}