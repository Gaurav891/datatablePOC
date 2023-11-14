import { LightningElement } from 'lwc';
import getContact from '@salesforce/apex/contactApexController.getAllContact'

export default class ContactDataTable extends LightningElement {
   
   employeeData=[];
   
   employeeColumn=[
      // Modified column to support the URL
      {
         label:'Name', 
         fieldName:'contactUrl',
         type:'url',
         typeAttributes:{
            label: {
               fieldName:'Name'
            },
            target:'_blank',
            tooltip:'View contact'

         }
      },
      {
         label:'Phone', 
         fieldName:'Phone',
         type:'phone'
      },
      {
         label:'Email', 
         fieldName:'Email',
         type:'email'
      },
      {
         label:'Account Name', 
         fieldName:'AccountUrl', //backend value
         type:'url',
         typeAttributes:{
            label:{
               fieldName:'accountName' //value looks on UI
            },
            target:'_blank',
            tooltip:'View Account'

         }
      },
      {
         label:'Street', 
         fieldName:'street'
      },
      {
         label:'City', 
      fieldName:'city'
      },
      {
         label:'Country', 
         fieldName:'country'
      },
      {
         label:'Pin Code', 
         fieldName:'postalCode'
      },

   ]

   /*
    connectedCallback will fetch data faster than wire in ORDER OF Execution.
    adding new atribute to the each contcat to suite the requirment of dataTable

   */
   connectedCallback()
   {
      /* Qureying contacts from salesforce org and adding new attributes to suite datatable requirements */
      getContact()
      .then(Contacts => {
         Contacts.forEach(contact => {
            //added below 2 attributes to support the Url
            contact.contactUrl = '/'+contact.Id;
            contact.AccountUrl= '/'+contact.Account?.Id;
            contact.accountName = contact.Account?.Name;
            contact.street = contact.MailingAddress?.street;
            contact.city = contact.MailingAddress?.city;
            contact.country = contact.MailingAddress?.country;
            contact.postalCode = contact.MailingAddress?.PostalCode;

         });
         console.log(Contacts);
          this.employeeData = Contacts;
      })
      .catch(error => console.log(error))
   }
// to learn more about data types in table follow below links
// https://developer.salesforce.com/docs/component-library/bundle/lightning-datatable/documentation
    /* Modification 
      Instead of static ,Now we will take the data from salesforce Org.
    //manual build of column --comment directly added on GitHub, though it's not a good practice.
    
    employeeColumn=[
       {label:'Employee ID', fieldName:'empID'},
       {label:'First Name', fieldName:'empFirstName'},
       {label:'Last Name', fieldName:'empLastName'},
       {label:'Phone', fieldName:'empPhone',type:'phone'},
       {label:'Email', fieldName:'empEmail',type:'email'},
    ]
    //generate static data
    employeeData=[
       { 
        empID: '1',
        empFirstName:'Gaurav',
        empLastName:'Kr',
        empPhone:'(985) 558-4621',
        empEmail:'gaurav@gmail.com'
       },
       { 
        empID: '2',
        empFirstName:'Gaurav',
        empLastName:'Kr',
        empPhone:'(985) 558-4621',
        empEmail:'gaurav@gmail.com'
       }, 
       { 
        empID: '3',
        empFirstName:'Gaurav',
        empLastName:'Kr',
        empPhone:'(985) 558-4621',
        empEmail:'gaurav@gmail.com'
       }, 
       { 
        empID: '4',
        empFirstName:'Gaurav',
        empLastName:'Kr',
        empPhone:'(985) 558-4621',
        empEmail:'gaurav@gmail.com'
       }
    ]
*/
}
