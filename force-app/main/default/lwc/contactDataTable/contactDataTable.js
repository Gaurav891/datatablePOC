import { LightningElement,track } from 'lwc';
import getContact from '@salesforce/apex/contactApexController.getAllContact'
import FirstName from '@salesforce/schema/Contact.FirstName';

export default class ContactDataTable extends LightningElement {
   
   // * Table Data
    employeeData=[];
   
    originalEmployeeData =[];

   // * Sorting Attributes 
   sortedBy ='Name';
   SortedDirection ='asc';
   defaultSortDirection ='asc'

   //* selected row 
   selectedRows=[];

   //* Define action column as per documentation action column should be array of action with label/Name pairs
   rowaction =[
      {
         label:'view', //value available on UI
         name :'view'  // value used in backend
      },
      {
         label:'edit',
         name:'edit',
      },
      {
         label:'delete',
         name:'delete'
      }
   ]
   
   
   // * Table columns
   employeeColumn=[
      // Modified column to support the URL
      {
         
         label:'Name', 
         fieldName:'contactUrl',
         type:'url',
         typeAttributes:{
            label: {
               fieldName:'Name' //value which we want to show on UI
            },
            target:'_blank',
            tooltip:'View contact'

         },
         sortable:true,
         initialWidth :80,
         hideDefaultActions:true
      },
      {
         label:'Phone', 
         fieldName:'Phone',
         type:'phone',
         sortable:true,
         initialWidth :80,
         hideDefaultActions:true
      },
      {
         label:'Email', 
         fieldName:'Email',
         type:'email',
         sortable:true,
         initialWidth :100,
         hideDefaultActions:true
      },
      //column having custom action 
      {
         label:'Lead Source', 
         fieldName:'LeadSource',
         actions:[
          { label : 'All' ,checked: true, name: 'all' },  
          { label : 'Web' ,checked: false, name: 'Web' },  
          { label : 'Phone Inquiry' ,checked: false, name: 'Phone_Inquiry' },  
          { label : 'Partner Referral' ,checked: false, name: 'Partner_Referral' },  
          { label : 'External Referral' ,checked: false, name: 'External_Referral' },
          { label : 'Partner	Partner' ,checked: false, name: 'Partner_Partner' },
          { label : 'Public Relations' ,checked: false, name: 'Public_Relations' },
          { label : 'Trade Show' ,checked: false, name: 'Trade_Show' },
          { label : 'Word of mouth' ,checked: false, name: 'Word_of_mouth' },
          { label : 'Employee Referral' ,checked: false, name: 'Employee_Referral' },
          { label : 'Other' ,checked: false, name: 'Other' },
         ],
         sortable:true,
         initialWidth :70,
         hideDefaultActions:true
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

         },
         sortable:true,
         initialWidth :150,
         hideDefaultActions:true
      },
      {
         label:'Street', 
         fieldName:'street',
         sortable:true,
         initialWidth :220,
         wrapText:true,
         hideDefaultActions:true
      },
      {
         label:'City', 
      fieldName:'city',
      sortable:true,
     
      hideDefaultActions:true
      },
      {
         label:'Country', 
         fieldName:'country',
         sortable:true,
         
         hideDefaultActions:true
      },
      {
         label:'Pin Code', 
         fieldName:'postalCode',
         sortable:true,
         
         hideDefaultActions:true
      },
      //add another column which contains list of action.
      {
         type:'action',
         typeAttributes:{
            rowActions :this.rowaction,
            menuAlignment :'auto'
         }

      }
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
            //contact.AccountUrl= '/'+contact.Account?.Id;
            contact.AccountUrl= (contact.Account === undefined ? '':'/'+contact.Account.Id); 
            contact.accountName = contact.Account?.Name;
            contact.street = contact.MailingAddress?.street;
            contact.city = contact.MailingAddress?.city;
            contact.country = contact.MailingAddress?.country;
            contact.postalCode = contact.MailingAddress?.PostalCode;

         });
         console.log(Contacts);
          this.employeeData = Contacts;
          this.originalEmployeeData = Contacts;
          //mark the 1st three row as selected by default.
          //we need to pass list of ID to ldt to mark those selected.
          this.selectedRows= Contacts.slice(0,3).map(contact => contact.Id);
          console.log('--default selected row--',JSON.stringify(this.selectedRows));
      })
      .catch(error => console.log(error))
   }
   // * Handle rowAction function 
   handleRowAction(event)
   {
      const actionName = event.detail?.action?.name;   //optional chaining..if the object accessed is null/undefined then expression short circuit evaluate to undefined 
      console.log(`actionName ${actionName}`);
      const row =event.detail?.row;
      console.log(JSON.stringify(row));

      switch(actionName){
         case 'view':
            console.log('view action clicked');
            break;
         case 'edit':
            console.log('edit button clicked');
            break;
         case 'delete':
            console.log('delete button clicked');
            //* logic to temporarily delete data from row
            const rows = this.employeeData;
            const rowIndex = rows.indexOf(row);
            console.log(rowIndex);
            rows.splice(rowIndex, 1);//delete 1 items of given rowIndex
            //shallow copy ..share the same reference in the memory 
            //spread syntax generate new array so re-render on UI takes place.
            //we may use deepclone as well but it's is not required here 
            //deep clone will take more memory /more time in execution as compare to shallow clone.
            this.employeeData = [...rows]; //we want each item of rows array copied to empdata
           //* deep copy ..attributes share different reference in the memory 
           // this.employeeData = JSON.parse(JSON.stringify(rows));


            break;
         default : 
         break 

      }

   }

   // * 
   sortBy(field, reverse, primer){
      
      //* key function return the value of attribute on whch sorting take place.
      //* each function accept a single contact object return value of specific field
      //* primer we use to do transform ..all character in upper case 
      //* primer wil accept the field value perform some logic on that then return . 
       const key =primer 
                  ? function(a)
                  {
                      return primer(field,a);
                  }
                  : 
                  function(a)
                  {
                     
                     return a[field];
                  };

      // * return comparable fun
       return function(a,b)
       {
         //a is object 
         //b is another adjacent record

         //once key called on a and b ...key function return  their particular field value.
          a = key(a);
          b = key(b);
         
          //based on it return -1, 1 ,0 
          /*
             -> valid for asc 
             > 0 means a should comes after b;
             < 0 means a should comes before b;
             = 0 means if order doesn't matter. 
          */

         //* handle undefined values while sorting.
         if(a === b)
             return 0;
         else if(a === undefined) 
            return reverse * -1; //undefined will come 1st in asc
         else if (b === undefined)
           return reverse * 1; //
         
          return reverse * ((a > b) - (b > a));
       }


   }
   //* helper method for sortby method
   primer(fieldName,record)
   {
      let retrunVal;
       switch (fieldName){
         case "contactUrl" : 
           retrunVal = record['Name'];
           break;
         case "AccountUrl" :
            retrunVal = record['accountName'];
            break;
         default:
            retrunVal = record[fieldName];
            break;

       }
       return retrunVal;
   }

   // * handle onsort function 
   handleSort(event)
   {
      console.log(event.detail);
      const {fieldName :sortedBy , sortDirection: SortedDirection} = event.detail;
      const clonedContacts = [...this.employeeData]; //shallow copy ..but 1st level it acts as deep copy.
      // sort function accept compareFn.
      console.log(`sortedBy : ${sortedBy} , sortedDirection :${SortedDirection}`);
      clonedContacts.sort(this.sortBy(sortedBy, SortedDirection === 'asc' ? 1 : -1,this.primer)); //no copy is made here same array got sorted.
      this.employeeData = clonedContacts; 
      this.sortedBy = sortedBy;
      this.SortedDirection = SortedDirection;

      }
   // * whenever header column action is clicked this function is called 
   handleHeaderAction(event)
   {
       console.log(JSON.stringify(event.detail));
       //event.detail gives cloumn defination and action which is clicked
       const {action ,columnDefinition} = event.detail;
       // get the cloumn and find the particular cloumn on which action is being performed.
       // once find the cloumn then get the list of all action associated with that coloumn.

       const column = this.employeeColumn;//all coloumn
       //get all the action of partilcular column ...looks for Json string to understand below statement.
       const columnAction = column.find(eachColumn => eachColumn.fieldName ===  columnDefinition.fieldName)?.actions; 
       // if the column action is find then tick the choosen action.
       if(columnAction)
       {
          columnAction.forEach(currentItem =>{
            //each item have checked Attribute
            //action comes from event just match and mark them to true.
             currentItem.checked = currentItem.name === action.name;
          })
          //due to limitation and known issue we need to assign the column with updated action 
          this.employeeColumn = [...column];
          if(action.name === 'all')
             this.employeeData = this.originalEmployeeData;
            else
            this.employeeData = this.originalEmployeeData.filter(eachContcat => eachContcat.LeadSource === action.label);
          
       }


      
   }
   //* Exceuted when the row is selected/dis-selected in LDT
   handleRowSelection(event)
   {
      console.log(JSON.stringify(event.detail));
      this.selectedRows = event.detail.selectedRows.map(contact => contact.Id);
      console.log(JSON.stringify(this.selectedRows));
      //write other logic to play with the recordID ..
      //open Modal /delete row /update rows
   }




/*
tracing :

arr1 = [
contact1 :{name : Gaurav, Email : kr@gmail.com, Phone : 3201111},
contact2 :{name : Victor, Email : vi@gmail.com, Phone : 9201111},
contact3 :{name : Fran, Email : Fran@gmail.com, Phone : 9201111}];

arr2 = [...arr1];
//got direction = asc and fieldName = Name 
arr2.sort() //sort() accept the compareFn

sortBy(Name ,1)
{
   const key =primer ? function(x)
                       {
                          return primer(x[Name]) //
                       } 
                       :
                       function(x)
                       {
                        return x[Name];
                       }

}






*/




// this.employeedata =[...row];
//* shallow copy is a copy whose proprty share the same reference.


//* deep copy is a copy whose properties don't share the same reference. 
    



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
