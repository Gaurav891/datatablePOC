import { api,LightningElement } from 'lwc';

export default class LibsPicklist extends LightningElement {

//public property value here populated from picklist template
   @api name;
   @api label;
   @api placeholder;
   @api value ;
   @api options;
   @api readOnly = false; 
   @api recordID; //to store the Id of each record in dt. 

   renderedCallback()
   {
      console.log('data check',this.readOnly);

      console.log('--',this.placeholder);
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