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


renderedCallback(){
   console.log('re-render ',this.picklistValues);
}
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
      console.log('setter execution...',newVal);
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
      console.log('hchange',event.detail.value);
      this.picklistValues = event.detail.value;
      const hiddenFormSubmitButton = this.template.querySelector('.picklistFormSubmitbutton');
      if(hiddenFormSubmitButton)
      {
         hiddenFormSubmitButton.click();
      }
     
   }
   makePicklistEditable()
   {
      
      this.readOnly =false;
      const that = this;
      //re-rendering edit mode combobox would take some time so using set-timeout 
      setTimeout(()=>{
         const cmb = that.template.querySelector('lightning-combobox');
         cmb.focus();
      },100)
      
   }
   //when div focusout below logic runs.
   //Target is the element which looses focus 
   //relatedTarget is the element which gainign the focus
   //relatedTarget helps here to observe user clicks on UI

   /*
      called when user click outside of the cell.
      using relatedTarget to undrstand westher user clicks outside of the cell or inside cells

   */
   makePicklistReadOnly(event)
   {
      /*
          list of possible  value inside the cell where user can clicks 
          and lose focus ..
          1. UpdateMultipleRecords - get this name when user cliks inside cell but checkbox 
          2. LeadSource - get this name when user cliks inside cell combobox 
          3. picklistContainer - get this name when user cliks inside cell data-name div
          4. cancelPopoverButton -get this name when user cliks inside cell but on cancelPopOver button
          5. savePopOverButton-get this name when user cliks inside cell but on save button 

          if the user clicks on above name then we won't make piklist radonly ...
          we assume while editing usr may clicks on these known item
      */
      console.log(event.relatedTarget?.name);
     //console.log(event.relatedTarget?.getAttribute('name'));
     console.log(event.relatedTarget?.getAttribute('data-name'));

     const relatedProperty = event.relatedTarget?.name || event.relatedTarget?.getAttribute('data-name');
     if(
         !(
            relatedProperty &&
                 (relatedProperty === this.name ||
                  relatedProperty === 'picklistContainer' ||
                  relatedProperty === 'UpdateMultipleRecords'||
                  relatedProperty === 'cancelPopoverButton' ||
                  relatedProperty === 'savePopOverButton'
                  )
         )
       )
     {
       
         this.readOnly =true ; // if user not click anywhere above mention name then means user click outside so that readOnly
         
         //we need to build logic when to call fireCellChangeEvent 

          // *1. checkbox,save,cancel is visible and user didn't click on apply instead click anywhere else //focusout means click anywhere but not on "picklistContainer"
          //  since user didn't click on apply then revert back the picklist changed value
          if(this.showcheckBoxToupdateSelectedRecords && event.srcElement?.name !=='savePopOverButton')
         {
           console.log('1 save not clicked',this.picklistValues);
           console.log('2 save not clicked',this.value);


           this.picklistValues = this.oldValue; //
           console.log('Revert back picklist value');
         }
          else if(this.oldValue != this.picklistValues || this.updateSelectedRecords)
          {
           console.log('fire event');
           this.fireCellChange(); 
          }
         this.updateSelectedRecords =false;

      }

     //

      
   }

   //piclist cancel is clicked 
   handleCancel()
   {
      this.readOnly =true ;
   }
   //when form is submitted 
   handleSubmit(event)
   {
        event.preventDefault(); 
        this.readOnly =true ;
   }
 //call when checkbox is clicked 
 handleUpdateSelectedRecords(event)
 {
   this.updateSelectedRecords = event.target.checked;
   
 }
  //fire event when picklist value changed 
  fireCellChange()
  {
    //fire the event and handle the event in the parent component and update the draft val
     //using special st. of event response detail so that we could re-use the same code oncellchange in parent component
     const detail ={
      draftValues :[
        {
           [this.name] : this.picklistValues,
            Id : this.recordID
        }
      ],
      updateSelectedRecords : this.updateSelectedRecords //notify dataTableThat about checkbox state
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

   

  


}