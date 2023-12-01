import { api,LightningElement } from 'lwc';

export default class LibsPicklist extends LightningElement {

//public property value here populated from picklist template
   @api name;
   @api label;
   @api placeholder;
   //@api value ;
   @api options;
   @api readOnly = false; 
   @api recordID; //to store the Id of each record in dt. 

   //attributes declared to match the standard UI when record is being to edit
   @api selected;
   @api numberOfRecordSelected =0;
   @api variant = 'standard';


   updateSelectedRecords =false;
   picklistValues ='';
   oldValue;

   //for combobox  instead of value as property 
   //we use getter and setter. 

   //whereever/whenever template refer value attribute  in code 
   //below get value method called
    @api 
    get value()
    {
      return this.picklistValues;
    }
    // setter method for value
    //whenever on UI value attributes changed then below fun called
    set value(newVal)
    {
       this.picklistValues = newVal;
       this.oldValue=newVal;
    }
     //getter to indentify  if we need to show checbox 
    get showcheckBoxToupdateSelectedRecords()
    {
      //show checkbox only when on UI more than one is selected
      return this.selected && (this.numberOfRecordSelected >1);
    }

     //getter to provide label to checkbocx on popover
     get checkboxLabel()
     {
      return 'Update '+this.numberOfRecordSelected+' selected item ';
     }

     //refer slds classes documentation to learn more
     //section _body style
     get section_BodyPopOver()
     {
       let style = 'slds-popover__body'
       if(!this.showcheckBoxToupdateSelectedRecords)
       {
         style +='zeroPadding';
       }
          return style; 
     }

     //section style 
     get section_popOver()
     {
      let style = 'slds-popover slds-popover_prompt slds-popover_prompt_bottom-right ';//slds-popover_small
      if(this.showcheckBoxToupdateSelectedRecords)
      {
         style += 'bottomPopover';
      }
      else 
      {
         style += 'inlinePopover';
      }
      return style;
     }

    
   //* called when picklist value of combox changed
   handlechange(event)
   {
      //fire the event and handle the event in the parent component and update the draft val
     //using special st. of event response detail so that we could re-use the same code oncellchange in parent component
      const detail ={
          draftValues :[
            {
               [this.name] : event.detail.value,
               'Id' : this.recordID
            }
          ]
      }
      //oncellchange event is alredy defined in parent component 
      //so i am gonna use the same  
      // we gonna use the same st. of detail which we are getting from standard cellchange event so same logic can be reused 
      this.dispatchEvent(new CustomEvent('cellchange',{
       bubbles:true,
       composed:true,
       cancelable:true,
       detail :detail
           
      }));

   }
   makePicklistEditable()
   {
      console.log('combo clicked');
      this.readOnly =false;
      const that = this;
      //re-rendering edit mode combobox would take some time so using set-timeout 
      setTimeout(()=>{
         const cmb = that.template.querySelector('lightning-combobox');
         cmb.focus();
      },100)
      
   }
   makePicklistReadOnly()
   {
      this.readOnly =true; //Re-render UI in readonly mode 
   }

   

  


}