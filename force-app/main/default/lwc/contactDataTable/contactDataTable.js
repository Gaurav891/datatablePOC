import Phone from '@salesforce/schema/Account.Phone';
import { LightningElement } from 'lwc';

export default class ContactDataTable extends LightningElement {

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

}