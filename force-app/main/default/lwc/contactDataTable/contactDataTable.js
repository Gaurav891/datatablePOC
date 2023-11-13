import Phone from '@salesforce/schema/Account.Phone';
import { LightningElement } from 'lwc';
import getContact from '@salesforce/apex/contactApexController.getAllContact'

export default class ContactDataTable extends LightningElement {
   
   employeeData=[];
   
   employeeColumn=[
      {label:'Name', fieldName:'Name'},
      {label:'Phone', fieldName:'Phone',type:'phone'},
      {label:'Email', fieldName:'Email',type:'email'},
      {label:'Account Name', fieldName:'accountName'},
      {label:'Street', fieldName:'street'},
      {label:'City', fieldName:'city'},
      {label:'Country', fieldName:'country'},
      {label:'Pin Code', fieldName:'postalCode'},

   ]

   connectedCallback()
   {
      getContact()
      .then(Contacts => {
         Contacts.forEach(contact => {
            contact.accountName = contact.Account?.Name;
            contact.street = contact.MailingAddress?.street;
            contact.city = contact.MailingAddress?.city;
            contact.country = contact.MailingAddress?.country;
            contact.postalCode = contact.MailingAddress?.PostalCode;//Mailing PostalCode

         });
         console.log(Contacts);
          this.employeeData = Contacts;
      })
      .catch(error => console.log(error))
   }
    

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
